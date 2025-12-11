/*
    Title: decrypt_and_export.js
    Author: Luis Simiao
    Purpose: connect to the database and export rows from the table "alerts" in MySQL to CSV.
*/

const { NODE_DB_CONFIG } = require('./db'); // DB connection config for mysql2
const mysql = require('mysql2/promise'); // promise-based MySQL client
const fs = require('fs'); // filesystem access for writing CSV

// Convert an array of objects to CSV format
function toCsv(rows) {
  if (!rows || rows.length === 0) return ''; // return empty string when no rows
  const headers = Object.keys(rows[0]); // use first object's keys as CSV headers
  const escape = v => {
    if (v === null || v === undefined) return ''; // empty cell for null/undefined
    const s = String(v); // ensure value is string
    if (s.includes('"') || s.includes(',') || s.includes('\n')) { // if contains special chars
      return '"' + s.replace(/"/g, '""') + '"'; // quote and escape double quotes
    }
    return s; // otherwise return as-is
  };
  const lines = [headers.join(',')]; // first line: comma-separated headers
  for (const r of rows) {
    lines.push(headers.map(h => escape(r[h])).join(',')); // build each CSV row using headers order
  }
  return lines.join('\n'); // join all lines with newline
}

async function main(outputPath = 'export.csv') {
  const conn = await mysql.createConnection(NODE_DB_CONFIG); // open DB connection using config
  try {
    // Select the plaintext columns to export
    const [rows] = await conn.execute('SELECT device_id, timestamp, acknowledged, randomExtra FROM alerts'); // fetch rows
    // Normalize boolean/Buffer values if necessary
    const out = rows.map(r => ({
      device_id: r.device_id, // device identifier column
      timestamp: r.timestamp, // timestamp column
      acknowledged: (r.acknowledged === 1 || r.acknowledged === true) ? 1 : 0, // normalize ack to 1/0
      randomExtra: r.randomExtra // extra random string column
    }));

    const csv = toCsv(out); // convert array of objects to CSV string
    fs.writeFileSync(outputPath, csv, 'utf8'); // write CSV to file using UTF-8
    console.log('Exported', out.length, 'rows to', outputPath); // report success
  } finally {
    await conn.end(); // always close DB connection
  }
}

if (require.main === module) {
  const out = process.argv[2] || 'export.csv'; // take output path from CLI or default
  main(out).catch(err => {
    console.error('Error:', err); // print errors to stderr
    process.exit(1); // exit with failure
  });
}
