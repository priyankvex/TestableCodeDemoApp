const WeatherControllerFactory = require('../../src/weather/controller');

const MockWeatherRepository = {};

MockWeatherRepository.getWeatherByCity = (city) => {

    const date = new Date('2019-07-12T16:55:45.662Z').toISOString();
    const weatherData = {
        'london': {
            'city': 'london',
            'temp': 321,
            'weather': 'sunny',
            'updated_at': date
        },
        'paris': {
            'city': 'paris',
            'temp': 123,
            'weather': 'rain',
            'updated_at': date
        }
    };

    return Promise.resolve().then(() => {
        return weatherData[city];
    })
};


describe('Test WeatherRepository', () => {

    const WeatherController = WeatherControllerFactory(MockWeatherRepository);
    const res = {
        json: (data) => data
    };

    it('should return correct weather for london', async function () {
        let req = {
            'query': {
                city: 'london'
            }
        };
        let r = await WeatherController.getWeather(req, res);

        let expectedResult = {
            data: { city: 'london', temp: 321, weather: 'sunny', updated_at: '2019-07-12T16:55:45.662Z' },
            statusCode: 200
        };

        expect(r).toMatchObject(expectedResult);

    });

    it('should return correct weather for paris', async function () {
        let req = {
            'query': {
                city: 'paris'
            }
        };
        let r = await WeatherController.getWeather(req, res);

        let expectedResult = {
            data: { city: 'paris', temp: 123, weather: 'rain', updated_at: '2019-07-12T16:55:45.662Z' },
            statusCode: 200
        };

        expect(r).toMatchObject(expectedResult);

    });

    it('should give bad weather for paris', async function () {
        let req = {
            'query': {
                city: 'paris'
            }
        };
        let r = await WeatherController.isWeatherBad(req, res);

        expect(r).toMatchObject({ data: { isWeatherBad: true }, statusCode: 200 });

    });

    it('should give good weather for london', async function () {
        let req = {
            'query': {
                city: 'london'
            }
        };
        let r = await WeatherController.isWeatherBad(req, res);

        expect(r).toMatchObject({ data: { isWeatherBad: false }, statusCode: 200 });

    });

});
