/*
  Title: simulate_data.js
  Author: Luis Simiao
  Purpose: generate simulated alert rows for testing and export as JSON.
*/

const devices = ['device_1', 'device_2'];

function timeGen() {
  // returns "YYYY-MM-DD HH:MM:SS" suitable for MySQL DATETIME
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function generateRecord() {
  // Choose device_id randomly from the devices array
  const device_id = devices[Math.floor(Math.random() * devices.length)];
  // Current timestamp in MySQL DATETIME format
  const timestamp = timeGen();
  // Alerts start as not acknowledged
  const acknowledged = false;
  // Small random string to add some extra data to the record
  const randomExtra = Math.random().toString(36).substring(2, 15);
  // Return the record object
  return { device_id, timestamp, acknowledged, randomExtra };
}

function generateMany(count = 10) {
  // Build an array of `count` records using generateRecord()
  const out = [];
  for (let i = 0; i < count; i++) out.push(generateRecord());
  return out;
}

// Export for programmatic use
module.exports = { generateMany };

// If run directly, print JSON to stdout
if (require.main === module) {
  const count = Number(process.argv[2] || 10);
  const rows = generateMany(count);
  console.log(JSON.stringify(rows, null, 2));
}