
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/contexts/AppContext";
import { Goal } from "@/types";

interface LinkGoalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initiativeId: string;
  onLink: (goalIds: string[]) => void;
}

export function LinkGoalsDialog({
  open,
  onOpenChange,
  initiativeId,
  onLink,
}: LinkGoalsDialogProps) {
  const { goals, initiatives } = useAppContext();
  const initiative = initiatives.find(i => i.id === initiativeId);
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>(
    initiative?.goals || []
  );

  const handleToggleGoal = (goalId: string) => {
    setSelectedGoalIds(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleSave = () => {
    onLink(selectedGoalIds);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Link to Strategic Goals</DialogTitle>
          <DialogDescription>
            Connect this initiative to strategic goals to track alignment.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[400px] overflow-auto py-4">
          <div className="space-y-2">
            {goals.length > 0 ? (
              goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-start space-x-3 p-2 border rounded-md"
                >
                  <Checkbox
                    id={goal.id}
                    checked={selectedGoalIds.includes(goal.id)}
                    onCheckedChange={() => handleToggleGoal(goal.id)}
                  />
                  <div className="space-y-1 w-full">
                    <Label htmlFor={goal.id} className="cursor-pointer">
                      {goal.title}
                    </Label>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {goal.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge
                        className={
                          goal.status === "completed"
                            ? "bg-green-500"
                            : goal.status === "in_progress"
                            ? "bg-blue-500"
                            : goal.status === "at_risk"
                            ? "bg-red-500"
                            : "bg-slate-500"
                        }
                      >
                        {goal.status.replace("_", " ")}
                      </Badge>
                      <span className="text-xs">{goal.progress}% complete</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4">
                <p className="text-muted-foreground">No goals available</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
