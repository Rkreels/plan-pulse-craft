
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
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Pencil, Plus, MoreHorizontal, Trash2, Link, Calendar, DollarSign, User } from "lucide-react";
import { toast } from "sonner";
import { AddEditThemeDialog } from "@/components/dialogs/AddEditThemeDialog";
import { LinkInitiativesDialog } from "@/components/dialogs/LinkInitiativesDialog";
import { useAppContext } from "@/contexts/AppContext";
import { Initiative } from "@/types";
import { format } from "date-fns";

export interface StrategicTheme {
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

export const StrategicThemes = () => {
  const { initiatives } = useAppContext();
  const [themes, setThemes] = useState<StrategicTheme[]>([
    {
      id: 1,
      name: "Customer Delight",
      description: "Focus on creating exceptional customer experiences",
      linkedInitiatives: 3,
      linkedGoals: 2,
      color: "#8B5CF6",
      owner: "Sarah Johnson",
      startDate: new Date("2024-01-15"),
      targetDate: new Date("2024-06-30"),
      status: "active",
      priority: "high",
      successMetrics: "NPS score > 70, Customer satisfaction > 85%",
      budget: 250000
    },
    {
      id: 2,
      name: "Operational Excellence",
      description: "Streamline operations and improve efficiency",
      linkedInitiatives: 2,
      linkedGoals: 4,
      color: "#10B981",
      owner: "Mike Chen",
      startDate: new Date("2024-02-01"),
      targetDate: new Date("2024-08-15"),
      status: "active",
      priority: "medium",
      successMetrics: "Cost reduction by 15%, Process automation 80%",
      budget: 180000
    },
    {
      id: 3,
      name: "Market Leadership",
      description: "Secure and maintain market leadership position",
      linkedInitiatives: 5,
      linkedGoals: 3,
      color: "#F97316",
      owner: "Alex Rivera",
      startDate: new Date("2024-03-01"),
      targetDate: new Date("2024-12-31"),
      status: "planning",
      priority: "critical",
      successMetrics: "Market share > 25%, Revenue growth 40%",
      budget: 500000
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "planning": return "bg-blue-500";
      case "on_hold": return "bg-yellow-500";
      case "completed": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-blue-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
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
          <Card key={theme.id} className="relative">
            <CardHeader className="pb-2" style={{ borderLeft: `4px solid ${theme.color}` }}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{theme.name}</CardTitle>
                    <Badge className={getPriorityColor(theme.priority)}>
                      {theme.priority}
                    </Badge>
                  </div>
                  <CardDescription>{theme.description}</CardDescription>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{theme.owner}</span>
                  </div>
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
            <CardContent className="pt-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(theme.status)}>
                    {theme.status.replace('_', ' ')}
                  </Badge>
                  {theme.budget && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      <span>${(theme.budget / 1000).toFixed(0)}k</span>
                    </div>
                  )}
                </div>

                {(theme.startDate || theme.targetDate) && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    {theme.startDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Start: {format(new Date(theme.startDate), "MMM dd, yyyy")}</span>
                      </div>
                    )}
                    {theme.targetDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Target: {format(new Date(theme.targetDate), "MMM dd, yyyy")}</span>
                      </div>
                    )}
                  </div>
                )}

                {theme.successMetrics && (
                  <div className="text-xs">
                    <div className="font-medium text-muted-foreground mb-1">Success Metrics:</div>
                    <div className="text-muted-foreground">{theme.successMetrics}</div>
                  </div>
                )}

                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Link className="h-4 w-4 mr-1" />
                      Initiatives
                    </span>
                    <Badge variant="outline">{theme.linkedInitiatives}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Link className="h-4 w-4 mr-1" />
                      Goals
                    </span>
                    <Badge variant="outline">{theme.linkedGoals}</Badge>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleLinkToInitiativesClick(theme)}
                  className="w-full"
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
