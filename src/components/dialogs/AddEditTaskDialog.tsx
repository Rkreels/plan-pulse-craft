
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Task, Feature, Epic, Release } from "@/types";

interface AddEditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSave: (task: Partial<Task>) => void;
  features: Feature[];
  epics: Epic[];
  releases: Release[];
}

export const AddEditTaskDialog = ({
  open,
  onOpenChange,
  task,
  onSave,
  features,
  epics,
  releases
}: AddEditTaskDialogProps) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "not_started",
    priority: "medium",
    assignedTo: [],
    tags: [],
    estimatedHours: 0,
    dueDate: undefined,
    featureId: undefined,
    epicId: undefined,
    releaseId: undefined
  });

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo || [],
        tags: task.tags,
        estimatedHours: task.estimatedHours,
        dueDate: task.dueDate,
        featureId: task.featureId,
        epicId: task.epicId,
        releaseId: task.releaseId
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "not_started",
        priority: "medium",
        assignedTo: [],
        tags: [],
        estimatedHours: 0,
        dueDate: undefined,
        featureId: undefined,
        epicId: undefined,
        releaseId: undefined
      });
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;
    
    onSave(formData);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
                required
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the task"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Task["status"]) => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Task["priority"]) => 
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
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                type="number"
                value={formData.estimatedHours || 0}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  estimatedHours: parseInt(e.target.value) || 0 
                }))}
                min="0"
              />
            </div>
            
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ""}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  dueDate: e.target.value ? new Date(e.target.value) : undefined 
                }))}
              />
            </div>
            
            <div>
              <Label htmlFor="feature">Related Feature</Label>
              <Select
                value={formData.featureId || ""}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  featureId: value || undefined 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select feature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No feature</SelectItem>
                  {features.map(feature => (
                    <SelectItem key={feature.id} value={feature.id}>
                      {feature.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="epic">Related Epic</Label>
              <Select
                value={formData.epicId || ""}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  epicId: value || undefined 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select epic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No epic</SelectItem>
                  {epics.map(epic => (
                    <SelectItem key={epic.id} value={epic.id}>
                      {epic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {task ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
