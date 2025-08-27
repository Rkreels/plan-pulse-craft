
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser } = useAppContext();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login if not authenticated, saving the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
