
import { PageTitle } from "@/components/common/PageTitle";
import { DashboardsList } from "@/components/dashboards/DashboardsList";

const Dashboards = () => {
  return (
    <>
      <PageTitle
        title="Custom Dashboards"
        description="Create and view customized dashboards with metrics that matter to you"
      />
      
      <DashboardsList />
    </>
  );
};

export default Dashboards;
