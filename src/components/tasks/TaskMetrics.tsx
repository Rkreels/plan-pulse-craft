
import { Task } from "@/types";

interface TaskMetricsProps {
  tasks: Task[];
}

export const TaskMetrics = ({ tasks }: TaskMetricsProps) => {
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const blockedTasks = tasks.filter(t => t.status === "blocked").length;

  return (
    <div className="mb-6">
      <div className="flex justify-between border-b pb-4">
        <div className="flex flex-wrap gap-6">
          <div>
            <span className="text-2xl font-bold">{totalTasks}</span>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
          </div>
          <div>
            <span className="text-2xl font-bold">{inProgressTasks}</span>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
          <div>
            <span className="text-2xl font-bold">{completedTasks}</span>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
          <div>
            <span className="text-2xl font-bold">{blockedTasks}</span>
            <p className="text-sm text-muted-foreground">Blocked</p>
          </div>
        </div>
      </div>
    </div>
  );
};
