import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  weatherService,
  WeatherData,
  AirQualityData,
  LocationData,
  WeatherHistoryData,
} from "@/services/weatherService";
import { locationService } from "@/services/locationService";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";
import { useWeatherHistory } from "../hooks/useWeatherHistory";

interface WeatherContextType {
  weatherData: WeatherData | null;
  airQualityData: AirQualityData | null;
  currentLocation: LocationData | null;
  currentLocationId: string | null;
  historyData: WeatherHistoryData[];
  loading: boolean;
  error: string | null;
  refreshWeather: () => Promise<void>;
  setLocationByCity: (cityName: string) => Promise<void>;
  setLocationByCoordinates: (lat: number, lon: number) => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};

interface WeatherProviderProps {
  children: ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({
  children,
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(
    null
  );
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const [currentLocationId, setCurrentLocationId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { latitude, longitude, error: geoError } = useGeolocation();
  const { toast } = useToast();

  const { historyData, saveCurrentWeatherToHistory } = useWeatherHistory(
    currentLocation?.lat,
    currentLocation?.lon,
    currentLocationId || undefined
  );

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);

      const [weather, airQuality, location] = await Promise.all([
        weatherService.getCurrentWeather(lat, lon),
        weatherService.getAirQuality(lat, lon),
        weatherService.reverseGeocode(lat, lon),
      ]);

      setWeatherData(weather);
      setAirQualityData(airQuality);
      setCurrentLocation(location);

      // Save to database and get location ID
      try {
        const savedLocation = await locationService.saveLocation(location);
        setCurrentLocationId(savedLocation.id);

        // Save current weather to history
        if (savedLocation.id) {
          await saveCurrentWeatherToHistory(
            weather,
            airQuality,
            savedLocation.id
          );
        }
      } catch (error) {
        console.log("User not authenticated, skipping location/history save");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch weather data";
      setError(errorMessage);
      toast({
        title: "Weather Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshWeather = async () => {
    if (currentLocation) {
      await fetchWeatherData(currentLocation.lat, currentLocation.lon);
    } else if (latitude && longitude) {
      await fetchWeatherData(latitude, longitude);
    }
  };

  const setLocationByCity = async (cityName: string) => {
    try {
      setLoading(true);
      setError(null);

      const locations = await weatherService.searchLocations(cityName);
      if (locations.length === 0) {
        throw new Error("City not found");
      }

      const location = locations[0];
      await fetchWeatherData(location.lat, location.lon);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch weather for city";
      setError(errorMessage);
      toast({
        title: "Location Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setLocationByCoordinates = async (lat: number, lon: number) => {
    await fetchWeatherData(lat, lon);
  };

  // Initialize provider and load current location from database
  useEffect(() => {
    const initializeProvider = async () => {
      try {
        const savedLocation = await locationService.getCurrentLocation();
        if (savedLocation) {
          setCurrentLocation({
            lat: Number(savedLocation.lat),
            lon: Number(savedLocation.lon),
            name: savedLocation.name,
            country: savedLocation.country,
            state: savedLocation.state || undefined,
          });
          setCurrentLocationId(savedLocation.id);
          await fetchWeatherData(
            Number(savedLocation.lat),
            Number(savedLocation.lon)
          );
        }
      } catch (error) {
        console.log("No saved location found or user not authenticated");
      } finally {
        setIsInitialized(true);
      }
    };

    initializeProvider();
  }, []);

  // Auto-fetch weather when geolocation is available (only if no saved location)
  useEffect(() => {
    if (
      latitude &&
      longitude &&
      !weatherData &&
      !currentLocation &&
      isInitialized
    ) {
      fetchWeatherData(latitude, longitude);
    }
  }, [latitude, longitude, isInitialized, currentLocation]);

  // Handle geolocation errors
  useEffect(() => {
    if (geoError && isInitialized) {
      setError(`Geolocation error: ${geoError}`);
      toast({
        title: "Location Access",
        description: geoError,
        variant: "destructive",
      });
    }
  }, [geoError, toast, isInitialized]);

  const value: WeatherContextType = {
    weatherData,
    airQualityData,
    currentLocation,
    currentLocationId,
    historyData,
    loading,
    error,
    refreshWeather,
    setLocationByCity,
    setLocationByCoordinates,
  };

  // Only render children after context is initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
};
