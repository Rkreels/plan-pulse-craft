
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Initiative, Goal } from "@/types";
import { useAppContext } from "@/contexts/AppContext";

interface AddEditInitiativeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initiative?: Initiative;
  onSave: (initiative: Initiative) => void;
}

export function AddEditInitiativeDialog({
  open,
  onOpenChange,
  initiative,
  onSave,
}: AddEditInitiativeDialogProps) {
  const { goals, currentUser, workspace } = useAppContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Initiative["status"]>("not_started");
  const [progress, setProgress] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  useEffect(() => {
    if (initiative) {
      setTitle(initiative.title);
      setDescription(initiative.description);
      setStatus(initiative.status);
      setProgress(initiative.progress);
      setSelectedGoals(initiative.goals || []);
    } else {
      setTitle("");
      setDescription("");
      setStatus("not_started");
      setProgress(0);
      setSelectedGoals([]);
    }
  }, [initiative, open]);

  const handleSave = () => {
    if (!title) return;

    const updatedInitiative: Initiative = {
      id: initiative?.id || `i-${Date.now()}`,
      title,
      description,
      status,
      progress,
      goals: selectedGoals,
      ownerId: initiative?.ownerId || currentUser?.id || "",
      workspaceId: initiative?.workspaceId || workspace?.id || "",
      startDate: initiative?.startDate || new Date(),
      targetDate: initiative?.targetDate,
    };

    onSave(updatedInitiative);
    onOpenChange(false);
  };

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } else {
        return [...prev, goalId];
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initiative ? "Edit" : "Add"} Strategic Initiative</DialogTitle>
          <DialogDescription>
            {initiative ? "Update the details of this strategic initiative." : "Create a new strategic initiative to track key efforts."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter initiative title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this initiative"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: Initiative["status"]) => setStatus(value)}>
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

            <div className="grid gap-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Linked Goals</Label>
            <div className="border rounded-md p-3 h-32 overflow-auto">
              {goals.length > 0 ? (
                goals.map(goal => (
                  <div key={goal.id} className="flex items-center space-x-2 py-1">
                    <input 
                      type="checkbox" 
                      id={`goal-${goal.id}`}
                      checked={selectedGoals.includes(goal.id)}
                      onChange={() => handleGoalSelect(goal.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={`goal-${goal.id}`} className="text-sm">{goal.title}</label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No goals available to link</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!title}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
