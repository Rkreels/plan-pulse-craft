
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
import { Feedback } from "@/types";
import { useAppContext } from "@/contexts/AppContext";

interface AddEditFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback?: Feedback;
  onSave: (feedback: Feedback) => void;
}

export function AddEditFeedbackDialog({ open, onOpenChange, feedback, onSave }: AddEditFeedbackDialogProps) {
  const { currentUser } = useAppContext();
  const [formData, setFormData] = useState<Partial<Feedback>>({
    title: "",
    description: "",
    source: "internal",
    status: "new",
    votes: 0,
    features: [],
    submittedBy: currentUser?.id || "",
    createdAt: new Date(),
    workspaceId: "w1", // Default workspace ID
  });

  // Load feedback data when editing
  useEffect(() => {
    if (feedback) {
      setFormData({
        ...feedback
      });
    } else {
      // Reset form for new feedback
      setFormData({
        title: "",
        description: "",
        source: "internal",
        status: "new",
        votes: 0,
        features: [],
        submittedBy: currentUser?.id || "",
        createdAt: new Date(),
        workspaceId: "w1",
      });
    }
  }, [feedback, currentUser]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const newFeedback = {
      id: feedback?.id || `fb${Date.now()}`, // Generate ID if new
      ...formData,
      votes: Number(formData.votes) || 0,
      features: formData.features || [],
      createdAt: feedback?.createdAt || new Date(),
    } as Feedback;
    
    onSave(newFeedback);
    onOpenChange(false);
  };

  const isFormValid = formData.title && formData.description;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{feedback ? "Edit Feedback" : "Add New Feedback"}</DialogTitle>
          <DialogDescription>
            {feedback ? "Update feedback details" : "Record new product feedback"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Feedback Title</Label>
            <Input 
              id="title"
              value={formData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g., Need better onboarding"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the feedback in detail"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select 
                value={formData.source} 
                onValueChange={(value) => handleChange("source", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="linked">Linked</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="votes">Votes</Label>
            <Input 
              id="votes"
              type="number"
              min="0"
              value={formData.votes || 0}
              onChange={(e) => handleChange("votes", parseInt(e.target.value))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            {feedback ? "Update Feedback" : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
