
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
import { toast } from "sonner";

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
    if (!name.trim()) {
      toast.error("Please enter a view name");
      return;
    }

    const updatedView: RoadmapView = {
      id: view?.id || `view-${Date.now()}`,
      name: name.trim(),
      type,
      filters: view?.filters || [],
      isDefault,
      ownerId: view?.ownerId || currentUser?.id || "",
      workspaceId: view?.workspaceId || workspace?.id || "",
      sortBy: view?.sortBy,
      groupBy: view?.groupBy
    };

    try {
      onSave(updatedView);
      onOpenChange(false);
      toast.success(`View ${view ? 'updated' : 'created'} successfully`);
    } catch (error) {
      toast.error(`Failed to ${view ? 'update' : 'create'} view`);
      console.error("Error saving view:", error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form
    if (view) {
      setName(view.name);
      setType(view.type);
      setIsDefault(view.isDefault);
    } else {
      setName("");
      setType("timeline");
      setIsDefault(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{view ? "Edit" : "Create"} Roadmap View</DialogTitle>
          <DialogDescription>
            {view ? "Update this roadmap view settings." : "Create a new view to visualize your roadmap data."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">View Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter view name..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">View Type</Label>
            <Select value={type} onValueChange={(value: RoadmapView["type"]) => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select view type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timeline">Timeline View</SelectItem>
                <SelectItem value="board">Board View</SelectItem>
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
            <Label htmlFor="is-default" className="text-sm">
              Set as default view
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {view ? "Update" : "Create"} View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
