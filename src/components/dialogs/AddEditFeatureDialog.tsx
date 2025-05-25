
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

interface AddEditFeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: Feature;
  onSave: (feature: Feature) => void;
}

export function AddEditFeatureDialog({ open, onOpenChange, feature, onSave }: AddEditFeatureDialogProps) {
  const { currentUser, epics, releases } = useAppContext();
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
      // Convert empty values to "none" for select components
      const processedFeature = {
        ...feature,
        epicId: feature.epicId || "none",
        releaseId: feature.releaseId || "none",
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
        epicId: "none",
        releaseId: "none",
        createdAt: new Date(),
        updatedAt: new Date(),
        workspaceId: "w1",
      });
    }
  }, [feature, currentUser, open]);

  const handleChange = (field: string, value: any) => {
    // Convert "none" value to null or empty string as appropriate
    const processedValue = (field === "epicId" || field === "releaseId") && value === "none" ? "" : value;
    setFormData((prev) => ({ ...prev, [field]: processedValue }));
  };

  const handleSubmit = () => {
    // Process the form data for submission
    const processedData = {
      ...formData,
      epicId: formData.epicId === "none" ? "" : formData.epicId,
      releaseId: formData.releaseId === "none" ? "" : formData.releaseId,
      assignedTo: formData.assignedTo || [],
    };
    
    const newFeature: Feature = {
      id: feature?.id || uuidv4(), // Generate ID if new
      ...processedData,
      title: processedData.title || "",
      description: processedData.description || "",
      status: processedData.status as Feature['status'] || "idea",
      priority: processedData.priority as Feature['priority'] || "medium",
      effort: Number(processedData.effort) || 5,
      value: Number(processedData.value) || 5,
      votes: Number(processedData.votes) || 0,
      progress: Number(processedData.progress) || 0,
      tags: processedData.tags || [],
      dependencies: processedData.dependencies || [],
      acceptanceCriteria: processedData.acceptanceCriteria || [],
      feedback: processedData.feedback || [],
      assignedTo: processedData.assignedTo || [],
      updatedAt: new Date(),
      createdAt: feature?.createdAt || new Date(),
      workspaceId: processedData.workspaceId || "w1",
    };
    
    onSave(newFeature);
    onOpenChange(false);
  };

  const isFormValid = formData.title && formData.description;

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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            {feature ? "Update Feature" : "Create Feature"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
