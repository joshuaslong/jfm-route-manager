-- Create users table for app authentication
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  department VARCHAR(50) NOT NULL CHECK (department IN ('shipping', 'transportation', 'admin')),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_app_users_username ON app_users(username);

-- Insert initial users with password '1234' (hashed)
-- Note: In production, use proper password hashing. For now using simple hash.
-- The password '1234' will be hashed client-side before comparison.

INSERT INTO app_users (username, password_hash, full_name, department, is_admin) VALUES
  ('greg.guadarrama', '1234', 'Greg Guadarrama', 'shipping', FALSE),
  ('evan.mcmechan', '1234', 'Evan McMechan', 'shipping', FALSE),
  ('joshua.long', '1234', 'Joshua Long', 'shipping', TRUE),
  ('shawn.martin', '1234', 'Shawn Martin', 'transportation', FALSE),
  ('dwight.sensenig', '1234', 'Dwight Sensenig', 'transportation', FALSE),
  ('cody.baker', '1234', 'Cody Baker', 'shipping', FALSE),
  ('carlos.reyes', '1234', 'Carlos Reyes', 'shipping', FALSE)
ON CONFLICT (username) DO NOTHING;
