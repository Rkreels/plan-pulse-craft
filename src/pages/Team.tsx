
import React from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { TeamDashboard } from "@/components/team/TeamDashboard";

const Team = () => {
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
