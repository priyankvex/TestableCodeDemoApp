const utils = require('../utils');
var RequestPromise = require('request-promise-native');

var WeatherServiceClient = {};

const API_KEY = null;
const URL = 'http://api.openweathermap.org/data/2.5/weather';

WeatherServiceClient.getWeatherByCity = function(city){

    let options = {
        uri: URL,
        qs: {
            q: city,
            appid: this.API_KEY,
            units: 'metric'
        },
        json: true
    };
    return RequestPromise(options)
        .then((response) => {
            return _parseWeatherResponse(response);
        })
        .catch((err) => {
            console.log(err);
            return null;
        })
};

function _parseWeatherResponse(rawWeatherResponse){
    return {
        temp: rawWeatherResponse.main.temp,
        weather: rawWeatherResponse.weather[0].main,
        updated_at: utils.dateToISOString(new Date()),
        city: rawWeatherResponse.name.toLowerCase()
    }
}


module.exports = function(api_key){
    WeatherServiceClient.API_KEY = api_key;
    return WeatherServiceClient;
};
