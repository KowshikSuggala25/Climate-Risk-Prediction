import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LayoutDashboard,
  AlertTriangle,
  MapPin,
  Settings,
  Globe,
  User,
  Edit,
  Camera,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const languages = [
  { code: "english", name: "English", native: "English" },
  { code: "telugu", name: "Telugu", native: "తెలుగు" },
  { code: "hindi", name: "Hindi", native: "हिंदी" },
  { code: "tamil", name: "Tamil", native: "தமிழ்" },
  { code: "malayalam", name: "Malayalam", native: "മലയാളം" },
];

export const NavigationBar = () => {
  const { user, updateProfile, language, setLanguage } = useUser();
  const { t } = useTranslation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode);
    if (user) {
      updateProfile({ language: langCode });
    }
  };

  const handleProfileSave = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateProfile({ avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <nav className="bg-primary/10 backdrop-blur-md border-b border-primary/20 shadow-climate sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">
              Climatic AI
            </span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {/* Dashboard */}
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 hover:bg-primary/20 hover:text-primary hover:translate-y-0.5 transition-all duration-200 ${
                activeTab === "dashboard" ? "bg-primary/20 text-primary" : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">{t("dashboard")}</span>
            </Button>

            {/* Disaster */}
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 hover:bg-primary/20 hover:text-primary hover:translate-y-0.5 transition-all duration-200 ${
                activeTab === "disaster" ? "bg-primary/20 text-primary" : ""
              }`}
              onClick={() => setActiveTab("disaster")}
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">{t("disaster")}</span>
            </Button>

            {/* Location */}
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 hover:bg-primary/20 hover:text-primary hover:translate-y-0.5 transition-all duration-200 ${
                activeTab === "location" ? "bg-primary/20 text-primary" : ""
              }`}
              onClick={() => setActiveTab("location")}
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">{t("location")}</span>
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 hover:bg-primary/20 hover:text-primary hover:translate-y-0.5 transition-all duration-200 ${
                activeTab === "settings" ? "bg-primary/20 text-primary" : ""
              }`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings")}</span>
            </Button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:bg-primary/20 hover:text-primary hover:translate-y-0.5 transition-all duration-200"
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {currentLanguage?.native}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-background/95 backdrop-blur-sm border-primary/20"
              >
                <DropdownMenuLabel>{t("selectLanguage")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`${
                      language === lang.code ? "bg-primary/20" : ""
                    } cursor-pointer hover:bg-primary/20`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{lang.native}</span>
                      <span className="text-xs text-muted-foreground">
                        {lang.name}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile */}
            <Popover open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:bg-primary/20 hover:text-primary hover:translate-y-0.5 transition-all duration-200"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{t("profile")}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-80 bg-background/95 backdrop-blur-sm border-primary/20"
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {t("userProfile")}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user?.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <label className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/90">
                            <Camera className="h-3 w-3" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                      {!isEditing && (
                        <div className="text-center">
                          <h3 className="font-medium">{user?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Profile Form */}
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="name" className="text-xs">
                            {t("name")}
                          </Label>
                          <Input
                            id="name"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-xs">
                            {t("email")}
                          </Label>
                          <Input
                            id="email"
                            value={editForm.email}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                email: e.target.value,
                              })
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-xs">
                            {t("phone")}
                          </Label>
                          <Input
                            id="phone"
                            value={editForm.phone}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                phone: e.target.value,
                              })
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location" className="text-xs">
                            {t("location")}
                          </Label>
                          <Input
                            id="location"
                            value={editForm.location}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                location: e.target.value,
                              })
                            }
                            className="h-8"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleProfileSave}
                            className="flex-1"
                          >
                            {t("save")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="flex-1"
                          >
                            {t("cancel")}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {t("phone")}:
                          </span>
                          <span>{user?.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {t("location")}:
                          </span>
                          <span className="text-right flex-1 ml-2">
                            {user?.location}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {t("selectLanguage")}:
                          </span>
                          <span>{currentLanguage?.name}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </nav>
  );
};
