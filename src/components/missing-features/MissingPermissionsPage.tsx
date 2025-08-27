import { EmptyState } from "@/components/common/EmptyState";
import { Shield } from "lucide-react";

export function MissingPermissionsPage() {
  return (
    <EmptyState
      title="Permissions Management"
      description="Role-based permissions and access control features are coming soon."
      icon={<Shield className="h-10 w-10 text-muted-foreground" />}
      action={{
        label: "Back to Dashboard",
        onClick: () => window.location.href = "/"
      }}
    />
  );
}