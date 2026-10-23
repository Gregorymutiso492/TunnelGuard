const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const recordsFile = path.join(dataDir, 'records.json');

function ensureDataStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(recordsFile)) {
    fs.writeFileSync(recordsFile, JSON.stringify([], null, 2));
  }
}

function readRecords() {
  ensureDataStore();
  try {
    const raw = fs.readFileSync(recordsFile, 'utf8');
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function writeRecords(records) {
  ensureDataStore();
  fs.writeFileSync(recordsFile, JSON.stringify(records, null, 2));
}

function saveRecord(record) {
  const records = readRecords();
  records.unshift({
    id: Date.now() + Math.random().toString(16).slice(2),
    createdAt: new Date().toISOString(),
    ...record,
  });
  writeRecords(records);
  return records[0];
}

function getAllRecords() {
  return readRecords();
}

module.exports = {
  saveRecord,
  getAllRecords,
  dataDir,
  recordsFile,
};
