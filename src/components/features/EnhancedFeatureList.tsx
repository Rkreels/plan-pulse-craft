
import React, { useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, GitPullRequest, Tag, Edit, Trash2 } from "lucide-react";
import { Feature, Epic } from "@/types";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "sonner";

interface EnhancedFeatureListProps {
  features: Feature[];
  epics: Epic[];
  selectedFeatures: string[];
  onSelectFeature: (featureId: string, selected: boolean) => void;
  onEditFeature: (feature: Feature) => void;
  onDeleteFeature: (featureId: string) => void;
}

const EnhancedFeatureList: React.FC<EnhancedFeatureListProps> = ({ 
  features, 
  epics, 
  selectedFeatures,
  onSelectFeature,
  onEditFeature,
  onDeleteFeature
}) => {
  const { updateFeature } = useAppContext();

  // Keyboard shortcuts
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'a':
          event.preventDefault();
          // Select all features
          features.forEach(feature => {
            if (!selectedFeatures.includes(feature.id)) {
              onSelectFeature(feature.id, true);
            }
          });
          break;
        case 'd':
          event.preventDefault();
          // Deselect all
          selectedFeatures.forEach(featureId => {
            onSelectFeature(featureId, false);
          });
          break;
      }
    }
    
    if (event.key === 'Delete' && selectedFeatures.length > 0) {
      event.preventDefault();
      if (window.confirm(`Delete ${selectedFeatures.length} selected feature(s)?`)) {
        selectedFeatures.forEach(featureId => {
          onDeleteFeature(featureId);
        });
      }
    }
  }, [features, selectedFeatures, onSelectFeature, onDeleteFeature]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleToggleComplete = (feature: Feature) => {
    const newStatus = feature.status === 'completed' ? 'in_progress' : 'completed';
    updateFeature({
      ...feature,
      status: newStatus,
      progress: newStatus === 'completed' ? 100 : feature.progress
    });
  };

  if (features.length === 0) {
    return (
      <div className="col-span-3 text-center py-8">
        <h3 className="text-lg font-medium mb-2">No features found</h3>
        <p className="text-muted-foreground mb-4">
          {selectedFeatures.length > 0 ? "No features match your current filters" : "Create your first feature to get started"}
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map(feature => (
        <Card 
          key={feature.id} 
          className={`overflow-hidden transition-all ${
            selectedFeatures.includes(feature.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3 flex-1">
                <Checkbox
                  checked={selectedFeatures.includes(feature.id)}
                  onCheckedChange={(checked) => onSelectFeature(feature.id, !!checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>
                    {feature.description && feature.description.slice(0, 100)}
                    {feature.description && feature.description.length > 100 ? '...' : ''}
                  </CardDescription>
                </div>
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
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEditFeature(feature)}
                className="gap-1"
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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                if (window.confirm('Delete this feature?')) {
                  onDeleteFeature(feature.id);
                }
              }}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={14} />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedFeatureList;
