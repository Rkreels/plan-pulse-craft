
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Feature } from "@/types";
import { useAppContext } from "@/contexts/AppContext";
import FeatureFormFields from "@/components/features/FeatureFormFields";
import { v4 as uuidv4 } from "uuid";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddEditFeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: Feature;
  onSave: (feature: Feature) => void;
}

export function AddEditFeatureDialog({ open, onOpenChange, feature, onSave }: AddEditFeatureDialogProps) {
  const { currentUser, epics, releases } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Feature>>({
    title: "",
    description: "",
    userStory: "",
    acceptanceCriteria: [],
    status: "idea",
    priority: "medium",
    effort: 5,
    value: 5,
    tags: [],
    assignedTo: currentUser?.id ? [currentUser.id] : [],
    votes: 0,
    feedback: [],
    progress: 0,
    dependencies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    workspaceId: "w1",
  });

  // Load feature data when editing
  useEffect(() => {
    if (feature) {
      // Convert empty values to proper defaults for select components
      const processedFeature = {
        ...feature,
        epicId: feature.epicId || undefined,
        releaseId: feature.releaseId || undefined,
        acceptanceCriteria: feature.acceptanceCriteria || [],
        assignedTo: Array.isArray(feature.assignedTo) ? feature.assignedTo : 
                    feature.assignedTo ? [feature.assignedTo] : [],
      };
      setFormData(processedFeature);
    } else {
      // Reset form for new feature
      setFormData({
        title: "",
        description: "",
        userStory: "",
        acceptanceCriteria: [],
        status: "idea",
        priority: "medium",
        effort: 5,
        value: 5,
        tags: [],
        assignedTo: currentUser?.id ? [currentUser.id] : [],
        votes: 0,
        feedback: [],
        dependencies: [],
        progress: 0,
        epicId: undefined,
        releaseId: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        workspaceId: "w1",
      });
    }
  }, [feature, currentUser, open]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.title?.trim()) {
      toast.error("Feature title is required");
      return;
    }
    
    if (!formData.description?.trim()) {
      toast.error("Feature description is required");
      return;
    }

    setIsLoading(true);

    try {
      const newFeature: Feature = {
        id: feature?.id || uuidv4(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        userStory: formData.userStory?.trim() || "",
        acceptanceCriteria: formData.acceptanceCriteria || [],
        status: (formData.status as Feature['status']) || "idea",
        priority: (formData.priority as Feature['priority']) || "medium",
        effort: Number(formData.effort) || 5,
        value: Number(formData.value) || 5,
        votes: Number(formData.votes) || 0,
        progress: Number(formData.progress) || 0,
        tags: formData.tags || [],
        dependencies: formData.dependencies || [],
        feedback: formData.feedback || [],
        assignedTo: formData.assignedTo || [],
        epicId: formData.epicId || undefined,
        releaseId: formData.releaseId || undefined,
        updatedAt: new Date(),
        createdAt: feature?.createdAt || new Date(),
        workspaceId: formData.workspaceId || "w1",
      };
      
      await onSave(newFeature);
      onOpenChange(false);
      toast.success(feature ? "Feature updated successfully" : "Feature created successfully");
    } catch (error) {
      toast.error(feature ? "Failed to update feature" : "Failed to create feature");
      console.error("Feature save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.title?.trim() && formData.description?.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{feature ? "Edit Feature" : "Add New Feature"}</DialogTitle>
          <DialogDescription>
            {feature ? "Update feature details" : "Create a new product feature"}
          </DialogDescription>
        </DialogHeader>
        
        <FeatureFormFields 
          formData={formData}
          onChange={handleChange}
          epics={epics}
          releases={releases}
        />

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isFormValid || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {feature ? "Update Feature" : "Create Feature"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
