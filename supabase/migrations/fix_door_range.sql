-- Fix door number range from 3-13 to 4-13
-- Run this in Supabase SQL Editor

-- Drop the old constraint
ALTER TABLE door_assignments DROP CONSTRAINT IF EXISTS door_assignments_door_number_check;

-- Add new constraint for doors 4-13
ALTER TABLE door_assignments
ADD CONSTRAINT door_assignments_door_number_check
CHECK (door_number >= 4 AND door_number <= 13);
