
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, CheckCircle, Circle, CircleCheck } from "lucide-react";
import { Task, Feature } from "@/types";

interface TaskTableProps {
  tasks: Task[];
  features: Feature[];
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onUpdateStatus: (task: Task, status: Task["status"]) => void;
}

export const TaskTable = ({ tasks, features, onViewTask, onEditTask, onUpdateStatus }: TaskTableProps) => {
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

  const getRelatedFeature = (featureId?: string) => {
    return features.find(f => f.id === featureId);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Status</TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Feature</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map(task => {
            const relatedFeature = getRelatedFeature(task.featureId);
            return (
              <TableRow 
                key={task.id} 
                className="cursor-pointer hover:bg-accent/50" 
                onClick={() => onViewTask(task)}
              >
                <TableCell>
                  {getStatusIcon(task.status)}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">{task.description}</div>
                  {task.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {task.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {task.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{task.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  {relatedFeature ? (
                    <div>
                      <div className="font-medium text-sm">{relatedFeature.title}</div>
                      <Badge variant="outline" className="text-xs">
                        Feature
                      </Badge>
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {task.dueDate ? (
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{task.progress}%</span>
                  </div>
                </TableCell>
                <TableCell 
                  className="text-right space-x-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditTask(task)}
                  >
                    Edit
                  </Button>
                  {task.status === "not_started" && (
                    <Badge 
                      className="bg-blue-500 cursor-pointer hover:bg-blue-600"
                      onClick={() => onUpdateStatus(task, "in_progress")}
                    >
                      Start
                    </Badge>
                  )}
                  {task.status === "in_progress" && (
                    <Badge 
                      className="bg-amber-500 cursor-pointer hover:bg-amber-600"
                      onClick={() => onUpdateStatus(task, "review")}
                    >
                      Review
                    </Badge>
                  )}
                  {task.status === "review" && (
                    <Badge 
                      className="bg-green-500 cursor-pointer hover:bg-green-600"
                      onClick={() => onUpdateStatus(task, "completed")}
                    >
                      Complete
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
