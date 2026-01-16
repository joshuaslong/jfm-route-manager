-- Create door_assignments table for tracking trailer positions at doors
-- Run this in Supabase SQL Editor

-- Create the door_assignments table
CREATE TABLE IF NOT EXISTS door_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  door_number INTEGER NOT NULL CHECK (door_number >= 3 AND door_number <= 13),
  trailer_id UUID REFERENCES trailers(id) ON DELETE SET NULL,
  daily_assignment_id UUID REFERENCES daily_assignments(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  move_status TEXT NOT NULL DEFAULT 'at_door' CHECK (move_status IN ('at_door', 'jockey_moving', 'truck_in', 'departed')),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  removed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quick lookups by date and active assignments
CREATE INDEX IF NOT EXISTS idx_door_assignments_date ON door_assignments(date);
CREATE INDEX IF NOT EXISTS idx_door_assignments_active ON door_assignments(date, door_number) WHERE removed_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_door_assignments_trailer ON door_assignments(trailer_id);
CREATE INDEX IF NOT EXISTS idx_door_assignments_daily ON door_assignments(daily_assignment_id);

-- Ensure only one active assignment per door at a time
CREATE UNIQUE INDEX IF NOT EXISTS idx_door_assignments_unique_active
ON door_assignments(date, door_number)
WHERE removed_at IS NULL;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_door_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER door_assignments_updated_at
  BEFORE UPDATE ON door_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_door_assignments_updated_at();

-- Enable RLS
ALTER TABLE door_assignments ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (adjust as needed)
CREATE POLICY "Allow all for authenticated users" ON door_assignments
  FOR ALL USING (true) WITH CHECK (true);

-- Remove the door_number column from daily_assignments since we're tracking separately now
ALTER TABLE daily_assignments DROP COLUMN IF EXISTS door_number;

-- Drop the old constraint if it exists
ALTER TABLE daily_assignments DROP CONSTRAINT IF EXISTS valid_door_number;

-- Drop the old index if it exists
DROP INDEX IF EXISTS idx_daily_assignments_door;
