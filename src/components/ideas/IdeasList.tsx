
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp } from "lucide-react";
import { Feature } from "@/types";

interface IdeasListProps {
  items: Feature[];
  onEditItem: (item: Feature) => void;
  onDeleteItem: (id: string) => void;
  hasEditPermission: boolean;
  hasDeletePermission: boolean;
  type: "idea" | "backlog";
}

const IdeasList: React.FC<IdeasListProps> = ({ 
  items, onEditItem, onDeleteItem, 
  hasEditPermission, hasDeletePermission,
  type
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">
          {type === "idea" ? "No Ideas Yet" : "Backlog is Empty"}
        </h3>
        <p className="text-muted-foreground">
          {type === "idea" 
            ? "Start adding product ideas that can be evaluated and prioritized."
            : "No features have been moved to the backlog yet."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => (
        <Card key={item.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <Badge>{type === "idea" ? "Idea" : "Backlog"}</Badge>
              <div className="flex items-center gap-2">
                {hasEditPermission && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => onEditItem(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {hasDeletePermission && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
                        onDeleteItem(item.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <h3 className="font-bold text-lg mt-2">{item.title}</h3>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {item.description}
            </p>
          </CardContent>
          <CardFooter className="border-t pt-3 flex justify-between">
            <div className="flex gap-4 text-xs text-muted-foreground">
              <div className="flex items-center">
                <span className="font-medium mr-1">Priority:</span>
                <Badge variant="outline" className="capitalize">{item.priority}</Badge>
              </div>
              <div>
                <span className="font-medium mr-1">Value:</span>
                {item.value}/10
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{item.votes}</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

// Import the UI components
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export default IdeasList;
