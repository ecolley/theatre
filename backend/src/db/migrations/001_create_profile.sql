-- Create taste_profile table
CREATE TABLE IF NOT EXISTS taste_profile (
    id SERIAL PRIMARY KEY,
    profile_data JSONB NOT NULL DEFAULT '{"artists": [], "shows": [], "festivals": []}'::jsonb,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default empty profile
INSERT INTO taste_profile (profile_data, notes)
VALUES ('{"artists": [], "shows": [], "festivals": []}'::jsonb, 'Default taste profile')
ON CONFLICT DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profile_updated_at
    BEFORE UPDATE ON taste_profile
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
