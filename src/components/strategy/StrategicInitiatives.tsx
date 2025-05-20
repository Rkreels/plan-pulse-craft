
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Pencil, Plus, MoreHorizontal, Trash2 } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "sonner";
import { Initiative } from "@/types";
import { AddEditInitiativeDialog } from "@/components/dialogs/AddEditInitiativeDialog";
import { LinkGoalsDialog } from "@/components/dialogs/LinkGoalsDialog";

export const StrategicInitiatives = () => {
  const { initiatives, addInitiative, updateInitiative, deleteInitiative, linkInitiativeToGoal } = useAppContext();
  
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isLinkGoalsDialogOpen, setIsLinkGoalsDialogOpen] = useState(false);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | undefined>(undefined);

  const handleAddNewClick = () => {
    setSelectedInitiative(undefined);
    setIsAddEditDialogOpen(true);
  };

  const handleEditClick = (initiative: Initiative) => {
    setSelectedInitiative(initiative);
    setIsAddEditDialogOpen(true);
  };

  const handleDeleteClick = (initiativeId: string) => {
    if (window.confirm("Are you sure you want to delete this initiative?")) {
      deleteInitiative(initiativeId);
      toast.success("Initiative deleted successfully");
    }
  };

  const handleLinkToGoalsClick = (initiative: Initiative) => {
    setSelectedInitiative(initiative);
    setIsLinkGoalsDialogOpen(true);
  };

  const handleSaveInitiative = (initiative: Initiative) => {
    if (selectedInitiative) {
      updateInitiative(initiative);
      toast.success("Initiative updated successfully");
    } else {
      addInitiative(initiative);
      toast.success("Initiative created successfully");
    }
  };

  const handleLinkGoals = (goalIds: string[]) => {
    if (!selectedInitiative) return;
    
    // Create a copy of the initiative with updated goals
    const updatedInitiative = {
      ...selectedInitiative,
      goals: goalIds
    };
    
    updateInitiative(updatedInitiative);
    toast.success("Goals linked to initiative successfully");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Strategic Initiatives</h2>
        <Button onClick={handleAddNewClick}>
          <Plus className="h-4 w-4 mr-2" /> New Initiative
        </Button>
      </div>

      {initiatives.length === 0 ? (
        <div className="text-center p-10 border rounded-md">
          <h3 className="font-semibold mb-2">No Strategic Initiatives</h3>
          <p className="text-muted-foreground mb-4">Create your first strategic initiative to start tracking major efforts.</p>
          <Button onClick={handleAddNewClick}>
            <Plus className="h-4 w-4 mr-2" /> New Initiative
          </Button>
        </div>
      ) : (
        initiatives.map(initiative => (
          <Card key={initiative.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle>{initiative.title}</CardTitle>
                  <CardDescription>{initiative.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={initiative.status === "in_progress" ? "default" : "outline"}>
                    {initiative.status.replace('_', ' ')}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(initiative)}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(initiative.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{initiative.progress}%</span>
                </div>
                <Progress value={initiative.progress} className="h-2" />
                <div className="flex justify-between items-center mt-4">
                  <Badge variant="outline">
                    {initiative.goals?.length || 0} Goal{initiative.goals?.length !== 1 ? 's' : ''} Linked
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => handleLinkToGoalsClick(initiative)}>
                    Link to Goals
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <AddEditInitiativeDialog
        open={isAddEditDialogOpen}
        onOpenChange={setIsAddEditDialogOpen}
        initiative={selectedInitiative}
        onSave={handleSaveInitiative}
      />

      {selectedInitiative && (
        <LinkGoalsDialog
          open={isLinkGoalsDialogOpen}
          onOpenChange={setIsLinkGoalsDialogOpen}
          initiativeId={selectedInitiative.id}
          onLink={handleLinkGoals}
        />
      )}
    </div>
  );
};
