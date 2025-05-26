
import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import FeatureList from "@/components/features/FeatureList";
import DraggableFeatureBoard from "@/components/features/DraggableFeatureBoard";
import { FeatureDependencyManager } from "@/components/features/FeatureDependencyManager";
import { AddEditFeatureDialog } from "@/components/dialogs/AddEditFeatureDialog";
import { Feature, Epic } from "@/types";
import { useAppContext } from "@/contexts/AppContext";

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
  const { updateFeature } = useAppContext();
  const [editFeatureDialogOpen, setEditFeatureDialogOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | undefined>(undefined);

  const handleFeatureEdit = (feature: Feature) => {
    setSelectedFeature(feature);
    setEditFeatureDialogOpen(true);
  };

  const handleFeatureSave = (updatedFeature: Feature) => {
    updateFeature(updatedFeature);
    setEditFeatureDialogOpen(false);
    setSelectedFeature(undefined);
  };

  return (
    <>
      <TabsContent value="list" className="space-y-4">
        <div className="space-y-4">
          <FeatureList features={features} epics={epics} onFeatureEdit={handleFeatureEdit} />
        </div>
      </TabsContent>
        
      <TabsContent value="board" className="space-y-4">
        <DraggableFeatureBoard features={features} onFeatureEdit={handleFeatureEdit} />
      </TabsContent>
        
      <TabsContent value="dependencies" className="space-y-4">
        <FeatureDependencyManager />
      </TabsContent>

      <AddEditFeatureDialog
        open={editFeatureDialogOpen}
        onOpenChange={setEditFeatureDialogOpen}
        feature={selectedFeature}
        onSave={handleFeatureSave}
      />
    </>
  );
};

export default FeatureTabContent;
