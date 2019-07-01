const utils = require('../utils');

var WeatherRepository = {};

WeatherRepository.weatherDBClient = null;
WeatherRepository.weatherServiceClient = null;

WeatherRepository.getWeatherByCity = function(city){
    let self = this;
     return this.weatherDBClient.getWeatherByCity(city)
        .then((weatherData) => {
            let fetchUsingAPI = false;
            if (!weatherData){
                fetchUsingAPI = true;
            }else{
                let currentTime = new Date();
                let lastUpdatedAt = utils.ISOStringToDate(weatherData.updated_at);
                let tenMinutes = 1000 * 60 * 10;
                if (currentTime - lastUpdatedAt > tenMinutes){
                    fetchUsingAPI = true;
                }
            }

            if(fetchUsingAPI){
                return self._refreshWeatherData(city);
            }
            else{
                return weatherData;
            }
        })
        .catch(err => {console.log(err)})
};


WeatherRepository._refreshWeatherData = function(city){
    let self = this;
    return this.weatherServiceClient.getWeatherByCity(city)
        .then(weatherData => {
            return self.weatherDBClient.saveWeatherData(weatherData)
        })
};


module.exports = function(weatherDBClient, weatherServiceClient){
    WeatherRepository.weatherDBClient = weatherDBClient;
    WeatherRepository.weatherServiceClient = weatherServiceClient;

    return WeatherRepository;
};
