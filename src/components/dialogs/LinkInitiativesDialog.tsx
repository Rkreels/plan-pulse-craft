
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
import { Initiative } from "@/types";
import { Progress } from "@/components/ui/progress";

interface LinkInitiativesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  themeId: number | string;
  onLink: (initiatives: Initiative[]) => void;
}

export function LinkInitiativesDialog({
  open,
  onOpenChange,
  themeId,
  onLink,
}: LinkInitiativesDialogProps) {
  const { initiatives } = useAppContext();
  const [selectedInitiativeIds, setSelectedInitiativeIds] = useState<string[]>([]);

  const handleToggleInitiative = (initiativeId: string) => {
    setSelectedInitiativeIds(prev =>
      prev.includes(initiativeId)
        ? prev.filter(id => id !== initiativeId)
        : [...prev, initiativeId]
    );
  };

  const handleSave = () => {
    const selectedInitiatives = initiatives.filter(initiative => 
      selectedInitiativeIds.includes(initiative.id)
    );
    onLink(selectedInitiatives);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Link to Initiatives</DialogTitle>
          <DialogDescription>
            Connect this theme to existing initiatives.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[400px] overflow-auto py-4">
          <div className="space-y-2">
            {initiatives.length > 0 ? (
              initiatives.map((initiative) => (
                <div
                  key={initiative.id}
                  className="flex items-start space-x-3 p-2 border rounded-md"
                >
                  <Checkbox
                    id={initiative.id}
                    checked={selectedInitiativeIds.includes(initiative.id)}
                    onCheckedChange={() => handleToggleInitiative(initiative.id)}
                  />
                  <div className="space-y-1 w-full">
                    <Label htmlFor={initiative.id} className="cursor-pointer">
                      {initiative.title}
                    </Label>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {initiative.description}
                    </p>
                    <div className="flex justify-between items-center mb-1">
                      <Badge
                        className={
                          initiative.status === "completed"
                            ? "bg-green-500"
                            : initiative.status === "in_progress"
                            ? "bg-blue-500"
                            : initiative.status === "at_risk"
                            ? "bg-red-500"
                            : "bg-slate-500"
                        }
                      >
                        {initiative.status.replace("_", " ")}
                      </Badge>
                      <span className="text-xs">{initiative.progress}% complete</span>
                    </div>
                    <Progress value={initiative.progress} className="h-1" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4">
                <p className="text-muted-foreground">No initiatives available</p>
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
