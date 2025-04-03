// src/pages/weather/WeatherPage.jsx
import React, { useState, useEffect } from 'react';
import { FiSearch, FiDroplet, FiWind, FiSunrise, FiSunset, FiCompass, FiEye, FiThermometer, FiMapPin, FiRefreshCw } from 'react-icons/fi';
import { WiHumidity, WiBarometer, WiStrongWind } from 'react-icons/wi';
import weatherService from '../../services/weatherService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { InfoAlert, SuccessAlert } from '../../components/ui/StyledAlerts';
import { LocationPicker } from './LocationPicker';
import { DailyForecast } from './DailyForecast';
import { useToast } from '../../components/ui/ToastContext';

const WeatherPage = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [location, setLocation] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [geolocationAvailable, setGeolocationAvailable] = useState(true);
  const [units, setUnits] = useState('metric'); // metric or imperial
  const { theme } = useTheme();
  const { error: toastError } = useToast();

  const [locationSuccess, setLocationSuccess] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const { success: toastSuccess } = useToast();

  // Function to fetch weather data based on geolocation
  const fetchWeatherByGeolocation = async (showSuccessMessage = false) => {
    if (!navigator.geolocation) {
      setGeolocationAvailable(false);
      setError('Geolocation is not supported by your browser');
      return;
    }

    setFetchingLocation(true);
    setLoading(true);
    setLocationSuccess(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weatherData = await weatherService.getWeather(latitude, longitude, units);
          setCurrentWeather(weatherData);
          setLocation(weatherData.location);

          const forecastData = await weatherService.getForecast(latitude, longitude, units);
          setForecast(forecastData);

          setError(null);

          if (showSuccessMessage) {
            setLocationSuccess(true);
            toastSuccess('Location Updated', `Weather data loaded for ${weatherData.location}`);
            // Hide success message after 3 seconds
            setTimeout(() => setLocationSuccess(false), 3000);
          }
        } catch (err) {
          console.error('Error fetching weather data:', err);
          setError('Unable to fetch weather data. Please try again later.');
          toastError('Weather Error', 'Unable to fetch weather data. Please try again later.');
        } finally {
          setLoading(false);
          setFetchingLocation(false);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Unable to get your location. Please enable location services or search for a location.');
        setLoading(false);
        setFetchingLocation(false);
      },
      // Options for geolocation request
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Fetch weather data on initial load
  useEffect(() => {
    fetchWeatherByGeolocation(false);
  }, [units]);

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchLocation.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Search by city name
      const weatherData = await weatherService.getWeatherByCity(searchLocation, units);
      setCurrentWeather(weatherData);
      setLocation(weatherData.location);

      // Get forecast data for the location
      const { lat, lon } = weatherData.coordinates;
      const forecastData = await weatherService.getForecast(lat, lon, units);
      setForecast(forecastData);

      setSearchLocation('');
    } catch (err) {
      console.error('Error searching location:', err);
      setError(`Unable to find weather data for "${searchLocation}". Please check the location name and try again.`);
      toastError('Search Error', `Unable to find weather data for "${searchLocation}"`);
    } finally {
      setLoading(false);
    }
  };

  // Toggle between metric and imperial units
  const toggleUnits = () => {
    setUnits(prevUnits => prevUnits === 'metric' ? 'imperial' : 'metric');
  };

  // Format sunrise/sunset time
  const formatTime = (timestamp) => {
    if (!timestamp) return '--:--';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get appropriate weather icon based on condition and time
  const getWeatherIcon = () => {
    if (!currentWeather) return null;

    const iconCode = currentWeather.icon;
    const isDay = iconCode?.includes('d');

    if (iconCode?.includes('01')) {
      return isDay ?
        <div className="weather-icon sunny" /> :
        <div className="weather-icon clear-night" />;
    }

    if (iconCode?.includes('02') || iconCode?.includes('03') || iconCode?.includes('04')) {
      return isDay ?
        <div className="weather-icon cloudy" /> :
        <div className="weather-icon cloudy-night" />;
    }

    if (iconCode?.includes('09') || iconCode?.includes('10')) {
      return <div className="weather-icon rainy" />;
    }

    if (iconCode?.includes('11')) {
      return <div className="weather-icon stormy" />;
    }

    if (iconCode?.includes('13')) {
      return <div className="weather-icon snowy" />;
    }

    if (iconCode?.includes('50')) {
      return <div className="weather-icon foggy" />;
    }

    return <div className="weather-icon default" />;
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Weather Forecast</h1>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchWeatherByGeolocation(true)}
            disabled={fetchingLocation || !geolocationAvailable}
            className="flex items-center gap-1"
          >
            {fetchingLocation ? <FiRefreshCw className="animate-spin" /> : <FiMapPin />}
            {fetchingLocation ? 'Locating...' : 'My Location'}
          </Button>
          <div className="flex gap-2 ml-0 sm:ml-2">
            <Button
              variant={units === 'metric' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUnits('metric')}
            >
              °C
            </Button>
            <Button
              variant={units === 'imperial' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUnits('imperial')}
            >
              °F
            </Button>
          </div>
        </div>
      </div>

      {/* Success message when location is updated */}
      {locationSuccess && (
        <SuccessAlert title="Location Updated" className="mb-6 animate-fadeIn">
          Successfully updated weather for your current location.
        </SuccessAlert>
      )}

      {/* Search Box */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search location (e.g., London, New York, Tokyo)"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <InfoAlert title="Weather Information" className="mb-6">
          {error}
          {!geolocationAvailable && (
            <p className="mt-2">
              You can still use the search box above to get weather information for specific locations.
            </p>
          )}
        </InfoAlert>
      )}

      {/* Current Weather */}
      {currentWeather && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Current Weather in {location}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex flex-col items-center">
                  {getWeatherIcon()}
                  <h3 className="text-4xl font-bold mt-2">
                    {currentWeather.temp}°{units === 'metric' ? 'C' : 'F'}
                  </h3>
                  <p className="text-lg capitalize">{currentWeather.description}</p>
                  <p className="text-sm text-gray-500">
                    Feels like {currentWeather.feelsLike}°{units === 'metric' ? 'C' : 'F'}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    <WiHumidity className="text-2xl text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Humidity</p>
                      <p className="font-medium">{currentWeather.humidity}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiWind className="text-2xl text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Wind</p>
                      <p className="font-medium">
                        {currentWeather.wind} {units === 'metric' ? 'm/s' : 'mph'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <WiBarometer className="text-2xl text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Pressure</p>
                      <p className="font-medium">{currentWeather.pressure} hPa</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiSunrise className="text-2xl text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-500">Sunrise</p>
                      <p className="font-medium">{formatTime(currentWeather.sunrise)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiSunset className="text-2xl text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-500">Sunset</p>
                      <p className="font-medium">{formatTime(currentWeather.sunset)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiEye className="text-2xl text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Visibility</p>
                      <p className="font-medium">
                        {Math.round(currentWeather.visibility / 1000)} km
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Air Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-full justify-between">
                <div className="air-quality-indicator mb-4">
                  <div className={`air-quality-meter ${getAirQualityClass(currentWeather.airQuality?.aqi || 0)}`}>
                    <div className="air-quality-level" style={{
                      width: `${Math.min((currentWeather.airQuality?.aqi || 0) / 5 * 100, 100)}%`
                    }}></div>
                  </div>
                  <p className="text-center mt-2 font-medium">
                    {getAirQualityText(currentWeather.airQuality?.aqi || 0)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="text-sm text-gray-500">PM2.5</p>
                      <p className="font-medium">{currentWeather.airQuality?.pm2_5 || 'N/A'} µg/m³</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm text-gray-500">PM10</p>
                      <p className="font-medium">{currentWeather.airQuality?.pm10 || 'N/A'} µg/m³</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div>
                      <p className="text-sm text-gray-500">O₃</p>
                      <p className="font-medium">{currentWeather.airQuality?.o3 || 'N/A'} µg/m³</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div>
                      <p className="text-sm text-gray-500">NO₂</p>
                      <p className="font-medium">{currentWeather.airQuality?.no2 || 'N/A'} µg/m³</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Daily Forecast */}
      {forecast && forecast.daily && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {forecast.daily.slice(0, 5).map((day, index) => (
                <div key={index} className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="font-medium mb-2">
                    {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>

                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                    className="w-16 h-16"
                  />

                  <p className="capitalize text-sm">{day.weather[0].description}</p>

                  <div className="flex justify-between w-full mt-2">
                    <span className="font-bold">{Math.round(day.temp.max)}°</span>
                    <span className="text-gray-500">{Math.round(day.temp.min)}°</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 w-full mt-4 text-xs">
                    <div className="flex items-center gap-1">
                      <WiHumidity className="text-blue-500" />
                      <span>{day.humidity}%</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <FiWind className="text-blue-500" />
                      <span>{Math.round(day.wind_speed)} {units === 'metric' ? 'm/s' : 'mph'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hourly Forecast */}
      {forecast && forecast.hourly && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Hourly Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
                {forecast.hourly.slice(0, 24).map((hour, index) => (
                  <div key={index} className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg min-w-[80px]">
                    <p className="text-sm font-medium">
                      {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit' })}
                    </p>

                    <img
                      src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                      alt={hour.weather[0].description}
                      className="w-10 h-10 my-1"
                    />

                    <p className="font-medium">{Math.round(hour.temp)}°</p>

                    <div className="flex items-center text-xs mt-1">
                      <FiDroplet className="text-blue-500 mr-1" />
                      <span>{hour.pop * 100}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Weather Information */}
      {currentWeather && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>UV Index & Precipitation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium mb-2">UV Index</h4>
                  <div className="uv-index-meter mb-2">
                    <div className="uv-index-level" style={{
                      width: `${Math.min((currentWeather.uvi || 0) / 11 * 100, 100)}%`,
                      backgroundColor: getUVIndexColor(currentWeather.uvi || 0)
                    }}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Low</span>
                    <span>Moderate</span>
                    <span>High</span>
                    <span>Extreme</span>
                  </div>
                  <p className="mt-2 font-medium text-center">{getUVIndexText(currentWeather.uvi || 0)}</p>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">Precipitation</h4>
                  <div className="flex items-center justify-center h-24">
                    <div className="relative">
                      <WiStrongWind className="text-6xl text-blue-500" />
                      <span className="absolute inset-0 flex items-center justify-center font-bold">
                        {Math.round((currentWeather.pop || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-center text-sm mt-2">
                    Chance of precipitation in next 24h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wind & Pressure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col items-center">
                  <h4 className="text-lg font-medium mb-2">Wind Direction</h4>
                  <div className="wind-direction-indicator">
                    <div className="compass-circle">
                      <div
                        className="compass-arrow"
                        style={{ transform: `rotate(${currentWeather.windDeg || 0}deg)` }}
                      ></div>
                    </div>
                  </div>
                  <p className="mt-2 text-center">
                    {getWindDirection(currentWeather.windDeg || 0)}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Pressure Trends</h4>
                  <div className="pressure-indicator flex items-center gap-4">
                    <WiBarometer className="text-5xl text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{currentWeather.pressure} hPa</p>
                      <p className="text-sm text-gray-500">
                        {getPressureDescription(currentWeather.pressure)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Helper functions for weather data interpretation
function getAirQualityClass(aqi) {
  if (aqi <= 1) return 'aqi-good';
  if (aqi <= 2) return 'aqi-fair';
  if (aqi <= 3) return 'aqi-moderate';
  if (aqi <= 4) return 'aqi-poor';
  return 'aqi-very-poor';
}

function getAirQualityText(aqi) {
  if (aqi <= 1) return 'Good';
  if (aqi <= 2) return 'Fair';
  if (aqi <= 3) return 'Moderate';
  if (aqi <= 4) return 'Poor';
  return 'Very Poor';
}

function getUVIndexColor(uvi) {
  if (uvi <= 2) return '#3498db'; // Low - Blue
  if (uvi <= 5) return '#2ecc71'; // Moderate - Green
  if (uvi <= 7) return '#f39c12'; // High - Orange
  if (uvi <= 10) return '#e74c3c'; // Very High - Red
  return '#9b59b6'; // Extreme - Purple
}

function getUVIndexText(uvi) {
  if (uvi <= 2) return 'Low';
  if (uvi <= 5) return 'Moderate';
  if (uvi <= 7) return 'High';
  if (uvi <= 10) return 'Very High';
  return 'Extreme';
}

function getWindDirection(deg) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(deg / 22.5) % 16];
}

function getPressureDescription(pressure) {
  if (pressure < 1000) return 'Low (Depression)';
  if (pressure < 1013) return 'Slightly Low';
  if (pressure <= 1025) return 'Normal';
  if (pressure <= 1040) return 'High';
  return 'Very High (Anticyclone)';
}

export default WeatherPage;