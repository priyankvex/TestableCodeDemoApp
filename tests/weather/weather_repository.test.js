const WeatherRepositoryFactory = require('../../src/weather/weather_repository');

var MockWeatherDbClient = {};
var MockWeatherServiceClient = {};


describe('Test WeatherRepository', () => {

    beforeEach(() => {

        MockWeatherDbClient.getWeatherByCity = function(city){
            return Promise.resolve().then(() => {
                return MockWeatherDbClient.storage[city]
            })
        };

        MockWeatherDbClient.storage = {};

        MockWeatherDbClient.saveWeatherData = function(weatherData){
            MockWeatherDbClient.storage[weatherData.city] = weatherData;
            return Promise.resolve().then(()=> { return weatherData});
        };

        MockWeatherServiceClient.getWeatherByCity = function(city){
            return Promise.resolve().then(() => {
                let data = {
                    'city': city,
                    'temp': 123,
                    'weather': 'rain',
                    'updated_at': new Date('2011-02-07 15:13:06').toISOString()
                };
                MockWeatherDbClient.saveWeatherData(data);
                return data;
            })
        };

    });

    it('should refresh weather data from the remote service for stale cached data', function () {
        const WeatherRepository = WeatherRepositoryFactory(MockWeatherDbClient, MockWeatherServiceClient);
        return WeatherRepository.getWeatherByCity('london').then(
            (weatherData) => {
                // check the final output
                expect(weatherData).toEqual({
                    'city': 'london',
                    'temp': 123,
                    'weather': 'rain',
                    'updated_at': new Date('2011-02-07 15:13:06').toISOString()
                });
                // check the storage is updated
                expect(MockWeatherDbClient.storage['london']).toMatchObject({
                    'city': 'london',
                    'temp': 123,
                    'weather': 'rain',
                    'updated_at': new Date('2011-02-07 15:13:06').toISOString()
                });
            }
        )
    });

    it('should fetch weather data form DB for non-stale cached weather data', () => {
        const WeatherRepository = WeatherRepositoryFactory(MockWeatherDbClient, MockWeatherServiceClient);

        const date = new Date().toISOString();
        MockWeatherDbClient.storage['london'] = {
            'city': 'london',
            'temp': 321,
            'weather': 'sunny',
            'updated_at': date
        };

        return WeatherRepository.getWeatherByCity('london').then(
            (weatherData) => {
                // check the final output
                expect(weatherData).toEqual({
                    'city': 'london',
                    'temp': 321,
                    'weather': 'sunny',
                    'updated_at': date
                });
                // check the storage remains the same
                expect(MockWeatherDbClient.storage['london']).toMatchObject({
                    'city': 'london',
                    'temp': 321,
                    'weather': 'sunny',
                    'updated_at': date
                });
            }
        )
    });
});

