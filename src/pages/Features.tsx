
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { FeatureDependencyManager } from "@/components/features/FeatureDependencyManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { Feature } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { AddEditFeatureDialog } from "@/components/dialogs/AddEditFeatureDialog";
import FeatureList from "@/components/features/FeatureList";
import FeatureBoard from "@/components/features/FeatureBoard";

type FeatureStatus = "not_started" | "in_progress" | "review" | "completed" | "idea" | "backlog" | "planned";
type FeaturePriority = "low" | "medium" | "high" | "critical";

const Features = () => {
  const [activeTab, setActiveTab] = useState("list");
  const { features, epics, addFeature } = useAppContext();
  const [newFeatureDialogOpen, setNewFeatureDialogOpen] = useState(false);
  const [newFeature, setNewFeature] = useState({
    title: "",
    description: "",
    status: "not_started" as FeatureStatus,
    priority: "medium" as FeaturePriority,
    epicId: ""
  });
  
  const handleAddFeature = (feature: Feature) => {
    addFeature(feature);
    setNewFeatureDialogOpen(false);
  };
  
  return (
    <>
      <PageTitle
        title="Feature Management"
        description="Manage product features and their dependencies"
      />
      
      <div className="flex justify-between items-center my-4">
        <div></div>
        <Dialog open={newFeatureDialogOpen} onOpenChange={setNewFeatureDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              New Feature
            </Button>
          </DialogTrigger>
          <AddEditFeatureDialog
            open={newFeatureDialogOpen}
            onOpenChange={setNewFeatureDialogOpen}
            onSave={handleAddFeature}
          />
        </Dialog>
      </div>
      
      <Tabs 
        defaultValue="list" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="list">Feature List</TabsTrigger>
          <TabsTrigger value="board">Kanban Board</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <div className="space-y-4">
            <FeatureList features={features} epics={epics} />
          </div>
        </TabsContent>
        
        <TabsContent value="board" className="space-y-4">
          <FeatureBoard features={features} />
        </TabsContent>
        
        <TabsContent value="dependencies" className="space-y-4">
          <FeatureDependencyManager />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Features;
