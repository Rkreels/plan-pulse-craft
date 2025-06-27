
import React from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { CapacityDashboard } from "@/components/capacity/CapacityDashboard";

const CapacityPlanning = () => {
  return (
    <div className="space-y-6">
      <PageTitle 
        title="Capacity Planning" 
        description="Monitor team capacity, resource allocation, and sprint planning"
      />
      
      <CapacityDashboard />
    </div>
  );
};

export default CapacityPlanning;
