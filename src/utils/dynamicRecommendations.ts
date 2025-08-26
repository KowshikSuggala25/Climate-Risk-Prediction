import { WeatherData, AirQualityData, LocationData } from '@/services/weatherService';
import { RiskLevel } from './riskCalculations';

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  riskType: 'flood' | 'heatwave' | 'air-quality' | 'general';
}

export const generateDynamicRecommendations = (
  weatherData: WeatherData | null,
  airQualityData: AirQualityData | null,
  currentLocation: LocationData | null,
  floodRisk: RiskLevel,
  heatwaveRisk: RiskLevel,
  airQualityRisk: RiskLevel
): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  // Air Quality Recommendations
  if (airQualityRisk === 'critical') {
    recommendations.push({
      priority: 'high',
      title: 'Air Quality Critical',
      message: 'Stay indoors, close windows, use air purifiers if available',
      riskType: 'air-quality'
    });
  } else if (airQualityRisk === 'high') {
    recommendations.push({
      priority: 'high', 
      title: 'Poor Air Quality',
      message: 'Avoid outdoor activities, especially for sensitive individuals',
      riskType: 'air-quality'
    });
  } else if (airQualityRisk === 'medium') {
    recommendations.push({
      priority: 'medium',
      title: 'Moderate Air Quality',
      message: 'Limit prolonged outdoor activities, wear mask if sensitive',
      riskType: 'air-quality'
    });
  }

  // Flood Risk Recommendations
  if (floodRisk === 'critical') {
    recommendations.push({
      priority: 'high',
      title: 'Flood Emergency',
      message: 'Evacuate low-lying areas immediately, avoid driving through water',
      riskType: 'flood'
    });
  } else if (floodRisk === 'high') {
    recommendations.push({
      priority: 'high',
      title: 'High Flood Risk',
      message: 'Prepare emergency kit, avoid basements and underground areas',
      riskType: 'flood'
    });
  } else if (floodRisk === 'medium') {
    recommendations.push({
      priority: 'medium',
      title: 'Flood Preparation',
      message: 'Monitor local drainage, move valuables to higher ground',
      riskType: 'flood'
    });
  }

  // Heatwave Recommendations
  if (heatwaveRisk === 'critical') {
    recommendations.push({
      priority: 'high',
      title: 'Extreme Heat Warning',
      message: 'Stay indoors during peak hours, drink water frequently, check on elderly',
      riskType: 'heatwave'
    });
  } else if (heatwaveRisk === 'high') {
    recommendations.push({
      priority: 'medium',
      title: 'High Temperature Alert',
      message: 'Limit outdoor work, wear light-colored clothing, stay hydrated',
      riskType: 'heatwave'
    });
  } else if (heatwaveRisk === 'medium') {
    recommendations.push({
      priority: 'medium',
      title: 'Warm Weather Advisory',
      message: 'Plan outdoor activities for cooler hours, carry water',
      riskType: 'heatwave'
    });
  }

  // Location-specific recommendations
  if (currentLocation?.country === 'IN') {
    // India-specific recommendations
    if (weatherData?.description.toLowerCase().includes('monsoon') || weatherData?.description.toLowerCase().includes('rain')) {
      recommendations.push({
        priority: 'medium',
        title: 'Monsoon Safety',
        message: 'Avoid waterlogged roads, keep emergency numbers handy',
        riskType: 'general'
      });
    }
    
    if (weatherData && weatherData.temperature > 40) {
      recommendations.push({
        priority: 'high',
        title: 'Heat Stroke Prevention',
        message: 'Consume ORS, avoid direct sunlight 11AM-4PM, use cooling aids',
        riskType: 'heatwave'
      });
    }
  }

  // General low-risk recommendations if no major risks
  if (recommendations.length === 0) {
    recommendations.push({
      priority: 'low',
      title: 'Weather Monitoring',
      message: 'Continue regular weather monitoring and stay prepared',
      riskType: 'general'
    });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
};