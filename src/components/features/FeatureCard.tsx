
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  Target,
  Star,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Feature } from "@/types";

interface FeatureCardProps {
  feature: Feature;
  onEdit: (feature: Feature) => void;
  onDelete: (id: string) => void;
  onStatusChange: (feature: Feature, newStatus: Feature["status"]) => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const getStatusIcon = (status: Feature["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress": return <Clock className="h-4 w-4 text-blue-500" />;
      case "review": return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default: return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Feature["status"]) => {
    switch (status) {
      case "completed": return "bg-green-500 text-white";
      case "in_progress": return "bg-blue-500 text-white";
      case "review": return "bg-orange-500 text-white";
      case "planned": return "bg-purple-500 text-white";
      case "backlog": return "bg-gray-500 text-white";
      case "idea": return "bg-yellow-500 text-white";
      default: return "bg-slate-500 text-white";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "border-red-500 bg-red-50";
      case "high": return "border-orange-500 bg-orange-50";
      case "medium": return "border-blue-500 bg-blue-50";
      case "low": return "border-green-500 bg-green-50";
      default: return "border-gray-300 bg-gray-50";
    }
  };

  const quickStatusOptions = [
    { value: "backlog", label: "Backlog" },
    { value: "planned", label: "Planned" },
    { value: "in_progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "completed", label: "Completed" }
  ] as const;

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 border-l-4 ${getPriorityColor(feature.priority)}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getStatusIcon(feature.status)}
            <Badge className={getStatusColor(feature.status)}>
              {feature.status.replace('_', ' ')}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(feature)}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                if (confirm("Are you sure you want to delete this feature?")) {
                  onDelete(feature.id);
                }
              }}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <CardTitle className="text-lg line-clamp-2">{feature.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {feature.description}
        </p>
        
        {feature.userStory && (
          <div className="text-xs bg-blue-50 border border-blue-200 rounded p-2">
            <strong>User Story:</strong> {feature.userStory}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500" />
            <span>Priority: <strong>{feature.priority}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3 text-blue-500" />
            <span>Score: <strong>{feature.score?.toFixed(1) || 'N/A'}</strong></span>
          </div>
          <div>
            <span>Value: <strong>{feature.value}/10</strong></span>
          </div>
          <div>
            <span>Effort: <strong>{feature.effort}/10</strong></span>
          </div>
        </div>

        {feature.assignedTo && feature.assignedTo.length > 0 && (
          <div className="flex items-center gap-1 text-xs">
            <Users className="h-3 w-3 text-gray-500" />
            <span>Assigned: {feature.assignedTo.length} member(s)</span>
          </div>
        )}

        {feature.progress > 0 && (
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span>Progress</span>
              <span>{feature.progress}%</span>
            </div>
            <Progress value={feature.progress} className="h-2" />
          </div>
        )}

        {feature.tags && feature.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {feature.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {feature.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{feature.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-3">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(feature.updatedAt).toLocaleDateString()}
          </div>
          
          <select
            value={feature.status}
            onChange={(e) => onStatusChange(feature, e.target.value as Feature["status"])}
            className="text-xs border rounded px-2 py-1 bg-background"
          >
            {quickStatusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </CardFooter>
    </Card>
  );
};
