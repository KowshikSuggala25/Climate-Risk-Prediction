import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/TranslationContext";
import { ProfileDropdown } from "../components/ProfileDropdown";
import { MapPin, AlertTriangle, Home, Settings, Globe } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NavigationBar = () => {
  const { t, language, setLanguage } = useTranslation();
  const location = useLocation();

  const getActiveTab = () => {
    switch (location.pathname) {
      case "/":
        return "dashboard";
      case "/disaster":
        return "disaster";
      case "/location":
        return "location";
      case "/settings":
        return "settings";
      default:
        return "dashboard";
    }
  };

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
              Climate Prediction
            </span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {/* Dashboard */}
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 hover:bg-primary/20 hover:text-primary transition-all duration-200 ${
                  getActiveTab() === "dashboard"
                    ? "bg-primary/20 text-primary"
                    : ""
                }`}
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">{t("dashboard")}</span>
              </Button>
            </Link>

            {/* Disaster */}
            <Link to="/disaster">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 hover:bg-primary/20 hover:text-primary transition-all duration-200 ${
                  getActiveTab() === "disaster"
                    ? "bg-primary/20 text-primary"
                    : ""
                }`}
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">{t("disaster")}</span>
              </Button>
            </Link>

            {/* Location */}
            <Link to="/location">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 hover:bg-primary/20 hover:text-primary transition-all duration-200 ${
                  getActiveTab() === "location"
                    ? "bg-primary/20 text-primary"
                    : ""
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">{t("location")}</span>
              </Button>
            </Link>

            {/* Settings */}
            <Link to="/settings">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 hover:bg-primary/20 hover:text-primary transition-all duration-200 ${
                  getActiveTab() === "settings"
                    ? "bg-primary/20 text-primary"
                    : ""
                }`}
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">{t("settings")}</span>
              </Button>
            </Link>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  {language === "english"
                    ? "EN"
                    : language === "hindi"
                    ? "हि"
                    : language === "telugu"
                    ? "తె"
                    : language === "tamil"
                    ? "த"
                    : language === "malayalam"
                    ? "മ"
                    : language === "kannada"
                    ? "ಕ"
                    : language === "bengali"
                    ? "বা"
                    : language === "gujarati"
                    ? "ગુ"
                    : language === "marathi"
                    ? "म"
                    : language === "punjabi"
                    ? "ਪੰ"
                    : language === "odia"
                    ? "ଓ"
                    : language === "urdu"
                    ? "اُ"
                    : "EN"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border z-50">
                <DropdownMenuItem onClick={() => setLanguage("english")}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("hindi")}>
                  हिंदी (Hindi)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("telugu")}>
                  తెలుగు (Telugu)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("tamil")}>
                  தமிழ் (Tamil)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("malayalam")}>
                  മലയാളം (Malayalam)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("kannada")}>
                  ಕನ್ನಡ (Kannada)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("bengali")}>
                  বাংলা (Bengali)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("gujarati")}>
                  ગુજરાતી (Gujarati)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("marathi")}>
                  मराठी (Marathi)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("punjabi")}>
                  ਪੰਜਾਬੀ (Punjabi)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("odia")}>
                  ଓଡ଼ିଆ (Odia)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("urdu")}>
                  اردو (Urdu)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile */}
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
};
