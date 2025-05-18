
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "./contexts/AppContext";
import { MainLayout } from "./components/layout/MainLayout";

// Pages
import Login from "./pages/Login";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Feedback from "./pages/Feedback";
import Goals from "./pages/Goals";
import Ideas from "./pages/Ideas";
import NotFound from "./pages/NotFound";
import Releases from "./pages/Releases";
import Roadmap from "./pages/Roadmap";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import Analytics from "./pages/Analytics";
import Documentation from "./pages/Documentation";
import Requirements from "./pages/Requirements";
import CapacityPlanning from "./pages/CapacityPlanning";
import Dashboards from "./pages/Dashboards";
import Integrations from "./pages/Integrations";
import Permissions from "./pages/Permissions";
import Team from "./pages/Team";

// Auth protection component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useAppContext();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login if not authenticated, saving the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Index />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/features" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Features />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/features/:id" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Features />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/feedback" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Feedback />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/goals" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Goals />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/goals/:id" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Goals />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ideas" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Ideas />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/releases" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Releases />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/releases/:id" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Releases />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/roadmap" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Roadmap />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/team" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Team />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tasks" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Tasks />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Analytics />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/documentation" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Documentation />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/requirements" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Requirements />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/capacity-planning" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <CapacityPlanning />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboards" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboards />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/integrations" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Integrations />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/permissions" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Permissions />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
