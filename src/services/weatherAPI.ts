import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string;
const BASE_URL = 'https://api.weatherapi.com/v1';

export interface WeatherData {
  name: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
}

export interface ForecastItem {
  dt: number;
  temp: number;
  tempMin?: number;
  tempMax?: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface AirQualityData {
  aqi: number; // US EPA AQI
  co: number;
  no2: number;
  o3: number;
  pm2_5: number;
  pm10: number;
}

export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  const response = await axios.get(`${BASE_URL}/current.json`, {
    params: { key: API_KEY, q: city, aqi: 'yes' },
  });

  const data = response.data;

  return {
    name: data.location.name,
    country: data.location.country,
    temperature: data.current.temp_c,
    feelsLike: data.current.feelslike_c,
    description: data.current.condition.text,
    icon: data.current.condition.icon,
    humidity: data.current.humidity,
    windSpeed: data.current.wind_kph,
    pressure: data.current.pressure_mb,
    visibility: data.current.vis_km,
    uvIndex: data.current.uv,
    sunrise: data.forecast?.forecastday?.[0]?.astro?.sunrise || '',
    sunset: data.forecast?.forecastday?.[0]?.astro?.sunset || '',
  };
};

export const fetchForecastData = async (city: string): Promise<ForecastItem[]> => {
  const response = await axios.get(`${BASE_URL}/forecast.json`, {
    params: { key: API_KEY, q: city, days: 3, aqi: 'yes', alerts: 'no' },
  });

  const hourly: ForecastItem[] = [];

  response.data.forecast.forecastday.forEach((day: any) => {
    day.hour.forEach((hour: any) => {
      hourly.push({
        dt: new Date(hour.time).getTime(),
        temp: hour.temp_c,
        description: hour.condition.text,
        icon: hour.condition.icon,
        humidity: hour.humidity,
        windSpeed: hour.wind_kph,
      });
    });
  });

  return hourly;
};

export const fetchDailyForecast = async (city: string): Promise<ForecastItem[]> => {
  const response = await axios.get(`${BASE_URL}/forecast.json`, {
    params: { key: API_KEY, q: city, days: 10, aqi: 'yes', alerts: 'no' },
  });

  return response.data.forecast.forecastday.map((day: any) => ({
    dt: new Date(day.date).getTime(),
    temp: day.day.avgtemp_c,
    tempMin: day.day.mintemp_c,
    tempMax: day.day.maxtemp_c,
    description: day.day.condition.text,
    icon: day.day.condition.icon,
    humidity: day.day.avghumidity,
    windSpeed: day.day.maxwind_kph,
  }));
};

export const fetchAirQuality = async (city: string): Promise<AirQualityData> => {
  const response = await axios.get(`${BASE_URL}/current.json`, {
    params: { key: API_KEY, q: city, aqi: 'yes' },
  });

  const air = response.data.current.air_quality;

  return {
    aqi: Math.round(air['us-epa-index']),
    co: air.co,
    no2: air.no2,
    o3: air.o3,
    pm2_5: air.pm2_5,
    pm10: air.pm10,
  };
};

export const getCurrentPosition = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => reject(new Error('Failed to get location'))
    );
  });
};
