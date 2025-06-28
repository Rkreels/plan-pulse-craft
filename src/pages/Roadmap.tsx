
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoadmapTimeline } from "@/components/roadmap/RoadmapTimeline";
import { Calendar, Map, Settings, Plus, Filter } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { AddEditRoadmapViewDialog } from "@/components/dialogs/AddEditRoadmapViewDialog";
import { RoadmapView } from "@/types";
import { toast } from "sonner";

const Roadmap = () => {
  const { 
    features, 
    releases, 
    epics, 
    roadmapViews, 
    currentView, 
    setCurrentView,
    updateFeature 
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState("timeline");
  const [newViewDialogOpen, setNewViewDialogOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("6months");
  const [groupBy, setGroupBy] = useState("release");

  // Filter features for roadmap (exclude ideas)
  const roadmapFeatures = features.filter(f => f.status !== "idea");

  const handleViewChange = (viewId: string) => {
    const view = roadmapViews.find(v => v.id === viewId);
    if (view) {
      setCurrentView(view);
      toast.success(`Switched to ${view.name} view`);
    }
  };

  const handleAddView = (view: RoadmapView) => {
    // This would typically call a context method to add the view
    toast.success("New roadmap view created");
  };

  const handleFeatureUpdate = (featureId: string, updates: Partial<any>) => {
    const feature = features.find(f => f.id === featureId);
    if (feature) {
      updateFeature({
        ...feature,
        ...updates,
        updatedAt: new Date()
      });
      toast.success("Feature updated");
    }
  };

  const renderTimelineView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
              <SelectItem value="2years">2 Years</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="release">By Release</SelectItem>
              <SelectItem value="epic">By Epic</SelectItem>
              <SelectItem value="quarter">By Quarter</SelectItem>
              <SelectItem value="theme">By Theme</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      <RoadmapTimeline 
        features={roadmapFeatures}
        releases={releases}
        epics={epics}
        timeRange={timeRange}
        groupBy={groupBy}
        onFeatureUpdate={handleFeatureUpdate}
      />
    </div>
  );

  const renderGanttView = () => (
    <div className="bg-muted/20 rounded-lg p-8 text-center">
      <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Gantt Chart View</h3>
      <p className="text-muted-foreground mb-4">
        Advanced Gantt chart with dependencies and resource allocation
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {roadmapFeatures.slice(0, 6).map(feature => (
          <div key={feature.id} className="bg-background p-4 rounded border">
            <h4 className="font-medium mb-2">{feature.title}</h4>
            <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
            <div className="flex justify-between items-center text-xs">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                {feature.status.replace('_', ' ')}
              </span>
              <span>{feature.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStrategyView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Current Quarter</h3>
          <p className="text-2xl font-bold text-blue-800 mb-2">
            {roadmapFeatures.filter(f => f.status === "in_progress").length}
          </p>
          <p className="text-sm text-blue-700">Features in progress</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">Next Quarter</h3>
          <p className="text-2xl font-bold text-green-800 mb-2">
            {roadmapFeatures.filter(f => f.status === "planned").length}
          </p>
          <p className="text-sm text-green-700">Planned features</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-2">Backlog</h3>
          <p className="text-2xl font-bold text-purple-800 mb-2">
            {roadmapFeatures.filter(f => f.status === "backlog").length}
          </p>
          <p className="text-sm text-purple-700">Backlog items</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background border rounded-lg p-6">
          <h3 className="font-semibold mb-4">High Priority Features</h3>
          <div className="space-y-3">
            {roadmapFeatures
              .filter(f => f.priority === "high" || f.priority === "critical")
              .slice(0, 5)
              .map(feature => (
                <div key={feature.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <div>
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.status.replace('_', ' ')}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    feature.priority === "critical" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"
                  }`}>
                    {feature.priority}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-background border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Recent Updates</h3>
          <div className="space-y-3">
            {roadmapFeatures
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 5)
              .map(feature => (
                <div key={feature.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <div>
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(feature.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {feature.progress}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      <PageTitle
        title="Product Roadmap"
        description="Visualize your product strategy and feature timeline"
      />
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start mb-6">
        <div className="flex gap-4">
          <Select 
            value={currentView?.id || ""} 
            onValueChange={handleViewChange}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              {roadmapViews.map(view => (
                <SelectItem key={view.id} value={view.id}>
                  {view.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={() => setNewViewDialogOpen(true)}>
          <Plus size={16} className="mr-2" />
          New View
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="gantt" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Gantt Chart
          </TabsTrigger>
          <TabsTrigger value="strategy" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Strategy View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="mt-6">
          {renderTimelineView()}
        </TabsContent>
        
        <TabsContent value="gantt" className="mt-6">
          {renderGanttView()}
        </TabsContent>
        
        <TabsContent value="strategy" className="mt-6">
          {renderStrategyView()}
        </TabsContent>
      </Tabs>
      
      <AddEditRoadmapViewDialog
        open={newViewDialogOpen}
        onOpenChange={setNewViewDialogOpen}
        onSave={handleAddView}
      />
    </>
  );
};

export default Roadmap;
