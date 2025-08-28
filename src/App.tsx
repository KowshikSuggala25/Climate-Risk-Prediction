import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WeatherProvider } from "@/contexts/WeatherContext";
import { UserProvider } from "@/contexts/UserContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { NavigationBar } from "./components/NavigationBar";
import Index from "./pages/Index";
import Disaster from "./pages/Disaster";
import Location from "./pages/Location";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TranslationProvider>
        <WeatherProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen">
                <NavigationBar />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/disaster" element={<Disaster />} />
                  <Route path="/location" element={<Location />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </WeatherProvider>
      </TranslationProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;