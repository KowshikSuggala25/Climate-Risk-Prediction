import { RiskIndicator } from "./RiskIndicator";
import { ClimateMetrics } from "./ClimateMetrics";
import { ForecastChart } from "./ForecastChart";
import { LocationSelector } from "./LocationSelector";
import { NavigationBar } from "./NavigationBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { AlertNotifications } from "./AlertNotifications";
import { PDFExport } from "./PDFExport";
import { useWeather } from "@/contexts/WeatherContext";
import climateHero from "@/assets/climate-hero.jpg";
import { 
  calculateFloodRisk, 
  calculateHeatwaveRisk, 
  calculateAirQualityRisk,
  generateFloodForecast,
  generateHeatwaveForecast,
  generatePollutionForecast
} from "@/utils/riskCalculations";
import { generateDynamicRecommendations } from "@/utils/dynamicRecommendations";
import { getLocationSpecificEmergencyContacts } from "@/utils/emergencyContacts";

export const Dashboard = () => {
  const { weatherData, airQualityData, currentLocation, refreshWeather, loading } = useWeather();

  // Calculate dynamic risk assessments
  const floodRisk = calculateFloodRisk(weatherData);
  const heatwaveRisk = calculateHeatwaveRisk(weatherData);
  const airQualityRisk = calculateAirQualityRisk(airQualityData);

  // Generate dynamic forecast data
  const floodData = generateFloodForecast(weatherData);
  const heatwaveData = generateHeatwaveForecast(weatherData);
  const pollutionData = generatePollutionForecast(airQualityData);

  // Generate dynamic recommendations based on current conditions and location
  const recommendations = generateDynamicRecommendations(
    weatherData,
    airQualityData,
    currentLocation,
    floodRisk.level,
    heatwaveRisk.level,
    airQualityRisk.level
  );

  // Get location-specific emergency contacts
  const emergencyContacts = getLocationSpecificEmergencyContacts(currentLocation);

  const handleRefresh = async () => {
    await refreshWeather();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Navigation Bar */}
      <NavigationBar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="h-64 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${climateHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-glow/80" />
          <div className="relative flex h-full items-center justify-center px-6">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-2">AI Climate Risk Prediction</h1>
              <p className="text-lg opacity-90">
                Advanced forecasting for flood, heatwave, and pollution risks
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Climate Risk Dashboard</h2>
            <p className="text-muted-foreground">Real-time monitoring and 7-day forecasts</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            <AlertNotifications />
            <PDFExport />
          </div>
        </div>

        {/* Location Selector */}
        <div className="mb-8">
          <LocationSelector />
        </div>

        {/* Current Risk Indicators */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Current Risk Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RiskIndicator
              level={floodRisk.level}
              title={floodRisk.title}
              description={floodRisk.description}
            />
            <RiskIndicator
              level={heatwaveRisk.level}
              title={heatwaveRisk.title}
              description={heatwaveRisk.description}
            />
            <RiskIndicator
              level={airQualityRisk.level}
              title={airQualityRisk.title}
              description={airQualityRisk.description}
            />
          </div>
        </div>

        {/* Climate Metrics */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Current Conditions</h3>
          <ClimateMetrics />
        </div>

        {/* Forecast Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <ForecastChart
            title="Flood Risk Forecast"
            description="7-day probability analysis"
            data={floodData}
            riskType="flood"
          />
          <ForecastChart
            title="Heatwave Prediction"
            description="Temperature-based risk assessment"
            data={heatwaveData}
            riskType="heatwave"
          />
          <ForecastChart
            title="Air Quality Index"
            description="Pollution level predictions"
            data={pollutionData}
            riskType="pollution"
          />
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
              <CardDescription>
                {currentLocation?.name ? 
                  `Emergency numbers for ${currentLocation.name}, ${currentLocation.country}` : 
                  'Important numbers for climate emergencies'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-80 overflow-y-auto">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium block">{contact.category}</span>
                    <span className="text-xs text-muted-foreground">{contact.description}</span>
                  </div>
                  <span className="text-sm font-mono ml-2">{contact.number}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
              <CardDescription>
                {currentLocation?.name ? 
                  `Actions for ${currentLocation.name} based on current conditions` : 
                  'Based on current risk levels'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-80 overflow-y-auto">
              {recommendations.map((recommendation, index) => {
                const priorityStyles = {
                  high: 'bg-risk-high/10 border-risk-high/20 text-risk-high-foreground',
                  medium: 'bg-risk-medium/10 border-risk-medium/20 text-risk-medium-foreground',
                  low: 'bg-risk-low/10 border-risk-low/20 text-risk-low-foreground'
                };
                
                return (
                  <div key={index} className={`p-3 border rounded-lg ${priorityStyles[recommendation.priority]}`}>
                    <p className="text-sm font-medium capitalize">{recommendation.priority} Priority - {recommendation.title}</p>
                    <p className="text-sm mt-1">{recommendation.message}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};