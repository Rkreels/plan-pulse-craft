
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import FeatureList from "@/components/features/FeatureList";
import FeatureBoard from "@/components/features/FeatureBoard";
import { FeatureDependencyManager } from "@/components/features/FeatureDependencyManager";
import { Feature, Epic } from "@/types";

interface FeatureTabContentProps {
  activeTab: string;
  features: Feature[];
  epics: Epic[];
}

const FeatureTabContent: React.FC<FeatureTabContentProps> = ({
  activeTab,
  features,
  epics,
}) => {
  return (
    <>
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
    </>
  );
};

export default FeatureTabContent;
