import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="flex h-full flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
          <p className="text-xl mb-8">Oops! We couldn't find the page you're looking for.</p>
          <Button asChild>
            <a href="/" className="inline-flex items-center gap-2">
              <Home className="h-4 w-4" /> Return to Dashboard
            </a>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
