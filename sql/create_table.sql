-- Creation of the vehicle_specifications table to store detailed information about each vehicle.
CREATE TABLE vehicle_specifications (
    vehicle_id SERIAL PRIMARY KEY, -- Unique identifier for each vehicle.
    model VARCHAR(255), -- The model name of the vehicle.
    power INT, -- Power of the vehicle in kW.
    acceleration NUMERIC, -- Acceleration from 0-100 km/h in seconds.
    price NUMERIC, -- Price of the vehicle in Euros.
    consumption NUMERIC, -- Fuel consumption in Euros per 100km.
    co2_emissions INT, -- CO2 emissions in grams per km.
    top_speed INT, -- Maximum speed of the vehicle in km/h.
    torque INT, -- Torque of the vehicle in Newton-meters.
    curb_weight INT, -- Curb weight of the vehicle in kilograms.
    seats INT, -- Number of seats in the vehicle.
    trunk_volume INT, -- Trunk volume in liters.
    vehicle_length NUMERIC, -- Length of the vehicle in meters.
    vehicle_class VARCHAR(50), -- Classification of the vehicle (e.g., SUV, sedan).
    engine_type VARCHAR(50) -- Type of engine (e.g., diesel, petrol, electric).
);

-- Creation of the vehicle_vectors table to store vector representations of vehicles.
-- These vectors can be used for similarity comparisons and machine learning models.
CREATE TABLE vehicle_vectors (
    vehicle_id INT, -- References the unique identifier from vehicle_specifications.
    embedding vector(5), -- Vector representation of the vehicle for advanced analyses.
    FOREIGN KEY (vehicle_id) REFERENCES vehicle_specifications(vehicle_id)
);

-- Creation of the normalization_data table to store normalization parameters.
-- This data is crucial for preprocessing inputs to machine learning models.
CREATE TABLE normalization_data (
    feature_name TEXT PRIMARY KEY, -- Name of the feature being normalized.
    min_value FLOAT, -- Minimum value of the feature across all vehicles.
    max_value FLOAT -- Maximum value of the feature across all vehicles.
);
