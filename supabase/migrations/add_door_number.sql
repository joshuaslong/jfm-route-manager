-- Add door_number column to daily_assignments
-- Run this in Supabase SQL Editor

ALTER TABLE daily_assignments
ADD COLUMN IF NOT EXISTS door_number INTEGER;

-- Add a check constraint to ensure door numbers are in valid range (3-13)
ALTER TABLE daily_assignments
ADD CONSTRAINT valid_door_number CHECK (door_number IS NULL OR (door_number >= 3 AND door_number <= 13));

-- Create an index for quick lookups by door
CREATE INDEX IF NOT EXISTS idx_daily_assignments_door ON daily_assignments(date, door_number) WHERE door_number IS NOT NULL;
