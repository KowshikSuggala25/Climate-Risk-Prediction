import { Card } from "@/components/ui/card";
import { Thermometer, Droplets, Wind, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWeather } from "@/contexts/WeatherContext";

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  trend: "up" | "down" | "stable";
  color: "temperature" | "humidity" | "wind" | "pollution";
}

const colorConfig = {
  temperature: "text-climate-temperature",
  humidity: "text-climate-humidity", 
  wind: "text-climate-wind",
  pollution: "text-climate-pollution",
};

const MetricCard = ({ icon: Icon, label, value, unit, trend, color }: MetricCardProps) => (
  <Card className="p-4 transition-all duration-300 hover:shadow-md">
    <div className="flex items-center gap-3">
      <div className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-muted",
        colorConfig[color]
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
      </div>
      <div className={cn(
        "h-2 w-2 rounded-full",
        trend === "up" ? "bg-risk-high" : 
        trend === "down" ? "bg-risk-low" : "bg-muted-foreground"
      )} />
    </div>
  </Card>
);

export const ClimateMetrics = () => {
  const { weatherData, airQualityData, loading } = useWeather();

  // Convert AQI scale (1-5) to more familiar scale (0-500)
  const convertAQI = (aqi: number) => {
    const aqiRanges = [0, 50, 100, 150, 200, 300];
    return aqiRanges[aqi] || aqi;
  };

  const metrics = [
    {
      icon: Thermometer,
      label: "Temperature",
      value: loading ? "--" : (weatherData?.temperature.toString() || "--"),
      unit: "°C",
      trend: "stable" as const,
      color: "temperature" as const,
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: loading ? "--" : (weatherData?.humidity.toString() || "--"),
      unit: "%",
      trend: "stable" as const,
      color: "humidity" as const,
    },
    {
      icon: Wind,
      label: "Wind Speed",
      value: loading ? "--" : (weatherData?.windSpeed.toString() || "--"),
      unit: "km/h",
      trend: "stable" as const,  
      color: "wind" as const,
    },
    {
      icon: Waves,
      label: "Air Quality",
      value: loading ? "--" : (airQualityData ? convertAQI(airQualityData.aqi).toString() : "--"),
      unit: "AQI",
      trend: "stable" as const,
      color: "pollution" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};