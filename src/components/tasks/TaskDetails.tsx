
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
import { AddEditTaskDialog } from "@/components/dialogs/AddEditTaskDialog";

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

export const TaskDetails = ({
  open,
  onOpenChange,
  task,
  onUpdate,
  onDelete,
  features,
  epics,
  releases
}: TaskDetailsProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const relatedFeature = features.find(f => f.id === task.featureId);
  const relatedEpic = epics.find(e => e.id === task.epicId);
  const relatedRelease = releases.find(r => r.id === task.releaseId);

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

  const handleStatusChange = (newStatus: Task["status"]) => {
    const updatedTask = {
      ...task,
      status: newStatus,
      progress: newStatus === "completed" ? 100 : 
                newStatus === "in_progress" ? 50 : 
                task.progress
    };
    onUpdate(updatedTask);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-xl mb-2">{task.title}</DialogTitle>
                <div className="flex items-center gap-2 mb-4">
                  {getStatusIcon(task.status)}
                  <Badge variant="outline">{task.status.replace('_', ' ')}</Badge>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">
                {task.description || "No description provided"}
              </p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Details</h4>
                  <div className="space-y-2 text-sm">
                    {task.dueDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {task.estimatedHours && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Estimated: {task.estimatedHours}h</span>
                        {task.actualHours && (
                          <span className="text-muted-foreground">
                            / Actual: {task.actualHours}h
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Assigned: {task.assignedTo?.length ? 
                          `${task.assignedTo.length} person(s)` : 
                          "Unassigned"
                        }
                      </span>
                    </div>
                  </div>
                </div>
                
                {task.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map(tag => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                </div>
                
                {(relatedFeature || relatedEpic || relatedRelease) && (
                  <div>
                    <h4 className="font-medium mb-2">Related Items</h4>
                    <div className="space-y-2">
                      {relatedFeature && (
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">Feature</Badge>
                          <span>{relatedFeature.title}</span>
                        </div>
                      )}
                      {relatedEpic && (
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">Epic</Badge>
                          <span>{relatedEpic.title}</span>
                        </div>
                      )}
                      {relatedRelease && (
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">Release</Badge>
                          <span>{relatedRelease.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-3">Quick Actions</h4>
              <div className="flex gap-2">
                {task.status === "not_started" && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusChange("in_progress")}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Start Task
                  </Button>
                )}
                {task.status === "in_progress" && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusChange("review")}
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    Submit for Review
                  </Button>
                )}
                {task.status === "review" && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusChange("completed")}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Mark Complete
                  </Button>
                )}
                {task.status !== "blocked" && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStatusChange("blocked")}
                  >
                    Mark as Blocked
                  </Button>
                )}
                {task.status === "blocked" && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusChange("not_started")}
                  >
                    Unblock
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <AddEditTaskDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        task={task}
        onSave={onUpdate}
        features={features}
        epics={epics}
        releases={releases}
      />
    </>
  );
};
