
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
    { path: "/project-roadmap/login", element: <Login />, protected: false },
    { path: "*", element: <NotFound />, protected: false },
    
    // Protected routes
    { path: "/", element: <Index />, protected: true },
    { path: "/project-roadmap", element: <Index />, protected: true },
    { path: "/project-roadmap/", element: <Index />, protected: true },
    { path: "/project-roadmap/features", element: <Features />, protected: true },
    { path: "/project-roadmap/features/:id", element: <Features />, protected: true },
    { path: "/project-roadmap/feedback", element: <Feedback />, protected: true },
    { path: "/project-roadmap/goals", element: <Goals />, protected: true },
    { path: "/project-roadmap/goals/:id", element: <Goals />, protected: true },
    { path: "/project-roadmap/ideas", element: <Ideas />, protected: true },
    { path: "/project-roadmap/releases", element: <Releases />, protected: true },
    { path: "/project-roadmap/releases/:id", element: <Releases />, protected: true },
    { path: "/project-roadmap/roadmap", element: <Roadmap />, protected: true },
    { path: "/project-roadmap/settings", element: <Settings />, protected: true },
    { path: "/project-roadmap/team", element: <Team />, protected: true },
    { path: "/project-roadmap/tasks", element: <Tasks />, protected: true },
    { path: "/project-roadmap/analytics", element: <Analytics />, protected: true },
    { path: "/project-roadmap/documentation", element: <Documentation />, protected: true },
    { path: "/project-roadmap/requirements", element: <Requirements />, protected: true },
    { path: "/project-roadmap/capacity-planning", element: <CapacityPlanning />, protected: true },
    { path: "/project-roadmap/dashboards", element: <Dashboards />, protected: true },
    { path: "/project-roadmap/integrations", element: <Integrations />, protected: true },
    { path: "/project-roadmap/permissions", element: <Permissions />, protected: true },
    { path: "/project-roadmap/strategy", element: <Strategy />, protected: true },
    { path: "/project-roadmap/reports", element: <Reports />, protected: true },
    { path: "/project-roadmap/competitor-analysis", element: <CompetitorAnalysis />, protected: true },
    { path: "/project-roadmap/customer-portal", element: <CustomerPortal />, protected: true },
  ];
};
