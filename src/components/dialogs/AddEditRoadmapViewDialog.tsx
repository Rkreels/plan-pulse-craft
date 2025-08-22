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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RoadmapView } from "@/types";

interface AddEditRoadmapViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  view?: RoadmapView;
  onSave: (view: RoadmapView) => void;
}

export function AddEditRoadmapViewDialog({ open, onOpenChange, view, onSave }: AddEditRoadmapViewDialogProps) {
  const [formData, setFormData] = useState<Partial<RoadmapView>>({
    name: "",
    type: "timeline",
    filters: [],
    sortBy: "priority",
    groupBy: "status",
    isDefault: false,
    ownerId: "user-1",
    workspaceId: "workspace-1"
  });

  useEffect(() => {
    if (view) {
      setFormData(view);
    } else {
      setFormData({
        name: "",
        type: "timeline",
        filters: [],
        sortBy: "priority",
        groupBy: "status",
        isDefault: false,
        ownerId: "user-1",
        workspaceId: "workspace-1"
      });
    }
  }, [view, open]);

  const handleSubmit = () => {
    if (!formData.name?.trim()) return;
    
    const viewData: RoadmapView = {
      id: view?.id || `view-${Date.now()}`,
      name: formData.name,
      type: formData.type || "timeline",
      filters: formData.filters || [],
      sortBy: formData.sortBy,
      groupBy: formData.groupBy,
      isDefault: formData.isDefault || false,
      ownerId: formData.ownerId || "user-1",
      workspaceId: formData.workspaceId || "workspace-1"
    };
    
    onSave(viewData);
    onOpenChange(false);
  };

  const isFormValid = formData.name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{view ? "Edit Roadmap View" : "Create New Roadmap View"}</DialogTitle>
          <DialogDescription>
            {view ? "Update view settings" : "Create a custom roadmap view"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">View Name</Label>
            <Input 
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Q4 2024 Roadmap"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">View Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: RoadmapView["type"]) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select view type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timeline">Timeline</SelectItem>
                <SelectItem value="board">Board</SelectItem>
                <SelectItem value="gantt">Gantt Chart</SelectItem>
                <SelectItem value="list">List</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sortBy">Sort By</Label>
              <Select 
                value={formData.sortBy} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, sortBy: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupBy">Group By</Label>
              <Select 
                value={formData.groupBy} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, groupBy: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Group by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="release">Release</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: !!checked }))}
            />
            <Label htmlFor="isDefault">Set as default view</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            {view ? "Update View" : "Create View"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}