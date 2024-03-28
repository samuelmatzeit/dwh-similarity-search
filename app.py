from flask import Flask, render_template, request, jsonify
import psycopg2
from pgvector.psycopg2 import register_vector
import numpy as np
import math

max_distance = math.sqrt(5)

app = Flask(__name__)

# Dummy-Funktion, die du durch eine echte Logik ersetzen musst, um die Vektor-Suche durchzuführen.
def vector_search(filters, preferences):
    # Ersetze diesen Platzhalter durch die tatsächliche Suchlogik.
    return [{'model': 'Modell 1', 'similarity': 95},
            {'model': 'Modell 2', 'similarity': 90},
            {'model': 'Modell 3', 'similarity': 85}]
    
def get_normalization_limits():
    
    # Lade Umgebungsvariablen
    load_dotenv()
    database_url = os.getenv("DATABASE_URL")
    # Verbindung zur Datenbank herstellen
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()

    # Normierungsinformationen laden
    cur.execute('SELECT * FROM normalization_data')
    normalization_data = {row[0]: {'min': row[1], 'max': row[2]} for row in cur.fetchall()}

    cur.close()
    conn.close()

    return normalization_data



@app.route('/')
def index():
    # Rendere deine HTML-Seite mit den Formularen und Slidern.
    # Du kannst auch Daten übergeben, wenn deine Seite dynamische Inhalte benötigt.
    return render_template('index.html')


@app.route('/search', methods=['POST'])
def search():
    data = request.json
    print(data)

    # Extrahiere die rohen Input-Werte und die Filter aus dem Request
    raw_input = {
        'performance': float(data['performance']),
        'acceleration': float(data['acceleration']),
        'price': float(data['price']),
        'consumption': float(data['consumption']),
        'length': float(data['length'])
    }
    print(raw_input)

    filters_str = data.get('filters', '')
    filters = {item.split('=')[0]: item.split('=')[1] for item in filters_str.split(';') if item}

    # Verbindung zur Datenbank herstellen
    conn = psycopg2.connect(dbname="postgres", user="postgres", password="postgres", host="localhost")
    cur = conn.cursor()
    register_vector(conn)

    # Normierungsinformationen laden
    cur.execute('SELECT * FROM normalization_data')
    normalization_data = {row[0]: {'min': row[1], 'max': row[2]} for row in cur.fetchall()}
    print(normalization_data)

    # Benutzereingaben normieren
    normalized_input = np.array([
        (raw_input['performance'] - normalization_data['performance']['min']) / (normalization_data['performance']['max'] - normalization_data['performance']['min']),
        (raw_input['acceleration'] - normalization_data['acceleration']['min']) / (normalization_data['acceleration']['max'] - normalization_data['acceleration']['min']),
        (raw_input['price'] - normalization_data['price']['min']) / (normalization_data['price']['max'] - normalization_data['price']['min']),
        (raw_input['consumption'] - normalization_data['consumption']['min']) / (normalization_data['consumption']['max'] - normalization_data['consumption']['min']),
        (raw_input['length'] - normalization_data['length']['min']) / (normalization_data['length']['max'] - normalization_data['length']['min'])
    ])
    print(normalized_input)

    # Bereite die SQL-Abfrage vor, um die ähnlichsten Vektoren basierend auf den normierten Werten und den dynamischen Filtern zu finden
    sql_query = """
    SELECT vs.model, vv.embedding <-> %s AS distance
    FROM vehicle_vectors vv
    JOIN vehicle_specifications vs ON vv.vehicle_id = vs.vehicle_id
    WHERE 1=1
    """
    query_params = [normalized_input]

    # Filterbedingungen zur Query hinzufügen
    for filter_key, filter_value in filters.items():
        if 'min' in filter_key or 'max' in filter_key:
            column_name = filter_key[:-4]  # Entferne '_min' oder '_max'
            operator = '>=' if 'min' in filter_key else '<='
            sql_query += f" AND vs.{column_name} {operator} %s"
            query_params.append(filter_value)
        else:
            sql_query += f" AND vs.{filter_key} = %s"
            query_params.append(filter_value)


        

    sql_query += " ORDER BY distance LIMIT 5;"
    
    print(sql_query)

    # Führe die angepasste Abfrage aus
    cur.execute(sql_query, query_params)
    results = cur.fetchall()

    cur.close()
    conn.close()
    print(results)

    # Ergebnisse in ein geeignetes Format für die JSON-Antwort umwandeln
    formatted_results = [{'model': result[0], 'similarity': f"{(1 - (float(result[1]) / max_distance)) * 100:.1f}"} for result in results]
    print(formatted_results)
    print(jsonify(formatted_results))

    return jsonify(formatted_results)

@app.route('/borders', methods=['GET'])
def borders():
    normalization_limits = get_normalization_limits()
    return jsonify(normalization_limits)

if __name__ == '__main__':
    app.run(debug=True)
