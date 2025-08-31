import React, { useState } from 'react';
import { ForecastItem } from '../services/weatherAPI';
import { getWeatherIcon } from '../utils/weatherIcons';

interface ForecastListProps {
  hourlyData: ForecastItem[];
  dailyData: ForecastItem[];
}

type TabType = 'today' | 'tomorrow' | '10-days';

const ForecastList: React.FC<ForecastListProps> = ({ hourlyData, dailyData }) => {
  const [activeTab, setActiveTab] = useState<TabType>('today');

  const tabs = [
    { key: 'today' as const, label: 'Today' },
    { key: 'tomorrow' as const, label: 'Tomorrow' },
    { key: '10-days' as const, label: '10 Days' },
  ];

  const getTodayData = () => hourlyData.slice(0, 12);
  const getTomorrowData = () => hourlyData.slice(12, 24);
  const get10DaysData = () => dailyData;

  const getCurrentData = () => {
    switch (activeTab) {
      case 'today':
        return getTodayData();
      case 'tomorrow':
        return getTomorrowData();
      case '10-days':
        return get10DaysData();
      default:
        return getTodayData();
    }
  };

  const formatTime = (timestamp: number, isDaily: boolean) => {
    const date = new Date(timestamp);
    if (isDaily) {
      return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentData = getCurrentData();
  const isDaily = activeTab === '10-days';

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
      <div className="flex space-x-1 mb-6 bg-white/10 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === tab.key
                ? 'bg-white/20 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {currentData.map((item, index) => {
          const WeatherIcon = getWeatherIcon(item.icon);
          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm w-16">
                  {formatTime(item.dt, isDaily)}
                </span>
                <WeatherIcon className="w-6 h-6 text-yellow-400" />
                <span className="text-gray-300 text-sm capitalize">
                  {item.description}
                </span>
              </div>
              <div className="text-right">
                {isDaily && item.tempMin !== undefined && item.tempMax !== undefined ? (
                  <span className="text-white font-semibold">
                    {Math.round(item.tempMax)}° / {Math.round(item.tempMin)}°
                  </span>
                ) : (
                  <span className="text-white font-semibold">
                    {Math.round(item.temp)}°
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastList;