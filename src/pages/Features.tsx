
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/contexts/AppContext";
import { Feature } from "@/types";
import { v4 as uuidv4 } from "uuid";
import FeatureHeader from "@/components/features/FeatureHeader";
import FeatureTabContent from "@/components/features/FeatureTabContent";

type FeatureStatus = "not_started" | "in_progress" | "review" | "completed" | "idea" | "backlog" | "planned";
type FeaturePriority = "low" | "medium" | "high" | "critical";

const Features = () => {
  const [activeTab, setActiveTab] = useState("list");
  const { features, epics, addFeature } = useAppContext();
  const [newFeatureDialogOpen, setNewFeatureDialogOpen] = useState(false);
  
  const handleAddFeature = (feature: Feature) => {
    const newFeature = {
      ...feature,
      id: feature.id || uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    addFeature(newFeature);
    setNewFeatureDialogOpen(false);
  };
  
  return (
    <>
      <PageTitle
        title="Feature Management"
        description="Manage product features and their dependencies"
      />
      
      <FeatureHeader 
        newFeatureDialogOpen={newFeatureDialogOpen}
        setNewFeatureDialogOpen={setNewFeatureDialogOpen}
        onAddFeature={handleAddFeature}
      />
      
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
        
        <FeatureTabContent 
          activeTab={activeTab}
          features={features}
          epics={epics}
        />
      </Tabs>
    </>
  );
};

export default Features;
