-- Create saved_events table
CREATE TABLE IF NOT EXISTS saved_events (
    id SERIAL PRIMARY KEY,
    ticketmaster_id VARCHAR(255) UNIQUE NOT NULL,
    event_data JSONB NOT NULL,
    match_reason TEXT,
    match_score DECIMAL(3,2),
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (match_score >= 0 AND match_score <= 1)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_saved_events_ticketmaster_id ON saved_events(ticketmaster_id);
CREATE INDEX IF NOT EXISTS idx_saved_events_match_score ON saved_events(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_saved_events_saved_at ON saved_events(saved_at DESC);
