import React from 'react';
import { Sunrise, Sunset } from 'lucide-react';

interface SunMoonCardProps {
  sunrise: number;
  sunset: number;
}

const SunMoonCard: React.FC<SunMoonCardProps> = ({ sunrise, sunset }) => {
  const sunriseTime = new Date(sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunsetTime = new Date(sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const now = Date.now();
  const dayDuration = sunset - sunrise;
  const timeElapsed = now - sunrise;
  const progress = Math.max(0, Math.min(100, (timeElapsed / dayDuration) * 100));

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Sun & Moon</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sunrise className="w-5 h-5 text-orange-400" />
            <span className="text-gray-300">Sunrise</span>
          </div>
          <span className="text-white font-semibold">{sunriseTime}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sunset className="w-5 h-5 text-orange-600" />
            <span className="text-gray-300">Sunset</span>
          </div>
          <span className="text-white font-semibold">{sunsetTime}</span>
        </div>

        <div className="pt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Daylight Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SunMoonCard;