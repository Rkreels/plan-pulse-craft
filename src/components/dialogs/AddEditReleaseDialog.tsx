
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
import { Release } from "@/types";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface AddEditReleaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  release?: Release;
  onSave: (release: Release) => void;
}

export function AddEditReleaseDialog({ open, onOpenChange, release, onSave }: AddEditReleaseDialogProps) {
  const [formData, setFormData] = useState<Partial<Release>>({
    name: "",
    description: "",
    status: "planned",
    version: "",
    releaseDate: new Date(),
    features: [],
    epics: [],
    workspaceId: "w1", // Default workspace ID
    notes: "", // Added notes field
  });

  // Load release data when editing
  useEffect(() => {
    if (release) {
      setFormData({
        ...release,
        releaseDate: new Date(release.releaseDate)
      });
    } else {
      // Reset form for new release
      setFormData({
        name: "",
        description: "",
        status: "planned",
        version: "",
        releaseDate: new Date(),
        features: [],
        epics: [],
        workspaceId: "w1",
        notes: "",
      });
    }
  }, [release]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const newRelease = {
      id: release?.id || `r${Date.now()}`, // Generate ID if new
      ...formData,
      features: formData.features || [],
      epics: formData.epics || [],
    } as Release;
    
    onSave(newRelease);
    onOpenChange(false);
  };

  const isFormValid = formData.name && formData.description && formData.version;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{release ? "Edit Release" : "Add New Release"}</DialogTitle>
          <DialogDescription>
            {release ? "Update release details" : "Schedule a new product release"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Release Name</Label>
            <Input 
              id="name"
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g., Spring Release 2023"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input 
              id="version"
              value={formData.version || ""}
              onChange={(e) => handleChange("version", e.target.value)}
              placeholder="e.g., 2.5.0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the release and its key features"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Release Notes</Label>
            <Textarea 
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Detailed notes about changes in this release"
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
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseDate">Release Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.releaseDate ? format(new Date(formData.releaseDate), "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(formData.releaseDate || new Date())}
                    onSelect={(date) => date && handleChange("releaseDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            {release ? "Update Release" : "Create Release"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
