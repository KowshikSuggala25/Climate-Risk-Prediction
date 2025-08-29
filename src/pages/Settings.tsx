import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Settings as SettingsIcon,
  Bell,
  Globe,
  Thermometer,
  Shield,
  Download,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { settingsService } from "@/services/settingsService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const Settings = () => {
  const { user } = useAuth();
  const { t, setLanguage } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    mobile_number: "",
  });

  const [notifications, setNotifications] = useState({
    weather: true,
    disasters: true,
    air_quality: false,
    email: true,
    sms: false,
  });

  const [preferences, setPreferences] = useState({
    tempUnit: "celsius",
    windUnit: "kmh",
    precipUnit: "mm",
    timeFormat: "24h",
    autoRefresh: true,
    darkMode: "system",
  });

  const [language, setLanguageState] = useState("english");

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        // Load profile data
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profile) {
          setProfileData({
            full_name: profile.full_name || "",
            email: profile.email || "",
            mobile_number: profile.mobile_number || "",
          });
        }

        // Load settings
        const settings = await settingsService.getUserSettings();
        if (settings) {
          setNotifications(settings.notifications);
          setPreferences(settings.preferences);
          setLanguageState(settings.language);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, [user]);

  const handleSaveSettings = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Save profile data
      await settingsService.updateProfile(profileData);

      // Save settings
      await settingsService.saveUserSettings({
        notifications,
        preferences,
        language,
      });

      // Update language in context
      setLanguage(language);

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      const data = await settingsService.exportUserData();

      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `climate-data-export-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Data exported successfully",
      });
    } catch (error) {
      console.error("Failed to export data:", error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
                  value={profileData.full_name}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      full_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <Input
                  id="phone"
                  value={profileData.mobile_number}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      mobile_number: e.target.value,
                    })
                  }
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
                    setNotifications({ ...notifications, weather: checked })
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
                    setNotifications({ ...notifications, disasters: checked })
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
                    setNotifications({ ...notifications, air_quality: checked })
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
                    setNotifications({ ...notifications, email: checked })
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
                    setNotifications({ ...notifications, sms: checked })
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
                    setPreferences({ ...preferences, tempUnit: value })
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
                    setPreferences({ ...preferences, windUnit: value })
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
                    setPreferences({ ...preferences, timeFormat: value })
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
                    setPreferences({ ...preferences, darkMode: value })
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
                  setPreferences({ ...preferences, autoRefresh: checked })
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
                <Select value={language} onValueChange={setLanguageState}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="telugu">Telugu (తెలుగు)</SelectItem>
                    <SelectItem value="hindi">Hindi (हिंदी)</SelectItem>
                    <SelectItem value="tamil">Tamil (தமிழ்)</SelectItem>
                    <SelectItem value="malayalam">
                      Malayalam (മലയാളം)
                    </SelectItem>
                    <SelectItem value="kannada">Kannada (ಕನ್ನಡ)</SelectItem>
                    <SelectItem value="bengali">Bengali (বাংলা)</SelectItem>
                    <SelectItem value="gujarati">Gujarati (ગુજરાતી)</SelectItem>
                    <SelectItem value="marathi">Marathi (मराठी)</SelectItem>
                    <SelectItem value="punjabi">Punjabi (ਪੰਜਾਬੀ)</SelectItem>
                    <SelectItem value="odia">Odia (ଓଡ଼ିଆ)</SelectItem>
                    <SelectItem value="urdu">Urdu (اردو)</SelectItem>
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
              <Button
                variant="outline"
                className="w-full"
                onClick={handleExportData}
                disabled={loading}
              >
                <Download className="h-4 w-4 mr-2" />
                {loading ? "Exporting..." : "Export My Data"}
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
          <Button
            size="lg"
            className="px-8"
            onClick={handleSaveSettings}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
