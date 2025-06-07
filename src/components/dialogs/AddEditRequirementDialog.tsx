
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
import { X, Plus } from "lucide-react";
import { Requirement } from "@/types";
import { useAppContext } from "@/contexts/AppContext";

interface AddEditRequirementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requirement?: Requirement;
  onSave: (requirement: Partial<Requirement>) => void;
}

export function AddEditRequirementDialog({
  open,
  onOpenChange,
  requirement,
  onSave,
}: AddEditRequirementDialogProps) {
  const { features, currentUser } = useAppContext();
  const [formData, setFormData] = useState<Partial<Requirement>>({
    title: "",
    description: "",
    priority: "medium",
    status: "draft",
    type: "functional",
    featureId: undefined,
    acceptanceCriteria: []
  });
  const [newCriteria, setNewCriteria] = useState("");

  useEffect(() => {
    if (requirement) {
      setFormData(requirement);
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "draft",
        type: "functional",
        featureId: undefined,
        acceptanceCriteria: []
      });
    }
  }, [requirement, open]);

  const handleSave = () => {
    if (!formData.title?.trim()) {
      return;
    }

    const processedData = {
      ...formData,
      featureId: formData.featureId === "none" ? undefined : formData.featureId,
      createdBy: formData.createdBy || currentUser?.id || "",
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: formData.version || 1
    };

    onSave(processedData);
    onOpenChange(false);
  };

  const handleAddCriteria = () => {
    if (newCriteria.trim()) {
      setFormData({
        ...formData,
        acceptanceCriteria: [
          ...(formData.acceptanceCriteria || []),
          { text: newCriteria.trim(), met: false }
        ]
      });
      setNewCriteria("");
    }
  };

  const handleRemoveCriteria = (index: number) => {
    setFormData({
      ...formData,
      acceptanceCriteria: formData.acceptanceCriteria?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{requirement ? "Edit Requirement" : "Create New Requirement"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter requirement title"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter requirement description"
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type || "functional"}
                onValueChange={(value: Requirement["type"]) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="functional">Functional</SelectItem>
                  <SelectItem value="non_functional">Non-Functional</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority || "medium"}
                onValueChange={(value: Requirement["priority"]) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || "draft"}
                onValueChange={(value: Requirement["status"]) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
            <Label htmlFor="acceptanceCriteria">Acceptance Criteria</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newCriteria}
                onChange={(e) => setNewCriteria(e.target.value)}
                placeholder="Add acceptance criteria"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCriteria();
                  }
                }}
              />
              <Button type="button" onClick={handleAddCriteria} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.acceptanceCriteria?.map((criteria, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <span className="flex-1">{criteria.text}</span>
                  <Badge variant={criteria.met ? "default" : "outline"}>
                    {criteria.met ? "Met" : "Pending"}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCriteria(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.title?.trim()}>
              {requirement ? "Update Requirement" : "Create Requirement"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
