
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  Edit, 
  Trash2, 
  CheckCircle,
  Circle,
  CircleCheck
} from "lucide-react";
import { Task, Feature, Epic, Release } from "@/types";
import { format } from "date-fns";

interface TaskDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  onUpdate: (task: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  features: Feature[];
  epics: Epic[];
  releases: Release[];
}

export function TaskDetails({
  open,
  onOpenChange,
  task,
  onUpdate,
  onDelete,
  features,
  epics,
  releases
}: TaskDetailsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "review":
        return <CircleCheck className="h-5 w-5 text-amber-500" />;
      case "in_progress":
        return <Circle className="h-5 w-5 text-blue-500" />;
      case "blocked":
        return <Circle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-amber-500";
      case "medium":
        return "bg-blue-500";
      default:
        return "bg-slate-500";
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "review":
        return "bg-amber-500";
      case "in_progress":
        return "bg-blue-500";
      case "blocked":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const relatedFeature = features.find(f => f.id === task.featureId);
  const relatedEpic = epics.find(e => e.id === task.epicId);
  const relatedRelease = releases.find(r => r.id === task.releaseId);

  const handleDelete = () => {
    onDelete(task.id);
    onOpenChange(false);
    setShowDeleteConfirm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(task.status)}
              <DialogTitle className="text-xl">{task.title}</DialogTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(task.status)}>
              {task.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority.toUpperCase()}
            </Badge>
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{task.description}</p>
            </div>
          )}

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Progress</h3>
              <span className="text-sm text-muted-foreground">{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="w-full" />
          </div>

          <Separator />

          {/* Task Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Task Information</h3>
              
              {task.dueDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Due:</span>
                  <span>{format(new Date(task.dueDate), "PPP")}</span>
                </div>
              )}

              {task.estimatedHours && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Estimated:</span>
                  <span>{task.estimatedHours}h</span>
                  {task.actualHours && (
                    <>
                      <span className="text-muted-foreground">/ Actual:</span>
                      <span>{task.actualHours}h</span>
                    </>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span>{format(new Date(task.createdAt), "PPP")}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Related Items</h3>
              
              {relatedFeature && (
                <div>
                  <span className="text-sm text-muted-foreground">Feature:</span>
                  <div className="mt-1">
                    <Badge variant="outline">{relatedFeature.title}</Badge>
                  </div>
                </div>
              )}

              {relatedEpic && (
                <div>
                  <span className="text-sm text-muted-foreground">Epic:</span>
                  <div className="mt-1">
                    <Badge variant="outline">{relatedEpic.title}</Badge>
                  </div>
                </div>
              )}

              {relatedRelease && (
                <div>
                  <span className="text-sm text-muted-foreground">Release:</span>
                  <div className="mt-1">
                    <Badge variant="outline">{relatedRelease.name} (v{relatedRelease.version})</Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Dependencies */}
          {task.dependencies && task.dependencies.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Dependencies</h3>
              <div className="space-y-2">
                {task.dependencies.map((depId) => (
                  <div key={depId} className="text-sm text-muted-foreground">
                    Task ID: {depId}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
              <h3 className="font-medium mb-2">Delete Task</h3>
              <p className="text-muted-foreground mb-4">
                Are you sure you want to delete "{task.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
