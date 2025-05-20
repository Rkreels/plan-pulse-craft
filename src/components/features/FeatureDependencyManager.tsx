
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X, Plus, Trash2 } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "sonner";

interface Dependency {
  id: string;
  featureId: string;
  dependsOnId: string;
  type: "blocks" | "required_by" | "related_to";
}

export function FeatureDependencyManager() {
  const { features } = useAppContext();
  const [dependencies, setDependencies] = useState<Dependency[]>([
    {
      id: "d1",
      featureId: features[0]?.id || "f1",
      dependsOnId: features[1]?.id || "f2",
      type: "blocks"
    },
    {
      id: "d2",
      featureId: features[2]?.id || "f3",
      dependsOnId: features[0]?.id || "f1",
      type: "required_by"
    },
    {
      id: "d3",
      featureId: features[1]?.id || "f2",
      dependsOnId: features[3]?.id || "f4",
      type: "related_to"
    }
  ]);
  
  const [newDependency, setNewDependency] = useState({
    featureId: "",
    dependsOnId: "",
    type: "blocks" as "blocks" | "required_by" | "related_to"
  });
  
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  
  const handleAddDependency = () => {
    if (!newDependency.featureId || !newDependency.dependsOnId || !newDependency.type) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (newDependency.featureId === newDependency.dependsOnId) {
      toast.error("A feature cannot depend on itself");
      return;
    }
    
    // Check if this dependency already exists
    const exists = dependencies.some(
      d => d.featureId === newDependency.featureId && 
           d.dependsOnId === newDependency.dependsOnId
    );
    
    if (exists) {
      toast.error("This dependency already exists");
      return;
    }
    
    const dependency: Dependency = {
      id: `d-${Date.now()}`,
      ...newDependency
    };
    
    setDependencies([...dependencies, dependency]);
    setNewDependency({
      featureId: "",
      dependsOnId: "",
      type: "blocks"
    });
    setShowNewForm(false);
    
    toast.success("Dependency added successfully");
  };
  
  const handleDeleteDependency = (id: string) => {
    setDependencies(dependencies.filter(d => d.id !== id));
    toast.success("Dependency removed");
  };
  
  const getFeatureTitleById = (id: string) => {
    const feature = features.find(f => f.id === id);
    return feature?.title || id;
  };

  const getDependencyTypeLabel = (type: string) => {
    switch (type) {
      case "blocks":
        return "blocks";
      case "required_by":
        return "is required by";
      case "related_to":
        return "is related to";
      default:
        return type;
    }
  };
  
  const featureDependencies = selectedFeature 
    ? dependencies.filter(d => d.featureId === selectedFeature || d.dependsOnId === selectedFeature)
    : dependencies;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold">Feature Dependencies</h2>
        <Button onClick={() => setShowNewForm(true)} disabled={showNewForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Dependency
        </Button>
      </div>
      
      <Card className={showNewForm ? "border-primary" : ""}>
        <CardHeader className="pb-3">
          <CardTitle>Create Dependency</CardTitle>
          <CardDescription>Define relationships between features</CardDescription>
        </CardHeader>
        {showNewForm && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-sm font-medium mb-1 block">Feature</label>
                <Select 
                  value={newDependency.featureId} 
                  onValueChange={(value) => setNewDependency({ ...newDependency, featureId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select feature" />
                  </SelectTrigger>
                  <SelectContent>
                    {features.map((feature) => (
                      <SelectItem key={feature.id} value={feature.id}>{feature.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Relationship</label>
                <Select 
                  value={newDependency.type} 
                  onValueChange={(value: "blocks" | "required_by" | "related_to") => 
                    setNewDependency({ ...newDependency, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blocks">Blocks</SelectItem>
                    <SelectItem value="required_by">Is required by</SelectItem>
                    <SelectItem value="related_to">Is related to</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Depends on</label>
                <Select 
                  value={newDependency.dependsOnId} 
                  onValueChange={(value) => setNewDependency({ ...newDependency, dependsOnId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select feature" />
                  </SelectTrigger>
                  <SelectContent>
                    {features
                      .filter(feature => feature.id !== newDependency.featureId)
                      .map((feature) => (
                        <SelectItem key={feature.id} value={feature.id}>{feature.title}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 md:col-span-3">
                <Button onClick={handleAddDependency}>
                  <Check className="h-4 w-4 mr-2" />
                  Add Dependency
                </Button>
                <Button variant="outline" onClick={() => setShowNewForm(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      <div className="mt-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <Select value={selectedFeature || ""} onValueChange={(value) => setSelectedFeature(value || null)}>
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Filter by feature" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Features</SelectItem>
              {features.map((feature) => (
                <SelectItem key={feature.id} value={feature.id}>{feature.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <span className="text-sm text-muted-foreground">
            {featureDependencies.length} dependencies found
          </span>
        </div>
        
        {featureDependencies.length > 0 ? (
          <div className="space-y-3">
            {featureDependencies.map((dependency) => (
              <Card key={dependency.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{getFeatureTitleById(dependency.featureId)}</span>
                      <Badge variant="outline" className="font-normal">
                        {getDependencyTypeLabel(dependency.type)}
                      </Badge>
                      <span className="font-medium">{getFeatureTitleById(dependency.dependsOnId)}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteDependency(dependency.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-10">
            <h3 className="font-semibold mb-2">No dependencies found</h3>
            <p className="text-muted-foreground">
              {selectedFeature ? 
                "This feature has no dependencies" : 
                "Start by adding your first feature dependency"}
            </p>
            {!showNewForm && (
              <Button className="mt-4" onClick={() => setShowNewForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Dependency
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
