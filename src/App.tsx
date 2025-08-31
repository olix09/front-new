import React, { useState, useEffect, useCallback } from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import StatsGrid from './components/StatsGrid';
import ForecastList from './components/ForecastList';
import SunMoonCard from './components/SunMoonCard';
import ErrorMessage from './components/ErrorMessage';
import ThemeToggle from './components/ThemeToggle';
import {
  WeatherData,
  ForecastItem,
  AirQualityData,
  fetchWeatherData,
  fetchForecastData,
  fetchDailyForecast,
  fetchAirQuality,
  getCurrentPosition,
} from './services/weatherAPI';

interface AppState {
  weather: WeatherData | null;
  hourlyForecast: ForecastItem[];
  dailyForecast: ForecastItem[];
  airQuality: AirQualityData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  currentCity: string;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    weather: null,
    hourlyForecast: [],
    dailyForecast: [],
    airQuality: null,
    loading: false,
    error: null,
    lastUpdated: null,
    currentCity: 'New York',
  });

  const fetchAllData = useCallback(async (city: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [weather, hourlyForecast, dailyForecast, airQuality] = await Promise.all([
        fetchWeatherData(city),
        fetchForecastData(city),
        fetchDailyForecast(city),
        fetchAirQuality(city),
      ]);

      setState(prev => ({
        ...prev,
        weather,
        hourlyForecast,
        dailyForecast,
        airQuality,
        loading: false,
        error: null,
        lastUpdated: Date.now(),
        currentCity: city,
      }));

      localStorage.setItem('weather-last-city', city);
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch weather data. Please try again.',
      }));
    }
  }, []);

  const handleSearch = useCallback((city: string) => {
    fetchAllData(city);
  }, [fetchAllData]);

  const handleLocationRequest = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const position = await getCurrentPosition();
      const { lat, lon } = position;

      // Fetch city name using WeatherAPI search endpoint
      const response = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${lat},${lon}`
      );
      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error('Unable to determine your location');
      }

      const cityName = data[0].name;
      fetchAllData(cityName);

    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Unable to get your location. Please search manually.',
      }));
    }
  }, [fetchAllData]);

  const handleRefresh = useCallback(() => {
    if (state.currentCity) {
      fetchAllData(state.currentCity);
    }
  }, [state.currentCity, fetchAllData]);

  const handleRetry = useCallback(() => {
    if (state.currentCity) {
      fetchAllData(state.currentCity);
    }
  }, [state.currentCity, fetchAllData]);

  useEffect(() => {
    const savedCity = localStorage.getItem('weather-last-city') || 'New York';
    fetchAllData(savedCity);
  }, [fetchAllData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (state.currentCity && !state.loading) {
        fetchAllData(state.currentCity);
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [state.currentCity, state.loading, fetchAllData]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-md bg-white/5">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SkyView
                </h1>
              </div>
              
              <div className="flex-1 max-w-2xl mx-8">
                <SearchBar
                  onSearch={handleSearch}
                  onLocationRequest={handleLocationRequest}
                  loading={state.loading}
                />
              </div>

              {/* Buttons hidden on mobile */}
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={handleRefresh}
                  disabled={state.loading}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 disabled:opacity-50"
                  aria-label="Refresh"
                >
                  <RefreshCw className={`w-5 h-5 text-white ${state.loading ? 'animate-spin' : ''}`} />
                </button>
                <ThemeToggle />
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {state.error ? (
            <ErrorMessage message={state.error} onRetry={handleRetry} />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-4 space-y-6">
                {state.weather && <WeatherCard data={state.weather} />}
                {state.weather && (
                  <StatsGrid weatherData={state.weather} airQuality={state.airQuality || undefined} />
                )}
              </div>

              <div className="xl:col-span-5">
                {state.hourlyForecast.length > 0 && (
                  <ForecastList hourlyData={state.hourlyForecast} dailyData={state.dailyForecast} />
                )}
              </div>

              <div className="xl:col-span-3 space-y-6">
                {state.weather && <WeatherCard data={state.weather} compact />}
                {state.weather && <SunMoonCard sunrise={state.weather.sunrise} sunset={state.weather.sunset} />}

                {state.weather && (
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">UV Index</span>
                        <span className="text-white font-semibold">{state.weather.uvIndex}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Feels like</span>
                        <span className="text-white font-semibold">{Math.round(state.weather.feelsLike)}°</span>
                      </div>
                      {state.airQuality && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Air Quality</span>
                          <span className="text-white font-semibold">AQI {state.airQuality.aqi}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {state.lastUpdated && (
            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm">
                Last updated: {new Date(state.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;
