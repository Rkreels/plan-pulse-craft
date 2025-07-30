
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppProvider } from "@/contexts/AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { EnhancedVoiceTrainingProvider } from "@/components/voice-training/EnhancedVoiceTrainingProvider";
import AppRoutes from "./AppRoutes";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <SidebarProvider>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <EnhancedVoiceTrainingProvider>
              <div className="flex w-full min-h-screen">
                <Toaster />
                <Sonner />
                <AppRoutes />
              </div>
            </EnhancedVoiceTrainingProvider>
          </AppProvider>
        </QueryClientProvider>
      </SidebarProvider>
    </TooltipProvider>
  </BrowserRouter>
);

export default App;
