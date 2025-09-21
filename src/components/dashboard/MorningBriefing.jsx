import React, { useState, useEffect } from 'react';
import { FiSun, FiCloudRain, FiCloud, FiCloudSnow, FiCloudLightning, FiWind, FiMoon, FiAlertTriangle, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import weatherService from '../../services/weatherService';
import { useTheme } from '../../hooks/useTheme';

const MorningBriefing = ({ tasks, loading: tasksLoading }) => {
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [quote, setQuote] = useState('');
  const { theme, getEffectiveTheme } = useTheme();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (!navigator.geolocation) {
          setWeatherError('Geolocation is not supported by your browser');
          setWeatherLoading(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const weatherData = await weatherService.getWeather(latitude, longitude);
              setWeather(weatherData);
              setWeatherError(null);
            } catch (err) {
              console.error('Error fetching weather data:', err);
              setWeatherError('Unable to fetch weather data. Please try again later.');
            } finally {
              setWeatherLoading(false);
            }
          },
          (err) => {
            console.error('Geolocation error:', err);
            setWeatherError('Unable to get your location. Please enable location services.');
            setWeatherLoading(false);
          },
          { timeout: 10000 }
        );
      } catch (err) {
        console.error('Error in weather fetch:', err);
        setWeatherError(err.message || 'An unexpected error occurred');
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const quotes = [
      "Focus on being productive instead of busy.",
      "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
      "Do the hard jobs first. The easy jobs will take care of themselves.",
      "Until we can manage time, we can manage nothing else.",
      "Time is the scarcest resource and unless it is managed, nothing else can be managed."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  const getWeatherIcon = () => {
    if (!weather || !weather.icon) return <FiCloud className="text-gray-500 text-3xl" />;

    const iconCode = weather.icon;

    if (iconCode.includes('01')) {
      return iconCode.includes('d')
        ? <FiSun className="text-yellow-500 text-3xl" />
        : <FiMoon className="text-blue-300 text-3xl" />;
    }
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) {
      return <FiCloud className="text-gray-500 text-3xl" />;
    }
    if (iconCode.includes('09') || iconCode.includes('10')) {
      return <FiCloudRain className="text-blue-500 text-3xl" />;
    }
    if (iconCode.includes('11')) {
      return <FiCloudLightning className="text-yellow-400 text-3xl" />;
    }
    if (iconCode.includes('13')) {
      return <FiCloudSnow className="text-blue-200 text-3xl" />;
    }
    if (iconCode.includes('50')) {
      return <FiWind className="text-gray-400 text-3xl" />;
    }

    return <FiCloud className="text-gray-500 text-3xl" />;
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTodaysTasks = () => {
    if (!tasks || tasks.length === 0) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tasks.filter(task => {
      if (!task.dueDate) return false;

      const taskDate = new Date(task.dueDate);
      return taskDate >= today && taskDate < tomorrow;
    });
  };

  const todaysTasks = getTodaysTasks();
  const pendingTasksCount = todaysTasks.filter(task => task.status !== 'done').length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{getGreeting()}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
          <FiCalendar className="mr-1" /> {formatDate()}
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center">
        {/* Weather Section */}
        <div className="mb-4 md:mb-0 md:mr-8 flex-shrink-0">
          {weatherLoading ? (
            <div className="flex items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg animate-pulse">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 mr-3"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ) : weatherError ? (
            <div className="flex items-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <FiAlertTriangle className="text-red-500 text-xl mr-2" />
              <div className="text-sm text-red-600 dark:text-red-400">
                {weatherError}
              </div>
            </div>
          ) : weather ? (
            <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              {getWeatherIcon()}
              <div className="ml-3">
                <div className="text-xl font-semibold">{weather.temp}°</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 capitalize">{weather.description}</div>
                {weather.location && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">{weather.location}</div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Tasks Summary Section */}
        <div className="flex-grow">
          <div className="mb-3">
            <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-1">
              Today's Tasks
            </div>
            {tasksLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ) : todaysTasks.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No tasks scheduled for today
              </p>
            ) : (
              <div>
                <div className="flex items-center mb-1">
                  <div className={`w-2 h-2 rounded-full ${pendingTasksCount > 0 ? 'bg-amber-500' : 'bg-green-500'} mr-2`}></div>
                  <span className="text-sm">
                    {pendingTasksCount === 0
                      ? 'All tasks completed'
                      : `${pendingTasksCount} task${pendingTasksCount !== 1 ? 's' : ''} remaining`}
                  </span>
                </div>
                <ul className="mt-2 space-y-1">
                  {todaysTasks.slice(0, 3).map(task => (
                    <li key={task._id} className="flex items-center text-sm">
                      {task.status === 'done' ? (
                        <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                      ) : (
                        <div className={`w-3 h-3 rounded-full mr-2 flex-shrink-0 ${
                          task.priority === 'urgent' ? 'bg-red-500' :
                          task.priority === 'high' ? 'bg-orange-500' :
                          task.priority === 'medium' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                      )}
                      <span className={`truncate ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
                        {task.title}
                      </span>
                    </li>
                  ))}
                  {todaysTasks.length > 3 && (
                    <li className="text-xs text-gray-500 italic pl-5">
                      +{todaysTasks.length - 3} more tasks
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Quote Section */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 italic border-l-2 border-blue-400 pl-3">
            {quote}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MorningBriefing;