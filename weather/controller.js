const httpResponse = require('./../responses');

var WeatherController = {};

const BAD_WEATHERS = new Set(['rain', 'thunderstorm', 'snow', 'tornado']);

WeatherController.weatherDataRepository =  null;

WeatherController.getWeather = function (req, res){
    let city = req.query.city;
    return this.weatherDataRepository.getWeatherByCity(city)
        .then(
            response => httpResponse.successResponse(res, response, 200)
        )
        .catch(err => {});
};

WeatherController.isWeatherBad = function (req, res){
    let city = req.query.city;
    return this.weatherDataRepository.getWeatherByCity(city)
        .then(response => {
            let weather = response.weather.toLowerCase();
            let isWeatherBad = BAD_WEATHERS.has(weather);
            httpResponse.successResponse(res, {isWeatherBad: isWeatherBad}, 200);
        })
        .catch(err => {});
};

/**
 * @return {WeatherController}
 */
module.exports = function(weatherRepository){
    WeatherController.weatherDataRepository = weatherRepository;
    return WeatherController;
};
