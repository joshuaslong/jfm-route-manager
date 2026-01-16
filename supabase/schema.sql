-- Route Management System Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- CORE ENTITIES
-- ============================================

-- Drivers who take routes out
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tractors and box trucks (typically 2-digit numbers)
CREATE TABLE trucks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL UNIQUE,
  type TEXT DEFAULT 'tractor' CHECK (type IN ('tractor', 'box_truck')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'retired')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trailers (typically 4-digit numbers)
CREATE TABLE trailers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL UNIQUE,
  type TEXT DEFAULT 'standard' CHECK (type IN ('standard', 'transfer')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'retired')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Warehouse employees who load trucks
CREATE TABLE loaders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Route identities (WP, WAKEFERN, NEPA, etc.)
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEMPLATE SYSTEM
-- ============================================

-- Default assignments for each weekday
CREATE TABLE weekly_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 5),
  route_id UUID REFERENCES routes(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  truck_id UUID REFERENCES trucks(id) ON DELETE SET NULL,
  trailer_id UUID REFERENCES trailers(id) ON DELETE SET NULL,
  dispatch_time TIME,
  backhaul TEXT,
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DAILY ASSIGNMENTS
-- ============================================

-- Actual assignments for specific dates
CREATE TABLE daily_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,

  -- Route info
  route_id UUID REFERENCES routes(id) ON DELETE SET NULL,
  display_name TEXT,
  type TEXT DEFAULT 'standard' CHECK (type IN ('standard', 'help', 'dock', 'van')),
  parent_assignment_id UUID REFERENCES daily_assignments(id) ON DELETE SET NULL,

  -- Equipment & driver
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  truck_id UUID REFERENCES trucks(id) ON DELETE SET NULL,
  trailer_id UUID REFERENCES trailers(id) ON DELETE SET NULL,

  -- Schedule
  dispatch_time TIME,
  backhaul TEXT,
  notes TEXT,

  -- Status tracking
  planning_status TEXT DEFAULT 'draft' CHECK (planning_status IN ('draft', 'finalized')),
  loading_status TEXT DEFAULT 'not_started' CHECK (loading_status IN ('not_started', 'in_progress', 'loaded')),

  -- Metadata
  trip_number INTEGER DEFAULT 1,
  is_modified_from_template BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(date, route_id, trip_number)
);

-- Junction table for loader assignments (1-3 per route)
CREATE TABLE assignment_loaders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_assignment_id UUID REFERENCES daily_assignments(id) ON DELETE CASCADE,
  loader_id UUID REFERENCES loaders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(daily_assignment_id, loader_id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_daily_assignments_date ON daily_assignments(date);
CREATE INDEX idx_daily_assignments_planning_status ON daily_assignments(planning_status);
CREATE INDEX idx_daily_assignments_date_status ON daily_assignments(date, planning_status);
CREATE INDEX idx_weekly_templates_day ON weekly_templates(day_of_week);
CREATE INDEX idx_assignment_loaders_assignment ON assignment_loaders(daily_assignment_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE trailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_loaders ENABLE ROW LEVEL SECURITY;

-- For development: Allow all authenticated users full access
-- Replace these with more restrictive policies in production

CREATE POLICY "Allow all for authenticated users" ON drivers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON trucks
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON trailers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON loaders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON routes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON weekly_templates
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON daily_assignments
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON assignment_loaders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Also allow anonymous access for development (remove in production)
CREATE POLICY "Allow all for anon" ON drivers
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon" ON trucks
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon" ON trailers
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon" ON loaders
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon" ON routes
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon" ON weekly_templates
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon" ON daily_assignments
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon" ON assignment_loaders
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================
-- REALTIME
-- ============================================

-- Enable realtime for tables that need live updates
ALTER PUBLICATION supabase_realtime ADD TABLE daily_assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE assignment_loaders;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_weekly_templates_updated_at
  BEFORE UPDATE ON weekly_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_assignments_updated_at
  BEFORE UPDATE ON daily_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
