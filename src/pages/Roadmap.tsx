import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { useAppContext } from "@/contexts/AppContext";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddEditRoadmapViewDialog } from "@/components/dialogs/AddEditRoadmapViewDialog";
import { AddEditGoalDialog } from "@/components/dialogs/AddEditGoalDialog";
import { AddEditReleaseDialog } from "@/components/dialogs/AddEditReleaseDialog";
import { RoadmapManagement } from "@/components/roadmap/RoadmapManagement";
import { RoadmapTimeline } from "@/components/roadmap/RoadmapTimeline";
import { RoadmapView, Goal, Release } from "@/types";
import { toast } from "sonner";

const Roadmap = () => {
  const { 
    roadmapViews, 
    currentView, 
    setCurrentView, 
    goals, 
    releases, 
    epics,
    features,
    updateGoal,
    updateRelease
  } = useAppContext();

  const [isAddEditViewDialogOpen, setIsAddEditViewDialogOpen] = useState(false);
  const [selectedView, setSelectedView] = useState<RoadmapView | undefined>(undefined);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>(undefined);
  const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<Release | undefined>(undefined);

  // Helper functions
  const handleAddViewClick = () => {
    setSelectedView(undefined);
    setIsAddEditViewDialogOpen(true);
  };

  const handleEditViewClick = () => {
    setSelectedView(currentView || undefined);
    setIsAddEditViewDialogOpen(true);
  };

  const handleSaveView = (view: RoadmapView) => {
    setCurrentView(view);
    toast.success(selectedView ? "View updated" : "New view created");
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsGoalDialogOpen(true);
  };

  const handleEditRelease = (release: Release) => {
    setSelectedRelease(release);
    setIsReleaseDialogOpen(true);
  };

  const handleSaveGoal = (goal: Goal) => {
    updateGoal(goal);
    setIsGoalDialogOpen(false);
    setSelectedGoal(undefined);
    toast.success("Goal updated successfully");
  };

  const handleSaveRelease = (release: Release) => {
    updateRelease(release);
    setIsReleaseDialogOpen(false);
    setSelectedRelease(undefined);
    toast.success("Release updated successfully");
  };

  // Board view with all roadmap items
  const renderBoardView = () => {
    const allItems = [
      ...goals.map(goal => ({
        id: goal.id,
        title: goal.title,
        description: goal.description,
        status: goal.status === "not_started" ? "planned" as const : 
                goal.status === "at_risk" ? "in_progress" as const : 
                goal.status as "planned" | "in_progress" | "completed",
        type: "goal" as const,
        progress: goal.progress,
        targetDate: goal.targetDate,
        originalItem: goal
      })),
      ...epics.map(epic => ({
        id: epic.id,
        title: epic.title,
        description: epic.description,
        status: epic.status === "backlog" ? "planned" as const : 
                epic.status === "review" ? "in_progress" as const :
                epic.status as "planned" | "in_progress" | "completed",
        type: "epic" as const,
        progress: epic.progress,
        targetDate: epic.targetDate,
        originalItem: epic
      })),
      ...releases.map(release => ({
        id: release.id,
        title: release.name,
        description: release.description,
        status: release.status === "delayed" ? "in_progress" as const : 
                release.status as "planned" | "in_progress" | "completed",
        type: "release" as const,
        progress: 0,
        targetDate: release.releaseDate,
        originalItem: release
      }))
    ];

    const itemsByStatus = {
      "Planned": allItems.filter(item => item.status === "planned"),
      "In Progress": allItems.filter(item => item.status === "in_progress"),
      "Completed": allItems.filter(item => item.status === "completed"),
    };

    return (
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(itemsByStatus).map(([columnName, columnItems]) => (
            <div key={columnName} className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-lg">{columnName}</h3>
                <Badge variant="secondary">{columnItems.length}</Badge>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 flex-1 min-h-[500px] space-y-3">
                {columnItems.map(item => (
                  <Card 
                    key={item.id} 
                    className="cursor-pointer hover:shadow-md transition-all duration-200 border-l-4"
                    style={{
                      borderLeftColor: 
                        item.type === "goal" ? "#3b82f6" :
                        item.type === "epic" ? "#8b5cf6" :
                        "#10b981"
                    }}
                    onClick={() => {
                      if (item.type === "goal") {
                        handleEditGoal(item.originalItem as Goal);
                      } else if (item.type === "release") {
                        handleEditRelease(item.originalItem as Release);
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={
                          item.type === "goal" ? "bg-blue-500 text-white" :
                          item.type === "epic" ? "bg-purple-500 text-white" :
                          "bg-green-500 text-white"
                        }>
                          {item.type}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-sm mb-2 line-clamp-2">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                      
                      {item.type !== "release" && (
                        <div className="space-y-2">
                          <Progress value={item.progress} className="h-2" />
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>{item.progress}% complete</span>
                            {item.targetDate && (
                              <span>{new Date(item.targetDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {item.type === "release" && item.targetDate && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Release: {new Date(item.targetDate).toLocaleDateString()}
                        </div>
                      )}
                      
                      {item.type === "epic" && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {features.filter(f => f.epicId === item.id).length} features
                        </div>
                      )}
                      
                      {item.type === "release" && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {features.filter(f => f.releaseId === item.id).length} features
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {columnItems.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No {columnName.toLowerCase()} items
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title="Product Roadmap"
        description="Strategic view of your product plan with comprehensive roadmap management"
      />
      
      <Tabs defaultValue="board" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="board">Board View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="manage">Manage Items</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Kanban Board View</Badge>
              <span className="text-sm text-muted-foreground">
                Click items to edit
              </span>
            </div>
            <Button onClick={handleAddViewClick}>
              <Plus className="h-4 w-4 mr-2" /> New View
            </Button>
          </div>
          
          {renderBoardView()}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
              <Select
                value={currentView?.id || ""}
                onValueChange={(value) => {
                  const view = roadmapViews.find(v => v.id === value);
                  if (view) setCurrentView(view);
                }}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roadmap Views</SelectLabel>
                    {roadmapViews.map(view => (
                      <SelectItem key={view.id} value={view.id}>
                        {view.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Badge variant="outline" className="capitalize">
                {currentView?.type || "timeline"}
              </Badge>

              <Button variant="outline" size="sm" onClick={handleEditViewClick}>
                <Settings className="h-4 w-4 mr-2" /> Edit view
              </Button>
            </div>

            <Button onClick={handleAddViewClick}>
              <Plus className="h-4 w-4 mr-2" /> New View
            </Button>
          </div>
          
          <RoadmapTimeline
            goals={goals}
            releases={releases}
            epics={epics}
            features={features}
            onEditGoal={handleEditGoal}
            onEditRelease={handleEditRelease}
          />
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <RoadmapManagement />
        </TabsContent>
      </Tabs>

      <AddEditRoadmapViewDialog
        open={isAddEditViewDialogOpen}
        onOpenChange={setIsAddEditViewDialogOpen}
        view={selectedView}
        onSave={handleSaveView}
      />

      <AddEditGoalDialog
        open={isGoalDialogOpen}
        onOpenChange={setIsGoalDialogOpen}
        goal={selectedGoal}
        onSave={handleSaveGoal}
      />

      <AddEditReleaseDialog
        open={isReleaseDialogOpen}
        onOpenChange={setIsReleaseDialogOpen}
        release={selectedRelease}
        onSave={handleSaveRelease}
      />
    </div>
  );
};

export default Roadmap;
