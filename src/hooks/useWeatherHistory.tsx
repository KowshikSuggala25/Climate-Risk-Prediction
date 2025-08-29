import { useState, useEffect } from "react";
import { weatherService, WeatherHistoryData } from "@/services/weatherService";
import { supabase } from "@/integrations/supabase/client";

export const useWeatherHistory = (
  lat?: number,
  lon?: number,
  locationId?: string
) => {
  const [historyData, setHistoryData] = useState<WeatherHistoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoryData = async () => {
    if (!lat || !lon) return;

    try {
      setLoading(true);
      setError(null);

      // Try to get from database first
      const {
        data: { user },
      } = await supabase.auth.getUser();
      let dbHistory: WeatherHistoryData[] = [];

      if (user && locationId) {
        const { data: weatherHistory } = await (supabase as any)
          .from("weather_history")
          .select("*")
          .eq("user_id", user.id)
          .eq("location_id", locationId)
          .gte(
            "recorded_at",
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          )
          .order("recorded_at", { ascending: true });

        if (weatherHistory && weatherHistory.length > 0) {
          dbHistory = weatherHistory.map((record) => ({
            date: record.recorded_at.split("T")[0],
            temperature: Number(record.temperature),
            humidity: record.humidity,
            windSpeed: Number(record.wind_speed),
            pressure: Number(record.pressure),
            description: record.description,
            visibility: Number(record.visibility),
            aqi: record.aqi || undefined,
            pm2_5: record.pm2_5 ? Number(record.pm2_5) : undefined,
            pm10: record.pm10 ? Number(record.pm10) : undefined,
          }));
        }
      }

      // If we don't have enough database records, get from API
      if (dbHistory.length < 7) {
        const apiHistory = await weatherService.getHistoricalWeather(lat, lon);

        // Combine and deduplicate
        const combinedHistory = [...dbHistory, ...apiHistory];
        const uniqueHistory = combinedHistory.reduce((acc, current) => {
          const existingIndex = acc.findIndex(
            (item) => item.date === current.date
          );
          if (existingIndex >= 0) {
            // Keep database record over API simulation
            if (dbHistory.some((db) => db.date === current.date)) {
              acc[existingIndex] = current;
            }
          } else {
            acc.push(current);
          }
          return acc;
        }, [] as WeatherHistoryData[]);

        // Sort by date and take last 7 days
        uniqueHistory.sort((a, b) => a.date.localeCompare(b.date));
        setHistoryData(uniqueHistory.slice(-7));
      } else {
        setHistoryData(dbHistory);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch weather history";
      setError(errorMessage);
      console.error("Weather history error:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentWeatherToHistory = async (
    weatherData: any,
    airQualityData: any,
    locationId: string
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      console.log("Weather data would be saved:", {
        user_id: user.id,
        location_id: locationId,
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        wind_speed: weatherData.windSpeed,
        pressure: weatherData.pressure,
        description: weatherData.description,
        visibility: weatherData.visibility,
        aqi: airQualityData?.aqi,
        pm2_5: airQualityData?.pm2_5,
        pm10: airQualityData?.pm10,
        co: airQualityData?.co,
        no2: airQualityData?.no2,
        o3: airQualityData?.o3,
        so2: airQualityData?.so2,
        recorded_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving weather history:", error);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, [lat, lon, locationId]);

  return {
    historyData,
    loading,
    error,
    refetch: fetchHistoryData,
    saveCurrentWeatherToHistory,
  };
};
