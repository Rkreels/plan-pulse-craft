
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
import { Checkbox } from "@/components/ui/checkbox";
import { Goal } from "@/types";
import { useAppContext } from "@/contexts/AppContext";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, X } from "lucide-react";

interface AddEditGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal;
  onSave: (goal: Goal) => void;
}

export function AddEditGoalDialog({ open, onOpenChange, goal, onSave }: AddEditGoalDialogProps) {
  const { currentUser, initiatives } = useAppContext();
  const [formData, setFormData] = useState<Partial<Goal & {
    category: string;
    priority: "low" | "medium" | "high" | "critical";
    successMetrics: string[];
    dependencies: string[];
    linkedInitiatives: string[];
    budget: number;
    owner: string;
  }>>({
    title: "",
    description: "",
    status: "not_started",
    progress: 0,
    ownerId: currentUser?.id || "",
    workspaceId: "w1",
    startDate: undefined,
    targetDate: undefined,
    category: "",
    priority: "medium",
    successMetrics: [],
    dependencies: [],
    linkedInitiatives: [],
    budget: 0,
    owner: "",
  });

  const [newMetric, setNewMetric] = useState("");
  const [newDependency, setNewDependency] = useState("");

  // Load goal data when editing
  useEffect(() => {
    if (goal) {
      setFormData({
        ...goal,
        category: "",
        priority: "medium",
        successMetrics: [],
        dependencies: [],
        linkedInitiatives: [],
        budget: 0,
        owner: "",
      });
    } else {
      // Reset form for new goal
      setFormData({
        title: "",
        description: "",
        status: "not_started",
        progress: 0,
        ownerId: currentUser?.id || "",
        workspaceId: "w1",
        startDate: undefined,
        targetDate: undefined,
        category: "",
        priority: "medium",
        successMetrics: [],
        dependencies: [],
        linkedInitiatives: [],
        budget: 0,
        owner: "",
      });
    }
  }, [goal, currentUser]);

  const handleChange = (field: string, value: string | number | Date | undefined | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addMetric = () => {
    if (newMetric.trim()) {
      handleChange("successMetrics", [...(formData.successMetrics || []), newMetric.trim()]);
      setNewMetric("");
    }
  };

  const removeMetric = (index: number) => {
    const metrics = [...(formData.successMetrics || [])];
    metrics.splice(index, 1);
    handleChange("successMetrics", metrics);
  };

  const addDependency = () => {
    if (newDependency.trim()) {
      handleChange("dependencies", [...(formData.dependencies || []), newDependency.trim()]);
      setNewDependency("");
    }
  };

  const removeDependency = (index: number) => {
    const deps = [...(formData.dependencies || [])];
    deps.splice(index, 1);
    handleChange("dependencies", deps);
  };

  const handleInitiativeToggle = (initiativeId: string) => {
    const linked = formData.linkedInitiatives || [];
    if (linked.includes(initiativeId)) {
      handleChange("linkedInitiatives", linked.filter(id => id !== initiativeId));
    } else {
      handleChange("linkedInitiatives", [...linked, initiativeId]);
    }
  };

  const handleSubmit = () => {
    const newGoal = {
      id: goal?.id || `g${Date.now()}`,
      title: formData.title || "",
      description: formData.description || "",
      status: formData.status || "not_started",
      progress: Number(formData.progress) || 0,
      ownerId: formData.ownerId || "",
      workspaceId: formData.workspaceId || "w1",
      startDate: formData.startDate,
      targetDate: formData.targetDate,
    } as Goal;
    
    onSave(newGoal);
    onOpenChange(false);
  };

  const isFormValid = formData.title && formData.description && formData.status;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "Add New Goal"}</DialogTitle>
          <DialogDescription>
            {goal ? "Update goal details" : "Create a new strategic goal"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title"
                value={formData.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Increase conversion rate by 20%"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="strategic">Strategic</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe this goal and its importance"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
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
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="at_risk">At Risk</SelectItem>
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

            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input 
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress || 0}
                onChange={(e) => handleChange("progress", parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Input 
                id="owner"
                value={formData.owner || ""}
                onChange={(e) => handleChange("owner", e.target.value)}
                placeholder="Goal owner"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input 
                id="budget"
                type="number"
                value={formData.budget || 0}
                onChange={(e) => handleChange("budget", Number(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(new Date(formData.startDate), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate ? new Date(formData.startDate) : undefined}
                    onSelect={(date) => handleChange("startDate", date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.targetDate ? (
                      format(new Date(formData.targetDate), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.targetDate ? new Date(formData.targetDate) : undefined}
                    onSelect={(date) => handleChange("targetDate", date)}
                    fromDate={formData.startDate ? new Date(formData.startDate) : undefined}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Success Metrics</Label>
            <div className="flex gap-2">
              <Input 
                value={newMetric}
                onChange={(e) => setNewMetric(e.target.value)}
                placeholder="Add a success metric"
                onKeyPress={(e) => e.key === 'Enter' && addMetric()}
              />
              <Button type="button" onClick={addMetric} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {formData.successMetrics?.map((metric, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                  <span className="text-sm">{metric}</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeMetric(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dependencies</Label>
            <div className="flex gap-2">
              <Input 
                value={newDependency}
                onChange={(e) => setNewDependency(e.target.value)}
                placeholder="Add a dependency"
                onKeyPress={(e) => e.key === 'Enter' && addDependency()}
              />
              <Button type="button" onClick={addDependency} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {formData.dependencies?.map((dep, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                  <span className="text-sm">{dep}</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeDependency(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Linked Initiatives</Label>
            <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
              {initiatives.length > 0 ? (
                initiatives.map(initiative => (
                  <div key={initiative.id} className="flex items-center space-x-2 py-1">
                    <Checkbox 
                      id={`initiative-${initiative.id}`}
                      checked={formData.linkedInitiatives?.includes(initiative.id) || false}
                      onCheckedChange={() => handleInitiativeToggle(initiative.id)}
                    />
                    <label htmlFor={`initiative-${initiative.id}`} className="text-sm flex-1">
                      {initiative.title}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No initiatives available to link</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            {goal ? "Update Goal" : "Create Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
