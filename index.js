const express = require('express');
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();

const path = require('path');
const dbPath = path.resolve(__dirname, 'database.db');
console.log(dbPath);
const DBConnection = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);
DBConnection.all(`create table if not exists owlcity (
    city text not null,
    temp real not null,
    updated_at text not null
)`);

module.exports = {
    DBConnection: DBConnection
};

const weatherRoutes = require('./weather/index');
app.use(weatherRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
