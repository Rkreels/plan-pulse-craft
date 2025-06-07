
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  User, Workspace, Goal, Initiative, Release, 
  Epic, Feature, Feedback, RoadmapView, Task 
} from "@/types";
import { getAllMockData } from "@/utils/mockData";
import { useToast } from "@/hooks/use-toast";
import { AppContextType } from "./app/types";
import { createFeatureActions } from "./app/featureActions";
import { createProjectActions } from "./app/projectActions";
import { createTaskActions } from "./app/taskActions";

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Define the provider component
export function AppProvider({ children }: { children: ReactNode }) {
  // State for data
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [roadmapViews, setRoadmapViews] = useState<RoadmapView[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState<RoadmapView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize feature, project, and task actions
  const featureActions = createFeatureActions(setFeatures, setFeedback);
  const projectActions = createProjectActions(
    setGoals, 
    setEpics, 
    setReleases, 
    setInitiatives, 
    setCurrentUser
  );
  const taskActions = createTaskActions(setTasks);

  // Load mock data on initial render
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = getAllMockData();
        
        // Set the current user to the first product manager
        const productManager = data.users.find(u => u.role === "product_manager") || data.users[0];
        setCurrentUser(productManager);
        
        // Set all other data
        setWorkspace(data.workspace);
        setGoals(data.goals);
        setInitiatives(data.initiatives);
        setReleases(data.releases);
        setEpics(data.epics);
        setFeatures(data.features);
        setFeedback(data.feedback);
        setRoadmapViews(data.roadmapViews);
        
        // Initialize some sample tasks
        setTasks([
          {
            id: "task-1",
            title: "Implement user authentication",
            description: "Add login and registration functionality",
            status: "in_progress",
            priority: "high",
            assignedTo: [productManager?.id || ""],
            featureId: data.features[0]?.id,
            estimatedHours: 8,
            actualHours: 5,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            tags: ["frontend", "security"],
            progress: 60,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: productManager?.id || "",
            workspaceId: "workspace-1"
          },
          {
            id: "task-2",
            title: "Design database schema",
            description: "Create database tables and relationships",
            status: "completed",
            priority: "medium",
            assignedTo: [productManager?.id || ""],
            featureId: data.features[1]?.id,
            estimatedHours: 4,
            actualHours: 4,
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            tags: ["backend", "database"],
            progress: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: productManager?.id || "",
            workspaceId: "workspace-1"
          }
        ]);
        
        // Set default view
        const defaultView = data.roadmapViews.find(v => v.isDefault) || data.roadmapViews[0];
        setCurrentView(defaultView);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Create the context value object
  const contextValue: AppContextType = {
    currentUser,
    workspace,
    goals,
    initiatives,
    releases,
    epics,
    features,
    feedback,
    roadmapViews,
    tasks,
    currentView,
    isLoading,
    setCurrentUser,
    setCurrentView,
    ...featureActions,
    ...projectActions,
    ...taskActions,
  };

  // Provide the context to children components
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for using the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
