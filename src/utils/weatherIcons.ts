import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Zap, 
  CloudDrizzle,
  Wind,
  Cloudy
} from 'lucide-react';

export const getWeatherIcon = (iconCode: string) => {
  const iconMap: Record<string, typeof Sun> = {
    '01d': Sun,        // clear sky day
    '01n': Sun,        // clear sky night
    '02d': CloudSun,   // few clouds day
    '02n': CloudSun,   // few clouds night
    '03d': Cloud,      // scattered clouds
    '03n': Cloud,      // scattered clouds
    '04d': Cloudy,     // broken clouds
    '04n': Cloudy,     // broken clouds
    '09d': CloudDrizzle, // shower rain
    '09n': CloudDrizzle, // shower rain
    '10d': CloudRain,  // rain day
    '10n': CloudRain,  // rain night
    '11d': Zap,        // thunderstorm
    '11n': Zap,        // thunderstorm
    '13d': CloudSnow,  // snow
    '13n': CloudSnow,  // snow
    '50d': Wind,       // mist
    '50n': Wind,       // mist
  };

  return iconMap[iconCode] || Cloud;
};