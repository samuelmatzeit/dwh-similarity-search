
    INSERT INTO normalization_data (feature_name, min_value, max_value) 
    VALUES ('performance', 116.0, 802.0)
    ON CONFLICT (feature_name) 
    DO UPDATE SET min_value = EXCLUDED.min_value, max_value = EXCLUDED.max_value;
    

    INSERT INTO normalization_data (feature_name, min_value, max_value) 
    VALUES ('acceleration', 3.3, 9.9)
    ON CONFLICT (feature_name) 
    DO UPDATE SET min_value = EXCLUDED.min_value, max_value = EXCLUDED.max_value;
    

    INSERT INTO normalization_data (feature_name, min_value, max_value) 
    VALUES ('price', 38175.2, 237208.65)
    ON CONFLICT (feature_name) 
    DO UPDATE SET min_value = EXCLUDED.min_value, max_value = EXCLUDED.max_value;
    

    INSERT INTO normalization_data (feature_name, min_value, max_value) 
    VALUES ('consumption', 5.09, 22.92)
    ON CONFLICT (feature_name) 
    DO UPDATE SET min_value = EXCLUDED.min_value, max_value = EXCLUDED.max_value;
    

    INSERT INTO normalization_data (feature_name, min_value, max_value) 
    VALUES ('length', 4558.0, 5469.0)
    ON CONFLICT (feature_name) 
    DO UPDATE SET min_value = EXCLUDED.min_value, max_value = EXCLUDED.max_value;
    
