
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { Task, Feature, Epic, Release } from "@/types";
import { useAppContext } from "@/contexts/AppContext";
import { Checkbox } from "@/components/ui/checkbox";

interface AddEditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSave: (task: Partial<Task>) => void;
  features: Feature[];
  epics: Epic[];
  releases: Release[];
}

// Mock users - in real app this would come from context or API
const mockUsers = [
  { id: "u1", name: "John Doe", email: "john@example.com" },
  { id: "u2", name: "Jane Smith", email: "jane@example.com" },
  { id: "u3", name: "Bob Wilson", email: "bob@example.com" },
  { id: "u4", name: "Alice Brown", email: "alice@example.com" },
];

export function AddEditTaskDialog({
  open,
  onOpenChange,
  task,
  onSave,
  features,
  epics,
  releases
}: AddEditTaskDialogProps) {
  const { currentUser } = useAppContext();
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "not_started",
    priority: "medium",
    assignedTo: [],
    featureId: undefined,
    epicId: undefined,
    releaseId: undefined,
    estimatedHours: undefined,
    dueDate: undefined,
    tags: []
  });
  const [newTag, setNewTag] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        title: "",
        description: "",
        status: "not_started",
        priority: "medium",
        assignedTo: [],
        featureId: undefined,
        epicId: undefined,
        releaseId: undefined,
        estimatedHours: undefined,
        dueDate: undefined,
        tags: []
      });
    }
  }, [task, open]);

  const handleSave = () => {
    if (!formData.title?.trim()) {
      return;
    }

    // Convert "none" values back to undefined
    const processedData = {
      ...formData,
      featureId: formData.featureId === "none" ? undefined : formData.featureId,
      epicId: formData.epicId === "none" ? undefined : formData.epicId,
      releaseId: formData.releaseId === "none" ? undefined : formData.releaseId,
    };

    onSave(processedData);
    onOpenChange(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()]
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const handleToggleAssignee = (userId: string) => {
    const currentAssignees = formData.assignedTo || [];
    const isAssigned = currentAssignees.includes(userId);
    
    if (isAssigned) {
      setFormData({
        ...formData,
        assignedTo: currentAssignees.filter(id => id !== userId)
      });
    } else {
      setFormData({
        ...formData,
        assignedTo: [...currentAssignees, userId]
      });
    }
  };

  const getAssignedUserNames = () => {
    const assignedUsers = mockUsers.filter(user => formData.assignedTo?.includes(user.id));
    return assignedUsers.map(user => user.name).join(", ") || "No one assigned";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || "not_started"}
                onValueChange={(value: Task["status"]) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
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
                value={formData.priority || "medium"}
                onValueChange={(value: Task["priority"]) => setFormData({ ...formData, priority: value })}
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

          <div>
            <Label htmlFor="assignees">Assigned To</Label>
            <Popover open={showAssigneeDropdown} onOpenChange={setShowAssigneeDropdown}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  {getAssignedUserNames()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Select Team Members</h4>
                  {mockUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={user.id}
                        checked={formData.assignedTo?.includes(user.id) || false}
                        onCheckedChange={() => handleToggleAssignee(user.id)}
                      />
                      <label htmlFor={user.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {user.name} ({user.email})
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="feature">Linked Feature (Optional)</Label>
              <Select
                value={formData.featureId || "none"}
                onValueChange={(value) => setFormData({ ...formData, featureId: value === "none" ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a feature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No feature</SelectItem>
                  {features.map((feature) => (
                    <SelectItem key={feature.id} value={feature.id}>
                      {feature.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="epic">Linked Epic (Optional)</Label>
              <Select
                value={formData.epicId || "none"}
                onValueChange={(value) => setFormData({ ...formData, epicId: value === "none" ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an epic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No epic</SelectItem>
                  {epics.map((epic) => (
                    <SelectItem key={epic.id} value={epic.id}>
                      {epic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="release">Linked Release (Optional)</Label>
              <Select
                value={formData.releaseId || "none"}
                onValueChange={(value) => setFormData({ ...formData, releaseId: value === "none" ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a release" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No release</SelectItem>
                  {releases.map((release) => (
                    <SelectItem key={release.id} value={release.id}>
                      {release.name} (v{release.version})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                type="number"
                min="0"
                step="0.5"
                value={formData.estimatedHours || ""}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  estimatedHours: e.target.value ? parseFloat(e.target.value) : undefined 
                })}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => {
                      setFormData({ ...formData, dueDate: date });
                      setShowCalendar(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.title?.trim()}>
              {task ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
