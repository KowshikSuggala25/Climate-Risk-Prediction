import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Navigation, Globe, Clock } from "lucide-react";
import { useWeather } from "@/contexts/WeatherContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { LocationSelector } from "@/components/LocationSelector";
import { locationService } from "@/services/locationService";
import { useState, useEffect } from "react";

const Location = () => {
  const { currentLocation, weatherData, setLocationByCoordinates } =
    useWeather();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentLocations, setRecentLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Indian popular monitoring places
  const popularLocations = [
    {
      name: "Delhi",
      country: "IN",
      lat: 28.6139,
      lon: 77.209,
      risk: "High air pollution",
      color: "bg-red-500",
    },
    {
      name: "Mumbai",
      country: "IN",
      lat: 19.076,
      lon: 72.8777,
      risk: "Flood risk during monsoon",
      color: "bg-orange-500",
    },
    {
      name: "Chennai",
      country: "IN",
      lat: 13.0827,
      lon: 80.2707,
      risk: "Cyclone risk",
      color: "bg-yellow-500",
    },
    {
      name: "Kolkata",
      country: "IN",
      lat: 22.5726,
      lon: 88.3639,
      risk: "Moderate flood risk",
      color: "bg-yellow-500",
    },
    {
      name: "Bangalore",
      country: "IN",
      lat: 12.9716,
      lon: 77.5946,
      risk: "Low risk",
      color: "bg-green-500",
    },
    {
      name: "Hyderabad",
      country: "IN",
      lat: 17.385,
      lon: 78.4867,
      risk: "Heat wave risk",
      color: "bg-orange-500",
    },
    {
      name: "Pune",
      country: "IN",
      lat: 18.5204,
      lon: 73.8567,
      risk: "Moderate risk",
      color: "bg-yellow-500",
    },
    {
      name: "Ahmedabad",
      country: "IN",
      lat: 23.0225,
      lon: 72.5714,
      risk: "High heat risk",
      color: "bg-red-500",
    },
  ];

  // Load recent locations from database
  useEffect(() => {
    const loadRecentLocations = async () => {
      try {
        const locations = await locationService.getUserLocations();
        setRecentLocations(locations.slice(0, 8)); // Show last 8 locations
      } catch (error) {
        console.log("Failed to load recent locations:", error);
      }
    };

    loadRecentLocations();
  }, []);

  const handleLocationSelect = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      await setLocationByCoordinates(lat, lon);
      // Reload recent locations after selecting a new one
      const locations = await locationService.getUserLocations();
      setRecentLocations(locations.slice(0, 8));
    } catch (error) {
      console.error("Failed to set location:", error);
    } finally {
      setLoading(false);
    }
  };

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
                    Coordinates: {currentLocation.lat.toFixed(4)}°,{" "}
                    {currentLocation.lon.toFixed(4)}°
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
                <Button
                  variant="outline"
                  onClick={() =>
                    currentLocation &&
                    handleLocationSelect(
                      currentLocation.lat,
                      currentLocation.lon
                    )
                  }
                  disabled={loading}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {loading ? "Changing..." : "Change Location"}
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
            <CardDescription>
              Locations you've recently monitored
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentLocations.length > 0 ? (
                recentLocations.map((location, index) => (
                  <Card
                    key={location.id || index}
                    className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="space-y-2">
                      <h3 className="font-medium">{location.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {location.country}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Number(location.lat).toFixed(2)}°,{" "}
                        {Number(location.lon).toFixed(2)}°
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          handleLocationSelect(
                            Number(location.lat),
                            Number(location.lon)
                          )
                        }
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Select"}
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  No recent locations found. Start by searching for a location
                  above.
                </div>
              )}
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
                      <p className="text-sm text-muted-foreground">
                        {location.risk}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {location.lat.toFixed(2)}°, {location.lon.toFixed(2)}°
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${location.color} text-white`}>
                        Risk
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleLocationSelect(location.lat, location.lon)
                        }
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Monitor"}
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
