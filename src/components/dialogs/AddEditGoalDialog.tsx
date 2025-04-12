
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
import { Goal } from "@/types";
import { useAppContext } from "@/contexts/AppContext";

interface AddEditGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal;
  onSave: (goal: Goal) => void;
}

export function AddEditGoalDialog({ open, onOpenChange, goal, onSave }: AddEditGoalDialogProps) {
  const { currentUser } = useAppContext();
  const [formData, setFormData] = useState<Partial<Goal>>({
    title: "",
    description: "",
    status: "not_started",
    progress: 0,
    ownerId: currentUser?.id || "",
    workspaceId: "w1", // Default workspace ID
  });

  // Load goal data when editing
  useEffect(() => {
    if (goal) {
      setFormData({
        ...goal
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
      });
    }
  }, [goal, currentUser]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const newGoal = {
      id: goal?.id || `g${Date.now()}`, // Generate ID if new
      ...formData,
      progress: Number(formData.progress) || 0,
    } as Goal;
    
    onSave(newGoal);
    onOpenChange(false);
  };

  const isFormValid = formData.title && formData.description && formData.status;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "Add New Goal"}</DialogTitle>
          <DialogDescription>
            {goal ? "Update goal details" : "Create a new strategic goal"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
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
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe this goal and its success metrics"
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
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="at_risk">At Risk</SelectItem>
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
