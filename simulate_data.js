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
  const device_id = devices[Math.floor(Math.random() * devices.length)]; // Choose device_id randomly from the devices array
  const timestamp = timeGen(); // Current timestamp in MySQL DATETIME format
  const acknowledged = false; // Alerts start as not acknowledged
  const randomExtra = Math.random().toString(36).substring(2, 15); // Small random string to add some extra data to the record
  return { device_id, timestamp, acknowledged, randomExtra }; // Return the record object
}

// Build an array of `count` records using generateRecord()
function generateMany(count = 10) {
  const out = [];
  for (let i = 0; i < count; i++) out.push(generateRecord());
  return out;
}

// Export
module.exports = { generateMany };

// If run directly, print JSON to stdout
if (require.main === module) {
  const count = Number(process.argv[2] || 10);
  const rows = generateMany(count);
  console.log(JSON.stringify(rows, null, 2));
}