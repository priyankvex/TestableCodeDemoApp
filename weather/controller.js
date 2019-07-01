const httpResponse = require('./../responses');

var WeatherController = {};

WeatherController.weatherDataRepository =  null;

WeatherController.getWeather = function (req, res){
    let city = req.query.city;
    return this.weatherDataRepository.getWeatherByCity(city)
        .then(response => httpResponse.successResponse(res, response, 200))
        .catch(err => {});
};

/**
 * @return {WeatherController}
 */
module.exports = function(weatherRepository){
    WeatherController.weatherDataRepository = weatherRepository;
    return WeatherController;
};
