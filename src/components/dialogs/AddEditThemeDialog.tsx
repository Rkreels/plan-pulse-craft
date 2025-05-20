
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
import { HexColorPicker } from "react-colorful";
import { useAppContext } from "@/contexts/AppContext";

interface StrategicTheme {
  id: number | string;
  name: string;
  description: string;
  linkedInitiatives: number;
  linkedGoals: number;
  color: string;
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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#8B5CF6");
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (theme) {
      setName(theme.name);
      setDescription(theme.description);
      setColor(theme.color);
    } else {
      setName("");
      setDescription("");
      setColor("#8B5CF6");
    }
  }, [theme, open]);

  const handleSave = () => {
    if (!name) return;

    const updatedTheme: StrategicTheme = {
      id: theme?.id || Date.now(),
      name,
      description,
      color,
      linkedInitiatives: theme?.linkedInitiatives || 0,
      linkedGoals: theme?.linkedGoals || 0,
    };

    onSave(updatedTheme);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{theme ? "Edit" : "Add"} Strategic Theme</DialogTitle>
          <DialogDescription>
            {theme ? "Update the details of this strategic theme." : "Create a new strategic theme to organize initiatives."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter theme name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this theme"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="color">Theme Color</Label>
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-md cursor-pointer border"
                style={{ backgroundColor: color }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              ></div>
              <Input
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="font-mono"
              />
            </div>
            {showColorPicker && (
              <div className="mt-2">
                <HexColorPicker color={color} onChange={setColor} />
              </div>
            )}
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
