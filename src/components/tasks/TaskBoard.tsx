
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { Task } from "@/types";
import { Plus, Calendar, Clock, User, Flag } from "lucide-react";

interface TaskBoardProps {
  onCreateTask: () => void;
  onEditTask: (task: Task) => void;
  onViewTask: (task: Task) => void;
}

export const TaskBoard = ({ onCreateTask, onEditTask, onViewTask }: TaskBoardProps) => {
  const { tasks, updateTask, currentUser } = useAppContext();
  const { toast } = useToast();
  
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const taskColumns = {
    not_started: tasks.filter(t => t.status === 'not_started'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed'),
    on_hold: tasks.filter(t => t.status === 'on_hold')
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    
    if (draggedTask && draggedTask.status !== status) {
      const updatedTask = {
        ...draggedTask,
        status,
        updatedAt: new Date(),
        progress: status === 'completed' ? 100 : status === 'in_progress' ? 50 : draggedTask.progress
      };
      
      updateTask(updatedTask);
      toast({
        title: "Task updated",
        description: `"${draggedTask.title}" moved to ${status.replace('_', ' ')}`
      });
    }
    
    setDraggedTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-200 bg-green-50';
      case 'in_progress': return 'border-blue-200 bg-blue-50';
      case 'on_hold': return 'border-orange-200 bg-orange-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const formatDueDate = (date: Date | undefined) => {
    if (!date) return null;
    const now = new Date();
    const due = new Date(date);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-600' };
    if (diffDays === 0) return { text: 'Due today', color: 'text-orange-600' };
    if (diffDays === 1) return { text: 'Due tomorrow', color: 'text-yellow-600' };
    return { text: `Due in ${diffDays} days`, color: 'text-gray-600' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Task Board</h3>
        <Button onClick={onCreateTask}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(taskColumns).map(([status, columnTasks]) => (
          <div
            key={status}
            className="space-y-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status as Task["status"])}
          >
            <div className={`p-4 rounded-lg ${getStatusColor(status)}`}>
              <h4 className="font-semibold capitalize mb-2">
                {status.replace('_', ' ')} ({columnTasks.length})
              </h4>
              
              <div className="space-y-3">
                {columnTasks.map(task => {
                  const dueDate = formatDueDate(task.dueDate);
                  
                  return (
                    <Card
                      key={task.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={() => handleDragStart(task)}
                      onClick={() => onViewTask(task)}
                    >
                      <CardHeader className="p-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-sm font-medium line-clamp-2">
                            {task.title}
                          </CardTitle>
                          <Badge className={`${getPriorityColor(task.priority)} text-white text-xs`}>
                            {task.priority}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-3 pt-0 space-y-3">
                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        
                        {task.progress !== undefined && (
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{task.progress}%</span>
                            </div>
                            <Progress value={task.progress} className="h-1" />
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1">
                            {task.assignedTo && task.assignedTo.length > 0 && (
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{task.assignedTo.length}</span>
                              </div>
                            )}
                            
                            {task.estimatedHours && (
                              <div className="flex items-center gap-1 ml-2">
                                <Clock className="h-3 w-3" />
                                <span>{task.estimatedHours}h</span>
                              </div>
                            )}
                          </div>
                          
                          {dueDate && (
                            <div className={`flex items-center gap-1 ${dueDate.color}`}>
                              <Calendar className="h-3 w-3" />
                              <span>{dueDate.text}</span>
                            </div>
                          )}
                        </div>
                        
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
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
                        
                        <div className="flex justify-between items-center">
                          <div className="flex -space-x-1">
                            {task.assignedTo?.slice(0, 3).map(userId => (
                              <Avatar key={userId} className="h-6 w-6 border-2 border-white">
                                <AvatarFallback className="text-xs">
                                  {userId === currentUser?.id ? 'You' : 'U'}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditTask(task);
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
