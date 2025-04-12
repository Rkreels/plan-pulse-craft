
import { useAppContext } from "@/contexts/AppContext";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AccessDeniedProps {
  requiredRole: "product_manager" | "executive" | "developer" | "customer";
  message?: string;
}

export function AccessDenied({ requiredRole, message }: AccessDeniedProps) {
  const { currentUser } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-red-100 p-6">
        <Shield className="h-10 w-10 text-red-500" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">Access Denied</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        {message || `This area requires ${requiredRole.replace('_', ' ')} permissions. Your current role is ${currentUser?.role.replace('_', ' ')}.`}
      </p>
      <Button onClick={() => navigate("/")}>
        Return to Dashboard
      </Button>
    </div>
  );
}
