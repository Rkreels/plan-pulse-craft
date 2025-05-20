
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Feature } from "@/types";
import { useAppContext } from "@/contexts/AppContext";
import { ChevronRight, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export const FeatureDependencies = () => {
  const { features, addFeature, updateFeature } = useAppContext();
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  
  // This is a simplified version for demo purposes.
  // In a real application, more complex logic would handle actual dependencies.
  
  const createDemoFeature = () => {
    const newFeature: Feature = {
      id: uuidv4(),
      title: "New Dependency Feature",
      description: "This is a demo dependency feature",
      status: "not_started",
      priority: "medium",
      progress: 0, // Added progress
      effort: 5,
      value: 7,
      tags: ["dependency", "demo"],
      votes: 0,
      feedback: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      workspaceId: "w1",
      dependencies: [],
      assignedTo: []
    };
    
    addFeature(newFeature);
  };
  
  // Example features for the demo
  const demoFeatures = [
    {
      id: "dep1",
      title: "API Integration",
      description: "Integrate with third-party payment API",
      status: "in_progress",
      priority: "high",
      effort: 8,
      value: 9,
      progress: 50, // Added progress
      tags: ["backend", "api"],
      votes: 12,
      createdAt: new Date(),
      updatedAt: new Date(),
      workspaceId: "w1",
      feedback: [],
      dependencies: []
    },
    {
      id: "dep2",
      title: "User Authentication",
      description: "Implement OAuth 2.0 authentication",
      status: "planned",
      priority: "medium",
      effort: 6,
      value: 8,
      progress: 0, // Added progress
      tags: ["security", "backend"],
      votes: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
      workspaceId: "w1",
      feedback: [],
      dependencies: []
    },
    {
      id: "dep3",
      title: "Frontend Validation",
      description: "Add form validation on the client side",
      status: "review",
      priority: "medium",
      effort: 4,
      value: 6,
      progress: 90, // Added progress
      tags: ["frontend", "ux"],
      votes: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      workspaceId: "w1",
      feedback: [],
      dependencies: []
    },
    {
      id: "dep4",
      title: "Admin Dashboard",
      description: "Create admin dashboard for user management",
      status: "backlog",
      priority: "critical",
      effort: 10,
      value: 10,
      progress: 0, // Added progress
      tags: ["admin", "dashboard"],
      votes: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
      workspaceId: "w1",
      feedback: [],
      dependencies: []
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Feature Dependencies</h3>
        <Button onClick={createDemoFeature}>
          <Plus className="h-4 w-4 mr-2" />
          Add Dependency
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demoFeatures.map((feature) => (
          <Card 
            key={feature.id} 
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setSelectedFeature(feature)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <Badge>{feature.priority}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
              <div className="flex gap-2">
                {feature.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {features.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Project Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.slice(0, 4).map((feature) => (
              <Card 
                key={feature.id} 
                className="cursor-pointer hover:border-primary transition-colors"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <Badge>{feature.priority}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
