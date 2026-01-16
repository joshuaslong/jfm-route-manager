-- Route Management System Seed Data
-- Run this AFTER schema.sql in your Supabase SQL Editor

-- ============================================
-- ROUTES (from Excel Load ID column)
-- ============================================

INSERT INTO routes (code, description) VALUES
  ('WP', 'WP'),
  ('WAKEFERN', 'Wakefern'),
  ('CPAM', 'CPAM'),
  ('NYM', 'NYM'),
  ('WI', 'WI'),
  ('WEIS', 'Weis'),
  ('M1', 'M1'),
  ('LPM', 'LPM'),
  ('DH M', 'DH Monday'),
  ('NEPA', 'NEPA'),
  ('NH M', 'NH Monday'),
  ('GM', 'GM'),
  ('JNM', 'JNM'),
  ('WBM', 'WBM'),
  ('NVAM', 'NVAM'),
  ('SVT', 'SVT'),
  ('MDWV', 'MDWV'),
  ('GT', 'GT'),
  ('JN T', 'JN Tuesday'),
  ('NJT', 'NJT'),
  ('GAPT', 'GAPT'),
  ('DS T', 'DS Tuesday'),
  ('Halls', 'Halls'),
  ('TC T', 'TC Tuesday'),
  ('KT', 'KT'),
  ('JPT', 'JPT'),
  ('VA', 'VA'),
  ('REDT', 'REDT'),
  ('PHT', 'PHT'),
  ('BHWT', 'BHWT'),
  ('ELT', 'ELT'),
  ('NYW', 'NYW'),
  ('TW', 'TW'),
  ('BMW', 'BMW'),
  ('EM W', 'EM Wednesday'),
  ('GW', 'GW'),
  ('MUL', 'MUL'),
  ('BELL', 'BELL'),
  ('PH W', 'PH Wednesday'),
  ('SJW', 'SJW'),
  ('SNW', 'SNW'),
  ('DEMA', 'DEMA'),
  ('CFCW', 'CFCW'),
  ('JNW', 'JNW'),
  ('LANC', 'LANC'),
  ('MDTH', 'MDTH'),
  ('NJTH', 'NJTH'),
  ('WILM', 'WILM'),
  ('WELL', 'WELL'),
  ('D TH', 'D Thursday'),
  ('DNTH', 'DNTH'),
  ('J TH', 'J Thursday'),
  ('CCTH', 'CCTH'),
  ('WBTH', 'WBTH'),
  ('EMTH', 'EMTH'),
  ('PTH', 'PTH'),
  ('ELTH', 'ELTH'),
  ('STH', 'STH'),
  ('BHTH', 'BHTH'),
  ('SJTH', 'SJTH'),
  ('VA P/U', 'VA Pickup'),
  ('Aldi', 'Aldi'),
  ('EM F', 'EM Friday'),
  ('SC F', 'SC Friday'),
  ('HF', 'HF'),
  ('DSF', 'DSF'),
  ('EPHF', 'EPHF'),
  ('GF', 'GF'),
  ('GMF', 'GMF'),
  ('BHF', 'BHF'),
  ('RF', 'RF'),
  ('ELF', 'ELF'),
  ('KF', 'KF'),
  ('MCAN', 'MCAN'),
  ('CHPF', 'CHPF'),
  ('WAWA', 'Wawa'),
  ('Applegate/Transfer', 'Applegate/Transfer'),
  ('Transfer', 'Transfer'),
  ('LOFR', 'LOFR'),
  ('LOTU', 'LOTU'),
  ('LOWE', 'LOWE');

-- ============================================
-- DRIVERS
-- ============================================

INSERT INTO drivers (name) VALUES
  ('Bill'),
  ('Chad Brinkman'),
  ('Josh'),
  ('Ryan G.'),
  ('David'),
  ('Steve'),
  ('Daryl'),
  ('Jim'),
  ('Curvin'),
  ('Dan'),
  ('JR'),
  ('Elmer'),
  ('Lester'),
  ('John'),
  ('Chad Sebastian'),
  ('Shawn'),
  ('Eric'),
  ('Mark Lipko'),
  ('Jay W'),
  ('Jan'),
  ('Glen H'),
  ('Tommy'),
  ('Colin'),
  ('Kenny'),
  ('Luis');

-- ============================================
-- TRUCKS (tractors and box trucks)
-- ============================================

-- Standard tractors (2-digit)
INSERT INTO trucks (number, type) VALUES
  ('72', 'tractor'),
  ('76', 'tractor'),
  ('77', 'tractor'),
  ('78', 'tractor'),
  ('80', 'tractor'),
  ('81', 'tractor'),
  ('82', 'tractor'),
  ('83', 'tractor'),
  ('84', 'tractor'),
  ('85', 'tractor'),
  ('86', 'tractor'),
  ('87', 'tractor'),
  ('88', 'tractor'),
  ('89', 'tractor'),
  ('90', 'tractor'),
  ('91', 'tractor'),
  ('92', 'tractor'),
  ('93', 'tractor'),
  ('94', 'tractor'),
  ('95', 'tractor'),
  ('96', 'tractor'),
  ('97', 'tractor');

-- Box trucks / special units
INSERT INTO trucks (number, type) VALUES
  ('2502', 'box_truck'),
  ('722961', 'box_truck'),
  ('722963', 'box_truck'),
  ('523962', 'box_truck');

-- ============================================
-- TRAILERS
-- ============================================

-- Standard trailers (4-digit)
INSERT INTO trailers (number, type) VALUES
  ('1015', 'standard'),
  ('1016', 'standard'),
  ('1018', 'standard'),
  ('1019', 'standard'),
  ('1022', 'standard'),
  ('1023', 'standard'),
  ('1025', 'standard'),
  ('1026', 'standard'),
  ('1027', 'standard'),
  ('1028', 'standard'),
  ('1031', 'standard'),
  ('1033', 'standard'),
  ('1034', 'standard'),
  ('1035', 'standard'),
  ('1036', 'standard'),
  ('1037', 'standard'),
  ('1038', 'standard'),
  ('1039', 'standard');

-- Transfer trailer
INSERT INTO trailers (number, type) VALUES
  ('Transfer', 'transfer');

-- ============================================
-- SAMPLE LOADERS (add your actual loaders)
-- ============================================

INSERT INTO loaders (name) VALUES
  ('Loader 1'),
  ('Loader 2'),
  ('Loader 3'),
  ('Loader 4'),
  ('Loader 5');
