import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

// Supabase connection string
const connectionString = `postgresql://postgres.jsvgsjcyjqqsdelehkbu:${process.env.DB_PASSWORD}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

async function runSQL(filePath) {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('Connected to database');

    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`Running ${path.basename(filePath)}...`);

    await client.query(sql);
    console.log(`Successfully executed ${path.basename(filePath)}`);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/run-sql.mjs <sql-file>');
  process.exit(1);
}

runSQL(file);
