
import React from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { AccessDenied } from "@/components/common/AccessDenied";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

const Analytics = () => {
  const { hasRole } = useRoleAccess();
  
  // Role-based access control
  if (!hasRole("product_manager")) {
    return <AccessDenied requiredRole="product_manager" />;
  }

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Analytics Dashboard" 
        description="Comprehensive insights into product development progress and metrics"
      />
      
      <AnalyticsDashboard />
    </div>
  );
};

export default Analytics;
