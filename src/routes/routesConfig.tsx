
import { ReactNode } from "react";
import Index from "@/pages/Index";
import Features from "@/pages/Features";
import Feedback from "@/pages/Feedback";
import Goals from "@/pages/Goals";
import Ideas from "@/pages/Ideas";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Releases from "@/pages/Releases";
import Roadmap from "@/pages/Roadmap";
import Settings from "@/pages/Settings";
import Tasks from "@/pages/Tasks";
import Analytics from "@/pages/Analytics";
import Documentation from "@/pages/Documentation";
import Requirements from "@/pages/Requirements";
import CapacityPlanning from "@/pages/CapacityPlanning";
import Dashboards from "@/pages/Dashboards";
import Integrations from "@/pages/Integrations";
import Permissions from "@/pages/Permissions";
import Team from "@/pages/Team";
import Strategy from "@/pages/Strategy";
import Reports from "@/pages/Reports";
import CompetitorAnalysis from "@/pages/CompetitorAnalysis";
import CustomerPortal from "@/pages/CustomerPortal";

export interface RouteConfig {
  path: string;
  element: ReactNode;
  protected?: boolean;
}

export const generateRoutes = (): RouteConfig[] => {
  return [
    // Public routes
    { path: "/login", element: <Login />, protected: false },
    
    // Protected routes - using clean paths since basename handles the prefix
    { path: "/", element: <Index />, protected: true },
    { path: "/features", element: <Features />, protected: true },
    { path: "/features/:id", element: <Features />, protected: true },
    { path: "/feedback", element: <Feedback />, protected: true },
    { path: "/goals", element: <Goals />, protected: true },
    { path: "/goals/:id", element: <Goals />, protected: true },
    { path: "/ideas", element: <Ideas />, protected: true },
    { path: "/releases", element: <Releases />, protected: true },
    { path: "/releases/:id", element: <Releases />, protected: true },
    { path: "/roadmap", element: <Roadmap />, protected: true },
    { path: "/settings", element: <Settings />, protected: true },
    { path: "/team", element: <Team />, protected: true },
    { path: "/tasks", element: <Tasks />, protected: true },
    { path: "/analytics", element: <Analytics />, protected: true },
    { path: "/documentation", element: <Documentation />, protected: true },
    { path: "/requirements", element: <Requirements />, protected: true },
    { path: "/capacity-planning", element: <CapacityPlanning />, protected: true },
    { path: "/dashboards", element: <Dashboards />, protected: true },
    { path: "/integrations", element: <Integrations />, protected: true },
    { path: "/permissions", element: <Permissions />, protected: true },
    { path: "/strategy", element: <Strategy />, protected: true },
    { path: "/reports", element: <Reports />, protected: true },
    { path: "/competitor-analysis", element: <CompetitorAnalysis />, protected: true },
    { path: "/customer-portal", element: <CustomerPortal />, protected: true },
    
    // Catch all - must be last
    { path: "*", element: <NotFound />, protected: false },
  ];
};
