import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/TranslationContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Menu,
  MapPin,
  AlertTriangle,
  Home,
  Settings,
  Globe,
  LogOut,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const NavigationBar = () => {
  const { t, language } = useTranslation();
  const { user, signOut } = useAuth();
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
                  {language === "english" ? "English" : "हिंदी"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() =>
                    console.log("Language switching not implemented yet")
                  }
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    console.log("Language switching not implemented yet")
                  }
                >
                  हिंदी
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem disabled>{user?.email}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={signOut}
                  className="text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
