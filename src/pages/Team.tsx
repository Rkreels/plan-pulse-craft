
import React from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { AccessDenied } from "@/components/common/AccessDenied";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { TeamDashboard } from "@/components/team/TeamDashboard";

const Team = () => {
  const { hasRole } = useRoleAccess();
  
  // Role-based access control
  if (!hasRole("product_manager")) {
    return <AccessDenied requiredRole="product_manager" />;
  }

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Team Management" 
        description="Manage team members, workload, and performance"
      />
      
      <TeamDashboard />
    </div>
  );
};

export default Team;
