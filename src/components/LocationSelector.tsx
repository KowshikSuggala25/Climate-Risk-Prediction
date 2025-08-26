import { useState } from "react";
import { MapPin, Navigation, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useWeather } from "@/contexts/WeatherContext";

export const LocationSelector = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { currentLocation, weatherData, setLocationByCity, loading } = useWeather();
  
  const displayLocation = currentLocation || {
    name: weatherData?.location || "Unknown Location",
    country: weatherData?.country || "",
    lat: 0,
    lon: 0,
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await setLocationByCity(searchQuery.trim());
      setSearchQuery("");
    }
  };

  const formatCoordinates = (lat: number, lon: number) => {
    const latDirection = lat >= 0 ? 'N' : 'S';
    const lonDirection = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}° ${latDirection}, ${Math.abs(lon).toFixed(4)}° ${lonDirection}`;
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        {/* Current Location Display */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Current Location</h3>
            <p className="text-foreground font-medium">
              {displayLocation.name}
              {displayLocation.country && `, ${displayLocation.country}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentLocation ? (
                <>
                  <Navigation className="inline h-3 w-3 mr-1" />
                  Auto-detected location
                </>
              ) : (
                "Location not available"
              )}
            </p>
          </div>
        </div>

        {/* Search for City */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading || !searchQuery.trim()}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>
        
        {/* Coordinates Display */}
        {currentLocation && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Coordinates:</span> {formatCoordinates(currentLocation.lat, currentLocation.lon)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <Navigation className="inline h-3 w-3 mr-1" />
              Detected from your device location
            </p>
          </div>
        )}

        {loading && (
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Loading location data...
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};