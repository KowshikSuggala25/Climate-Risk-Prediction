import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WeatherProvider } from "@/contexts/WeatherContext";
import { UserProvider } from "@/contexts/UserContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NavigationBar } from "./components/NavigationBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Disaster from "./pages/Disaster";
import Location from "./pages/Location";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserProvider>
        <TranslationProvider>
          <WeatherProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="min-h-screen">
                  <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <>
                            <NavigationBar />
                            <Index />
                          </>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/disaster"
                      element={
                        <ProtectedRoute>
                          <>
                            <NavigationBar />
                            <Disaster />
                          </>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/location"
                      element={
                        <ProtectedRoute>
                          <>
                            <NavigationBar />
                            <Location />
                          </>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <>
                            <NavigationBar />
                            <Settings />
                          </>
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </WeatherProvider>
        </TranslationProvider>
      </UserProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
