import XLSX from 'xlsx';
import path from 'path';

const filePath = process.argv[2] || 'C:\\Users\\jlong\\Documents\\Daily Transportation Resource Assignments.xlsx';

const workbook = XLSX.readFile(filePath);

// Get all sheet names
console.log('Sheet names:', workbook.SheetNames);
console.log('\n');

// Read each sheet
workbook.SheetNames.forEach(sheetName => {
  console.log(`\n=== ${sheetName} ===\n`);
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Print first 30 rows
  data.slice(0, 30).forEach((row, i) => {
    console.log(`Row ${i}: ${JSON.stringify(row)}`);
  });
});
