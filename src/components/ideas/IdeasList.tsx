
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Edit, Trash2 } from "lucide-react";
import { Feature } from "@/types";

interface IdeasListProps {
  items: Feature[];
  onEditItem: (item: Feature) => void;
  onDeleteItem: (id: string) => void;
  onVoteItem: (item: Feature) => void;
  hasEditPermission: boolean;
  hasDeletePermission: boolean;
  type: "idea" | "backlog";
}

const IdeasList: React.FC<IdeasListProps> = ({ 
  items, 
  onEditItem, 
  onDeleteItem, 
  onVoteItem,
  hasEditPermission, 
  hasDeletePermission,
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-blue-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => (
        <Card key={item.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Badge variant="outline">{type === "idea" ? "Idea" : "Backlog"}</Badge>
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
                    className="h-8 w-8 text-red-500 hover:text-red-700"
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
            <h3 className="font-bold text-lg mt-2 line-clamp-2">{item.title}</h3>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {item.description}
            </p>
            {item.userStory && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded mb-2">
                <strong>User Story:</strong> {item.userStory}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-3 flex justify-between items-center">
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="font-medium">Priority:</span>
                <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Value:</span>
                <span>{item.value}/10</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Effort:</span>
                <span>{item.effort}/10</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onVoteItem(item)}
                className="flex items-center gap-1"
              >
                <ThumbsUp className="h-3 w-3" />
                <span className="font-medium">{item.votes || 0}</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default IdeasList;
