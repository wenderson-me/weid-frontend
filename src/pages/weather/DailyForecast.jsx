// src/pages/weather/DailyForecast.jsx
import React from 'react';
import { FiDroplet, FiWind, FiSun, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { WiHumidity, WiBarometer, WiSunrise, WiSunset } from 'react-icons/wi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

/**
 * Component to display daily weather forecast
 *
 * @param {Object} props Component props
 * @param {Object} props.day The forecast data for the day
 * @param {string} props.units The units to display ('metric' or 'imperial')
 */
export const DailyForecast = ({ day, units = 'metric' }) => {
  if (!day) return null;

  // Format time from timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '--:--';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date from timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown Date';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  // Determine temperature unit symbol
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const speedUnit = units === 'metric' ? 'm/s' : 'mph';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formatDate(day.dt)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main weather info */}
          <div className="flex flex-col items-center">
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].description}
              className="w-20 h-20"
            />
            <p className="text-lg font-medium capitalize">{day.weather[0].description}</p>

            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center">
                <FiArrowUp className="text-red-500 mr-1" />
                <span className="font-bold">{Math.round(day.temp.max)}{tempUnit}</span>
              </div>
              <div className="flex items-center">
                <FiArrowDown className="text-blue-500 mr-1" />
                <span className="font-bold">{Math.round(day.temp.min)}{tempUnit}</span>
              </div>
            </div>
          </div>

          {/* Detailed weather stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            <div className="flex items-center gap-2">
              <FiSun className="text-2xl text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">UV Index</p>
                <p className="font-medium">{day.uvi}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <WiHumidity className="text-2xl text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Humidity</p>
                <p className="font-medium">{day.humidity}%</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FiWind className="text-2xl text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Wind</p>
                <p className="font-medium">{Math.round(day.wind_speed)} {speedUnit}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FiDroplet className="text-2xl text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Precipitation</p>
                <p className="font-medium">{Math.round((day.pop || 0) * 100)}%</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <WiBarometer className="text-2xl text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Pressure</p>
                <p className="font-medium">{day.pressure} hPa</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <WiSunrise className="text-2xl text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Sunrise</p>
                <p className="font-medium">{formatTime(day.sunrise)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <WiSunset className="text-2xl text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Sunset</p>
                <p className="font-medium">{formatTime(day.sunset)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-5 w-5 flex items-center justify-center text-blue-500">
                <span className="text-sm font-bold">F</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Feels Like</p>
                <p className="font-medium">
                  Day: {Math.round(day.feels_like.day)}{tempUnit} /
                  Night: {Math.round(day.feels_like.night)}{tempUnit}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Temperature throughout the day */}
        <div className="mt-6">
          <h4 className="font-medium mb-3">Temperature Throughout the Day</h4>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <p className="text-sm text-gray-500">Morning</p>
              <p className="font-medium">{Math.round(day.temp.morn)}{tempUnit}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Day</p>
              <p className="font-medium">{Math.round(day.temp.day)}{tempUnit}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Evening</p>
              <p className="font-medium">{Math.round(day.temp.eve)}{tempUnit}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Night</p>
              <p className="font-medium">{Math.round(day.temp.night)}{tempUnit}</p>
            </div>
          </div>

          {/* Simple temperature graph visualization */}
          <div className="mt-4 h-20 relative bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="absolute inset-0 flex items-center justify-between px-4">
              {/* Morning */}
              <div
                className="h-4 w-4 rounded-full bg-blue-500"
                style={{
                  marginTop: calculateTemperatureOffset(day.temp.morn, day.temp.min, day.temp.max)
                }}
              ></div>

              {/* Day */}
              <div
                className="h-4 w-4 rounded-full bg-orange-500"
                style={{
                  marginTop: calculateTemperatureOffset(day.temp.day, day.temp.min, day.temp.max)
                }}
              ></div>

              {/* Evening */}
              <div
                className="h-4 w-4 rounded-full bg-purple-500"
                style={{
                  marginTop: calculateTemperatureOffset(day.temp.eve, day.temp.min, day.temp.max)
                }}
              ></div>

              {/* Night */}
              <div
                className="h-4 w-4 rounded-full bg-indigo-500"
                style={{
                  marginTop: calculateTemperatureOffset(day.temp.night, day.temp.min, day.temp.max)
                }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to calculate vertical position for temperature visualization
function calculateTemperatureOffset(temp, min, max) {
  const range = max - min;
  if (range === 0) return '0px';

  const normalized = (temp - min) / range;
  const offset = 100 - (normalized * 100);

  // Constrain the value to stay within the container
  return `${Math.max(0, Math.min(offset, 100))}%`;
}

export default DailyForecast;