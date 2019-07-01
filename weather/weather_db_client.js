const utils = require('../utils');
let WeatherDBClient = {};

WeatherDBClient.getWeatherByCity = function(city){
    let self = this;
    return new Promise(function (resolve, reject) {
        self.connection.get(`select * from owlcity`, {}, (err, row) => {
            console.log(row);
            if (err){
                reject(err);
            }
            else{
                resolve(row);
            }
        })
    });
};

WeatherDBClient.saveWeatherData = function (weatherData) {
    let self = this;
    return new Promise(function (resolve, reject) {
        self.connection.run(`delete from owlcity where city = ?`, [weatherData.city], (err, row) => {
            if (err){
                reject(err);
            }
            else{
                resolve(row);
            }
        })
    }).then(() => {
        return new Promise(function (resolve, reject) {
            self.connection.run(
                `insert into owlcity (city, temp, weather, updated_at) values (?, ?, ?, ?)`,
                [weatherData.city, weatherData.temp, weatherData.weather, weatherData.updated_at],
                (err, row) => {
                    if (err){
                        reject(err);
                    }
                    else{
                        resolve(weatherData);
                    }
                }
            )
        })
    });
};

module.exports = function(databaseConnection){
    WeatherDBClient.connection = databaseConnection;
    return WeatherDBClient;
};