// frontend/src/services/weatherService.js
class WeatherService {
  /**
   * Fetches weather data based on coordinates
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Object>} Weather data
   */
  async getWeather(lat, lon) {
    try {
      // For a real implementation, you would use an API key
      // This is an example using OpenWeatherMap API
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;; // Replace with your actual API key
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch weather data');

      const data = await response.json();

      // Format the response
      return {
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        location: data.name
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw new Error('Unable to load weather data');
    }
  }

  /**
   * Mock version for development without API key
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Object>} Mocked weather data
   */
  async getMockWeather(lat, lon) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return mock data
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