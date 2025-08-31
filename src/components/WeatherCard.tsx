import React from 'react';
import { WeatherData } from '../services/weatherAPI';
import { getWeatherIcon } from '../utils/weatherIcons';

interface WeatherCardProps {
  data: WeatherData;
  compact?: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, compact = false }) => {
  const WeatherIcon = getWeatherIcon(data.icon);
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (compact) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
        <div className="flex items-center space-x-4">
          <WeatherIcon className="w-12 h-12 text-yellow-400" />
          <div>
            <p className="text-2xl font-bold text-white">{Math.round(data.temperature)}°</p>
            <p className="text-gray-300 text-sm capitalize">{data.description}</p>
            <p className="text-gray-400 text-xs">{data.name}, {data.country}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-white/20 rounded-xl p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-gray-300 text-sm mb-1">{currentTime}</p>
          <h2 className="text-2xl font-bold text-white">{data.name}, {data.country}</h2>
        </div>
        <WeatherIcon className="w-16 h-16 text-yellow-400" />
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-6xl font-light text-white mb-2">{Math.round(data.temperature)}°</p>
          <p className="text-gray-300 mb-1">Feels like {Math.round(data.feelsLike)}°</p>
          <p className="text-gray-300 capitalize">{data.description}</p>
        </div>
        
        <div className="pt-4 border-t border-white/10">
          <p className="text-gray-300">
            There will be mostly sunny skies. The high will be {Math.round(data.temperature + 3)}°.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;