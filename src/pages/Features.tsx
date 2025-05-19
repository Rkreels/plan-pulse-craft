
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { FeatureDependencyManager } from "@/components/features/FeatureDependencyManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Features = () => {
  const [activeTab, setActiveTab] = useState("list");
  
  return (
    <>
      <PageTitle
        title="Feature Management"
        description="Manage product features and their dependencies"
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
        <TabsContent value="list" className="space-y-4">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Features List</h2>
            <p className="text-muted-foreground">Manage and organize your product features.</p>
            {/* Feature list content would go here */}
          </div>
        </TabsContent>
        <TabsContent value="board" className="space-y-4">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Feature Kanban Board</h2>
            <p className="text-muted-foreground">Visualize your features workflow with a Kanban board.</p>
            {/* Kanban board content would go here */}
          </div>
        </TabsContent>
        <TabsContent value="dependencies" className="space-y-4">
          <FeatureDependencyManager />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Features;
