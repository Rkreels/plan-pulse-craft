import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppProvider } from "@/contexts/AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Roadmap from "./pages/Roadmap";
import Goals from "./pages/Goals";
import Releases from "./pages/Releases";
import Features from "./pages/Features";
import Ideas from "./pages/Ideas";
import Feedback from "./pages/Feedback";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <SidebarProvider>
          <div className="flex w-full min-h-screen">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/goals/:id" element={<Goals />} />
                <Route path="/releases" element={<Releases />} />
                <Route path="/releases/:id" element={<Releases />} />
                <Route path="/features" element={<Features />} />
                <Route path="/features/:id" element={<Features />} />
                <Route path="/ideas" element={<Ideas />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </SidebarProvider>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
