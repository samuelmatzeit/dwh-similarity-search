CREATE EXTENSION IF NOT EXISTS vector;

DROP TABLE IF EXISTS vehicle_specifications;

DROP TABLE IF EXISTS vehicle_vectors;

DROP TABLE IF EXISTS normalization_data;

CREATE TABLE vehicle_specifications (
    vehicle_id SERIAL PRIMARY KEY,
    model VARCHAR(255),
    power INT, -- Leistung in kW
    acceleration NUMERIC, -- Beschleunigung 0-100 km/h in sekunden
    price NUMERIC, -- Preis (€)
    consumption NUMERIC, -- Verbrauch (€ / 100km)
    co2_emissions INT, -- CO2-Emissionen (g/km)
    top_speed INT, -- Höchstgeschwindigkeit
    torque INT, -- Drehmoment
    curb_weight INT, -- Leergewicht
    seats INT, -- Sitzplätze
    trunk_volume INT, -- Kofferraumvolumen in L
    vehicle_length NUMERIC, -- Länge
    vehicle_class VARCHAR(50), -- Fahrzeugklasse
    engine_type VARCHAR(50) -- Motorart
);
    
CREATE TABLE vehicle_vectors (
    vehicle_id INT,
    embedding vector(5),
    FOREIGN KEY (vehicle_id) REFERENCES vehicle_specifications(vehicle_id)
);
CREATE TABLE normalization_data (
    feature_name TEXT PRIMARY KEY,
    min_value FLOAT,
    max_value FLOAT
);
