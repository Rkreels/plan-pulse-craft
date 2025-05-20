
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
          onSave={onAddFeature}
        />
      </Dialog>
    </div>
  );
};

export default FeatureHeader;
