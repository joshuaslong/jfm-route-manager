-- Add storage trailer 1007
-- Run this in Supabase SQL Editor

INSERT INTO trailers (number, type, status)
VALUES ('1007', 'standard', 'active')
ON CONFLICT (number) DO NOTHING;
