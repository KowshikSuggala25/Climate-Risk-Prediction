import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Navigation, Globe, Clock } from "lucide-react";
import { useWeather } from "@/contexts/WeatherContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { LocationSelector } from "@/components/LocationSelector";
import { useState } from "react";

const Location = () => {
  const { currentLocation, weatherData } = useWeather();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const recentLocations = [
    { name: "New York", country: "US", lat: 40.7128, lon: -74.0060 },
    { name: "London", country: "GB", lat: 51.5074, lon: -0.1278 },
    { name: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
    { name: "Mumbai", country: "IN", lat: 19.0760, lon: 72.8777 },
  ];

  const popularLocations = [
    { name: "Miami", country: "US", risk: "High flood risk", color: "bg-orange-500" },
    { name: "Phoenix", country: "US", risk: "Extreme heat risk", color: "bg-red-500" },
    { name: "Amsterdam", country: "NL", risk: "Moderate flood risk", color: "bg-yellow-500" },
    { name: "Sydney", country: "AU", risk: "Bushfire risk", color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <MapPin className="h-8 w-8 text-primary" />
            {t("location")}
          </h1>
          <p className="text-muted-foreground">
            Manage your locations and monitor climate risks worldwide
          </p>
        </div>

        {/* Current Location */}
        {currentLocation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Current Location
              </CardTitle>
              <CardDescription>Your active monitoring location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">
                    {currentLocation.name}, {currentLocation.country}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Coordinates: {currentLocation.lat.toFixed(4)}°, {currentLocation.lon.toFixed(4)}°
                  </p>
                  {weatherData && (
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm">
                        Temperature: {weatherData.temperature}°C
                      </span>
                      <span className="text-sm">
                        Humidity: {weatherData.humidity}%
                      </span>
                      <span className="text-sm capitalize">
                        {weatherData.description}
                      </span>
                    </div>
                  )}
                </div>
                <Button variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Change Location
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Locations
            </CardTitle>
            <CardDescription>
              Find and select a new location to monitor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LocationSelector />
          </CardContent>
        </Card>

        {/* Recent Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Locations
            </CardTitle>
            <CardDescription>Locations you've recently monitored</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentLocations.map((location, index) => (
                <Card key={index} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="space-y-2">
                    <h3 className="font-medium">{location.name}</h3>
                    <p className="text-sm text-muted-foreground">{location.country}</p>
                    <p className="text-xs text-muted-foreground">
                      {location.lat.toFixed(2)}°, {location.lon.toFixed(2)}°
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Select
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Locations with Risk Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Popular Monitoring Locations
            </CardTitle>
            <CardDescription>
              Frequently monitored locations with current risk status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {popularLocations.map((location, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">
                        {location.name}, {location.country}
                      </h3>
                      <p className="text-sm text-muted-foreground">{location.risk}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${location.color} text-white`}>
                        Risk
                      </Badge>
                      <Button size="sm" variant="outline">
                        Monitor
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Location Preferences</CardTitle>
            <CardDescription>
              Configure how location data is handled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Auto-detect location</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically use your device's location
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Save location history</p>
                  <p className="text-sm text-muted-foreground">
                    Keep a history of monitored locations
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enabled
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Location notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get alerts when entering high-risk areas
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Location;