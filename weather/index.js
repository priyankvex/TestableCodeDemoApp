const express = require("express");
const router = express.Router();

const WeatherControllerFactory = require("./controller");
const WeatherRepositoryFactory = require("./weather_repository");
const WeatherServiceClientFactory = require('./weather_service_client');
const WeatherDBClientFactory = require('./weather_db_client');
const Main = require('../index');

const weatherDBClient = getWeatherDBClient();
const weatherServiceClient = getWeatherServiceClient();

const weatherRepository = WeatherRepositoryFactory(weatherDBClient, weatherServiceClient);
const weatherController = WeatherControllerFactory(weatherRepository);

router.get("/getweather", (req, res) => weatherController.getWeather(req, res));

function getWeatherDBClient(){
    return WeatherDBClientFactory(Main.DBConnection);
}

function getWeatherServiceClient(){
    const API_KEY = 'e7cd658b0117bceb94b8c799b172cd97';
    return WeatherServiceClientFactory(API_KEY);
}

module.exports = router;
