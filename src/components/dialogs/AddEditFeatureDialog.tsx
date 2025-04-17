
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
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    assignedTo: currentUser?.id,
    votes: 0,
    feedback: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    workspaceId: "w1",
  });
  
  const [currentTag, setCurrentTag] = useState("");
  const [currentCriterion, setCurrentCriterion] = useState("");

  // Load feature data when editing
  useEffect(() => {
    if (feature) {
      // Convert empty values to "none" for select components
      const processedFeature = {
        ...feature,
        epicId: feature.epicId || "none",
        releaseId: feature.releaseId || "none",
        acceptanceCriteria: feature.acceptanceCriteria || [],
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
    setCurrentTag("");
    setCurrentCriterion("");
  }, [feature, currentUser, open]);

  const handleChange = (field: string, value: any) => {
    // Convert "none" value to null or empty string as appropriate
    const processedValue = (field === "epicId" || field === "releaseId") && value === "none" ? "" : value;
    setFormData((prev) => ({ ...prev, [field]: processedValue }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag.trim()]
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const addCriterion = () => {
    if (currentCriterion.trim()) {
      setFormData((prev) => ({
        ...prev,
        acceptanceCriteria: [...(prev.acceptanceCriteria || []), currentCriterion.trim()]
      }));
      setCurrentCriterion("");
    }
  };

  const removeCriterion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      acceptanceCriteria: (prev.acceptanceCriteria || []).filter((_, i) => i !== index)
    }));
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
      acceptanceCriteria: processedData.acceptanceCriteria || [],
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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

          <div className="space-y-2">
            <Label htmlFor="userStory">User Story</Label>
            <Textarea 
              id="userStory"
              value={formData.userStory || ""}
              onChange={(e) => handleChange("userStory", e.target.value)}
              placeholder="As a [type of user], I want [goal] so that [benefit]"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Acceptance Criteria</Label>
            <div className="flex gap-2">
              <Input
                value={currentCriterion}
                onChange={(e) => setCurrentCriterion(e.target.value)}
                placeholder="Add acceptance criterion"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCriterion();
                  }
                }}
              />
              <Button type="button" onClick={addCriterion}>Add</Button>
            </div>
            {formData.acceptanceCriteria && formData.acceptanceCriteria.length > 0 && (
              <div className="mt-2 space-y-2">
                {formData.acceptanceCriteria.map((criterion, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                    <span className="text-sm">{criterion}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeCriterion(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="epicId">Epic</Label>
              <Select 
                value={formData.epicId || "none"} 
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
                value={formData.releaseId || "none"} 
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

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag}>Add</Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1 pl-2 pr-1">
                    {tag}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 ml-1 hover:bg-muted"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
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
