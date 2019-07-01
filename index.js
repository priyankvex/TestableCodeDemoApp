const express = require('express');
const app = express();
const port = 3000;
const DBConnection = require('./db');

module.exports = {
    DBConnection: DBConnection
};

const weatherRoutes = require('./weather/index');

app.use(weatherRoutes);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
