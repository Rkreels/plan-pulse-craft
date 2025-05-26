
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";
import { Feature } from "@/types";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "sonner";

interface DragData {
  featureId: string;
  sourceStatus: string;
}

interface ColumnProps {
  title: string;
  status: string;
  items: Feature[];
  onFeatureEdit: (feature: Feature) => void;
  onStatusChange: (featureId: string, newStatus: string) => void;
}

const Column: React.FC<ColumnProps> = ({ title, status, items, onFeatureEdit, onStatusChange }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const dragData: DragData = JSON.parse(e.dataTransfer.getData('application/json'));
    if (dragData.sourceStatus !== status) {
      onStatusChange(dragData.featureId, status);
    }
  };

  return (
    <div className="flex flex-col">
      <h3 className="font-medium mb-2 flex items-center justify-between">
        <span>{title}</span>
        <Badge>{items.length}</Badge>
      </h3>
      <div 
        className={`bg-muted rounded-lg p-2 flex-1 h-[calc(100vh-230px)] overflow-y-auto transition-colors ${
          isDragOver ? 'bg-blue-100 border-2 border-blue-300' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {items.length > 0 ? (
          items.map(feature => (
            <DraggableFeatureCard 
              key={feature.id} 
              feature={feature} 
              onEdit={() => onFeatureEdit(feature)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Drop features here
          </div>
        )}
      </div>
    </div>
  );
};

interface FeatureCardProps {
  feature: Feature;
  onEdit: () => void;
}

const DraggableFeatureCard: React.FC<FeatureCardProps> = ({ feature, onEdit }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    const dragData: DragData = {
      featureId: feature.id,
      sourceStatus: feature.status
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <Card 
      className={`mb-2 cursor-move hover:border-primary transition-all ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div className="font-medium text-sm flex-1">{feature.title}</div>
          <div className="flex gap-1 ml-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="h-6 w-6 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
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
            <span>Effort: {feature.effort}</span>
            <span>•</span>
            <span>Value: {feature.value}</span>
          </div>
        </div>
        
        {feature.assignedTo && feature.assignedTo.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            Assigned to {feature.assignedTo.length} member{feature.assignedTo.length !== 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface DraggableFeatureBoardProps {
  features: Feature[];
  onFeatureEdit: (feature: Feature) => void;
}

const DraggableFeatureBoard: React.FC<DraggableFeatureBoardProps> = ({ features, onFeatureEdit }) => {
  const { updateFeature } = useAppContext();

  const handleStatusChange = (featureId: string, newStatus: string) => {
    const feature = features.find(f => f.id === featureId);
    if (feature) {
      const updatedFeature = {
        ...feature,
        status: newStatus as Feature['status'],
        updatedAt: new Date()
      };
      updateFeature(updatedFeature);
      toast.success(`Feature moved to ${newStatus.replace('_', ' ')}`);
    }
  };

  // Feature statuses for Kanban board
  const statusColumns = [
    { status: "idea", title: "Ideas" },
    { status: "backlog", title: "Backlog" },
    { status: "in_progress", title: "In Progress" },
    { status: "review", title: "In Review" },
    { status: "completed", title: "Completed" }
  ];
  
  // Sort features into columns for board view
  const getFeaturesByStatus = (status: string) => {
    return features.filter(feature => feature.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {statusColumns.map(({ status, title }) => (
        <Column 
          key={status} 
          title={title} 
          status={status}
          items={getFeaturesByStatus(status)} 
          onFeatureEdit={onFeatureEdit}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
};

export default DraggableFeatureBoard;
