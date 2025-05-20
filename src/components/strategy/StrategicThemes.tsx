
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Pencil, Plus, MoreHorizontal, Trash2, Link } from "lucide-react";
import { toast } from "sonner";
import { AddEditThemeDialog } from "@/components/dialogs/AddEditThemeDialog";
import { LinkInitiativesDialog } from "@/components/dialogs/LinkInitiativesDialog";
import { useAppContext } from "@/contexts/AppContext";
import { Initiative } from "@/types";

export interface StrategicTheme {
  id: number | string;
  name: string;
  description: string;
  linkedInitiatives: number;
  linkedGoals: number;
  color: string;
}

export const StrategicThemes = () => {
  const { initiatives } = useAppContext();
  const [themes, setThemes] = useState<StrategicTheme[]>([
    {
      id: 1,
      name: "Customer Delight",
      description: "Focus on creating exceptional customer experiences",
      linkedInitiatives: 3,
      linkedGoals: 2,
      color: "#8B5CF6"
    },
    {
      id: 2,
      name: "Operational Excellence",
      description: "Streamline operations and improve efficiency",
      linkedInitiatives: 2,
      linkedGoals: 4,
      color: "#10B981"
    },
    {
      id: 3,
      name: "Market Leadership",
      description: "Secure and maintain market leadership position",
      linkedInitiatives: 5,
      linkedGoals: 3,
      color: "#F97316"
    }
  ]);

  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<StrategicTheme | undefined>(undefined);
  
  const handleAddNewClick = () => {
    setSelectedTheme(undefined);
    setIsAddEditDialogOpen(true);
  };

  const handleEditClick = (theme: StrategicTheme) => {
    setSelectedTheme(theme);
    setIsAddEditDialogOpen(true);
  };

  const handleDeleteClick = (themeId: number | string) => {
    if (window.confirm("Are you sure you want to delete this theme?")) {
      setThemes(themes.filter(theme => theme.id !== themeId));
      toast.success("Theme deleted successfully");
    }
  };

  const handleSaveTheme = (theme: StrategicTheme) => {
    if (selectedTheme) {
      setThemes(themes.map(t => t.id === theme.id ? theme : t));
      toast.success("Theme updated successfully");
    } else {
      setThemes([...themes, theme]);
      toast.success("Theme created successfully");
    }
  };

  const handleLinkInitiatives = (selectedInitiatives: Initiative[]) => {
    if (!selectedTheme) return;
    
    // In a real app, we would establish a relationship between themes and initiatives
    // For now, we'll just update the count in the theme
    const updatedTheme = {
      ...selectedTheme,
      linkedInitiatives: selectedInitiatives.length,
      linkedGoals: selectedTheme.linkedGoals
    };
    
    setThemes(themes.map(t => t.id === selectedTheme.id ? updatedTheme : t));
    toast.success(`Linked ${selectedInitiatives.length} initiatives to theme`);
  };

  const handleLinkToInitiativesClick = (theme: StrategicTheme) => {
    setSelectedTheme(theme);
    setIsLinkDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Strategic Themes</h2>
        <Button onClick={handleAddNewClick}>
          <Plus className="h-4 w-4 mr-2" /> New Theme
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map(theme => (
          <Card key={theme.id}>
            <CardHeader className="pb-2" style={{ borderLeft: `4px solid ${theme.color}` }}>
              <div className="flex justify-between">
                <div>
                  <CardTitle>{theme.name}</CardTitle>
                  <CardDescription>{theme.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditClick(theme)}>
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(theme.id)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <Link className="h-4 w-4 mr-1" />
                    Linked Initiatives
                  </span>
                  <Badge variant="outline">{theme.linkedInitiatives}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <Link className="h-4 w-4 mr-1" />
                    Linked Goals
                  </span>
                  <Badge variant="outline">{theme.linkedGoals}</Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleLinkToInitiativesClick(theme)}
                >
                  Link to Initiatives
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddEditThemeDialog
        open={isAddEditDialogOpen}
        onOpenChange={setIsAddEditDialogOpen}
        theme={selectedTheme}
        onSave={handleSaveTheme}
      />

      {selectedTheme && (
        <LinkInitiativesDialog
          open={isLinkDialogOpen}
          onOpenChange={setIsLinkDialogOpen}
          themeId={selectedTheme.id}
          onLink={handleLinkInitiatives}
        />
      )}
    </div>
  );
};
