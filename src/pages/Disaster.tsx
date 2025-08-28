import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Clock, Users, PhoneCall } from "lucide-react";
import { useWeather } from "@/contexts/WeatherContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { calculateFloodRisk, calculateHeatwaveRisk } from "@/utils/riskCalculations";
import { getLocationSpecificEmergencyContacts } from "@/utils/emergencyContacts";

const Disaster = () => {
  const { weatherData, currentLocation } = useWeather();
  const { t } = useTranslation();
  
  const floodRisk = weatherData ? calculateFloodRisk(weatherData) : null;
  const heatRisk = weatherData ? calculateHeatwaveRisk(weatherData) : null;
  const emergencyContacts = getLocationSpecificEmergencyContacts(currentLocation);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500"; 
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <AlertTriangle className="h-8 w-8 text-primary" />
            {t("disaster")}
          </h1>
          <p className="text-muted-foreground">
            Monitor risks and emergency response for your location
          </p>
        </div>

        {/* Current Location Status */}
        {currentLocation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Current Location Status
              </CardTitle>
              <CardDescription>
                {currentLocation.name}, {currentLocation.country}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {floodRisk && (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Flood Risk</h3>
                      <p className="text-sm text-muted-foreground">{floodRisk.description}</p>
                    </div>
                    <Badge className={`${getRiskColor(floodRisk.level)} text-white`}>
                      {floodRisk.level}
                    </Badge>
                  </div>
                )}
                
                {heatRisk && (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Heat Risk</h3>
                      <p className="text-sm text-muted-foreground">{heatRisk.description}</p>
                    </div>
                    <Badge className={`${getRiskColor(heatRisk.level)} text-white`}>
                      {heatRisk.level}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5" />
              Emergency Contacts
            </CardTitle>
            <CardDescription>
              Important numbers for your region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emergencyContacts.map((contact, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">{contact.category}</h3>
                    <p className="text-2xl font-bold text-primary">{contact.number}</p>
                    <p className="text-sm text-muted-foreground">{contact.description}</p>
                    <Button size="sm" className="w-full">
                      Call Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Preparedness Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Emergency Preparedness
            </CardTitle>
            <CardDescription>
              Essential tips for disaster preparedness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Before a Disaster</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    Prepare an emergency kit with water, food, and medications
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    Create a family communication plan
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    Know your evacuation routes
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    Keep important documents in a safe place
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">During a Disaster</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    Stay informed through reliable news sources
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    Follow evacuation orders immediately
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    Stay away from damaged areas
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    Help neighbors and check on elderly relatives
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Disaster;