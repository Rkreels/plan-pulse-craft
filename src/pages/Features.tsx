
import { useState, useMemo } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, List, Kanban, GitBranch } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { AddEditFeatureDialog } from "@/components/dialogs/AddEditFeatureDialog";
import { FeatureCard } from "@/components/features/FeatureCard";
import { Feature } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const Features = () => {
  const { features, epics, addFeature, updateFeature, deleteFeature } = useAppContext();
  const [activeTab, setActiveTab] = useState("list");
  const [newFeatureDialogOpen, setNewFeatureDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | undefined>(undefined);
  
  // Filtering and search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  
  // Filter out ideas - show only actual features
  const featureList = features.filter(feature => feature.status !== "idea");
  
  const filteredFeatures = useMemo(() => {
    let filtered = featureList.filter(feature => {
      const matchesSearch = !searchQuery || 
        feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || feature.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || feature.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
    
    return filtered;
  }, [featureList, searchQuery, statusFilter, priorityFilter]);
  
  const handleAddFeature = (feature: Feature) => {
    const newFeature: Feature = {
      ...feature,
      id: feature.id || uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    addFeature(newFeature);
    toast.success("Feature added successfully");
  };

  const handleEditFeature = (feature: Feature) => {
    setEditingFeature(feature);
  };

  const handleUpdateFeature = (updatedFeature: Feature) => {
    updateFeature(updatedFeature);
    setEditingFeature(undefined);
    toast.success("Feature updated successfully");
  };

  const handleDeleteFeature = (featureId: string) => {
    if (window.confirm("Are you sure you want to delete this feature?")) {
      deleteFeature(featureId);
    }
  };

  const handleStatusChange = (feature: Feature, newStatus: Feature["status"]) => {
    const updatedFeature = {
      ...feature,
      status: newStatus,
      updatedAt: new Date()
    };
    updateFeature(updatedFeature);
    toast.success(`Feature moved to ${newStatus.replace('_', ' ')}`);
  };

  const renderListView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredFeatures.map(feature => (
        <FeatureCard
          key={feature.id}
          feature={feature}
          onEdit={() => handleEditFeature(feature)}
          onDelete={() => handleDeleteFeature(feature.id)}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );

  const renderBoardView = () => {
    const columns = {
      backlog: filteredFeatures.filter(f => f.status === "backlog"),
      planned: filteredFeatures.filter(f => f.status === "planned"),
      in_progress: filteredFeatures.filter(f => f.status === "in_progress"),
      review: filteredFeatures.filter(f => f.status === "review"),
      completed: filteredFeatures.filter(f => f.status === "completed")
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(columns).map(([status, columnFeatures]) => (
          <div key={status} className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold capitalize">{status.replace('_', ' ')}</h3>
              <span className="text-sm text-muted-foreground bg-background px-2 py-1 rounded">
                {columnFeatures.length}
              </span>
            </div>
            <div className="space-y-3">
              {columnFeatures.map(feature => (
                <div key={feature.id} className="bg-background rounded border p-3 cursor-pointer hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-sm mb-2 line-clamp-2">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {feature.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {feature.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {feature.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDependenciesView = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <GitBranch className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Feature Dependencies</h3>
        <p className="text-muted-foreground">
          Manage feature dependencies and relationships
        </p>
      </div>
      
      {filteredFeatures.filter(f => f.dependencies && f.dependencies.length > 0).map(feature => (
        <div key={feature.id} className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">{feature.title}</h4>
          <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
          <div>
            <strong className="text-sm">Dependencies:</strong>
            <div className="mt-2 flex flex-wrap gap-2">
              {feature.dependencies?.map(depId => {
                const depFeature = features.find(f => f.id === depId);
                return depFeature ? (
                  <Badge key={depId} variant="secondary">
                    {depFeature.title}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        </div>
      ))}
      
      {filteredFeatures.filter(f => f.dependencies && f.dependencies.length > 0).length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No feature dependencies found</p>
        </div>
      )}
    </div>
  );
  
  return (
    <>
      <PageTitle
        title="Features"
        description="Manage your product features and track their progress"
      />
      
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start mb-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="backlog">Backlog</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={() => setNewFeatureDialogOpen(true)}>
          <Plus size={16} className="mr-2" />
          New Feature
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="board" className="flex items-center gap-2">
            <Kanban className="h-4 w-4" />
            Board View
          </TabsTrigger>
          <TabsTrigger value="dependencies" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Dependencies
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          {filteredFeatures.length > 0 ? renderListView() : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No features found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || statusFilter !== "all" || priorityFilter !== "all" 
                  ? "Try adjusting your filters"
                  : "Create your first feature to get started"
                }
              </p>
              <Button onClick={() => setNewFeatureDialogOpen(true)}>
                <Plus size={16} className="mr-2" />
                Add New Feature
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="board" className="mt-6">
          {renderBoardView()}
        </TabsContent>
        
        <TabsContent value="dependencies" className="mt-6">
          {renderDependenciesView()}
        </TabsContent>
      </Tabs>
      
      <AddEditFeatureDialog
        open={newFeatureDialogOpen}
        onOpenChange={setNewFeatureDialogOpen}
        onSave={handleAddFeature}
      />

      {editingFeature && (
        <AddEditFeatureDialog
          open={!!editingFeature}
          onOpenChange={(open) => !open && setEditingFeature(undefined)}
          feature={editingFeature}
          onSave={handleUpdateFeature}
        />
      )}
    </>
  );
};

export default Features;
