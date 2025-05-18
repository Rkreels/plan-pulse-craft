
import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plus,
  X,
  Link as LinkIcon,
  AlertTriangle,
  AlertCircle,
  Check
} from "lucide-react";
import { Feature } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Add dependency type to the Feature type
interface FeatureWithDependencies extends Feature {
  dependencies?: string[];
  blockedBy?: string[];
}

interface FeatureDependenciesProps {
  featureId: string;
}

export function FeatureDependencies({ featureId }: FeatureDependenciesProps) {
  const { features } = useAppContext();
  const [isAddingDependency, setIsAddingDependency] = useState(false);
  const [dependencyType, setDependencyType] = useState<"dependencies" | "blockedBy">("dependencies");
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  
  // Mock dependencies (in a real implementation, this would be part of the Feature object)
  const currentFeature = features.find(f => f.id === featureId) as FeatureWithDependencies | undefined;
  
  // Mock data - in a real app, these would be stored in the database
  const [featureDependencies, setFeatureDependencies] = useState<Record<string, { dependencies: string[], blockedBy: string[] }>>({
    'f1': { dependencies: ['f2', 'f3'], blockedBy: [] },
    'f2': { dependencies: [], blockedBy: ['f1'] },
    'f3': { dependencies: [], blockedBy: ['f1'] },
    'f4': { dependencies: ['f5'], blockedBy: [] },
    'f5': { dependencies: [], blockedBy: ['f4'] },
  });

  if (!currentFeature) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dependencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Feature not found</div>
        </CardContent>
      </Card>
    );
  }

  // Get dependencies for current feature
  const dependencies = featureDependencies[featureId]?.dependencies || [];
  const blockedBy = featureDependencies[featureId]?.blockedBy || [];
  
  // Features that can be added as dependencies (excluding the current feature and existing dependencies)
  const availableFeatures = features.filter(f => 
    f.id !== featureId && 
    !dependencies.includes(f.id) && 
    !blockedBy.includes(f.id)
  );

  const handleAddDependency = () => {
    if (!selectedFeatureId) return;
    
    // Update the dependency relationships
    if (dependencyType === "dependencies") {
      // This feature depends on the selected feature
      setFeatureDependencies(prev => ({
        ...prev,
        [featureId]: {
          ...prev[featureId] || { dependencies: [], blockedBy: [] },
          dependencies: [...(prev[featureId]?.dependencies || []), selectedFeatureId]
        },
        [selectedFeatureId]: {
          ...prev[selectedFeatureId] || { dependencies: [], blockedBy: [] },
          blockedBy: [...(prev[selectedFeatureId]?.blockedBy || []), featureId]
        }
      }));
      
      toast.success("Dependency added successfully");
    } else {
      // This feature is blocked by the selected feature
      setFeatureDependencies(prev => ({
        ...prev,
        [featureId]: {
          ...prev[featureId] || { dependencies: [], blockedBy: [] },
          blockedBy: [...(prev[featureId]?.blockedBy || []), selectedFeatureId]
        },
        [selectedFeatureId]: {
          ...prev[selectedFeatureId] || { dependencies: [], blockedBy: [] },
          dependencies: [...(prev[selectedFeatureId]?.dependencies || []), featureId]
        }
      }));
      
      toast.success("Blocker added successfully");
    }
    
    setIsAddingDependency(false);
    setSelectedFeatureId(null);
  };

  const handleRemoveDependency = (dependencyId: string, type: "dependencies" | "blockedBy") => {
    // Update the dependency relationships
    if (type === "dependencies") {
      setFeatureDependencies(prev => ({
        ...prev,
        [featureId]: {
          ...prev[featureId] || { dependencies: [], blockedBy: [] },
          dependencies: prev[featureId]?.dependencies.filter(id => id !== dependencyId) || []
        },
        [dependencyId]: {
          ...prev[dependencyId] || { dependencies: [], blockedBy: [] },
          blockedBy: prev[dependencyId]?.blockedBy.filter(id => id !== featureId) || []
        }
      }));
    } else {
      setFeatureDependencies(prev => ({
        ...prev,
        [featureId]: {
          ...prev[featureId] || { dependencies: [], blockedBy: [] },
          blockedBy: prev[featureId]?.blockedBy.filter(id => id !== dependencyId) || []
        },
        [dependencyId]: {
          ...prev[dependencyId] || { dependencies: [], blockedBy: [] },
          dependencies: prev[dependencyId]?.dependencies.filter(id => id !== featureId) || []
        }
      }));
    }
    
    toast.success("Dependency removed");
  };
  
  // Get the full feature objects for dependencies and blockedBy
  const dependencyFeatures = features.filter(f => dependencies.includes(f.id));
  const blockerFeatures = features.filter(f => blockedBy.includes(f.id));

  // Check if there are any blocked dependencies that would prevent this feature from starting
  const hasDependencyIssues = blockerFeatures.some(f => 
    f.status === 'idea' || f.status === 'backlog' || f.status === 'planned'
  );

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Dependencies</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setDependencyType("dependencies");
                setIsAddingDependency(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          {hasDependencyIssues && (
            <div className="flex items-center gap-2 mt-1 text-amber-500">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-xs">This feature is blocked by unresolved dependencies</p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {dependencies.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No dependencies for this feature
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">This feature depends on:</h4>
              {dependencyFeatures.map(feature => (
                <div key={feature.id} className="flex items-center justify-between bg-muted/50 px-2 py-1 rounded-md">
                  <div className="flex gap-2 items-center">
                    {feature.status === 'completed' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                    <span className="text-sm">{feature.title}</span>
                    <Badge className="ml-auto" variant="outline">
                      {feature.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6"
                    onClick={() => handleRemoveDependency(feature.id, "dependencies")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Blocking features:</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setDependencyType("blockedBy");
                  setIsAddingDependency(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            {blockedBy.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No features are blocked by this one
              </div>
            ) : (
              <div className="space-y-2">
                {blockerFeatures.map(feature => (
                  <div key={feature.id} className="flex items-center justify-between bg-muted/50 px-2 py-1 rounded-md">
                    <div className="flex flex-1 gap-2 items-center">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{feature.title}</span>
                      <Badge className="ml-auto" variant="outline">
                        {feature.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6"
                      onClick={() => handleRemoveDependency(feature.id, "blockedBy")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddingDependency} onOpenChange={setIsAddingDependency}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dependencyType === "dependencies" 
                ? "Add Dependency" 
                : "Add Blocker"}
            </DialogTitle>
            <DialogDescription>
              {dependencyType === "dependencies"
                ? "Select a feature that this feature depends on."
                : "Select a feature that is blocked by this feature."}
            </DialogDescription>
          </DialogHeader>
          
          <Command className="border rounded-md">
            <CommandInput placeholder="Search features..." />
            <CommandList>
              <CommandEmpty>No features found.</CommandEmpty>
              <CommandGroup>
                {availableFeatures.map(feature => (
                  <CommandItem
                    key={feature.id}
                    onSelect={() => setSelectedFeatureId(feature.id)}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer",
                      selectedFeatureId === feature.id ? "bg-accent" : ""
                    )}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      feature.priority === "critical" ? "bg-red-500" :
                      feature.priority === "high" ? "bg-amber-500" :
                      feature.priority === "medium" ? "bg-blue-500" :
                      "bg-slate-500"
                    }`} />
                    <span>{feature.title}</span>
                    <Badge className="ml-auto" variant="outline">
                      {feature.status.replace('_', ' ')}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingDependency(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddDependency}
              disabled={!selectedFeatureId}
            >
              Add {dependencyType === "dependencies" ? "Dependency" : "Blocker"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
