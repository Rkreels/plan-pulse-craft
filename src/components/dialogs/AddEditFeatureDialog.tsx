
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import { Feature } from "@/types";

interface AddEditFeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: Feature;
  onSave: (feature: Feature) => void;
}

export const AddEditFeatureDialog = ({
  open,
  onOpenChange,
  feature,
  onSave
}: AddEditFeatureDialogProps) => {
  const [formData, setFormData] = useState<Partial<Feature>>({
    title: "",
    description: "",
    status: "idea",
    priority: "medium",
    effort: 5,
    value: 5,
    tags: [],
    userStory: "",
    acceptanceCriteria: [],
    assignedTo: [],
    votes: 0,
    progress: 0
  });

  const [newTag, setNewTag] = useState("");
  const [newCriteria, setNewCriteria] = useState("");

  useEffect(() => {
    if (feature) {
      setFormData({
        title: feature.title,
        description: feature.description,
        status: feature.status,
        priority: feature.priority,
        effort: feature.effort,
        value: feature.value,
        tags: feature.tags,
        userStory: feature.userStory || "",
        acceptanceCriteria: feature.acceptanceCriteria || [],
        assignedTo: feature.assignedTo || [],
        votes: feature.votes,
        progress: feature.progress
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "idea",
        priority: "medium",
        effort: 5,
        value: 5,
        tags: [],
        userStory: "",
        acceptanceCriteria: [],
        assignedTo: [],
        votes: 0,
        progress: 0
      });
    }
  }, [feature, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;
    
    const featureData: Feature = {
      id: feature?.id || `feature-${Date.now()}`,
      title: formData.title,
      description: formData.description || "",
      status: formData.status || "idea",
      priority: formData.priority || "medium",
      effort: formData.effort || 5,
      value: formData.value || 5,
      score: (formData.value || 5) * (formData.effort || 5),
      tags: formData.tags || [],
      userStory: formData.userStory,
      acceptanceCriteria: formData.acceptanceCriteria,
      assignedTo: formData.assignedTo || [],
      feedback: feature?.feedback || [],
      votes: formData.votes || 0,
      progress: formData.progress || 0,
      createdAt: feature?.createdAt || new Date(),
      updatedAt: new Date(),
      workspaceId: "workspace-1"
    };
    
    onSave(featureData);
    onOpenChange(false);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const addCriteria = () => {
    if (newCriteria.trim()) {
      setFormData(prev => ({
        ...prev,
        acceptanceCriteria: [...(prev.acceptanceCriteria || []), newCriteria.trim()]
      }));
      setNewCriteria("");
    }
  };

  const removeCriteria = (index: number) => {
    setFormData(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{feature ? "Edit Feature" : "Create New Feature"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter feature title"
                required
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the feature"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Feature["status"]) => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Feature["priority"]) => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Effort (1-10): {formData.effort}</Label>
              <Slider
                value={[formData.effort || 5]}
                onValueChange={(value) => setFormData(prev => ({ ...prev, effort: value[0] }))}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label>Value (1-10): {formData.value}</Label>
              <Slider
                value={[formData.value || 5]}
                onValueChange={(value) => setFormData(prev => ({ ...prev, value: value[0] }))}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="userStory">User Story</Label>
              <Textarea
                id="userStory"
                value={formData.userStory || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, userStory: e.target.value }))}
                placeholder="As a [user], I want [goal] so that [benefit]"
                rows={2}
              />
            </div>
            
            <div className="col-span-2">
              <Label>Acceptance Criteria</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newCriteria}
                  onChange={(e) => setNewCriteria(e.target.value)}
                  placeholder="Add acceptance criteria"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCriteria();
                    }
                  }}
                />
                <Button type="button" onClick={addCriteria} variant="outline">
                  Add
                </Button>
              </div>
              <div className="space-y-1">
                {formData.acceptanceCriteria?.map((criteria, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{criteria}</span>
                    <X 
                      className="h-4 w-4 cursor-pointer" 
                      onClick={() => removeCriteria(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-span-2">
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.tags?.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {feature ? "Update Feature" : "Create Feature"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
