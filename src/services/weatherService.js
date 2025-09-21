
class WeatherService {
  /**
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Object>} Weather data
   */
  async getWeather(lat, lon) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch weather data');

      const data = await response.json();

      const weatherDescription = this.getWeatherDescription(data.current.weather_code);
      const weatherIcon = this.getWeatherIcon(data.current.weather_code);

      return {
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        description: weatherDescription,
        icon: weatherIcon,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        location: data.timezone.split('/')[1]?.replace('_', ' ') || 'Your Location'
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw new Error('Unable to load weather data');
    }
  }

  /**
   * Alternative method using WeatherAPI.com (limited free tier without API key)
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Object>} Weather data
   */
  async getWeatherAlt(lat, lon) {
    try {
      const url = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch weather data');

      const data = await response.json();
      const currentWeather = data.dataseries[0];

      const weatherDescription = this.get7TimerWeatherDescription(currentWeather.weather);
      const weatherIcon = this.get7TimerWeatherIcon(currentWeather.weather);

      return {
        temp: currentWeather.temp2m,
        feelsLike: currentWeather.temp2m,
        description: weatherDescription,
        icon: weatherIcon,
        humidity: currentWeather.rh2m || 50,
        windSpeed: currentWeather.wind10m_speed,
        location: 'Lisbon'
      };
    } catch (error) {
      console.error('Error fetching weather from alternative source:', error);
      return this.getMockWeather(lat, lon);
    }
  }

  /**
   * Get weather description based on WMO weather code
   * @param {number} code - WMO weather code
   * @returns {string} Weather description
   */
  getWeatherDescription(code) {
    const weatherCodes = {
      0: 'clear sky',
      1: 'mainly clear',
      2: 'partly cloudy',
      3: 'overcast',
      45: 'fog',
      48: 'depositing rime fog',
      51: 'light drizzle',
      53: 'moderate drizzle',
      55: 'dense drizzle',
      56: 'light freezing drizzle',
      57: 'dense freezing drizzle',
      61: 'slight rain',
      63: 'moderate rain',
      65: 'heavy rain',
      66: 'light freezing rain',
      67: 'heavy freezing rain',
      71: 'slight snow fall',
      73: 'moderate snow fall',
      75: 'heavy snow fall',
      77: 'snow grains',
      80: 'slight rain showers',
      81: 'moderate rain showers',
      82: 'violent rain showers',
      85: 'slight snow showers',
      86: 'heavy snow showers',
      95: 'thunderstorm',
      96: 'thunderstorm with slight hail',
      99: 'thunderstorm with heavy hail'
    };

    return weatherCodes[code] || 'unknown';
  }

  /**
   * Get weather icon based on WMO weather code
   * @param {number} code - WMO weather code
   * @returns {string} Weather icon code compatible with existing system
   */
  getWeatherIcon(code) {
    if (code === 0) return '01d'; // clear sky
    if (code === 1) return '01d'; // mainly clear
    if (code === 2) return '02d'; // partly cloudy
    if (code === 3) return '03d'; // overcast
    if (code >= 45 && code <= 48) return '50d'; // fog
    if (code >= 51 && code <= 57) return '09d'; // drizzle
    if (code >= 61 && code <= 67) return '10d'; // rain
    if (code >= 71 && code <= 77) return '13d'; // snow
    if (code >= 80 && code <= 82) return '09d'; // rain showers
    if (code >= 85 && code <= 86) return '13d'; // snow showers
    if (code >= 95) return '11d'; // thunderstorm

    return '50d'; // default
  }

  /**
   * Get weather description for 7Timer API
   * @param {string} code - 7Timer weather code
   * @returns {string} Weather description
   */
  get7TimerWeatherDescription(code) {
    const weatherCodes = {
      'clear': 'clear sky',
      'pcloudy': 'partly cloudy',
      'mcloudy': 'mostly cloudy',
      'cloudy': 'overcast',
      'humid': 'hazy',
      'lightrain': 'light rain',
      'oshower': 'occasional showers',
      'ishower': 'isolated showers',
      'lightsnow': 'light snow',
      'rain': 'moderate rain',
      'snow': 'snow',
      'rainsnow': 'sleet',
      'ts': 'thunderstorm',
      'tsrain': 'thunderstorm with rain'
    };

    return weatherCodes[code] || 'unknown';
  }

  /**
   * Get weather icon for 7Timer API
   * @param {string} code - 7Timer weather code
   * @returns {string} Weather icon code compatible with existing system
   */
  get7TimerWeatherIcon(code) {
    const iconMap = {
      'clear': '01d',
      'pcloudy': '02d',
      'mcloudy': '03d',
      'cloudy': '04d',
      'humid': '50d',
      'lightrain': '10d',
      'oshower': '09d',
      'ishower': '09d',
      'lightsnow': '13d',
      'rain': '10d',
      'snow': '13d',
      'rainsnow': '13d',
      'ts': '11d',
      'tsrain': '11d'
    };

    return iconMap[code] || '50d';
  }

  /**
   * Mock version for development or fallback
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Object>} Mocked weather data
   */
  async getMockWeather(lat, lon) {

    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      temp: 22,
      feelsLike: 23,
      description: 'partly cloudy',
      icon: '02d',
      humidity: 65,
      windSpeed: 5.2,
      location: 'Your Location'
    };
  }
}

export default new WeatherService();