-- Add shipping crew members to loaders table
-- Run this in Supabase SQL Editor

-- First, clear existing placeholder loaders
DELETE FROM loaders WHERE name LIKE 'Loader %';

-- Insert actual shipping crew
INSERT INTO loaders (name) VALUES
  ('Josh Long'),
  ('Leo Giraldi'),
  ('Gregory Guadarrama'),
  ('Josue Legarreta'),
  ('Brian Borysowski'),
  ('Baltazar Castillo'),
  ('Carlos Reyes'),
  ('Jarol Quinonez'),
  ('Jean Reyes'),
  ('Robert Shaffer'),
  ('Freddy Melendez'),
  ('Andres Palomo Diaz'),
  ('Kenneeth Gil'),
  ('Evan McMechan'),
  ('Paul Valdez'),
  ('Marcos Eusebio'),
  ('David Palomo'),
  ('Raldy Giron'),
  ('Ernesto Ramos'),
  ('Evan Blymier')
ON CONFLICT DO NOTHING;
