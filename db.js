const sqlite3 = require('sqlite3').verbose();

const path = require('path');
const dbPath = path.resolve(__dirname, 'database.db');
console.log(dbPath);
const DBConnection = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);

DBConnection.all(`create table if not exists weatherdata (
    city text not null,
    temp real not null,
    updated_at text not null,
    weather text not null
)`);

module.exports = DBConnection;
