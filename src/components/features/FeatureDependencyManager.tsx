
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X, Plus, Trash2, AlertCircle } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "sonner";

interface Dependency {
  id: string;
  featureId: string;
  dependsOnId: string;
  type: "blocks" | "required_by" | "related_to";
}

export function FeatureDependencyManager() {
  const { features, updateFeature } = useAppContext();
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [newDependency, setNewDependency] = useState({
    featureId: "",
    dependsOnId: "",
    type: "blocks" as "blocks" | "required_by" | "related_to"
  });
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize dependencies from features
  useEffect(() => {
    const existingDependencies: Dependency[] = [];
    features.forEach(feature => {
      if (feature.dependencies && feature.dependencies.length > 0) {
        feature.dependencies.forEach(depId => {
          existingDependencies.push({
            id: `${feature.id}-${depId}`,
            featureId: feature.id,
            dependsOnId: depId,
            type: "blocks"
          });
        });
      }
    });
    setDependencies(existingDependencies);
  }, [features]);
  
  const handleAddDependency = async () => {
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
    
    setIsLoading(true);
    
    try {
      const dependency: Dependency = {
        id: `${newDependency.featureId}-${newDependency.dependsOnId}`,
        ...newDependency
      };
      
      // Update the feature with the new dependency
      const feature = features.find(f => f.id === newDependency.featureId);
      if (feature) {
        const updatedFeature = {
          ...feature,
          dependencies: [...(feature.dependencies || []), newDependency.dependsOnId],
          updatedAt: new Date()
        };
        updateFeature(updatedFeature);
      }
      
      setDependencies([...dependencies, dependency]);
      setNewDependency({
        featureId: "",
        dependsOnId: "",
        type: "blocks"
      });
      setShowNewForm(false);
      
      toast.success("Dependency added successfully");
    } catch (error) {
      toast.error("Failed to add dependency");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteDependency = async (id: string) => {
    setIsLoading(true);
    
    try {
      const dependency = dependencies.find(d => d.id === id);
      if (dependency) {
        // Update the feature to remove the dependency
        const feature = features.find(f => f.id === dependency.featureId);
        if (feature) {
          const updatedFeature = {
            ...feature,
            dependencies: (feature.dependencies || []).filter(depId => depId !== dependency.dependsOnId),
            updatedAt: new Date()
          };
          updateFeature(updatedFeature);
        }
      }
      
      setDependencies(dependencies.filter(d => d.id !== id));
      toast.success("Dependency removed");
    } catch (error) {
      toast.error("Failed to remove dependency");
    } finally {
      setIsLoading(false);
    }
  };
  
  const getFeatureTitleById = (id: string) => {
    const feature = features.find(f => f.id === id);
    return feature?.title || `Feature ${id}`;
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

  // Get available features for selection - ensure no empty IDs and valid titles
  const availableFeatures = features.filter(f => 
    f.id && 
    f.id.trim() !== "" && 
    f.title && 
    f.title.trim() !== ""
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">Feature Dependencies</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage relationships between features to track blockers and requirements
          </p>
        </div>
        <Button 
          onClick={() => setShowNewForm(true)} 
          disabled={showNewForm || isLoading || availableFeatures.length < 2}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Dependency
        </Button>
      </div>

      {availableFeatures.length < 2 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">You need at least 2 features to create dependencies.</span>
            </div>
          </CardContent>
        </Card>
      )}
      
      {showNewForm && availableFeatures.length >= 2 && (
        <Card className="border-primary">
          <CardHeader className="pb-3">
            <CardTitle>Create Dependency</CardTitle>
            <CardDescription>Define relationships between features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-sm font-medium mb-1 block">Feature</label>
                <Select 
                  value={newDependency.featureId || undefined} 
                  onValueChange={(value) => setNewDependency({ ...newDependency, featureId: value || "" })}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select feature" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFeatures.map((feature) => (
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
                  disabled={isLoading}
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
                  value={newDependency.dependsOnId || undefined} 
                  onValueChange={(value) => setNewDependency({ ...newDependency, dependsOnId: value || "" })}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select feature" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFeatures
                      .filter(feature => feature.id !== newDependency.featureId)
                      .map((feature) => (
                        <SelectItem key={feature.id} value={feature.id}>{feature.title}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 md:col-span-3">
                <Button onClick={handleAddDependency} disabled={isLoading}>
                  <Check className="h-4 w-4 mr-2" />
                  {isLoading ? "Adding..." : "Add Dependency"}
                </Button>
                <Button variant="outline" onClick={() => setShowNewForm(false)} disabled={isLoading}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="mt-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <Select value={selectedFeature || undefined} onValueChange={(value) => setSelectedFeature(value || null)}>
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Filter by feature" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Features</SelectItem>
              {availableFeatures.map((feature) => (
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
                      disabled={isLoading}
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
            {!showNewForm && availableFeatures.length >= 2 && (
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
