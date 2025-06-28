import { useState, useMemo } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { EmptyState } from "@/components/common/EmptyState";
import { AccessDenied } from "@/components/common/AccessDenied";
import { useAppContext } from "@/contexts/AppContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Task } from "@/types";
import { CheckSquare } from "lucide-react";
import { AddEditTaskDialog } from "@/components/dialogs/AddEditTaskDialog";
import { TaskDetails } from "@/components/tasks/TaskDetails";
import { TaskMetrics } from "@/components/tasks/TaskMetrics";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  return (
    <>
      <PageTitle
        title="Development Tasks"
        description="Create, assign, and track development tasks"
      />
      
      <div className="flex flex-col gap-6">
        <TaskFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          assigneeFilter={assigneeFilter}
          setAssigneeFilter={setAssigneeFilter}
          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          onNewTask={() => {
            setEditingTask(undefined);
            setShowTaskDialog(true);
          }}
        />
        
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
            <TaskMetrics tasks={filteredTasks} />
            
            <Tabs defaultValue="board" className="mt-6">
              <TabsList>
                <TabsTrigger value="board">Board View</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="board">
                <TaskBoard
                  onCreateTask={() => {
                    setEditingTask(undefined);
                    setShowTaskDialog(true);
                  }}
                  onEditTask={handleEditTask}
                  onViewTask={handleViewTask}
                />
              </TabsContent>
              
              <TabsContent value="table">
                <TaskTable
                  tasks={filteredTasks}
                  features={features}
                  onViewTask={handleViewTask}
                  onEditTask={handleEditTask}
                  onUpdateStatus={handleUpdateStatus}
                />
              </TabsContent>
            </Tabs>
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
