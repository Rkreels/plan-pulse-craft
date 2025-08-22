
import { Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import Index from '@/pages/Index';
import Features from '@/pages/Features';
import Ideas from '@/pages/Ideas';
import Roadmap from '@/pages/Roadmap';
import Goals from '@/pages/Goals';
import Tasks from '@/pages/Tasks';
import Feedback from '@/pages/Feedback';
import Releases from '@/pages/Releases';
import Analytics from '@/pages/Analytics';
import Reports from '@/pages/Reports';
import Team from '@/pages/Team';
import Settings from '@/pages/Settings';
import Requirements from '@/pages/Requirements';
import Strategy from '@/pages/Strategy';
import CapacityPlanning from '@/pages/CapacityPlanning';
import CustomerPortal from '@/pages/CustomerPortal';
import Integrations from '@/pages/Integrations';
import Documentation from '@/pages/Documentation';
import WorkflowAutomation from '@/pages/WorkflowAutomation';
import CompetitorAnalysis from '@/pages/CompetitorAnalysis';
import Portfolio from '@/pages/Portfolio';
import IdeaScoring from '@/pages/IdeaScoring';
import Dashboards from '@/pages/Dashboards';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

export interface RouteConfig {
  path: string;
  element: React.ReactElement;
  protected: boolean;
}

export const generateRoutes = (): RouteConfig[] => [
  // Public routes
  {
    path: '/login',
    element: <Login />,
    protected: false,
  },
  
  // Protected routes with MainLayout wrapper
  {
    path: '/',
    element: (
      <MainLayout>
        <Index />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/features',
    element: (
      <MainLayout>
        <Features />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/ideas',
    element: (
      <MainLayout>
        <Ideas />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/idea-scoring',
    element: (
      <MainLayout>
        <IdeaScoring />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/roadmap',
    element: (
      <MainLayout>
        <Roadmap />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/goals',
    element: (
      <MainLayout>
        <Goals />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/tasks',
    element: (
      <MainLayout>
        <Tasks />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/feedback',
    element: (
      <MainLayout>
        <Feedback />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/releases',
    element: (
      <MainLayout>
        <Releases />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/analytics',
    element: (
      <MainLayout>
        <Analytics />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/reports',
    element: (
      <MainLayout>
        <Reports />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/team',
    element: (
      <MainLayout>
        <Team />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/settings',
    element: (
      <MainLayout>
        <Settings />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/requirements',
    element: (
      <MainLayout>
        <Requirements />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/strategy',
    element: (
      <MainLayout>
        <Strategy />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/capacity-planning',
    element: (
      <MainLayout>
        <CapacityPlanning />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/customer-portal',
    element: (
      <MainLayout>
        <CustomerPortal />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/integrations',
    element: (
      <MainLayout>
        <Integrations />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/documentation',
    element: (
      <MainLayout>
        <Documentation />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/workflow-automation',
    element: (
      <MainLayout>
        <WorkflowAutomation />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/competitor-analysis',
    element: (
      <MainLayout>
        <CompetitorAnalysis />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/portfolio',
    element: (
      <MainLayout>
        <Portfolio />
      </MainLayout>
    ),
    protected: true,
  },
  {
    path: '/dashboards',
    element: (
      <MainLayout>
        <Dashboards />
      </MainLayout>
    ),
    protected: true,
  },
  
  // Catch-all route for 404
  {
    path: '*',
    element: <NotFound />,
    protected: false,
  }
];
