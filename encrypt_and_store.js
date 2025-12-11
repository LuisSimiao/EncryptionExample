/*
    Title: encrypt_and_store.js
    Author: Luis Simiao
    Purpose: generate simulated alert rows and insert them into the "alerts" table in MySQL.
*/

const { generateMany } = require('./simulate_data');
const { NODE_DB_CONFIG } = require('./db');
const mysql = require('mysql2/promise');

async function main(count = 10) {
  const rows = generateMany(Number(count));

  const conn = await mysql.createConnection(NODE_DB_CONFIG);
  try {
    // Insert into existing alerts table (device_id, timestamp, acknowledged, randomExtra)
    const insertSql = 'INSERT INTO alerts (device_id, timestamp, acknowledged, randomExtra) VALUES (?, ?, ?, ?)';
    for (const r of rows) {
      // const device_id = r.device_id; // device identifier from generated record
      // const timestamp = r.timestamp; // timestamp generated in MySQL DATETIME format
      // const acknowledged = r.acknowledged; // boolean flag, false by default
      // const randomExtra = r.randomExtra; // small random string for extra data
      const ack = r.acknowledged ? 1 : 0; // acknowledged is boolean; use 1/0 for MySQL
      await conn.execute(insertSql, [r.device_id, r.timestamp, ack, r.randomExtra]);
    }

    console.log(`Inserted ${rows.length} rows into alerts`);
  } finally {
    await conn.end();
  }
}

// run from CLI: node encrypt_and_store.js [count]
if (require.main === module) {
  const count = process.argv[2] || 10;
  main(count).catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}
