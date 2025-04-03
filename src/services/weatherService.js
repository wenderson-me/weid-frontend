// src/services/weatherService.js
/**
 * Service for fetching weather data from OpenWeatherMap API
 * Using only free endpoints (weather and forecast)
 */
class WeatherService {
  constructor() {
    // API key can be stored in an environment variable
    this.apiKey = import.meta.env.VITE_WEATHER_API_KEY || 'YOUR_API_KEY';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.geocodingUrl = 'https://api.openweathermap.org/geo/1.0';
  }

  /**
   * Fetches current weather data based on coordinates
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @param {string} units - Units system (metric or imperial)
   * @returns {Promise<Object>} Weather data
   */
  async getWeather(lat, lon, units = 'metric') {
    try {
      // For development without API key, use mock data
      if (this.apiKey === 'YOUR_API_KEY') {
        return this.getMockWeather(lat, lon, units);
      }

      // Call the OpenWeatherMap API
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();

      // Get air quality data if available
      let airQuality = null;
      try {
        const aqiResponse = await fetch(
          `${this.baseUrl}/air_pollution?lat=${lat}&lon=${lon}&appid=${this.apiKey}`
        );

        if (aqiResponse.ok) {
          const aqiData = await aqiResponse.json();
          airQuality = {
            aqi: aqiData.list[0].main.aqi,
            ...aqiData.list[0].components
          };
        }
      } catch (error) {
        console.warn('Could not fetch air quality data', error);
      }

      // UV index is not available in the free API anymore, so we'll set a placeholder
      const uvi = await this.getEstimatedUVIndex(data.weather[0].id, data.clouds.all);

      // Format the response for our application
      return {
        location: data.name,
        country: data.sys.country,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon
        },
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        wind: Math.round(data.wind.speed),
        windDeg: data.wind.deg,
        windGust: data.wind.gust,
        visibility: data.visibility,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        timezone: data.timezone,
        dt: data.dt,
        airQuality,
        uvi, // Estimated UV index
        pop: 0 // Probability of precipitation (not available in free API)
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Unable to fetch weather data. Please try again later.');
    }
  }

  /**
   * Get an estimated UV index based on weather condition and cloud coverage
   * @param {number} weatherId - Weather condition ID
   * @param {number} cloudiness - Cloud coverage in percentage
   * @returns {number} Estimated UV index (0-11)
   */
  async getEstimatedUVIndex(weatherId, cloudiness) {
    // A very simple estimation based on weather conditions
    // Clear skies = higher UV, cloudy/rainy = lower UV
    if (weatherId >= 800 && weatherId <= 801) { // Clear or few clouds
      return 8 - (cloudiness / 25); // Max 8 on clear day
    } else if (weatherId >= 802 && weatherId <= 804) { // Cloudy
      return 5 - (cloudiness / 20); // Lower for cloudier days
    } else if (weatherId >= 700 && weatherId <= 799) { // Atmosphere conditions (fog, mist)
      return 4;
    } else if (weatherId >= 600 && weatherId <= 699) { // Snow
      return 3;
    } else if (weatherId >= 500 && weatherId <= 599) { // Rain
      return 2;
    } else if (weatherId >= 300 && weatherId <= 399) { // Drizzle
      return 3;
    } else if (weatherId >= 200 && weatherId <= 299) { // Thunderstorm
      return 1;
    }
    return 5; // Default moderate value
  }

  /**
   * Fetches weather forecast data using the free forecast API
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @param {string} units - Units system (metric or imperial)
   * @returns {Promise<Object>} Forecast data
   */
  async getForecast(lat, lon, units = 'metric') {
    try {
      // For development without API key, use mock data
      if (this.apiKey === 'YOUR_API_KEY') {
        return this.getMockForecast(lat, lon, units);
      }

      // Call the OpenWeatherMap forecast API (gives 5 days with 3-hour intervals)
      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
      }

      const data = await response.json();

      // Process the forecast data to match our expected format
      const processed = this.processForecastData(data);

      return processed;
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      throw new Error('Unable to fetch forecast data. Please try again later.');
    }
  }

  /**
   * Process the forecast data from the API into daily and hourly format
   * @param {Object} data - Raw forecast data from API
   * @returns {Object} Processed forecast data
   */
  processForecastData(data) {
    // Current date to determine day boundaries
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Group forecast by day
    const dailyMap = new Map();
    const hourlyList = [];

    // Process each forecast entry (every 3 hours for 5 days)
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayKey = day.toISOString().split('T')[0];

      // Format for hourly forecasts (first 24 entries)
      if (hourlyList.length < 24) {
        hourlyList.push({
          dt: item.dt,
          temp: item.main.temp,
          feels_like: item.main.feels_like,
          pressure: item.main.pressure,
          humidity: item.main.humidity,
          weather: item.weather,
          clouds: item.clouds.all,
          wind_speed: item.wind.speed,
          wind_deg: item.wind.deg,
          pop: item.pop || 0,
          visibility: item.visibility
        });
      }

      // Aggregate for daily forecasts
      if (!dailyMap.has(dayKey)) {
        dailyMap.set(dayKey, {
          dt: day.getTime() / 1000,
          day_temps: [],
          night_temps: [],
          humidity: [],
          pressure: [],
          weather: [],
          wind_speed: [],
          wind_deg: [],
          pop: 0
        });
      }

      const dayData = dailyMap.get(dayKey);

      // Determine if it's day or night (rough approximation)
      const hour = date.getHours();
      if (hour >= 6 && hour <= 18) {
        dayData.day_temps.push(item.main.temp);
      } else {
        dayData.night_temps.push(item.main.temp);
      }

      dayData.humidity.push(item.main.humidity);
      dayData.pressure.push(item.main.pressure);
      dayData.weather.push(item.weather[0]);
      dayData.wind_speed.push(item.wind.speed);
      dayData.wind_deg.push(item.wind.deg);

      // Track max probability of precipitation
      if (item.pop && item.pop > dayData.pop) {
        dayData.pop = item.pop;
      }
    });

    // Process daily aggregates into final format
    const daily = Array.from(dailyMap.entries()).map(([key, day]) => {
      // Determine most frequent weather condition
      const weatherFrequency = day.weather.reduce((acc, weather) => {
        acc[weather.id] = (acc[weather.id] || 0) + 1;
        return acc;
      }, {});

      const mostFrequentWeatherId = Object.entries(weatherFrequency)
        .sort((a, b) => b[1] - a[1])
        [0][0];

      const mostFrequentWeather = day.weather.find(w => w.id.toString() === mostFrequentWeatherId);

      // Calculate average values
      const avgDayTemp = day.day_temps.length ?
        day.day_temps.reduce((sum, temp) => sum + temp, 0) / day.day_temps.length : null;

      const avgNightTemp = day.night_temps.length ?
        day.night_temps.reduce((sum, temp) => sum + temp, 0) / day.night_temps.length : null;

      const avgHumidity = day.humidity.reduce((sum, h) => sum + h, 0) / day.humidity.length;
      const avgPressure = day.pressure.reduce((sum, p) => sum + p, 0) / day.pressure.length;
      const avgWindSpeed = day.wind_speed.reduce((sum, w) => sum + w, 0) / day.wind_speed.length;

      // Find max and min temps across all readings for the day
      const allTemps = [...day.day_temps, ...day.night_temps];
      const maxTemp = Math.max(...allTemps);
      const minTemp = Math.min(...allTemps);

      // Estimate sunrise and sunset from key (approximate only)
      const dayDate = new Date(key);
      const estimatedSunrise = new Date(dayDate.setHours(6, 0, 0, 0)).getTime() / 1000;
      const estimatedSunset = new Date(dayDate.setHours(18, 0, 0, 0)).getTime() / 1000;

      return {
        dt: day.dt,
        sunrise: estimatedSunrise,
        sunset: estimatedSunset,
        temp: {
          day: avgDayTemp || maxTemp,
          min: minTemp,
          max: maxTemp,
          night: avgNightTemp || minTemp,
          eve: avgDayTemp || maxTemp,
          morn: avgDayTemp || minTemp
        },
        feels_like: {
          day: avgDayTemp || maxTemp,
          night: avgNightTemp || minTemp,
          eve: avgDayTemp || maxTemp,
          morn: avgDayTemp || minTemp
        },
        pressure: Math.round(avgPressure),
        humidity: Math.round(avgHumidity),
        weather: [mostFrequentWeather],
        wind_speed: avgWindSpeed,
        wind_deg: day.wind_deg[0], // Just use first value
        pop: day.pop,
        clouds: 0, // Not calculating this
        uvi: this.getEstimatedUVIndex(mostFrequentWeather.id, 0) // Estimated UV index
      };
    });

    // Sort daily forecasts by date
    daily.sort((a, b) => a.dt - b.dt);

    return {
      current: hourlyList[0], // First 3-hour segment as current
      hourly: hourlyList,
      daily: daily.slice(0, 7), // Limit to 7 days
      timezone: data.city.timezone,
      timezone_offset: data.city.timezone
    };
  }

  /**
   * Get weather data by city name
   * @param {string} city - City name
   * @param {string} units - Units system (metric or imperial)
   * @returns {Promise<Object>} Weather data
   */
  async getWeatherByCity(city, units = 'metric') {
    try {
      // For development without API key, use mock data
      if (this.apiKey === 'YOUR_API_KEY') {
        return this.getMockWeather(0, 0, units);
      }

      // First, convert city name to coordinates using geocoding API
      const geoResponse = await fetch(
        `${this.geocodingUrl}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`
      );

      if (!geoResponse.ok) {
        throw new Error('Failed to geocode city');
      }

      const geoData = await geoResponse.json();

      if (!geoData.length) {
        throw new Error(`Location not found: ${city}`);
      }

      const { lat, lon } = geoData[0];

      // Then get weather using coordinates
      return this.getWeather(lat, lon, units);
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      throw new Error(`Unable to fetch weather for ${city}. Please try a different location.`);
    }
  }

  /**
   * Mock version for development without API key
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @param {string} units - Units system (metric or imperial)
   * @returns {Promise<Object>} Mocked weather data
   */
  async getMockWeather(lat, lon, units = 'metric') {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate random data based on units
    const tempBase = units === 'metric' ? 18 : 64;
    const windBase = units === 'metric' ? 5 : 11;

    // Return mock data
    return {
      location: 'Mock City',
      country: 'Mockland',
      coordinates: {
        lat: lat || 40.7128,
        lon: lon || -74.0060
      },
      temp: Math.round(tempBase + (Math.random() * 10 - 5)),
      feelsLike: Math.round(tempBase + (Math.random() * 10 - 3)),
      description: ['clear sky', 'few clouds', 'scattered clouds', 'broken clouds', 'shower rain', 'rain', 'thunderstorm', 'snow', 'mist'][Math.floor(Math.random() * 9)],
      icon: ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'][Math.floor(Math.random() * 9)],
      humidity: Math.round(40 + (Math.random() * 40)),
      pressure: Math.round(1000 + (Math.random() * 30)),
      wind: Math.round(windBase + (Math.random() * 5)),
      windDeg: Math.round(Math.random() * 360),
      windGust: Math.round(windBase + (Math.random() * 8)),
      visibility: 10000 - Math.round(Math.random() * 2000),
      sunrise: Math.floor(new Date().setHours(6, Math.random() * 30, 0) / 1000),
      sunset: Math.floor(new Date().setHours(18, Math.random() * 30, 0) / 1000),
      timezone: 0,
      dt: Math.floor(Date.now() / 1000),
      airQuality: {
        aqi: Math.floor(Math.random() * 5) + 1,
        co: Math.round(100 + Math.random() * 400),
        no: Math.round(Math.random() * 20),
        no2: Math.round(5 + Math.random() * 25),
        o3: Math.round(20 + Math.random() * 40),
        so2: Math.round(Math.random() * 15),
        pm2_5: Math.round(Math.random() * 30),
        pm10: Math.round(5 + Math.random() * 40),
        nh3: Math.round(Math.random() * 10)
      },
      uvi: Math.floor(Math.random() * 11),
      pop: Math.random() * 0.8
    };
  }

  /**
   * Mock forecast data for development without API key
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @param {string} units - Units system (metric or imperial)
   * @returns {Promise<Object>} Mocked forecast data
   */
  async getMockForecast(lat, lon, units = 'metric') {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Base temperature depends on units
    const tempBase = units === 'metric' ? 18 : 64;
    const windBase = units === 'metric' ? 5 : 11;

    // Generate daily forecast data
    const daily = Array.from({ length: 7 }).map((_, i) => {
      const dayTemp = tempBase + (Math.random() * 8 - 4);

      return {
        dt: Math.floor(Date.now() / 1000) + (i * 24 * 60 * 60),
        sunrise: Math.floor(new Date().setHours(6, Math.random() * 30, 0) / 1000) + (i * 24 * 60 * 60),
        sunset: Math.floor(new Date().setHours(18, Math.random() * 30, 0) / 1000) + (i * 24 * 60 * 60),
        temp: {
          day: dayTemp,
          min: dayTemp - (3 + Math.random() * 2),
          max: dayTemp + (3 + Math.random() * 2),
          night: dayTemp - (5 + Math.random() * 2),
          eve: dayTemp - (1 + Math.random()),
          morn: dayTemp - (2 + Math.random() * 3)
        },
        feels_like: {
          day: dayTemp + (Math.random() * 2),
          night: dayTemp - (5 + Math.random() * 2 - 1),
          eve: dayTemp - (1 + Math.random() - 0.5),
          morn: dayTemp - (2 + Math.random() * 3 - 1)
        },
        pressure: 1000 + Math.round(Math.random() * 30),
        humidity: 40 + Math.round(Math.random() * 40),
        dew_point: tempBase - 10 + Math.random() * 5,
        wind_speed: windBase + Math.random() * 5,
        wind_deg: Math.round(Math.random() * 360),
        wind_gust: windBase + 2 + Math.random() * 5,
        weather: [
          {
            id: [800, 801, 802, 803, 804, 500, 501, 502, 600, 741][Math.floor(Math.random() * 10)],
            main: ['Clear', 'Clouds', 'Rain', 'Snow', 'Mist'][Math.floor(Math.random() * 5)],
            description: ['clear sky', 'few clouds', 'scattered clouds', 'broken clouds', 'shower rain', 'rain', 'thunderstorm', 'snow', 'mist'][Math.floor(Math.random() * 9)],
            icon: ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'][Math.floor(Math.random() * 9)]
          }
        ],
        clouds: Math.round(Math.random() * 100),
        pop: Math.random() * 0.7,
        uvi: Math.floor(Math.random() * 11),
        rain: Math.random() > 0.7 ? Math.random() * 10 : 0
      };
    });

    // Generate hourly forecast data
    const hourly = Array.from({ length: 48 }).map((_, i) => {
      const hourTemp = tempBase + (Math.random() * 10 - 5) - (i % 24 < 12 ? 0 : 5);

      return {
        dt: Math.floor(Date.now() / 1000) + (i * 60 * 60),
        temp: hourTemp,
        feels_like: hourTemp + (Math.random() * 3 - 1.5),
        pressure: 1000 + Math.round(Math.random() * 30),
        humidity: 40 + Math.round(Math.random() * 40),
        dew_point: tempBase - 10 + Math.random() * 5,
        uvi: i % 24 > 6 && i % 24 < 18 ? Math.random() * 8 : 0,
        clouds: Math.round(Math.random() * 100),
        visibility: 10000 - Math.round(Math.random() * 2000),
        wind_speed: windBase + Math.random() * 4,
        wind_deg: Math.round(Math.random() * 360),
        wind_gust: windBase + 2 + Math.random() * 3,
        weather: [
          {
            id: [800, 801, 802, 803, 804, 500, 501, 502, 600, 741][Math.floor(Math.random() * 10)],
            main: ['Clear', 'Clouds', 'Rain', 'Snow', 'Mist'][Math.floor(Math.random() * 5)],
            description: ['clear sky', 'few clouds', 'scattered clouds', 'broken clouds', 'shower rain', 'rain', 'thunderstorm', 'snow', 'mist'][Math.floor(Math.random() * 9)],
            icon: ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'][Math.floor(Math.random() * 9)]
          }
        ],
        pop: Math.random() * 0.5
      };
    });

    // Current weather data
    const current = {
      dt: Math.floor(Date.now() / 1000),
      sunrise: Math.floor(new Date().setHours(6, Math.random() * 30, 0) / 1000),
      sunset: Math.floor(new Date().setHours(18, Math.random() * 30, 0) / 1000),
      temp: tempBase + (Math.random() * 10 - 5),
      feels_like: tempBase + (Math.random() * 10 - 3),
      pressure: 1000 + Math.round(Math.random() * 30),
      humidity: 40 + Math.round(Math.random() * 40),
      dew_point: tempBase - 10 + Math.random() * 5,
      uvi: Math.floor(Math.random() * 11),
      clouds: Math.round(Math.random() * 100),
      visibility: 10000 - Math.round(Math.random() * 2000),
      wind_speed: windBase + Math.random() * 5,
      wind_deg: Math.round(Math.random() * 360),
      weather: [
        {
          id: [800, 801, 802, 803, 804, 500, 501, 502, 600, 741][Math.floor(Math.random() * 10)],
          main: ['Clear', 'Clouds', 'Rain', 'Snow', 'Mist'][Math.floor(Math.random() * 5)],
          description: ['clear sky', 'few clouds', 'scattered clouds', 'broken clouds', 'shower rain', 'rain', 'thunderstorm', 'snow', 'mist'][Math.floor(Math.random() * 9)],
          icon: ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'][Math.floor(Math.random() * 9)]
        }
      ]
    };

    return {
      lat,
      lon,
      timezone: "America/New_York",
      timezone_offset: -18000,
      current,
      hourly,
      daily
    };
  }
}

export default new WeatherService();