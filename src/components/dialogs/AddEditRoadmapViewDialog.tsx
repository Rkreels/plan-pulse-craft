
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
import { Checkbox } from "@/components/ui/checkbox";
import { RoadmapView } from "@/types";
import { useAppContext } from "@/contexts/AppContext";

interface AddEditRoadmapViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  view?: RoadmapView;
  onSave: (view: RoadmapView) => void;
}

export function AddEditRoadmapViewDialog({
  open,
  onOpenChange,
  view,
  onSave,
}: AddEditRoadmapViewDialogProps) {
  const { currentUser, workspace } = useAppContext();
  
  const [name, setName] = useState("");
  const [type, setType] = useState<RoadmapView["type"]>("timeline");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (view) {
      setName(view.name);
      setType(view.type);
      setIsDefault(view.isDefault);
    } else {
      setName("");
      setType("timeline");
      setIsDefault(false);
    }
  }, [view, open]);

  const handleSave = () => {
    if (!name) return;

    const updatedView: RoadmapView = {
      id: view?.id || `view-${Date.now()}`,
      name,
      type,
      filters: view?.filters || [],
      isDefault,
      ownerId: view?.ownerId || currentUser?.id || "",
      workspaceId: view?.workspaceId || workspace?.id || "",
      sortBy: view?.sortBy,
      groupBy: view?.groupBy
    };

    onSave(updatedView);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{view ? "Edit" : "Add"} Roadmap View</DialogTitle>
          <DialogDescription>
            {view ? "Update this roadmap view." : "Create a new view to visualize your roadmap."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">View Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter view name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">View Type</Label>
            <Select value={type} onValueChange={(value: RoadmapView["type"]) => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select view type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timeline">Timeline</SelectItem>
                <SelectItem value="board">Board</SelectItem>
                <SelectItem value="gantt">Gantt Chart</SelectItem>
                <SelectItem value="list">List View</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is-default" 
              checked={isDefault} 
              onCheckedChange={(checked) => setIsDefault(checked === true)}
            />
            <Label htmlFor="is-default">Set as default view</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
