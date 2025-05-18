
import { PageTitle } from "@/components/common/PageTitle";
import { TeamManagement } from "@/components/team/TeamManagement";

const Team = () => {
  return (
    <>
      <PageTitle
        title="Team Management"
        description="Manage your team members and their roles"
      />
      
      <div className="space-y-6">
        <TeamManagement />
      </div>
    </>
  );
};

export default Team;
