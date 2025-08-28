import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, AlertTriangle, Info, CheckCircle, X } from "lucide-react";
import { useWeather } from "@/contexts/WeatherContext";
import { calculateFloodRisk, calculateHeatwaveRisk, calculateAirQualityRisk } from "@/utils/riskCalculations";
import { format, addDays, subDays } from "date-fns";

interface WeatherAlert {
  id: string;
  type: "flood" | "heatwave" | "pollution" | "general";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  location: string;
}

const severityConfig = {
  low: { color: "bg-green-500", icon: CheckCircle },
  medium: { color: "bg-yellow-500", icon: Info },
  high: { color: "bg-orange-500", icon: AlertTriangle },
  critical: { color: "bg-red-500", icon: AlertTriangle }
};

export const AlertNotifications = () => {
  const { weatherData, airQualityData, currentLocation } = useWeather();
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Generate alerts based on current conditions
  React.useEffect(() => {
    if (!weatherData || !airQualityData || !currentLocation) return;

    // Only generate new alerts if we don't have any yet
    if (alerts.length > 0) return;

    const newAlerts: WeatherAlert[] = [];
    const now = new Date();

    // Generate recent alerts (last 2 days)
    const floodRisk = calculateFloodRisk(weatherData);
    const heatRisk = calculateHeatwaveRisk(weatherData);
    const airRisk = calculateAirQualityRisk(airQualityData);

    // Flood alerts
    if (floodRisk.level !== "low") {
      newAlerts.push({
        id: `flood-${now.getTime()}`,
        type: "flood",
        severity: floodRisk.level,
        title: floodRisk.title,
        message: floodRisk.description,
        timestamp: subDays(now, Math.floor(Math.random() * 2)),
        isRead: Math.random() > 0.5,
        location: `${currentLocation.name}, ${currentLocation.country}`
      });
    }

    // Heatwave alerts
    if (heatRisk.level !== "low") {
      newAlerts.push({
        id: `heat-${now.getTime()}`,
        type: "heatwave",
        severity: heatRisk.level,
        title: heatRisk.title,
        message: heatRisk.description,
        timestamp: subDays(now, Math.floor(Math.random() * 1)),
        isRead: Math.random() > 0.3,
        location: `${currentLocation.name}, ${currentLocation.country}`
      });
    }

    // Air quality alerts
    if (airRisk.level !== "low") {
      newAlerts.push({
        id: `air-${now.getTime()}`,
        type: "pollution",
        severity: airRisk.level,
        title: airRisk.title,
        message: airRisk.description,
        timestamp: now,
        isRead: false,
        location: `${currentLocation.name}, ${currentLocation.country}`
      });
    }

    // Add upcoming alerts
    newAlerts.push({
      id: `upcoming-${now.getTime()}`,
      type: "general",
      severity: "medium",
      title: "Weather Update",
      message: "Moderate weather conditions expected tomorrow. Monitor forecasts.",
      timestamp: addDays(now, 1),
      isRead: false,
      location: `${currentLocation.name}, ${currentLocation.country}`
    });

    // Sort by timestamp (newest first)
    newAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setAlerts(newAlerts);
  }, [weatherData, airQualityData, currentLocation]);

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const recentAlerts = alerts.filter(alert => alert.timestamp <= new Date());
  const upcomingAlerts = alerts.filter(alert => alert.timestamp > new Date());

  const handleDialogOpen = () => {
    setIsOpen(true);
    // Mark all unread alerts as read when dialog opens
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
  };

  // Generate new alerts periodically (simulating real-time alerts)
  React.useEffect(() => {
    if (alerts.length === 0) return;

    const interval = setInterval(() => {
      // Randomly generate new alerts
      if (Math.random() > 0.7) { // 30% chance every 30 seconds
        const now = new Date();
        const newAlert: WeatherAlert = {
          id: `new-${now.getTime()}`,
          type: "general",
          severity: Math.random() > 0.5 ? "medium" : "low",
          title: "Weather Update",
          message: "New weather conditions detected in your area.",
          timestamp: now,
          isRead: false,
          location: `${currentLocation?.name}, ${currentLocation?.country}`
        };
        
        setAlerts(prev => [newAlert, ...prev].slice(0, 10)); // Keep max 10 alerts
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [alerts.length, currentLocation]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative" onClick={handleDialogOpen}>
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs">
              {unreadCount}
            </Badge>
          )}
          Alerts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Weather Alerts & Notifications</DialogTitle>
          <DialogDescription>
            Recent and upcoming weather notifications for your location
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Recent Alerts */}
          <div>
            <h3 className="font-semibold mb-3">Recent Alerts</h3>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {recentAlerts.length > 0 ? (
                  recentAlerts.map((alert) => {
                    const SeverityIcon = severityConfig[alert.severity].icon;
                    return (
                      <Card key={alert.id} className={`p-3 ${!alert.isRead ? 'border-l-4 border-l-primary' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-1 rounded-full ${severityConfig[alert.severity].color}`}>
                              <SeverityIcon className="h-3 w-3 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm">{alert.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {alert.severity}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{alert.message}</p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span>{format(alert.timestamp, "MMM dd, HH:mm")}</span>
                                <span>•</span>
                                <span>{alert.location}</span>
                              </div>
                            </div>
                          </div>
                          {!alert.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(alert.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  })
                ) : (
                  <p className="text-center text-muted-foreground text-sm">No recent alerts</p>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Upcoming Alerts */}
          <div>
            <h3 className="font-semibold mb-3">Upcoming Notifications</h3>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {upcomingAlerts.length > 0 ? (
                  upcomingAlerts.map((alert) => {
                    const SeverityIcon = severityConfig[alert.severity].icon;
                    return (
                      <Card key={alert.id} className="p-3 bg-muted/50">
                        <div className="flex items-start gap-3">
                          <div className={`p-1 rounded-full ${severityConfig[alert.severity].color} opacity-70`}>
                            <SeverityIcon className="h-3 w-3 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{alert.title}</h4>
                              <Badge variant="secondary" className="text-xs">
                                Upcoming
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{alert.message}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span>{format(alert.timestamp, "MMM dd, HH:mm")}</span>
                              <span>•</span>
                              <span>{alert.location}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                ) : (
                  <p className="text-center text-muted-foreground text-sm">No upcoming notifications</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};