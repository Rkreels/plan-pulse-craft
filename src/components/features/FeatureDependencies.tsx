
import { useState } from "react";
import { Feature } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowRight, Plus, X } from "lucide-react";

// Sample dependency data
interface FeatureDependency {
  id: string;
  sourceFeatureId: string;
  targetFeatureId: string;
  type: "blocks" | "depends_on" | "required_for";
}

export const FeatureDependencies = ({ feature }: { feature: Feature }) => {
  // In a real app, this would be fetched from API
  const mockFeatures: Feature[] = [
    {
      id: "f1",
      title: "Interactive Product Tour",
      description: "Guide users through key features",
      status: "in_progress",
      priority: "high",
      effort: 6,
      value: 8,
      tags: ["onboarding"],
      votes: 24,
      createdAt: new Date(),
      updatedAt: new Date(),
      workspaceId: "w1",
      feedback: [],
    },
    {
      id: "f2",
      title: "Personalized Activity Feed",
      description: "Show users relevant updates",
      status: "planned",
      priority: "medium",
      effort: 7,
      value: 7,
      tags: ["engagement"],
      votes: 18,
      createdAt: new Date(),
      updatedAt: new Date(),
      workspaceId: "w1",
      feedback: [],
    },
    {
      id: "f5",
      title: "Contextual Help System",
      description: "Provide contextual help",
      status: "review",
      priority: "medium",
      effort: 6,
      value: 7,
      tags: ["support"],
      votes: 9,
      createdAt: new Date(),
      updatedAt: new Date(),
      workspaceId: "w1",
      feedback: [],
    },
    {
      id: "f7",
      title: "SAML Single Sign-On",
      description: "Enterprise SSO integration",
      status: "backlog",
      priority: "critical",
      effort: 9,
      value: 10,
      tags: ["security"],
      votes: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
      workspaceId: "w1",
      feedback: [],
    },
  ];

  const [dependencies, setDependencies] = useState<FeatureDependency[]>([
    {
      id: "dep1",
      sourceFeatureId: feature.id,
      targetFeatureId: "f5",
      type: "depends_on",
    },
    {
      id: "dep2",
      sourceFeatureId: feature.id,
      targetFeatureId: "f7",
      type: "depends_on",
    },
    {
      id: "dep3",
      sourceFeatureId: "f2",
      targetFeatureId: feature.id,
      type: "blocks",
    },
  ]);

  const getFeatureById = (id: string) => {
    return mockFeatures.find((f) => f.id === id) || null;
  };

  const handleAddDependency = () => {
    toast.success("Add dependency dialog would open here");
  };

  const handleRemoveDependency = (dependencyId: string) => {
    setDependencies(dependencies.filter(dep => dep.id !== dependencyId));
    toast.success("Dependency removed");
  };

  // Dependencies where this feature depends on other features
  const dependsOn = dependencies.filter(
    (dep) => dep.sourceFeatureId === feature.id && dep.type === "depends_on"
  );

  // Dependencies where other features depend on this feature
  const requiredBy = dependencies.filter(
    (dep) => dep.targetFeatureId === feature.id
  );

  // Features that this feature blocks
  const blocks = dependencies.filter(
    (dep) => dep.sourceFeatureId === feature.id && dep.type === "blocks"
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Feature Dependencies</CardTitle>
            <CardDescription>
              Manage relationships between this feature and others
            </CardDescription>
          </div>
          <Button onClick={handleAddDependency}>
            <Plus className="h-4 w-4 mr-2" />
            Add Dependency
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* This feature depends on */}
          <div>
            <h3 className="text-lg font-medium mb-2">This feature depends on:</h3>
            {dependsOn.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dependsOn.map((dep) => {
                    const targetFeature = getFeatureById(dep.targetFeatureId);
                    if (!targetFeature) return null;

                    return (
                      <TableRow key={dep.id}>
                        <TableCell>{targetFeature.title}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              targetFeature.status === "completed"
                                ? "default"
                                : "outline"
                            }
                          >
                            {targetFeature.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Depends On</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveDependency(dep.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-sm text-muted-foreground py-2">
                This feature doesn't depend on any other features.
              </div>
            )}
          </div>

          {/* Features that depend on this feature */}
          <div>
            <h3 className="text-lg font-medium mb-2">Required by:</h3>
            {requiredBy.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requiredBy.map((dep) => {
                    const sourceFeature = getFeatureById(dep.sourceFeatureId);
                    if (!sourceFeature) return null;

                    return (
                      <TableRow key={dep.id}>
                        <TableCell>{sourceFeature.title}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              sourceFeature.status === "completed"
                                ? "default"
                                : "outline"
                            }
                          >
                            {sourceFeature.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={dep.type === "blocks" ? "bg-red-100 text-red-800" : ""}
                          >
                            {dep.type === "blocks" ? "Blocked By" : "Required By"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveDependency(dep.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-sm text-muted-foreground py-2">
                No other features require this feature.
              </div>
            )}
          </div>
          
          {/* Dependency Graph Visual */}
          {(dependsOn.length > 0 || requiredBy.length > 0) && (
            <div>
              <h3 className="text-lg font-medium mb-2">Dependency Graph</h3>
              <div className="p-4 border rounded-md bg-accent/30">
                <div className="flex flex-col items-center">
                  {dependsOn.length > 0 && (
                    <div className="mb-4 w-full">
                      {dependsOn.map(dep => {
                        const targetFeature = getFeatureById(dep.targetFeatureId);
                        if (!targetFeature) return null;
                        
                        return (
                          <div key={dep.id} className="flex justify-center items-center gap-2 mb-2">
                            <div className="border p-2 rounded-md bg-background w-40 text-center">
                              {targetFeature.title}
                            </div>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <div className="border-2 p-3 rounded-md bg-primary/10 border-primary w-48 text-center font-medium mb-4">
                    {feature.title}
                  </div>
                  
                  {requiredBy.length > 0 && (
                    <div className="w-full">
                      {requiredBy.map(dep => {
                        const sourceFeature = getFeatureById(dep.sourceFeatureId);
                        if (!sourceFeature) return null;
                        
                        return (
                          <div key={dep.id} className="flex justify-center items-center gap-2 mb-2">
                            <ArrowRight className="h-4 w-4" />
                            <div className="border p-2 rounded-md bg-background w-40 text-center">
                              {sourceFeature.title}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
