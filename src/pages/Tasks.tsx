import { useState, useMemo } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { EmptyState } from "@/components/common/EmptyState";
import { AccessDenied } from "@/components/common/AccessDenied";
import { useAppContext } from "@/contexts/AppContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Task } from "@/types";
import { 
  CheckSquare, 
  CircleCheck, 
  Circle, 
  CheckCircle, 
  Filter, 
  ArrowUpDown,
  Plus,
  Calendar,
  Clock,
  User,
  Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AddEditTaskDialog } from "@/components/dialogs/AddEditTaskDialog";
import { TaskDetails } from "@/components/tasks/TaskDetails";
import { toast } from "sonner";

const Tasks = () => {
  const { features, epics, releases, tasks, currentUser, addTask, updateTask, deleteTask } = useAppContext();
  const { hasRole } = useRoleAccess();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("priority");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  
  // Role-based access control
  if (!hasRole("developer")) {
    return <AccessDenied requiredRole="developer" />;
  }

  // Apply filters and sorting
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      if (search && !task.title.toLowerCase().includes(search.toLowerCase()) && 
         !task.description.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (statusFilter !== "all" && task.status !== statusFilter) {
        return false;
      }
      
      // Priority filter
      if (priorityFilter !== "all" && task.priority !== priorityFilter) {
        return false;
      }
      
      // Assignee filter
      if (assigneeFilter !== "all" && !task.assignedTo?.includes(assigneeFilter)) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      // Sort based on selected field
      if (sortField === "priority") {
        const priorityValues = { critical: 3, high: 2, medium: 1, low: 0 };
        const aValue = priorityValues[a.priority] || 0;
        const bValue = priorityValues[b.priority] || 0;
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else if (sortField === "title") {
        return sortDirection === "asc" 
          ? a.title.localeCompare(b.title) 
          : b.title.localeCompare(a.title);
      } else if (sortField === "dueDate") {
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      }
      
      return 0;
    });
  }, [tasks, search, statusFilter, priorityFilter, assigneeFilter, sortField, sortDirection]);

  const handleUpdateStatus = (task: Task, newStatus: Task["status"]) => {
    const updatedTask = {
      ...task,
      status: newStatus,
      updatedAt: new Date(),
      progress: newStatus === "completed" ? 100 : newStatus === "in_progress" ? 50 : task.progress
    };
    
    updateTask(updatedTask);
    toast.success(`Task "${task.title}" updated to ${newStatus.replace('_', ' ')}`);
  };

  const handleCreateTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title || "",
      description: taskData.description || "",
      status: taskData.status || "not_started",
      priority: taskData.priority || "medium",
      assignedTo: taskData.assignedTo || [],
      featureId: taskData.featureId,
      epicId: taskData.epicId,
      releaseId: taskData.releaseId,
      estimatedHours: taskData.estimatedHours,
      actualHours: 0,
      dueDate: taskData.dueDate,
      tags: taskData.tags || [],
      dependencies: taskData.dependencies || [],
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: currentUser?.id || "",
      workspaceId: "workspace-1"
    };
    
    addTask(newTask);
    setShowTaskDialog(false);
    toast.success("Task created successfully");
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskDialog(true);
  };

  const handleUpdateTask = (taskData: Partial<Task>) => {
    if (!editingTask) return;
    
    const updatedTask = {
      ...editingTask,
      ...taskData,
      updatedAt: new Date()
    };
    
    updateTask(updatedTask);
    setShowTaskDialog(false);
    setEditingTask(undefined);
    toast.success("Task updated successfully");
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    toast.success("Task deleted successfully");
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

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

  const getRelatedEpic = (epicId?: string) => {
    return epics.find(e => e.id === epicId);
  };

  const getRelatedRelease = (releaseId?: string) => {
    return releases.find(r => r.id === releaseId);
  };

  return (
    <>
      <PageTitle
        title="Development Tasks"
        description="Create, assign, and track development tasks"
      />
      
      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Status</h4>
                    <Select
                      value={statusFilter}
                      onValueChange={(val) => setStatusFilter(val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="not_started">Not Started</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="review">In Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Priority</h4>
                    <Select
                      value={priorityFilter}
                      onValueChange={(val) => setPriorityFilter(val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All priorities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All priorities</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="hidden sm:inline">Sort</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Sort by</h4>
                    <Select
                      value={sortField}
                      onValueChange={(val) => setSortField(val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="title">Name</SelectItem>
                        <SelectItem value="dueDate">Due Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Direction</h4>
                    <Select
                      value={sortDirection}
                      onValueChange={(val: "asc" | "desc") => setSortDirection(val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <Button 
            className="flex items-center gap-1 ml-auto" 
            onClick={() => {
              setEditingTask(undefined);
              setShowTaskDialog(true);
            }}
          >
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
        
        {filteredTasks.length === 0 ? (
          <EmptyState 
            title={search || statusFilter || priorityFilter ? "No Matching Tasks" : "No Tasks"} 
            description={search || statusFilter || priorityFilter 
              ? "Try changing your search or filters."
              : "Create your first development task to get started."
            }
            icon={<CheckSquare className="h-10 w-10 text-muted-foreground" />}
          />
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex justify-between border-b pb-4">
                <div className="flex flex-wrap gap-6">
                  <div>
                    <span className="text-2xl font-bold">{filteredTasks.length}</span>
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold">
                      {filteredTasks.filter(t => t.status === "in_progress").length}
                    </span>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold">
                      {filteredTasks.filter(t => t.status === "completed").length}
                    </span>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold">
                      {filteredTasks.filter(t => t.status === "blocked").length}
                    </span>
                    <p className="text-sm text-muted-foreground">Blocked</p>
                  </div>
                </div>
              </div>
            </div>
            
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
                  {filteredTasks.map(task => {
                    const relatedFeature = getRelatedFeature(task.featureId);
                    return (
                      <TableRow 
                        key={task.id} 
                        className="cursor-pointer hover:bg-accent/50" 
                        onClick={() => handleViewTask(task)}
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
                            onClick={() => handleEditTask(task)}
                          >
                            Edit
                          </Button>
                          {task.status === "not_started" && (
                            <Badge 
                              className="bg-blue-500 cursor-pointer hover:bg-blue-600"
                              onClick={() => handleUpdateStatus(task, "in_progress")}
                            >
                              Start
                            </Badge>
                          )}
                          {task.status === "in_progress" && (
                            <Badge 
                              className="bg-amber-500 cursor-pointer hover:bg-amber-600"
                              onClick={() => handleUpdateStatus(task, "review")}
                            >
                              Review
                            </Badge>
                          )}
                          {task.status === "review" && (
                            <Badge 
                              className="bg-green-500 cursor-pointer hover:bg-green-600"
                              onClick={() => handleUpdateStatus(task, "completed")}
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
          </div>
        )}
      </div>

      <AddEditTaskDialog
        open={showTaskDialog}
        onOpenChange={setShowTaskDialog}
        task={editingTask}
        onSave={editingTask ? handleUpdateTask : handleCreateTask}
        features={features}
        epics={epics}
        releases={releases}
      />

      {selectedTask && (
        <TaskDetails
          open={showTaskDetails}
          onOpenChange={setShowTaskDetails}
          task={selectedTask}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          features={features}
          epics={epics}
          releases={releases}
        />
      )}
    </>
  );
};

export default Tasks;
