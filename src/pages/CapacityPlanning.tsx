
import { PageTitle } from "@/components/common/PageTitle";
import { CapacityPlanningDashboard } from "@/components/capacity/CapacityPlanningDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CapacityPlanning = () => {
  return (
    <>
      <PageTitle
        title="Capacity Planning"
        description="Plan and manage your team's capacity across sprints"
      />
      
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Capacity Dashboard</TabsTrigger>
          <TabsTrigger value="allocation">Resource Allocation</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-4">
          <CapacityPlanningDashboard />
        </TabsContent>
        <TabsContent value="allocation" className="space-y-4">
          <h2 className="text-lg font-medium">Resource Allocation</h2>
          <p className="text-muted-foreground">Manage detailed resource allocation across projects and features.</p>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default CapacityPlanning;
