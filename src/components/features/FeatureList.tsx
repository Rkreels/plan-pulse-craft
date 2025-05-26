
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check, GitPullRequest, Tag, Edit } from "lucide-react";
import { Feature, Epic } from "@/types";
import { useAppContext } from "@/contexts/AppContext";

interface FeatureListProps {
  features: Feature[];
  epics: Epic[];
  onFeatureEdit?: (feature: Feature) => void;
}

const FeatureList: React.FC<FeatureListProps> = ({ features, epics, onFeatureEdit }) => {
  const { updateFeature } = useAppContext();

  const handleToggleComplete = (feature: Feature) => {
    const newStatus = feature.status === 'completed' ? 'in_progress' : 'completed';
    updateFeature({
      ...feature,
      status: newStatus,
      progress: newStatus === 'completed' ? 100 : feature.progress,
      updatedAt: new Date()
    });
  };

  if (features.length === 0) {
    return (
      <div className="col-span-3 text-center py-8">
        <h3 className="text-lg font-medium mb-2">No features yet</h3>
        <p className="text-muted-foreground mb-4">Create your first feature to get started</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map(feature => (
        <Card key={feature.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="mt-1">
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
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{feature.progress || 0}%</span>
            </div>
            <Progress value={feature.progress || 0} className="h-2" />
            
            <div className="flex flex-wrap gap-2">
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

            {feature.tags && feature.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {feature.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {feature.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{feature.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pt-1 gap-2">
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onFeatureEdit?.(feature)}
                className="flex items-center gap-1"
              >
                <Edit size={14} />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleToggleComplete(feature)}
                className="flex items-center gap-1"
              >
                <Check size={14} />
                {feature.status === 'completed' ? 'Reopen' : 'Complete'}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              E:{feature.effort} V:{feature.value}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default FeatureList;
