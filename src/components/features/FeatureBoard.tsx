
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Feature } from "@/types";
import { useAppContext } from "@/contexts/AppContext";

interface ColumnProps {
  title: string;
  items: Feature[];
  onFeatureEdit: (feature: Feature) => void;
}

const Column: React.FC<ColumnProps> = ({ title, items, onFeatureEdit }) => (
  <div className="flex flex-col">
    <h3 className="font-medium mb-2 flex items-center justify-between">
      <span>{title}</span>
      <Badge>{items.length}</Badge>
    </h3>
    <div className="bg-muted rounded-lg p-2 flex-1 h-[calc(100vh-230px)] overflow-y-auto">
      {items.length > 0 ? (
        items.map(feature => (
          <Card key={feature.id} className="mb-2 cursor-pointer hover:border-primary group">
            <CardContent className="p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-sm flex-1">{feature.title}</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onFeatureEdit(feature);
                  }}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground mt-1 line-clamp-2 mb-2">
                {feature.description}
              </div>
              
              {feature.progress > 0 && (
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{feature.progress}%</span>
                  </div>
                  <Progress value={feature.progress} className="h-1" />
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <Badge 
                  className={
                    feature.priority === "critical" ? "bg-red-500" : 
                    feature.priority === "high" ? "bg-orange-500" : 
                    feature.priority === "medium" ? "bg-blue-500" : "bg-green-500"
                  }
                >
                  {feature.priority}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>E:{feature.effort}</span>
                  <span>•</span>
                  <span>V:{feature.value}</span>
                </div>
              </div>
              
              {feature.assignedTo && feature.assignedTo.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Assigned: {feature.assignedTo.length} member{feature.assignedTo.length !== 1 ? 's' : ''}
                </div>
              )}
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
);

interface FeatureBoardProps {
  features: Feature[];
  onFeatureEdit?: (feature: Feature) => void;
}

const FeatureBoard: React.FC<FeatureBoardProps> = ({ features, onFeatureEdit = () => {} }) => {
  // Feature statuses for Kanban board
  const statusColumns: Record<string, { title: string; items: Feature[] }> = {
    idea: { title: "Ideas", items: [] },
    backlog: { title: "Backlog", items: [] },
    in_progress: { title: "In Progress", items: [] },
    review: { title: "In Review", items: [] },
    completed: { title: "Completed", items: [] }
  };
  
  // Sort features into columns for board view
  features.forEach(feature => {
    const status = feature.status || "idea";
    if (statusColumns[status]) {
      statusColumns[status].items.push(feature);
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {Object.entries(statusColumns).map(([status, column]) => (
        <Column 
          key={status} 
          title={column.title} 
          items={column.items} 
          onFeatureEdit={onFeatureEdit}
        />
      ))}
    </div>
  );
};

export default FeatureBoard;
