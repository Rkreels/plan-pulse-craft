
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddEditFeatureDialog } from "@/components/dialogs/AddEditFeatureDialog";
import { Feature } from "@/types";

interface FeatureHeaderProps {
  newFeatureDialogOpen: boolean;
  setNewFeatureDialogOpen: (open: boolean) => void;
  onAddFeature: (feature: Feature) => void;
}

const FeatureHeader: React.FC<FeatureHeaderProps> = ({
  newFeatureDialogOpen,
  setNewFeatureDialogOpen,
  onAddFeature,
}) => {
  return (
    <div className="flex justify-between items-center my-4">
      <div className="text-sm text-muted-foreground">
        Manage your product features and track their progress
      </div>
      
      <Button onClick={() => setNewFeatureDialogOpen(true)}>
        <Plus size={16} className="mr-2" />
        New Feature
      </Button>

      <AddEditFeatureDialog
        open={newFeatureDialogOpen}
        onOpenChange={setNewFeatureDialogOpen}
        onSave={onAddFeature}
      />
    </div>
  );
};

export default FeatureHeader;
