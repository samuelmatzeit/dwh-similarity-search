import pandas as pd
import numpy as np
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import os

def format_decimal(value):
    """Convert a string to float, fixing decimal point issues."""
    if isinstance(value, str):
        return float(value.replace('.', '').replace(',', '.'))
    else:
        return float(value)

def normalize(column):
    """Normalize values in a DataFrame column to a 0-1 scale."""
    max_value = df[column].max()
    min_value = df[column].min()
    df[column + "_norm"] = (df[column] - min_value) / (max_value - min_value)

def execute_sql_statements(conn, statements):
    cur = conn.cursor()
    for statement in statements:
        cur.execute(statement)
    conn.commit()
    cur.close()

# Lade Umgebungsvariablen
load_dotenv()
database_url = os.getenv("DATABASE_URL")

# Pfad zur CSV-Datei
csv_path = 'DWH-Mercedes_Data.csv'
df = pd.read_csv(csv_path, sep=';', decimal=',')

# Konvertiere spezifische Spalten zu float
for column in ['Preis (€)', 'Verbrauch (€ / 100km)', 'Länge', 'Leistung', 'Beschleunigung 0-100 km/h in sekunden']:
    df[column] = df[column].apply(format_decimal).astype(float)

# Definiere zu normalisierende Spalten
columns_to_normalize = {
    'Leistung': 'performance',
    'Beschleunigung 0-100 km/h in sekunden': 'acceleration',
    'Preis (€)': 'price',
    'Verbrauch (€ / 100km)': 'consumption',
    'Länge': 'length'
}

normalization_statements = []
specifications_statements = []
vectors_statements = []

# Generiere und schreibe SQL-Statements für normalization_data
for column, normalized_name in columns_to_normalize.items():
    max_value = df[column].max()
    min_value = df[column].min()
    normalization_sql = f"""
    INSERT INTO normalization_data (feature_name, min_value, max_value) 
    VALUES ('{normalized_name}', {min_value}, {max_value})
    ON CONFLICT (feature_name) 
    DO UPDATE SET min_value = EXCLUDED.min_value, max_value = EXCLUDED.max_value;
    """
    normalization_statements.append(normalization_sql)

# Normalisiere die spezifizierten Spalten
for column in columns_to_normalize:
    normalize(column)

# Generiere SQL-Statements für vehicle_specifications und vehicle_vectors
current_id = 1
for index, row in df.iterrows():
    spec_sql = (
        f"INSERT INTO vehicle_specifications ("
        f"model, power, acceleration, price, consumption, "
        f"co2_emissions, top_speed, torque, curb_weight, seats, "
        f"trunk_volume, vehicle_length, vehicle_class, engine_type"
        f") VALUES ("
        f"'{row['Modell']}', {row['Leistung']}, {row['Beschleunigung 0-100 km/h in sekunden']}, "
        f"{row['Preis (€)']}, {row['Verbrauch (€ / 100km)']}, "
        f"{row['CO2-Emissionen (g/km)']}, {row['Höchstgeschwindigkeit']}, {row['Drehmoment']}, "
        f"{row['Leergewicht']}, {row['Sitzplätze']}, {row['Kofferraumvolumen in L']}, "
        f"{row['Länge']}, '{row['Fahrzeugklasse']}', '{row['Motorart']}'"
        f");"
    )
    specifications_statements.append(spec_sql)
    
    vec_sql = f"INSERT INTO vehicle_vectors (vehicle_id, embedding) VALUES ({current_id}, ARRAY[{row['Leistung_norm']}, {row['Beschleunigung 0-100 km/h in sekunden_norm']}, {row['Preis (€)_norm']}, {row['Verbrauch (€ / 100km)_norm']}, {row['Länge_norm']}]);"
    vectors_statements.append(vec_sql)
    
    current_id += 1

# Schreibe die SQL-Statements in Dateien
with open('sql-commandset/normalization_data.sql', 'w') as f:
    for statement in normalization_statements:
        f.write("%s\n" % statement)

with open('sql-commandset/vehicle_specification.sql', 'w') as f:
    for statement in specifications_statements:
        f.write("%s\n" % statement)

with open('sql-commandset/vehicle_embedding.sql', 'w') as f:
    for statement in vectors_statements:
        f.write("%s\n" % statement)

# Führe die SQL-Statements direkt aus
conn = psycopg2.connect(database_url)
execute_sql_statements(conn, normalization_statements + specifications_statements + vectors_statements)
conn.close()
