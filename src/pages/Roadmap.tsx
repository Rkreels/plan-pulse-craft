
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
import { BarChart3, Plus, Settings, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddEditRoadmapViewDialog } from "@/components/dialogs/AddEditRoadmapViewDialog";
import { RoadmapView } from "@/types";
import { toast } from "sonner";

const Roadmap = () => {
  const { 
    roadmapViews, 
    currentView, 
    setCurrentView, 
    goals, 
    initiatives, 
    releases, 
    epics,
    features
  } = useAppContext();

  const [isAddEditViewDialogOpen, setIsAddEditViewDialogOpen] = useState(false);
  const [selectedView, setSelectedView] = useState<RoadmapView | undefined>(undefined);

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

  // Get actual feature count for an epic
  const getEpicFeatureCount = (epicId: string) => {
    return features.filter(feature => feature.epicId === epicId).length;
  };

  // Get actual epic feature count
  const getReleaseFeatureCount = (releaseId: string) => {
    return features.filter(feature => feature.releaseId === releaseId).length;
  };

  // Apply view filters if any
  const getFilteredData = () => {
    let filteredEpics = [...epics];
    let filteredGoals = [...goals];
    let filteredReleases = [...releases];

    if (currentView?.filters) {
      currentView.filters.forEach(filter => {
        switch (filter.field) {
          case 'status':
            filteredEpics = filteredEpics.filter(epic => epic.status === filter.value);
            filteredGoals = filteredGoals.filter(goal => goal.status === filter.value);
            filteredReleases = filteredReleases.filter(release => release.status === filter.value);
            break;
          case 'priority':
            // Could filter by priority if we add priority to epics/goals
            break;
        }
      });
    }

    return { filteredEpics, filteredGoals, filteredReleases };
  };

  // Simple timeline view of goals, epics, and releases
  const renderTimelineView = () => {
    const { filteredEpics, filteredGoals, filteredReleases } = getFilteredData();

    // Sort items by date
    const sortedGoals = [...filteredGoals].sort((a, b) => {
      const dateA = a.targetDate ? new Date(a.targetDate).getTime() : 0;
      const dateB = b.targetDate ? new Date(b.targetDate).getTime() : 0;
      return dateA - dateB;
    });
    
    const sortedReleases = [...filteredReleases].sort((a, b) => {
      return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
    });
    
    // Create quarters for the next 12 months
    const now = new Date();
    const quarters = [];
    
    for (let i = 0; i < 4; i++) {
      const quarterStart = new Date(now);
      quarterStart.setMonth(now.getMonth() + i * 3);
      quarterStart.setDate(1);
      
      const quarterEnd = new Date(quarterStart);
      quarterEnd.setMonth(quarterStart.getMonth() + 3);
      quarterEnd.setDate(0);
      
      quarters.push({
        name: `Q${Math.floor((quarterStart.getMonth() + 3) / 3)}/${quarterStart.getFullYear()}`,
        start: quarterStart,
        end: quarterEnd
      });
    }
    
    return (
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
          {quarters.map((quarter, i) => (
            <div key={i} className="px-4 py-2 bg-muted rounded-md text-center">
              <h3 className="font-medium">{quarter.name}</h3>
            </div>
          ))}
        </div>
        
        <div className="space-y-8 mt-6">
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge className="bg-primary">Goals</Badge>
              Strategic Goals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {quarters.map((quarter, i) => (
                <div key={i} className="border rounded-md p-3 h-full">
                  {sortedGoals
                    .filter(g => {
                      if (!g.targetDate) return i === 0;
                      const targetDate = new Date(g.targetDate);
                      return targetDate >= quarter.start && targetDate <= quarter.end;
                    })
                    .map(goal => (
                      <div key={goal.id} className="mb-2 p-2 bg-background rounded-md border group cursor-pointer hover:border-primary">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-sm flex-1">{goal.title}</div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                          <span>{goal.status.replace('_', ' ')}</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-1 mt-1" />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge className="bg-green-600">Releases</Badge>
              Product Releases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {quarters.map((quarter, i) => (
                <div key={i} className="border rounded-md p-3 h-full">
                  {sortedReleases
                    .filter(r => {
                      const releaseDate = new Date(r.releaseDate);
                      return releaseDate >= quarter.start && releaseDate <= quarter.end;
                    })
                    .map(release => (
                      <div key={release.id} className="mb-2 p-2 bg-background rounded-md border group cursor-pointer hover:border-primary">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-sm flex-1">
                            {release.name} <span className="text-xs">v{release.version}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-1 text-xs">
                          <Badge className={
                            release.status === "completed" ? "bg-green-500" :
                            release.status === "in_progress" ? "bg-blue-500" :
                            release.status === "delayed" ? "bg-red-500" :
                            "bg-slate-500"
                          }>
                            {release.status}
                          </Badge>
                          <span className="text-muted-foreground">{getReleaseFeatureCount(release.id)} features</span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {new Date(release.releaseDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge className="bg-blue-600">Epics</Badge>
              Development Epics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {quarters.map((quarter, i) => (
                <div key={i} className="border rounded-md p-3 h-full">
                  {filteredEpics
                    .filter(e => {
                      if (!e.targetDate) return i === 0;
                      const targetDate = new Date(e.targetDate);
                      return targetDate >= quarter.start && targetDate <= quarter.end;
                    })
                    .map(epic => {
                      const featureCount = getEpicFeatureCount(epic.id);
                      return (
                        <div key={epic.id} className="mb-2 p-2 bg-background rounded-md border group cursor-pointer hover:border-primary">
                          <div className="flex justify-between items-start">
                            <div className="font-medium text-sm flex-1">{epic.title}</div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                            <span>{epic.status.replace('_', ' ')}</span>
                            <span>{featureCount} feature{featureCount !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{epic.progress}%</span>
                          </div>
                          <Progress value={epic.progress} className="h-1 mt-1" />
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Board view
  const renderBoardView = () => {
    const { filteredEpics } = getFilteredData();

    const epicsByStatus = {
      "Planned": filteredEpics.filter(epic => epic.status === "planned" || epic.status === "backlog"),
      "In Progress": filteredEpics.filter(epic => epic.status === "in_progress"),
      "Review": filteredEpics.filter(epic => epic.status === "review"),
      "Completed": filteredEpics.filter(epic => epic.status === "completed"),
    };

    return (
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(epicsByStatus).map(([columnName, columnEpics]) => (
            <div key={columnName} className="flex flex-col">
              <h3 className="font-semibold mb-2 px-2">{columnName} <Badge>{columnEpics.length}</Badge></h3>
              <div className="bg-muted rounded-md p-2 flex-1 min-h-[200px]">
                {columnEpics.map(epic => {
                  const featureCount = getEpicFeatureCount(epic.id);
                  return (
                    <Card key={epic.id} className="mb-2 cursor-pointer hover:border-primary group">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-sm flex-1">{epic.title}</div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {featureCount} feature{featureCount !== 1 ? 's' : ''}
                        </div>
                        <Progress value={epic.progress} className="h-1 mt-2" />
                        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                          <span>{epic.progress}%</span>
                          {epic.targetDate && (
                            <span>{new Date(epic.targetDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <PageTitle
        title="Product Roadmap"
        description="Strategic view of your product plan"
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
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
      
      {currentView?.type === 'board' ? renderBoardView() : renderTimelineView()}

      <AddEditRoadmapViewDialog
        open={isAddEditViewDialogOpen}
        onOpenChange={setIsAddEditViewDialogOpen}
        view={selectedView}
        onSave={handleSaveView}
      />
    </>
  );
};

export default Roadmap;
