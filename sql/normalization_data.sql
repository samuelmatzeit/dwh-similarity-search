-- Insert or update normalization parameters for the 'performance' feature.
-- This ensures that if the 'performance' entry already exists, its min and max values are updated.
INSERT INTO normalization_data (feature_name, min_value, max_value) 
VALUES ('performance', 116.0, 802.0)
ON CONFLICT (feature_name) -- Specifies the conflict resolution strategy based on the unique feature_name.
DO UPDATE SET min_value = EXCLUDED.min_value, max_value = EXCLUDED.max_value;
-- EXCLUDED refers to the values that were proposed for insertion.

-- Insert or update normalization parameters for the 'acceleration' feature.
-- Follows the same pattern as above to maintain or update the acceleration feature's normalization parameters.
INSERT INTO normalization_data (feature_name, min_value, max_value) 
VALUES ('acceleration', 3.3, 9.9)
ON CONFLICT (feature_name) 
DO UPDATE SET min_value = EXCLUDED.min_value, max_value = EXCLUDED.max_value;

-- Insert or update normalization parameters for the 'price' feature.
-- Ensures that the price normalization parameters are up-to-date.
INSERT INTO normalization_data (feature_name, min_value, max_value) 
VALUES ('price', 38175.2, 237208.65)
ON CONFLICT (feature_name) 
DO UPDATE SET min_value = EXCLUDED.min_value, max_value = EXCLUDED.max_value;

-- Insert or update normalization parameters for the 'consumption' feature.
-- Keeps the fuel consumption normalization parameters current.
INSERT INTO normalization_data (feature_name, min_value, max_value) 
VALUES ('consumption', 5.09, 22.92)
ON CONFLICT (feature_name) 
DO UPDATE SET min_value = EXCLUDED.min_value, max_value = EXCLUDED.max_value;

-- Insert or update normalization parameters for the 'length' feature.
-- Updates the vehicle length normalization parameters as necessary.
INSERT INTO normalization_data (feature_name, min_value, max_value) 
VALUES ('length', 4558.0, 5469.0)
ON CONFLICT (feature_name) 
DO UPDATE SET min_value = EXCLUDED.min_value, max_value = EXCLUDED.max_value;
