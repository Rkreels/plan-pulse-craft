
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { HexColorPicker } from "react-colorful";
import { useAppContext } from "@/contexts/AppContext";

interface StrategicTheme {
  id: number | string;
  name: string;
  description: string;
  linkedInitiatives: number;
  linkedGoals: number;
  color: string;
  owner?: string;
  startDate?: Date;
  targetDate?: Date;
  status: "planning" | "active" | "on_hold" | "completed";
  priority: "low" | "medium" | "high" | "critical";
  successMetrics?: string;
  budget?: number;
}

interface AddEditThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme?: StrategicTheme;
  onSave: (theme: StrategicTheme) => void;
}

export function AddEditThemeDialog({
  open,
  onOpenChange,
  theme,
  onSave,
}: AddEditThemeDialogProps) {
  const { currentUser } = useAppContext();
  const [formData, setFormData] = useState<Partial<StrategicTheme>>({
    name: "",
    description: "",
    color: "#8B5CF6",
    owner: currentUser?.id || "",
    status: "planning",
    priority: "medium",
    successMetrics: "",
    budget: 0,
  });
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (theme) {
      setFormData(theme);
    } else {
      setFormData({
        name: "",
        description: "",
        color: "#8B5CF6",
        owner: currentUser?.id || "",
        status: "planning",
        priority: "medium",
        successMetrics: "",
        budget: 0,
      });
    }
  }, [theme, open, currentUser]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name) return;

    const updatedTheme: StrategicTheme = {
      id: theme?.id || Date.now(),
      name: formData.name,
      description: formData.description || "",
      color: formData.color || "#8B5CF6",
      linkedInitiatives: theme?.linkedInitiatives || 0,
      linkedGoals: theme?.linkedGoals || 0,
      owner: formData.owner || "",
      startDate: formData.startDate,
      targetDate: formData.targetDate,
      status: formData.status || "planning",
      priority: formData.priority || "medium",
      successMetrics: formData.successMetrics || "",
      budget: formData.budget || 0,
    };

    onSave(updatedTheme);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{theme ? "Edit" : "Add"} Strategic Theme</DialogTitle>
          <DialogDescription>
            {theme ? "Update the details of this strategic theme." : "Create a new strategic theme to organize initiatives."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter theme name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="owner">Owner</Label>
              <Input
                id="owner"
                value={formData.owner || ""}
                onChange={(e) => handleChange("owner", e.target.value)}
                placeholder="Theme owner"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe this theme"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => handleChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(new Date(formData.startDate), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate ? new Date(formData.startDate) : undefined}
                    onSelect={(date) => handleChange("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label>Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.targetDate ? format(new Date(formData.targetDate), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.targetDate ? new Date(formData.targetDate) : undefined}
                    onSelect={(date) => handleChange("targetDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="successMetrics">Success Metrics</Label>
            <Textarea
              id="successMetrics"
              value={formData.successMetrics || ""}
              onChange={(e) => handleChange("successMetrics", e.target.value)}
              placeholder="Define how success will be measured"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget || 0}
                onChange={(e) => handleChange("budget", Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">Theme Color</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-md cursor-pointer border"
                  style={{ backgroundColor: formData.color }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                ></div>
                <Input
                  id="color"
                  value={formData.color || ""}
                  onChange={(e) => handleChange("color", e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>
          </div>

          {showColorPicker && (
            <div className="mt-2">
              <HexColorPicker 
                color={formData.color} 
                onChange={(color) => handleChange("color", color)} 
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!formData.name}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
