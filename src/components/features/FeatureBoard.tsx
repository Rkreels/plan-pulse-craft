
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Feature } from "@/types";

interface ColumnProps {
  title: string;
  items: Feature[];
}

const Column: React.FC<ColumnProps> = ({ title, items }) => (
  <div className="flex flex-col">
    <h3 className="font-medium mb-2 flex items-center justify-between">
      <span>{title}</span>
      <Badge>{items.length}</Badge>
    </h3>
    <div className="bg-muted rounded-lg p-2 flex-1 h-[calc(100vh-230px)] overflow-y-auto">
      {items.length > 0 ? (
        items.map(feature => (
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
);

interface FeatureBoardProps {
  features: Feature[];
}

const FeatureBoard: React.FC<FeatureBoardProps> = ({ features }) => {
  // Feature statuses for Kanban board
  const statusColumns: Record<string, { title: string; items: Feature[] }> = {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Object.entries(statusColumns).map(([status, column]) => (
        <Column key={status} title={column.title} items={column.items} />
      ))}
    </div>
  );
};

export default FeatureBoard;
