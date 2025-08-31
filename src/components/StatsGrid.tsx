import React from 'react';
import { Wind, Droplets, Eye, Gauge, Thermometer } from 'lucide-react';
import { WeatherData, AirQualityData } from '../services/weatherAPI';

interface StatsGridProps {
  weatherData: WeatherData;
  airQuality?: AirQualityData;
}

const StatsGrid: React.FC<StatsGridProps> = ({ weatherData, airQuality }) => {
  const getAirQualityText = (aqi: number) => {
    const levels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    return levels[aqi - 1] || 'Unknown';
  };

  const getAirQualityColor = (aqi: number) => {
    const colors = ['text-green-400', 'text-yellow-400', 'text-orange-400', 'text-red-400', 'text-purple-400'];
    return colors[aqi - 1] || 'text-gray-400';
  };

  const stats = [
    {
      icon: Gauge,
      label: 'Air Quality',
      value: airQuality ? getAirQualityText(airQuality.aqi) : 'Loading...',
      unit: airQuality ? `AQI ${airQuality.aqi}` : '',
      color: airQuality ? getAirQualityColor(airQuality.aqi) : 'text-gray-400',
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: weatherData.windSpeed.toFixed(1),
      unit: 'km/h',
      color: 'text-blue-400',
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: weatherData.humidity,
      unit: '%',
      color: 'text-cyan-400',
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: weatherData.visibility,
      unit: 'km',
      color: 'text-green-400',
    },
    {
      icon: Thermometer,
      label: 'Pressure',
      value: weatherData.pressure,
      unit: 'hPa',
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <Icon className={`w-6 h-6 ${stat.color}`} />
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-white font-semibold">
                  {stat.value} <span className="text-gray-300 text-sm">{stat.unit}</span>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;