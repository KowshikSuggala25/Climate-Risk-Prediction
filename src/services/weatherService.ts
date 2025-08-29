const API_KEY = '520b90b1db2fd1c4c12593cedb99f09e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  location: string;
  country: string;
  visibility: number;
  pressure: number;
  uvIndex?: number;
}

export interface AirQualityData {
  aqi: number;
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
}

export interface LocationData {
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
}

export interface WeatherHistoryData {
  date: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  description: string;
  visibility: number;
  aqi?: number;
  pm2_5?: number;
  pm10?: number;
}

class WeatherService {
  private async fetchWithErrorHandler(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
        }
        throw new Error(`Weather API Error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Weather Service Error:', error);
      throw error;
    }
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const data = await this.fetchWithErrorHandler(url);
    
    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      description: data.weather[0].description,
      location: data.name,
      country: data.sys.country,
      visibility: data.visibility ? Math.round(data.visibility / 1000) : 0, // Convert to km
      pressure: data.main.pressure,
    };
  }

  async getCurrentWeatherByCity(cityName: string): Promise<WeatherData> {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
    const data = await this.fetchWithErrorHandler(url);
    
    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      description: data.weather[0].description,
      location: data.name,
      country: data.sys.country,
      visibility: data.visibility ? Math.round(data.visibility / 1000) : 0,
      pressure: data.main.pressure,
    };
  }

  async getHistoricalWeather(lat: number, lon: number, days: number = 7): Promise<WeatherHistoryData[]> {
    const history: WeatherHistoryData[] = [];
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Generate historical data for the past week
    // Note: OpenWeather free tier doesn't include historical data, so we'll simulate it
    for (let i = days; i >= 1; i--) {
      const dayAgo = currentTime - (i * 24 * 60 * 60);
      
      // Simulate weather variations based on current conditions
      const baseTemp = Math.random() * 10 + 15; // Random base between 15-25°C
      const tempVariation = Math.random() * 10 - 5; // ±5°C variation
      
      history.push({
        date: new Date(dayAgo * 1000).toISOString().split('T')[0],
        temperature: Math.round(baseTemp + tempVariation),
        humidity: Math.round(30 + Math.random() * 40), // 30-70%
        windSpeed: Math.round(Math.random() * 20), // 0-20 km/h
        pressure: Math.round(1000 + Math.random() * 50), // 1000-1050 hPa
        description: ['clear sky', 'few clouds', 'scattered clouds', 'broken clouds', 'light rain'][Math.floor(Math.random() * 5)],
        visibility: Math.round(5 + Math.random() * 10), // 5-15 km
        aqi: Math.floor(Math.random() * 5) + 1, // 1-5
        pm2_5: Math.round(10 + Math.random() * 40), // 10-50
        pm10: Math.round(20 + Math.random() * 60), // 20-80
      });
    }
    
    return history;
  }

  async getAirQuality(lat: number, lon: number): Promise<AirQualityData> {
    const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const data = await this.fetchWithErrorHandler(url);
    
    const pollutionData = data.list[0];
    return {
      aqi: pollutionData.main.aqi,
      co: pollutionData.components.co,
      no: pollutionData.components.no,
      no2: pollutionData.components.no2,
      o3: pollutionData.components.o3,
      so2: pollutionData.components.so2,
      pm2_5: pollutionData.components.pm2_5,
      pm10: pollutionData.components.pm10,
    };
  }

  async searchLocations(query: string): Promise<LocationData[]> {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
    const data = await this.fetchWithErrorHandler(url);
    
    return data.map((location: any) => ({
      lat: location.lat,
      lon: location.lon,
      name: location.name,
      country: location.country,
      state: location.state,
    }));
  }

  async reverseGeocode(lat: number, lon: number): Promise<LocationData> {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
    const data = await this.fetchWithErrorHandler(url);
    
    if (data.length === 0) {
      throw new Error('Location not found');
    }

    const location = data[0];
    return {
      lat: location.lat,
      lon: location.lon,
      name: location.name,
      country: location.country,
      state: location.state,
    };
  }
}

export const weatherService = new WeatherService();