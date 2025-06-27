
import React from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { DashboardsList } from "@/components/dashboards/DashboardsList";

const Dashboards = () => {
  return (
    <div className="space-y-6">
      <PageTitle 
        title="Dashboards" 
        description="Create and manage custom dashboards for data visualization"
      />
      
      <DashboardsList />
    </div>
  );
};

export default Dashboards;
