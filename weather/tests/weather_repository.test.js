const WeatherRepositoryFactory = require('../weather_repository');


var MockWeatherDbClient = {};
var MockWeatherServiceClient = {};

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


test('test stale weather is refreshed using the API', () => {
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

test('test non-stale weather is served from the DB', () => {
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
