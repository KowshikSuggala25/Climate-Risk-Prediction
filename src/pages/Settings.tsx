import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Bell, Globe, Thermometer, Shield, Download, Trash2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { useState } from "react";

const Settings = () => {
  const { user, updateProfile, language, setLanguage } = useUser();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState({
    weather: true,
    disasters: true,
    air_quality: false,
    email: true,
    sms: false
  });
  
  const [preferences, setPreferences] = useState({
    tempUnit: "celsius",
    windUnit: "kmh", 
    precipUnit: "mm",
    timeFormat: "24h",
    autoRefresh: true,
    darkMode: "system"
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            {t("settings")}
          </h1>
          <p className="text-muted-foreground">
            Customize your climate monitoring experience
          </p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Profile Settings
            </CardTitle>
            <CardDescription>
              Manage your personal information and account preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={user?.name || ""} 
                  onChange={(e) => updateProfile({ name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={user?.email || ""}
                  onChange={(e) => updateProfile({ email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={user?.phone || ""}
                  onChange={(e) => updateProfile({ phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={user?.location || ""}
                  onChange={(e) => updateProfile({ location: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure when and how you receive alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Weather Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified about severe weather conditions
                  </p>
                </div>
                <Switch 
                  checked={notifications.weather}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, weather: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Disaster Warnings</p>
                  <p className="text-sm text-muted-foreground">
                    Critical disaster and emergency notifications
                  </p>
                </div>
                <Switch 
                  checked={notifications.disasters}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, disasters: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Air Quality Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Notifications about air quality changes
                  </p>
                </div>
                <Switch 
                  checked={notifications.air_quality}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, air_quality: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts via email
                  </p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, email: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive critical alerts via SMS
                  </p>
                </div>
                <Switch 
                  checked={notifications.sms}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, sms: checked})
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Display Preferences
            </CardTitle>
            <CardDescription>
              Customize units and display options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Temperature Unit</Label>
                <Select 
                  value={preferences.tempUnit} 
                  onValueChange={(value) => 
                    setPreferences({...preferences, tempUnit: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celsius">Celsius (°C)</SelectItem>
                    <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Wind Speed Unit</Label>
                <Select 
                  value={preferences.windUnit}
                  onValueChange={(value) => 
                    setPreferences({...preferences, windUnit: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kmh">km/h</SelectItem>
                    <SelectItem value="mph">mph</SelectItem>
                    <SelectItem value="ms">m/s</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Time Format</Label>
                <Select 
                  value={preferences.timeFormat}
                  onValueChange={(value) => 
                    setPreferences({...preferences, timeFormat: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 Hour</SelectItem>
                    <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select 
                  value={preferences.darkMode}
                  onValueChange={(value) => 
                    setPreferences({...preferences, darkMode: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <div className="space-y-0.5">
                <p className="font-medium">Auto-refresh Data</p>
                <p className="text-sm text-muted-foreground">
                  Automatically update weather data every 10 minutes
                </p>
              </div>
              <Switch 
                checked={preferences.autoRefresh}
                onCheckedChange={(checked) => 
                  setPreferences({...preferences, autoRefresh: checked})
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language & Region
            </CardTitle>
            <CardDescription>
              Set your preferred language and regional settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Interface Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="telugu">Telugu (తెలుగు)</SelectItem>
                    <SelectItem value="hindi">Hindi (हिंदी)</SelectItem>
                    <SelectItem value="tamil">Tamil (தமிழ்)</SelectItem>
                    <SelectItem value="malayalam">Malayalam (മലയാളം)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Data & Privacy
            </CardTitle>
            <CardDescription>
              Manage your data and privacy preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Data Collection</p>
                <p className="text-sm text-muted-foreground">
                  Allow collection of usage data to improve the service
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Location Tracking</p>
                <p className="text-sm text-muted-foreground">
                  Save location history for personalized recommendations
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>
              <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button size="lg" className="px-8">
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;