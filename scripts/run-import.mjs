import XLSX from 'xlsx';

const SUPABASE_URL = 'https://jsvgsjcyjqqsdelehkbu.supabase.co';
const SUPABASE_KEY = 'sb_secret_aBOBAslS81DkT7p1MwLTAg_u2HraVTp';

const filePath = 'C:\\Users\\jlong\\Documents\\Daily Transportation Resource Assignments.xlsx';
const workbook = XLSX.readFile(filePath);

// First, fetch all reference data to map names to IDs
async function fetchData(table, field = 'name') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id,${field}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  const data = await res.json();
  const map = {};
  data.forEach((item) => {
    map[item[field]] = item.id;
  });
  return map;
}

// Parse trailer field
function parseTrailer(trailerField) {
  if (!trailerField) return { truck: null, trailer: null };
  const str = String(trailerField);

  if (str.toLowerCase().includes('transfer')) {
    const parts = str.split('-');
    return { truck: parts[0], trailer: 'Transfer' };
  }

  if (str.includes('-')) {
    const parts = str.split('-');
    return { truck: parts[0], trailer: parts[1] };
  }

  if (/^10\d{2}$/.test(str)) {
    return { truck: null, trailer: str };
  }

  return { truck: str, trailer: null };
}

// Parse dispatch time
function parseTime(timeField) {
  if (!timeField) return null;
  const str = String(timeField).toLowerCase().trim();

  const pmMatch = str.match(/^(\d{1,2})(?::(\d{2}))?pm$/);
  if (pmMatch) {
    let hours = parseInt(pmMatch[1]);
    const mins = pmMatch[2] || '00';
    if (hours !== 12) hours += 12;
    return `${hours.toString().padStart(2, '0')}:${mins}:00`;
  }

  const amMatch = str.match(/^(\d{1,2}):(\d{2})am$/);
  if (amMatch) {
    let hours = parseInt(amMatch[1]);
    if (hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${amMatch[2]}:00`;
  }

  return null;
}

// Clean driver name
function cleanDriverName(name) {
  if (!name) return null;
  return name.replace(/\*/g, '').replace(/\s+/g, ' ').trim();
}

// Map sheet names to day_of_week
const dayMap = {
  'Mon Master': 1,
  'Tue Master': 2,
  'Wed Master': 3,
  'Thurs Master': 4,
  'Fri Master': 5,
};

async function main() {
  console.log('Fetching reference data...');
  const routes = await fetchData('routes', 'code');
  const drivers = await fetchData('drivers', 'name');
  const trucks = await fetchData('trucks', 'number');
  const trailers = await fetchData('trailers', 'number');

  console.log(`Found ${Object.keys(routes).length} routes, ${Object.keys(drivers).length} drivers, ${Object.keys(trucks).length} trucks, ${Object.keys(trailers).length} trailers`);

  // Clear existing templates
  console.log('Clearing existing templates...');
  await fetch(`${SUPABASE_URL}/rest/v1/weekly_templates`, {
    method: 'DELETE',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'return=minimal',
    },
  });

  const templates = [];

  Object.entries(dayMap).forEach(([sheetName, dayOfWeek]) => {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    let sortOrder = 0;

    data.slice(1).forEach((row) => {
      const driver = cleanDriverName(row[0]);
      const loadId = row[1];
      const trailerField = row[2];
      const dispatchTime = row[3];
      const backhaul = row[4];
      const notes = row[5];

      if (!loadId) return;

      const { truck, trailer } = parseTrailer(trailerField);
      const time = parseTime(dispatchTime);

      // Look up IDs, handling slight name variations
      const routeCode = String(loadId).trim();
      const routeId = routes[routeCode];

      let driverId = null;
      if (driver) {
        driverId = drivers[driver];
        // Try partial match if exact match fails
        if (!driverId) {
          const match = Object.keys(drivers).find(
            (name) => name.toLowerCase().startsWith(driver.toLowerCase().slice(0, 5))
          );
          if (match) driverId = drivers[match];
        }
      }

      const truckId = truck ? trucks[truck] : null;
      const trailerId = trailer ? trailers[trailer] : null;

      if (!routeId) {
        console.log(`Warning: Route not found: ${routeCode}`);
      }

      templates.push({
        day_of_week: dayOfWeek,
        route_id: routeId || null,
        driver_id: driverId || null,
        truck_id: truckId || null,
        trailer_id: trailerId || null,
        dispatch_time: time,
        backhaul: backhaul || null,
        notes: notes || null,
        sort_order: sortOrder++,
      });
    });
  });

  console.log(`Inserting ${templates.length} templates...`);

  // Insert in batches of 20
  const batchSize = 20;
  for (let i = 0; i < templates.length; i += batchSize) {
    const batch = templates.slice(i, i + batchSize);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/weekly_templates`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`Error inserting batch ${i / batchSize + 1}:`, err);
    } else {
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(templates.length / batchSize)}`);
    }
  }

  console.log('Done!');
}

main().catch(console.error);
