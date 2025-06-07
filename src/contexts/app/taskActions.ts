
import { Task } from "@/types";

export const createTaskActions = (
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return {
    addTask,
    updateTask,
    deleteTask,
  };
};
