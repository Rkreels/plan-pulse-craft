
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTitle } from "@/components/common/PageTitle";
import { EmptyState } from "@/components/common/EmptyState";
import { AccessDenied } from "@/components/common/AccessDenied";
import { useAppContext } from "@/contexts/AppContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Feature } from "@/types";
import { CheckSquare, CircleCheck, Circle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Tasks = () => {
  const { features, epics, updateFeature } = useAppContext();
  const { hasRole } = useRoleAccess();
  
  // Role-based access control
  if (!hasRole("developer")) {
    return <AccessDenied requiredRole="developer" />;
  }
  
  // Get dev tasks (in progress or review features)
  const tasks = features.filter(f => 
    f.status === "in_progress" || f.status === "review"
  );

  const handleUpdateStatus = (feature: Feature, newStatus: Feature["status"]) => {
    updateFeature({
      ...feature,
      status: newStatus
    });
  };

  return (
    <>
      <PageTitle
        title="Development Tasks"
        description="Track and manage development tasks"
      />
      
      {tasks.length === 0 ? (
        <EmptyState 
          title="No Active Tasks" 
          description="There are no development tasks currently in progress or under review."
          icon={<CheckSquare className="h-10 w-10 text-muted-foreground" />}
        />
      ) : (
        <div>
          <div className="mb-6">
            <div className="flex justify-between border-b pb-4">
              <div className="flex gap-6">
                <div>
                  <span className="text-2xl font-bold">{tasks.length}</span>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                </div>
                <div>
                  <span className="text-2xl font-bold">
                    {tasks.filter(t => t.status === "in_progress").length}
                  </span>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
                <div>
                  <span className="text-2xl font-bold">
                    {tasks.filter(t => t.status === "review").length}
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
                {tasks.map(task => {
                  const relatedEpic = epics.find(e => e.id === task.epicId);
                  return (
                    <TableRow key={task.id}>
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
                      <TableCell className="text-right space-x-2">
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
    </>
  );
};

export default Tasks;
