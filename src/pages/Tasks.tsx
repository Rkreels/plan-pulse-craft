
import { useState, useMemo } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { EmptyState } from "@/components/common/EmptyState";
import { AccessDenied } from "@/components/common/AccessDenied";
import { useAppContext } from "@/contexts/AppContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Feature } from "@/types";
import { 
  CheckSquare, 
  CircleCheck, 
  Circle, 
  CheckCircle, 
  Filter, 
  ArrowUpDown,
  Plus,
  SlidersHorizontal
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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Tasks = () => {
  const navigate = useNavigate();
  const { features, epics, updateFeature } = useAppContext();
  const { hasRole } = useRoleAccess();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("priority");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Role-based access control
  if (!hasRole("developer")) {
    return <AccessDenied requiredRole="developer" />;
  }
  
  // Get dev tasks (in progress or review features)
  const allTasks = features.filter(f => 
    f.status === "in_progress" || f.status === "review"
  );

  // Apply filters and sorting
  const filteredTasks = useMemo(() => {
    return allTasks.filter(task => {
      // Search filter
      if (search && !task.title.toLowerCase().includes(search.toLowerCase()) && 
         !task.description.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (statusFilter && task.status !== statusFilter) {
        return false;
      }
      
      // Priority filter
      if (priorityFilter && task.priority !== priorityFilter) {
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
      }
      
      return 0;
    });
  }, [allTasks, search, statusFilter, priorityFilter, sortField, sortDirection]);

  const handleUpdateStatus = (feature: Feature, newStatus: Feature["status"]) => {
    updateFeature({
      ...feature,
      status: newStatus
    });
    
    toast.success(`Task "${feature.title}" updated to ${newStatus.replace('_', ' ')}`);
  };

  const handleCreateTask = () => {
    navigate("/features?action=create&taskView=true");
  };

  const toggleSortDirection = () => {
    setSortDirection(current => current === "asc" ? "desc" : "asc");
  };

  return (
    <>
      <PageTitle
        title="Development Tasks"
        description="Track and manage development tasks"
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
                      value={statusFilter || ""}
                      onValueChange={(val) => setStatusFilter(val === "" ? null : val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All statuses</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="review">In Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Priority</h4>
                    <Select
                      value={priorityFilter || ""}
                      onValueChange={(val) => setPriorityFilter(val === "" ? null : val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All priorities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All priorities</SelectItem>
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
            onClick={handleCreateTask}
          >
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
        
        {filteredTasks.length === 0 ? (
          <EmptyState 
            title={search || statusFilter || priorityFilter ? "No Matching Tasks" : "No Active Tasks"} 
            description={search || statusFilter || priorityFilter 
              ? "Try changing your search or filters."
              : "There are no development tasks currently in progress or under review."
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
                    <p className="text-sm text-muted-foreground">Tasks</p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold">
                      {filteredTasks.filter(t => t.status === "in_progress").length}
                    </span>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold">
                      {filteredTasks.filter(t => t.status === "review").length}
                    </span>
                    <p className="text-sm text-muted-foreground">In Review</p>
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
                    <TableHead>Epic</TableHead>
                    <TableHead>Release</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map(task => {
                    const relatedEpic = epics.find(e => e.id === task.epicId);
                    return (
                      <TableRow key={task.id} className="cursor-pointer hover:bg-accent/50" onClick={() => navigate(`/features/${task.id}`)}>
                        <TableCell>
                          {task.status === "completed" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : task.status === "review" ? (
                            <CircleCheck className="h-5 w-5 text-amber-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-blue-500" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{task.description}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            task.priority === "critical" ? "bg-red-500" :
                            task.priority === "high" ? "bg-amber-500" :
                            task.priority === "medium" ? "bg-blue-500" :
                            "bg-slate-500"
                          }>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {relatedEpic ? relatedEpic.title : "-"}
                        </TableCell>
                        <TableCell>
                          {task.releaseId ? `v${task.releaseId.replace('r', '')}` : "-"}
                        </TableCell>
                        <TableCell 
                          className="text-right space-x-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {task.status === "in_progress" && (
                            <Badge 
                              className="bg-amber-500 cursor-pointer hover:bg-amber-600"
                              onClick={() => handleUpdateStatus(task, "review")}
                            >
                              Move to Review
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
    </>
  );
};

export default Tasks;
