
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { FeatureDependencyManager } from "@/components/features/FeatureDependencyManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, GitPullRequest, Plus, Tag } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { Feature } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Features = () => {
  const [activeTab, setActiveTab] = useState("list");
  const { features, epics, addFeature } = useAppContext();
  const [newFeatureDialogOpen, setNewFeatureDialogOpen] = useState(false);
  const [newFeature, setNewFeature] = useState({
    title: "",
    description: "",
    status: "not_started",
    priority: "medium",
    epicId: ""
  });
  
  // Feature statuses for Kanban board
  const statusColumns = {
    not_started: { title: "Not Started", items: [] },
    in_progress: { title: "In Progress", items: [] },
    review: { title: "In Review", items: [] },
    completed: { title: "Completed", items: [] }
  };
  
  // Sort features into columns for board view
  features.forEach(feature => {
    const status = feature.status || "not_started";
    if (statusColumns[status]) {
      statusColumns[status].items.push(feature);
    }
  });
  
  const handleAddFeature = () => {
    const feature: Feature = {
      id: uuidv4(),
      title: newFeature.title,
      description: newFeature.description,
      status: newFeature.status,
      priority: newFeature.priority,
      epicId: newFeature.epicId || undefined,
      assignedTo: [],
      dependencies: [],
      createdAt: new Date(),
      progress: 0,
      workspaceId: "workspace-1"
    };
    
    addFeature(feature);
    setNewFeature({
      title: "",
      description: "",
      status: "not_started",
      priority: "medium",
      epicId: ""
    });
    setNewFeatureDialogOpen(false);
  };
  
  return (
    <>
      <PageTitle
        title="Feature Management"
        description="Manage product features and their dependencies"
      />
      
      <div className="flex justify-between items-center my-4">
        <div></div>
        <Dialog open={newFeatureDialogOpen} onOpenChange={setNewFeatureDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              New Feature
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Feature</DialogTitle>
              <DialogDescription>
                Create a new feature for your product. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="feature-title">Title</Label>
                <Input
                  id="feature-title"
                  value={newFeature.title}
                  onChange={e => setNewFeature({...newFeature, title: e.target.value})}
                  placeholder="Feature title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="feature-desc">Description</Label>
                <Textarea
                  id="feature-desc"
                  value={newFeature.description}
                  onChange={e => setNewFeature({...newFeature, description: e.target.value})}
                  placeholder="Describe the feature"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="feature-status">Status</Label>
                  <Select 
                    value={newFeature.status}
                    onValueChange={value => setNewFeature({...newFeature, status: value})}
                  >
                    <SelectTrigger id="feature-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_started">Not Started</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="review">In Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="feature-priority">Priority</Label>
                  <Select 
                    value={newFeature.priority}
                    onValueChange={value => setNewFeature({...newFeature, priority: value})}
                  >
                    <SelectTrigger id="feature-priority">
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
              <div className="grid gap-2">
                <Label htmlFor="feature-epic">Epic</Label>
                <Select 
                  value={newFeature.epicId}
                  onValueChange={value => setNewFeature({...newFeature, epicId: value})}
                >
                  <SelectTrigger id="feature-epic">
                    <SelectValue placeholder="Select an epic (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {epics.map(epic => (
                      <SelectItem key={epic.id} value={epic.id}>
                        {epic.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewFeatureDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleAddFeature} disabled={!newFeature.title}>
                Add Feature
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs 
        defaultValue="list" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="list">Feature List</TabsTrigger>
          <TabsTrigger value="board">Kanban Board</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.length > 0 ? (
                features.map(feature => (
                  <Card key={feature.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <CardDescription>
                            {feature.description && feature.description.slice(0, 100)}
                            {feature.description && feature.description.length > 100 ? '...' : ''}
                          </CardDescription>
                        </div>
                        <Badge 
                          className={
                            feature.priority === "critical" ? "bg-red-500" : 
                            feature.priority === "high" ? "bg-orange-500" : 
                            feature.priority === "medium" ? "bg-blue-500" : "bg-green-500"
                          }
                        >
                          {feature.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{feature.progress || 0}%</span>
                      </div>
                      <Progress value={feature.progress || 0} className="h-2" />
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {feature.epicId && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <GitPullRequest size={12} />
                            {epics.find(e => e.id === feature.epicId)?.title || 'Epic'}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Tag size={12} />
                          {feature.status?.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-1">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Check size={14} />
                        {feature.status === 'completed' ? 'Reopen' : 'Complete'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <h3 className="text-lg font-medium mb-2">No features yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first feature to get started</p>
                  <Button onClick={() => setNewFeatureDialogOpen(true)}>
                    <Plus size={16} className="mr-2" /> 
                    Add Feature
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="board" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(statusColumns).map(([status, column]) => (
              <div key={status} className="flex flex-col">
                <h3 className="font-medium mb-2 flex items-center justify-between">
                  <span>{column.title}</span>
                  <Badge>{column.items.length}</Badge>
                </h3>
                <div className="bg-muted rounded-lg p-2 flex-1 h-[calc(100vh-230px)] overflow-y-auto">
                  {column.items.length > 0 ? (
                    column.items.map(feature => (
                      <Card key={feature.id} className="mb-2 cursor-pointer hover:border-primary">
                        <CardContent className="p-3">
                          <div className="font-medium text-sm">{feature.title}</div>
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {feature.description}
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <Badge 
                              className={
                                feature.priority === "critical" ? "bg-red-500" : 
                                feature.priority === "high" ? "bg-orange-500" : 
                                feature.priority === "medium" ? "bg-blue-500" : "bg-green-500"
                              }
                            >
                              {feature.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(feature.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No features here
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="dependencies" className="space-y-4">
          <FeatureDependencyManager />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Features;
