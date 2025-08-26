import { WeatherData, AirQualityData } from '@/services/weatherService';
import { format, addDays } from 'date-fns';

export type RiskLevel = "low" | "medium" | "high" | "critical";

interface RiskAssessment {
  level: RiskLevel;
  title: string;
  description: string;
}

interface ForecastData {
  day: string;
  risk: number;
  confidence: number;
}

// Calculate flood risk based on weather conditions
export const calculateFloodRisk = (weatherData: WeatherData | null): RiskAssessment => {
  if (!weatherData) {
    return {
      level: "low",
      title: "Flood Risk",
      description: "Weather data unavailable"
    };
  }

  const { humidity, windSpeed, description } = weatherData;
  const hasRain = description.toLowerCase().includes('rain') || description.toLowerCase().includes('storm');
  
  let riskScore = 0;
  
  // High humidity increases flood risk
  if (humidity > 80) riskScore += 2;
  else if (humidity > 60) riskScore += 1;
  
  // High wind speeds with rain increase risk
  if (hasRain && windSpeed > 20) riskScore += 2;
  else if (hasRain) riskScore += 1;
  
  // Weather description factors
  if (description.toLowerCase().includes('heavy rain')) riskScore += 3;
  else if (description.toLowerCase().includes('rain')) riskScore += 1;
  
  if (riskScore >= 4) {
    return {
      level: "critical",
      title: "Flood Risk",
      description: "Severe weather conditions. Avoid low-lying areas."
    };
  } else if (riskScore >= 3) {
    return {
      level: "high", 
      title: "Flood Risk",
      description: "Heavy rainfall expected. Monitor drainage systems."
    };
  } else if (riskScore >= 1) {
    return {
      level: "medium",
      title: "Flood Risk", 
      description: "Moderate risk. Stay alert for weather updates."
    };
  }
  
  return {
    level: "low",
    title: "Flood Risk",
    description: "Low risk. Normal weather conditions."
  };
};

// Calculate heatwave risk based on temperature
export const calculateHeatwaveRisk = (weatherData: WeatherData | null): RiskAssessment => {
  if (!weatherData) {
    return {
      level: "low",
      title: "Heatwave Alert",
      description: "Temperature data unavailable"
    };
  }

  const { temperature } = weatherData;
  const maxTemp = temperature;
  
  if (maxTemp >= 45) {
    return {
      level: "critical",
      title: "Heatwave Alert",
      description: "Extreme heat. Stay indoors and hydrated."
    };
  } else if (maxTemp >= 40) {
    return {
      level: "high",
      title: "Heatwave Alert", 
      description: "Temperature rising above 40°C. Stay hydrated."
    };
  } else if (maxTemp >= 35) {
    return {
      level: "medium",
      title: "Heatwave Alert",
      description: "Warm weather. Limit outdoor activities."
    };
  }
  
  return {
    level: "low",
    title: "Heatwave Alert",
    description: "Normal temperature conditions."
  };
};

// Calculate air quality risk
export const calculateAirQualityRisk = (airQualityData: AirQualityData | null): RiskAssessment => {
  if (!airQualityData) {
    return {
      level: "low",
      title: "Air Quality",
      description: "Air quality data unavailable"
    };
  }

  const { aqi } = airQualityData;
  
  if (aqi >= 4) {
    return {
      level: "critical",
      title: "Air Quality",
      description: "Pollution levels dangerous. Avoid outdoor activities."
    };
  } else if (aqi >= 3) {
    return {
      level: "high",
      title: "Air Quality",
      description: "Unhealthy air quality. Limit outdoor exposure."
    };
  } else if (aqi >= 2) {
    return {
      level: "medium", 
      title: "Air Quality",
      description: "Moderate pollution. Sensitive groups should be careful."
    };
  }
  
  return {
    level: "low",
    title: "Air Quality", 
    description: "Good air quality. Safe for outdoor activities."
  };
};

// Generate forecast data based on current conditions with dynamic patterns
export const generateFloodForecast = (weatherData: WeatherData | null): ForecastData[] => {
  const baseRisk = weatherData ? calculateFloodRisk(weatherData).level : "low";
  let riskValue = baseRisk === "critical" ? 80 : baseRisk === "high" ? 60 : baseRisk === "medium" ? 40 : 20;
  
  // Dynamic adjustments based on current weather patterns
  const hasRainPattern = weatherData?.description.toLowerCase().includes('rain');
  const highHumidity = weatherData ? weatherData.humidity > 80 : false;
  
  // Simulate more realistic weather patterns
  const patterns = hasRainPattern ? [0, -5, -10, -15, -20, -25, -30] : [0, -10, -15, -20, -25, -30, -35];
  const confidenceBase = hasRainPattern ? 85 : 75;
  
  const today = new Date();
  
  return [
    { day: format(today, "MMM dd"), risk: riskValue, confidence: confidenceBase },
    { day: format(addDays(today, 1), "MMM dd"), risk: Math.max(10, riskValue + patterns[1] + (highHumidity ? 5 : 0)), confidence: confidenceBase - 7 },
    { day: format(addDays(today, 2), "MMM dd"), risk: Math.max(8, riskValue + patterns[2] + (hasRainPattern ? 3 : -2)), confidence: confidenceBase - 13 },
    { day: format(addDays(today, 3), "MMM dd"), risk: Math.max(5, riskValue + patterns[3]), confidence: confidenceBase - 17 },
    { day: format(addDays(today, 4), "MMM dd"), risk: Math.max(5, riskValue + patterns[4]), confidence: confidenceBase - 20 },
    { day: format(addDays(today, 5), "MMM dd"), risk: Math.max(3, riskValue + patterns[5]), confidence: confidenceBase - 23 },
    { day: format(addDays(today, 6), "MMM dd"), risk: Math.max(3, riskValue + patterns[6]), confidence: confidenceBase - 25 },
  ];
};

export const generateHeatwaveForecast = (weatherData: WeatherData | null): ForecastData[] => {
  const baseRisk = weatherData ? calculateHeatwaveRisk(weatherData).level : "low";
  let riskValue = baseRisk === "critical" ? 85 : baseRisk === "high" ? 65 : baseRisk === "medium" ? 45 : 25;
  
  // Dynamic adjustments based on current temperature trends and humidity
  const currentTemp = weatherData?.temperature || 25;
  const lowHumidity = weatherData ? weatherData.humidity < 40 : false;
  const highTemp = currentTemp > 35;
  
  // Simulate temperature trend patterns (heat waves tend to build up and persist)
  const heatPattern = highTemp ? [0, 5, 8, 10, 5, 0, -5] : [0, 2, 5, 8, 3, -2, -5];
  const confidenceBase = highTemp ? 92 : 85;
  
  const today = new Date();
  
  return [
    { day: format(today, "MMM dd"), risk: riskValue, confidence: confidenceBase },
    { day: format(addDays(today, 1), "MMM dd"), risk: Math.min(95, riskValue + heatPattern[1] + (lowHumidity ? 3 : 0)), confidence: confidenceBase - 3 },
    { day: format(addDays(today, 2), "MMM dd"), risk: Math.min(95, riskValue + heatPattern[2] + (lowHumidity ? 2 : 0)), confidence: confidenceBase - 7 },
    { day: format(addDays(today, 3), "MMM dd"), risk: Math.min(95, riskValue + heatPattern[3]), confidence: confidenceBase - 11 },
    { day: format(addDays(today, 4), "MMM dd"), risk: Math.max(15, riskValue + heatPattern[4]), confidence: confidenceBase - 14 },
    { day: format(addDays(today, 5), "MMM dd"), risk: Math.max(10, riskValue + heatPattern[5]), confidence: confidenceBase - 17 },
    { day: format(addDays(today, 6), "MMM dd"), risk: Math.max(8, riskValue + heatPattern[6]), confidence: confidenceBase - 20 },
  ];
};

export const generatePollutionForecast = (airQualityData: AirQualityData | null): ForecastData[] => {
  const baseRisk = airQualityData ? calculateAirQualityRisk(airQualityData).level : "low";
  let riskValue = baseRisk === "critical" ? 85 : baseRisk === "high" ? 65 : baseRisk === "medium" ? 45 : 25;
  
  // Dynamic adjustments based on current pollution levels and patterns
  const currentAQI = airQualityData?.aqi || 1;
  const highPM25 = airQualityData ? airQualityData.pm2_5 > 15 : false;
  const winterPattern = new Date().getMonth() >= 10 || new Date().getMonth() <= 2; // Nov-Feb typically worse
  
  // Pollution tends to accumulate in certain weather conditions
  const pollutionPattern = winterPattern ? [0, 2, 1, -2, -5, -8, -10] : [0, -2, -5, -8, -10, -12, -15];
  const confidenceBase = currentAQI > 2 ? 88 : 82;
  
  const today = new Date();
  
  return [
    { day: format(today, "MMM dd"), risk: riskValue, confidence: confidenceBase },
    { day: format(addDays(today, 1), "MMM dd"), risk: Math.max(15, riskValue + pollutionPattern[1] + (highPM25 ? 3 : 0)), confidence: confidenceBase - 3 },
    { day: format(addDays(today, 2), "MMM dd"), risk: Math.max(12, riskValue + pollutionPattern[2] + (winterPattern ? 2 : 0)), confidence: confidenceBase - 6 },
    { day: format(addDays(today, 3), "MMM dd"), risk: Math.max(10, riskValue + pollutionPattern[3]), confidence: confidenceBase - 9 },
    { day: format(addDays(today, 4), "MMM dd"), risk: Math.max(8, riskValue + pollutionPattern[4]), confidence: confidenceBase - 12 },
    { day: format(addDays(today, 5), "MMM dd"), risk: Math.max(5, riskValue + pollutionPattern[5]), confidence: confidenceBase - 15 },
    { day: format(addDays(today, 6), "MMM dd"), risk: Math.max(5, riskValue + pollutionPattern[6]), confidence: confidenceBase - 18 },
  ];
};