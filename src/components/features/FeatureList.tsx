
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check, GitPullRequest, Tag } from "lucide-react";
import { Feature, Epic } from "@/types";

interface FeatureListProps {
  features: Feature[];
  epics: Epic[];
}

const FeatureList: React.FC<FeatureListProps> = ({ features, epics }) => {
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
      ))}
    </div>
  );
};

export default FeatureList;
