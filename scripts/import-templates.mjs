import XLSX from 'xlsx';

const filePath = 'C:\\Users\\jlong\\Documents\\Daily Transportation Resource Assignments.xlsx';
const workbook = XLSX.readFile(filePath);

// Map sheet names to day_of_week values
const dayMap = {
  'Mon Master': 1,
  'Tue Master': 2,
  'Wed Master': 3,
  'Thurs Master': 4,
  'Fri Master': 5,
};

// Parse trailer field - could be "88-1027" or just "84" or "95-Transfer"
function parseTrailer(trailerField) {
  if (!trailerField) return { truck: null, trailer: null };

  const str = String(trailerField);

  // Check for transfer trailer
  if (str.toLowerCase().includes('transfer')) {
    const parts = str.split('-');
    return { truck: parts[0], trailer: 'Transfer' };
  }

  // Check for truck-trailer format (e.g., "88-1027" or "722963-1033")
  if (str.includes('-')) {
    const parts = str.split('-');
    return { truck: parts[0], trailer: parts[1] };
  }

  // Just a number - could be truck only (box trucks) or trailer only
  // If 4+ digits starting with 10xx, it's likely a trailer
  // If 2 digits or special numbers like 722961, it's a truck
  if (/^10\d{2}$/.test(str)) {
    return { truck: null, trailer: str };
  }

  return { truck: str, trailer: null };
}

// Parse dispatch time
function parseTime(timeField) {
  if (!timeField) return null;

  const str = String(timeField).toLowerCase().trim();

  // Handle "3pm" format
  const pmMatch = str.match(/^(\d{1,2})(?::(\d{2}))?pm$/);
  if (pmMatch) {
    let hours = parseInt(pmMatch[1]);
    const mins = pmMatch[2] || '00';
    if (hours !== 12) hours += 12;
    return `${hours.toString().padStart(2, '0')}:${mins}:00`;
  }

  // Handle "3:30am" format
  const amMatch = str.match(/^(\d{1,2}):(\d{2})am$/);
  if (amMatch) {
    let hours = parseInt(amMatch[1]);
    if (hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${amMatch[2]}:00`;
  }

  return null;
}

// Clean driver name (remove asterisks and extra spaces)
function cleanDriverName(name) {
  if (!name) return null;
  return name.replace(/\*/g, '').replace(/\s+/g, ' ').trim();
}

// Generate SQL for templates
const templates = [];

Object.entries(dayMap).forEach(([sheetName, dayOfWeek]) => {
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  let sortOrder = 0;

  // Skip header row, process data rows
  data.slice(1).forEach((row) => {
    const driver = cleanDriverName(row[0]);
    const loadId = row[1];
    const trailerField = row[2];
    const dispatchTime = row[3];
    const backhaul = row[4];
    const notes = row[5];

    // Skip empty rows or rows without a load ID (these are spare drivers/equipment)
    if (!loadId) return;

    const { truck, trailer } = parseTrailer(trailerField);
    const time = parseTime(dispatchTime);

    templates.push({
      day_of_week: dayOfWeek,
      route_code: String(loadId).trim(),
      driver_name: driver,
      truck_number: truck,
      trailer_number: trailer,
      dispatch_time: time,
      backhaul: backhaul || null,
      notes: notes || null,
      sort_order: sortOrder++,
    });
  });
});

// Generate SQL that looks up IDs from existing tables
console.log('-- Weekly Templates Import');
console.log('-- Run this after schema.sql and seed.sql');
console.log('');
console.log('-- Clear existing templates first');
console.log('DELETE FROM weekly_templates;');
console.log('');

templates.forEach((t, index) => {
  const routeCode = t.route_code.replace(/'/g, "''");
  const driverName = t.driver_name ? t.driver_name.replace(/'/g, "''") : null;
  const backhaul = t.backhaul ? t.backhaul.replace(/'/g, "''") : null;
  const notes = t.notes ? t.notes.replace(/'/g, "''") : null;

  console.log(`INSERT INTO weekly_templates (day_of_week, route_id, driver_id, truck_id, trailer_id, dispatch_time, backhaul, notes, sort_order)
SELECT
  ${t.day_of_week},
  (SELECT id FROM routes WHERE code = '${routeCode}'),
  ${driverName ? `(SELECT id FROM drivers WHERE name = '${driverName}')` : 'NULL'},
  ${t.truck_number ? `(SELECT id FROM trucks WHERE number = '${t.truck_number}')` : 'NULL'},
  ${t.trailer_number ? `(SELECT id FROM trailers WHERE number = '${t.trailer_number}')` : 'NULL'},
  ${t.dispatch_time ? `'${t.dispatch_time}'` : 'NULL'},
  ${backhaul ? `'${backhaul}'` : 'NULL'},
  ${notes ? `'${notes}'` : 'NULL'},
  ${t.sort_order};
`);
});

console.log('-- Done! Check results with:');
console.log('-- SELECT wt.*, r.code, d.name FROM weekly_templates wt');
console.log('-- LEFT JOIN routes r ON wt.route_id = r.id');
console.log('-- LEFT JOIN drivers d ON wt.driver_id = d.id');
console.log('-- ORDER BY day_of_week, sort_order;');
