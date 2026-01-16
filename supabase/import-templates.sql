-- Weekly Templates Import
-- Run this after schema.sql and seed.sql

-- Clear existing templates first
DELETE FROM weekly_templates;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  1,
  (SELECT id FROM routes WHERE code = 'WP'),
  (SELECT id FROM drivers WHERE name = 'Bill'),
  (SELECT id FROM trucks WHERE number = '722963'),
  (SELECT id FROM trailers WHERE number = '1033'),
  '01:00:00',
  'Cheese(Tues)',
  NULL,
  0;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  1,
  (SELECT id FROM routes WHERE code = 'WAKEFERN'),
  (SELECT id FROM drivers WHERE name = 'Chad Brinkman'),
  (SELECT id FROM trucks WHERE number = '89'),
  (SELECT id FROM trailers WHERE number = '1037'),
  '02:00:00',
  'Al & John/Patriot Pickle',
  NULL,
  1;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  1,
  (SELECT id FROM routes WHERE code = 'CPAM'),
  (SELECT id FROM drivers WHERE name = 'Josh'),
  (SELECT id FROM trucks WHERE number = '91'),
  (SELECT id FROM trailers WHERE number = '1023'),
  '03:30:00',
  NULL,
  NULL,
  2;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  1,
  (SELECT id FROM routes WHERE code = 'NYM'),
  (SELECT id FROM drivers WHERE name = 'Ryan G.'),
  (SELECT id FROM trucks WHERE number = '88'),
  (SELECT id FROM trailers WHERE number = '1027'),
  '00:00:00',
  'Cargill/Stoltzfus Dairy (Tues)',
  NULL,
  3;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  1,
  (SELECT id FROM routes WHERE code = 'WI'),
  (SELECT id FROM drivers WHERE name = 'David'),
  (SELECT id FROM trucks WHERE number = '722961'),
  (SELECT id FROM trailers WHERE number = '1036'),
  '04:00:00',
  'Cheese (Friday)',
  NULL,
  4;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  1,
  (SELECT id FROM routes WHERE code = 'WEIS'),
  (SELECT id FROM drivers WHERE name = 'Steve'),
  (SELECT id FROM trucks WHERE number = '93'),
  (SELECT id FROM trailers WHERE number = '1026'),
  '03:30:00',
  'Weis',
  'NO Jack NO Hand Cart',
  5;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  1,
  (SELECT id FROM routes WHERE code = 'M1'),
  (SELECT id FROM drivers WHERE name = 'Daryl'),
  (SELECT id FROM trucks WHERE number = '92'),
  (SELECT id FROM trailers WHERE number = '1038'),
  '04:30:00',
  'Stoltzfus Meats/Green Tree/Fishers ',
  NULL,
  6;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  1,
  (SELECT id FROM routes WHERE code = 'LPM'),
  (SELECT id FROM drivers WHERE name = 'Jim'),
  (SELECT id FROM trucks WHERE number = '80'),
  (SELECT id FROM trailers WHERE number = '1031'),
  '04:30:00',
  NULL,
  NULL,
  7;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  1,
  (SELECT id FROM routes WHERE code = 'DH M'),
  (SELECT id FROM drivers WHERE name = 'Curvin'),
  (SELECT id FROM trucks WHERE number = '83'),
  NULL,
  '04:30:00',
  NULL,
  NULL,
  8;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  1,
  (SELECT id FROM routes WHERE code = 'NEPA'),
  (SELECT id FROM drivers WHERE name = 'Dan'),
  (SELECT id FROM trucks WHERE number = '87'),
  (SELECT id FROM trailers WHERE number = '1018'),
  '05:15:00',
  NULL,
  NULL,
  9;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  1,
  (SELECT id FROM routes WHERE code = 'NH M'),
  (SELECT id FROM drivers WHERE name = 'JR'),
  (SELECT id FROM trucks WHERE number = '94'),
  NULL,
  '05:30:00',
  NULL,
  NULL,
  10;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  1,
  (SELECT id FROM routes WHERE code = 'GM'),
  (SELECT id FROM drivers WHERE name = 'Elmer'),
  (SELECT id FROM trucks WHERE number = '86'),
  NULL,
  '05:15:00',
  NULL,
  NULL,
  11;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  1,
  (SELECT id FROM routes WHERE code = 'JNM'),
  (SELECT id FROM drivers WHERE name = 'Lester'),
  (SELECT id FROM trucks WHERE number = '85'),
  (SELECT id FROM trailers WHERE number = '1025'),
  '07:30:00',
  'Eggs/ Good Food',
  NULL,
  12;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  1,
  (SELECT id FROM routes WHERE code = 'WBM'),
  (SELECT id FROM drivers WHERE name = 'John'),
  (SELECT id FROM trucks WHERE number = '90'),
  NULL,
  '09:00:00',
  NULL,
  NULL,
  13;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  1,
  (SELECT id FROM routes WHERE code = 'NVAM'),
  (SELECT id FROM drivers WHERE name = 'Chad Sebastian'),
  (SELECT id FROM trucks WHERE number = '96'),
  (SELECT id FROM trailers WHERE number = '1019'),
  '02:45:00',
  NULL,
  NULL,
  14;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  1,
  (SELECT id FROM routes WHERE code = 'Applegate/Transfer'),
  (SELECT id FROM drivers WHERE name = 'Glen H'),
  (SELECT id FROM trucks WHERE number = '95'),
  (SELECT id FROM trailers WHERE number = 'Transfer'),
  '03:30:00',
  NULL,
  'Both applegate and transfer need to be ready by 4:00am',
  15;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  1,
  (SELECT id FROM routes WHERE code = 'SVT'),
  (SELECT id FROM drivers WHERE name = 'Colin'),
  (SELECT id FROM trucks WHERE number = '2502'),
  (SELECT id FROM trailers WHERE number = '1039'),
  '01:00:00',
  'Stoltzfus Kitchen',
  NULL,
  16;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  2,
  (SELECT id FROM routes WHERE code = 'MDWV'),
  (SELECT id FROM drivers WHERE name = 'Mark Lipko'),
  (SELECT id FROM trucks WHERE number = '84'),
  NULL,
  '00:30:00',
  NULL,
  NULL,
  0;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  2,
  (SELECT id FROM routes WHERE code = 'GT'),
  (SELECT id FROM drivers WHERE name = 'Jan'),
  (SELECT id FROM trucks WHERE number = '82'),
  NULL,
  '03:00:00',
  NULL,
  NULL,
  1;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  2,
  (SELECT id FROM routes WHERE code = 'JN T'),
  (SELECT id FROM drivers WHERE name = 'Josh'),
  (SELECT id FROM trucks WHERE number = '91'),
  (SELECT id FROM trailers WHERE number = '1023'),
  '03:30:00',
  NULL,
  NULL,
  2;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  2,
  (SELECT id FROM routes WHERE code = 'NJT'),
  (SELECT id FROM drivers WHERE name = 'Eric'),
  (SELECT id FROM trucks WHERE number = '97'),
  (SELECT id FROM trailers WHERE number = '1028'),
  '02:30:00',
  NULL,
  NULL,
  3;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  2,
  (SELECT id FROM routes WHERE code = 'GAPT'),
  (SELECT id FROM drivers WHERE name = 'Kenny'),
  (SELECT id FROM trucks WHERE number = '523962'),
  (SELECT id FROM trailers WHERE number = '1022'),
  '02:45:00',
  'Berner/Painterland',
  NULL,
  4;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  2,
  (SELECT id FROM routes WHERE code = 'DS T'),
  (SELECT id FROM drivers WHERE name LIKE 'Jay W%' LIMIT 1),
  (SELECT id FROM trucks WHERE number = '81'),
  NULL,
  '03:15:00',
  NULL,
  NULL,
  5;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  2,
  (SELECT id FROM routes WHERE code = 'Halls'),
  (SELECT id FROM drivers WHERE name = 'Steve'),
  (SELECT id FROM trucks WHERE number = '93'),
  (SELECT id FROM trailers WHERE number = '1026'),
  '03:30:00',
  NULL,
  'NO Jack NO Hand Cart',
  6;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  2,
  (SELECT id FROM routes WHERE code = 'TC T'),
  (SELECT id FROM drivers WHERE name = 'Lester'),
  (SELECT id FROM trucks WHERE number = '85'),
  (SELECT id FROM trailers WHERE number = '1025'),
  '04:00:00',
  NULL,
  NULL,
  7;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  2,
  (SELECT id FROM routes WHERE code = 'KT'),
  (SELECT id FROM drivers WHERE name = 'Daryl'),
  (SELECT id FROM trucks WHERE number = '92'),
  (SELECT id FROM trailers WHERE number = '1038'),
  '02:45:00',
  'Weavers of Wellsville/Warrington Farm',
  NULL,
  8;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  2,
  (SELECT id FROM routes WHERE code = 'Applegate/Transfer'),
  (SELECT id FROM drivers WHERE name = 'Glen H'),
  (SELECT id FROM trucks WHERE number = '95'),
  (SELECT id FROM trailers WHERE number = 'Transfer'),
  '03:30:00',
  NULL,
  'Both applegate and transfer need to be ready by 4:00am',
  9;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  2,
  (SELECT id FROM routes WHERE code = 'JPT'),
  (SELECT id FROM drivers WHERE name = 'Chad Sebastian'),
  (SELECT id FROM trucks WHERE number = '96'),
  (SELECT id FROM trailers WHERE number = '1019'),
  '03:30:00',
  'Mrs Resslers/Foods Galore',
  NULL,
  10;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  2,
  (SELECT id FROM routes WHERE code = 'VA'),
  (SELECT id FROM drivers WHERE name = 'Chad Brinkman'),
  (SELECT id FROM trucks WHERE number = '89'),
  (SELECT id FROM trailers WHERE number = '1037'),
  '04:00:00',
  NULL,
  NULL,
  11;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  2,
  (SELECT id FROM routes WHERE code = 'REDT'),
  (SELECT id FROM drivers WHERE name = 'Dan'),
  (SELECT id FROM trucks WHERE number = '87'),
  (SELECT id FROM trailers WHERE number = '1018'),
  '04:30:00',
  NULL,
  NULL,
  12;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  2,
  (SELECT id FROM routes WHERE code = 'PHT'),
  (SELECT id FROM drivers WHERE name = 'JR'),
  (SELECT id FROM trucks WHERE number = '94'),
  NULL,
  '04:30:00',
  'September Farms/Essex',
  NULL,
  13;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  2,
  (SELECT id FROM routes WHERE code = 'BHWT'),
  (SELECT id FROM drivers WHERE name = 'Curvin'),
  (SELECT id FROM trucks WHERE number = '83'),
  NULL,
  '04:30:00',
  'T&L',
  NULL,
  14;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  2,
  (SELECT id FROM routes WHERE code = 'ELT'),
  (SELECT id FROM drivers WHERE name = 'Elmer'),
  (SELECT id FROM trucks WHERE number = '86'),
  NULL,
  '05:15:00',
  NULL,
  NULL,
  15;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  2,
  (SELECT id FROM routes WHERE code = 'Halls 2'),
  (SELECT id FROM drivers WHERE name = 'Jim'),
  (SELECT id FROM trucks WHERE number = '80'),
  (SELECT id FROM trailers WHERE number = '1031'),
  '03:30:00',
  NULL,
  'NO Jack NO Hand Cart',
  16;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  3,
  (SELECT id FROM routes WHERE code = 'NYW'),
  (SELECT id FROM drivers WHERE name = 'Bill'),
  (SELECT id FROM trucks WHERE number = '722963'),
  (SELECT id FROM trailers WHERE number = '1033'),
  '01:00:00',
  'Us Salt / Yancey Fancey',
  NULL,
  0;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  3,
  (SELECT id FROM routes WHERE code = 'TW'),
  (SELECT id FROM drivers WHERE name = 'Chad Sebastian'),
  (SELECT id FROM trucks WHERE number = '96'),
  (SELECT id FROM trailers WHERE number = '1019'),
  '02:00:00',
  'Maid rite/Old Farmers',
  NULL,
  1;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  3,
  (SELECT id FROM routes WHERE code = 'BMW'),
  (SELECT id FROM drivers WHERE name = 'John'),
  (SELECT id FROM trucks WHERE number = '90'),
  NULL,
  '02:00:00',
  NULL,
  NULL,
  2;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  3,
  (SELECT id FROM routes WHERE code = 'EM W'),
  (SELECT id FROM drivers WHERE name = 'Eric'),
  (SELECT id FROM trucks WHERE number = '97'),
  (SELECT id FROM trailers WHERE number = '1028'),
  '02:30:00',
  NULL,
  NULL,
  3;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  3,
  (SELECT id FROM routes WHERE code = 'GW'),
  (SELECT id FROM drivers WHERE name = 'Jan'),
  (SELECT id FROM trucks WHERE number = '82'),
  NULL,
  '02:30:00',
  NULL,
  NULL,
  4;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  3,
  (SELECT id FROM routes WHERE code = 'MUL'),
  (SELECT id FROM drivers WHERE name = 'JR'),
  (SELECT id FROM trucks WHERE number = '94'),
  NULL,
  '03:00:00',
  NULL,
  NULL,
  5;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  3,
  (SELECT id FROM routes WHERE code = 'BELL'),
  (SELECT id FROM drivers WHERE name = 'Lester'),
  (SELECT id FROM trucks WHERE number = '85'),
  (SELECT id FROM trailers WHERE number = '1025'),
  '03:30:00',
  NULL,
  NULL,
  6;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  3,
  (SELECT id FROM routes WHERE code = 'PH W'),
  (SELECT id FROM drivers WHERE name LIKE 'Jay W%' LIMIT 1),
  (SELECT id FROM trucks WHERE number = '81'),
  NULL,
  '03:45:00',
  NULL,
  NULL,
  7;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  3,
  (SELECT id FROM routes WHERE code = 'SJW'),
  (SELECT id FROM drivers WHERE name = 'Steve'),
  (SELECT id FROM trucks WHERE number = '93'),
  (SELECT id FROM trailers WHERE number = '1016'),
  '04:00:00',
  'J&L',
  NULL,
  8;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  3,
  (SELECT id FROM routes WHERE code = 'SNW'),
  (SELECT id FROM drivers WHERE name = 'Curvin'),
  (SELECT id FROM trucks WHERE number = '83'),
  NULL,
  '04:00:00',
  NULL,
  NULL,
  9;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  3,
  (SELECT id FROM routes WHERE code = 'Applegate/Transfer'),
  (SELECT id FROM drivers WHERE name = 'Glen H'),
  (SELECT id FROM trucks WHERE number = '95'),
  (SELECT id FROM trailers WHERE number = 'Transfer'),
  '04:00:00',
  NULL,
  'Both applegate and transfer need to be ready by 4:00am',
  10;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  3,
  (SELECT id FROM routes WHERE code = 'DEMA'),
  (SELECT id FROM drivers WHERE name = 'Josh'),
  (SELECT id FROM trucks WHERE number = '91'),
  (SELECT id FROM trailers WHERE number = '1023'),
  '04:00:00',
  'MSC (Stevens)',
  NULL,
  11;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  3,
  (SELECT id FROM routes WHERE code = 'CFCW'),
  (SELECT id FROM drivers WHERE name = 'Kenny'),
  (SELECT id FROM trucks WHERE number = '523962'),
  (SELECT id FROM trailers WHERE number = '1022'),
  '04:00:00',
  'KNAUSS',
  NULL,
  12;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  3,
  (SELECT id FROM routes WHERE code = 'JNW'),
  (SELECT id FROM drivers WHERE name = 'Jim'),
  (SELECT id FROM trucks WHERE number = '80'),
  (SELECT id FROM trailers WHERE number = '1027'),
  '04:00:00',
  NULL,
  NULL,
  13;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  3,
  (SELECT id FROM routes WHERE code = 'LANC'),
  (SELECT id FROM drivers WHERE name = 'Dan'),
  (SELECT id FROM trucks WHERE number = '87'),
  (SELECT id FROM trailers WHERE number = '1018'),
  '04:00:00',
  'York Valley',
  NULL,
  14;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  4,
  (SELECT id FROM routes WHERE code = 'MDTH'),
  (SELECT id FROM drivers WHERE name = 'Kenny'),
  (SELECT id FROM trucks WHERE number = '523962'),
  (SELECT id FROM trailers WHERE number = '1022'),
  '00:00:00',
  'Mangers/Elite Spice',
  NULL,
  0;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  4,
  (SELECT id FROM routes WHERE code = 'NJTH'),
  (SELECT id FROM drivers WHERE name = 'Jan'),
  (SELECT id FROM trucks WHERE number = '82'),
  NULL,
  '01:45:00',
  NULL,
  NULL,
  1;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  4,
  (SELECT id FROM routes WHERE code = 'WILM'),
  (SELECT id FROM drivers WHERE name = 'Mark Lipko'),
  (SELECT id FROM trucks WHERE number = '84'),
  NULL,
  '03:00:00',
  'Pony Express',
  NULL,
  2;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  4,
  (SELECT id FROM routes WHERE code = 'WELL'),
  (SELECT id FROM drivers WHERE name = 'Daryl'),
  (SELECT id FROM trucks WHERE number = '92'),
  (SELECT id FROM trailers WHERE number = '1038'),
  '01:00:00',
  NULL,
  NULL,
  3;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  4,
  (SELECT id FROM routes WHERE code = 'D TH'),
  (SELECT id FROM drivers WHERE name = 'Colin'),
  (SELECT id FROM trucks WHERE number = '2502'),
  (SELECT id FROM trailers WHERE number = '1039'),
  '03:30:00',
  NULL,
  NULL,
  4;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  4,
  (SELECT id FROM routes WHERE code = 'DNTH'),
  (SELECT id FROM drivers WHERE name LIKE 'Jay W%' LIMIT 1),
  (SELECT id FROM trucks WHERE number = '81'),
  NULL,
  '03:30:00',
  NULL,
  NULL,
  5;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  4,
  (SELECT id FROM routes WHERE code = 'J TH'),
  (SELECT id FROM drivers WHERE name = 'Ryan G.'),
  (SELECT id FROM trucks WHERE number = '88'),
  (SELECT id FROM trailers WHERE number = '1027'),
  '03:45:00',
  'Gene Wenger / S. Clyde Weaver/Dutch Gold/Haldeman Mills',
  NULL,
  6;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  4,
  (SELECT id FROM routes WHERE code = 'Applegate/Transfer'),
  (SELECT id FROM drivers WHERE name = 'Glen H'),
  (SELECT id FROM trucks WHERE number = '95'),
  (SELECT id FROM trailers WHERE number = 'Transfer'),
  '04:00:00',
  NULL,
  'Both applegate and transfer need to be ready by 4:00am',
  7;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  4,
  (SELECT id FROM routes WHERE code = 'CCTH'),
  (SELECT id FROM drivers WHERE name = 'John'),
  (SELECT id FROM trucks WHERE number = '90'),
  NULL,
  '04:00:00',
  'Farmland',
  NULL,
  8;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  4,
  (SELECT id FROM routes WHERE code = 'WBTH'),
  (SELECT id FROM drivers WHERE name = 'Curvin'),
  (SELECT id FROM trucks WHERE number = '83'),
  NULL,
  '04:00:00',
  NULL,
  NULL,
  9;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  4,
  (SELECT id FROM routes WHERE code = 'EMTH'),
  (SELECT id FROM drivers WHERE name = 'Eric'),
  (SELECT id FROM trucks WHERE number = '97'),
  (SELECT id FROM trailers WHERE number = '1028'),
  '04:30:00',
  NULL,
  NULL,
  10;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  4,
  (SELECT id FROM routes WHERE code = 'PTH'),
  (SELECT id FROM drivers WHERE name = 'JR'),
  (SELECT id FROM trucks WHERE number = '94'),
  NULL,
  '04:30:00',
  NULL,
  NULL,
  11;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  4,
  (SELECT id FROM routes WHERE code = 'ELTH'),
  (SELECT id FROM drivers WHERE name = 'Elmer'),
  (SELECT id FROM trucks WHERE number = '86'),
  NULL,
  '05:00:00',
  NULL,
  NULL,
  12;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  4,
  (SELECT id FROM routes WHERE code = 'STH'),
  (SELECT id FROM drivers WHERE name = 'Dan'),
  (SELECT id FROM trucks WHERE number = '87'),
  (SELECT id FROM trailers WHERE number = '1018'),
  '05:00:00',
  NULL,
  NULL,
  13;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  4,
  (SELECT id FROM routes WHERE code = 'BHTH'),
  (SELECT id FROM drivers WHERE name = 'Lester'),
  (SELECT id FROM trucks WHERE number = '85'),
  (SELECT id FROM trailers WHERE number = '1025'),
  '03:30:00',
  NULL,
  NULL,
  14;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  4,
  (SELECT id FROM routes WHERE code = 'SJTH'),
  (SELECT id FROM drivers WHERE name = 'Steve'),
  (SELECT id FROM trucks WHERE number = '93'),
  (SELECT id FROM trailers WHERE number = '1016'),
  '04:00:00',
  'Giordonio',
  'Needs Jack NO Hand Cart',
  15;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  4,
  (SELECT id FROM routes WHERE code = 'VA P/U'),
  (SELECT id FROM drivers WHERE name = 'Chad Brinkman'),
  (SELECT id FROM trucks WHERE number = '89'),
  (SELECT id FROM trailers WHERE number = '1037'),
  '09:00:00',
  'Virginia Poultry ',
  NULL,
  16;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  4,
  (SELECT id FROM routes WHERE code = 'Aldi'),
  (SELECT id FROM drivers WHERE name = 'Jim'),
  (SELECT id FROM trucks WHERE number = '80'),
  (SELECT id FROM trailers WHERE number = '1031/1035'),
  '03:00:00',
  NULL,
  NULL,
  17;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  5,
  (SELECT id FROM routes WHERE code = 'EM F'),
  (SELECT id FROM drivers WHERE name = 'Eric'),
  (SELECT id FROM trucks WHERE number = '97'),
  (SELECT id FROM trailers WHERE number = '1028'),
  '02:45:00',
  'J&L',
  NULL,
  0;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  5,
  (SELECT id FROM routes WHERE code = 'SC F'),
  (SELECT id FROM drivers WHERE name = 'Jan'),
  (SELECT id FROM trucks WHERE number = '82'),
  NULL,
  '02:45:00',
  NULL,
  NULL,
  1;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  5,
  (SELECT id FROM routes WHERE code = 'HF'),
  (SELECT id FROM drivers WHERE name = 'Ryan G.'),
  (SELECT id FROM trucks WHERE number = '88'),
  (SELECT id FROM trailers WHERE number = '1027'),
  '03:15:00',
  NULL,
  NULL,
  2;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  5,
  (SELECT id FROM routes WHERE code = 'DSF'),
  (SELECT id FROM drivers WHERE name LIKE 'Jay W%' LIMIT 1),
  (SELECT id FROM trucks WHERE number = '81'),
  NULL,
  '03:15:00',
  NULL,
  NULL,
  3;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  5,
  (SELECT id FROM routes WHERE code = 'EPHF'),
  (SELECT id FROM drivers WHERE name = 'Colin'),
  (SELECT id FROM trucks WHERE number = '2502'),
  (SELECT id FROM trailers WHERE number = '1039'),
  '03:30:00',
  NULL,
  NULL,
  4;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  5,
  (SELECT id FROM routes WHERE code = 'GF'),
  (SELECT id FROM drivers WHERE name = 'Mark Lipko'),
  (SELECT id FROM trucks WHERE number = '84'),
  NULL,
  '03:30:00',
  NULL,
  NULL,
  5;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  5,
  (SELECT id FROM routes WHERE code = 'GMF'),
  (SELECT id FROM drivers WHERE name = 'John'),
  (SELECT id FROM trucks WHERE number = '90'),
  NULL,
  '03:30:00',
  NULL,
  NULL,
  6;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  5,
  (SELECT id FROM routes WHERE code = 'BHF'),
  (SELECT id FROM drivers WHERE name = 'Steve'),
  (SELECT id FROM trucks WHERE number = '93'),
  (SELECT id FROM trailers WHERE number = '1016'),
  '03:45:00',
  NULL,
  NULL,
  7;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  5,
  (SELECT id FROM routes WHERE code = 'Applegate/Transfer'),
  (SELECT id FROM drivers WHERE name = 'Glen H'),
  (SELECT id FROM trucks WHERE number = '95'),
  (SELECT id FROM trailers WHERE number = 'Transfer'),
  '04:00:00',
  NULL,
  'Both applegate and transfer need to be ready by 4:00am',
  8;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  5,
  (SELECT id FROM routes WHERE code = 'RF'),
  (SELECT id FROM drivers WHERE name = 'Curvin'),
  (SELECT id FROM trucks WHERE number = '83'),
  NULL,
  '04:00:00',
  NULL,
  NULL,
  9;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  5,
  (SELECT id FROM routes WHERE code = 'ELF'),
  (SELECT id FROM drivers WHERE name = 'Elmer'),
  (SELECT id FROM trucks WHERE number = '86'),
  NULL,
  '05:00:00',
  NULL,
  NULL,
  10;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  5,
  (SELECT id FROM routes WHERE code = 'KF'),
  (SELECT id FROM drivers WHERE name = 'JR'),
  (SELECT id FROM trucks WHERE number = '94'),
  NULL,
  '05:30:00',
  NULL,
  NULL,
  11;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  5,
  (SELECT id FROM routes WHERE code = 'MCAN'),
  (SELECT id FROM drivers WHERE name = 'Lester'),
  (SELECT id FROM trucks WHERE number = '85'),
  (SELECT id FROM trailers WHERE number = '1031'),
  '03:00:00',
  NULL,
  NULL,
  12;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  5,
  (SELECT id FROM routes WHERE code = 'CHPF'),
  (SELECT id FROM drivers WHERE name = 'Kenny'),
  (SELECT id FROM trucks WHERE number = '523962'),
  (SELECT id FROM trailers WHERE number = '1022'),
  '03:00:00',
  'Packer Ave',
  NULL,
  13;

INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  5,
  (SELECT id FROM routes WHERE code = 'WAWA'),
  (SELECT id FROM drivers WHERE name = 'Bill'),
  (SELECT id FROM trucks WHERE number = '78'),
  NULL,
  '15:00:00',
  NULL,
  NULL,
  14;

-- Done! Check results with:
-- SELECT wt.*, r.code, d.name FROM weekly_templates wt
-- LEFT JOIN routes r ON wt.route_id = r.id
-- LEFT JOIN drivers d ON wt.driver_id = d.id
-- ORDER BY day_of_week, sort_order;
