
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CapacityDashboard } from "@/components/capacity/CapacityDashboard";
import { ResourceAllocation } from "@/components/capacity/ResourceAllocation";
import { TeamCapacity } from "@/components/capacity/TeamCapacity";
import { Button } from "@/components/ui/button";
import { Download, Save, Share2 } from "lucide-react";
import { toast } from "sonner";

const CapacityPlanning = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleExport = () => {
    toast.success("Capacity planning data exported successfully");
  };

  const handleSave = () => {
    toast.success("Capacity planning configuration saved");
  };

  const handleShare = () => {
    toast.success("Capacity planning link copied to clipboard");
  };

  return (
    <>
      <PageTitle
        title="Capacity Planning"
        description="Plan and manage team capacity, resource allocation, and workload distribution"
        action={{
          label: "Export Report",
          icon: <Download className="h-4 w-4" />,
          onClick: handleExport
        }}
      />
      
      <div className="flex justify-end gap-2 mb-6">
        <Button variant="outline" size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Capacity Dashboard</TabsTrigger>
          <TabsTrigger value="allocation">Resource Allocation</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <CapacityDashboard />
        </TabsContent>

        <TabsContent value="allocation" className="space-y-6">
          <ResourceAllocation />
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <TeamCapacity />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Capacity Reports</h3>
            <p className="text-muted-foreground mb-4">
              Generate detailed capacity planning reports and analytics
            </p>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default CapacityPlanning;
