
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Feature, Epic, Release } from "@/types";
import { useAppContext } from "@/contexts/AppContext";

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
    status: "idea",
    priority: "medium",
    effort: 5,
    value: 5,
    tags: [],
    assignedTo: currentUser?.id,
    votes: 0,
    feedback: [],
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
        releaseId: feature.releaseId || "none"
      };
      setFormData(processedFeature);
    } else {
      // Reset form for new feature
      setFormData({
        title: "",
        description: "",
        status: "idea",
        priority: "medium",
        effort: 5,
        value: 5,
        tags: [],
        assignedTo: currentUser?.id,
        votes: 0,
        feedback: [],
        epicId: "none",
        releaseId: "none",
        createdAt: new Date(),
        updatedAt: new Date(),
        workspaceId: "w1",
      });
    }
  }, [feature, currentUser]);

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
      releaseId: formData.releaseId === "none" ? "" : formData.releaseId
    };
    
    const newFeature = {
      id: feature?.id || `f${Date.now()}`, // Generate ID if new
      ...processedData,
      effort: Number(processedData.effort) || 5,
      value: Number(processedData.value) || 5,
      votes: Number(processedData.votes) || 0,
      tags: processedData.tags || [],
      feedback: processedData.feedback || [],
      updatedAt: new Date(),
      createdAt: feature?.createdAt || new Date(),
    } as Feature;
    
    onSave(newFeature);
    onOpenChange(false);
  };

  const isFormValid = formData.title && formData.description;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{feature ? "Edit Feature" : "Add New Feature"}</DialogTitle>
          <DialogDescription>
            {feature ? "Update feature details" : "Create a new product feature"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Feature Title</Label>
            <Input 
              id="title"
              value={formData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g., Interactive Product Tour"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe this feature and its benefits"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => handleChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="effort">Effort (1-10)</Label>
              <Input 
                id="effort"
                type="number"
                min="1"
                max="10"
                value={formData.effort || 5}
                onChange={(e) => handleChange("effort", parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value (1-10)</Label>
              <Input 
                id="value"
                type="number"
                min="1"
                max="10"
                value={formData.value || 5}
                onChange={(e) => handleChange("value", parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="epicId">Epic</Label>
              <Select 
                value={formData.epicId || ""} 
                onValueChange={(value) => handleChange("epicId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select epic (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {epics.map((epic) => (
                    <SelectItem key={epic.id} value={epic.id}>{epic.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseId">Release</Label>
              <Select 
                value={formData.releaseId || ""} 
                onValueChange={(value) => handleChange("releaseId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select release (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {releases.map((release) => (
                    <SelectItem key={release.id} value={release.id}>{release.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

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
