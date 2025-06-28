
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  User, Workspace, Goal, Initiative, Release, 
  Epic, Feature, Feedback, RoadmapView, Task 
} from "@/types";
import { getAllMockData } from "@/utils/mockData";
import { createEnhancedMockData } from "@/utils/enhancedMockData";
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
        const baseData = getAllMockData();
        const enhancedData = createEnhancedMockData();
        
        // Set the current user to the first product manager
        const productManager = baseData.users.find(u => u.role === "product_manager") || baseData.users[0];
        setCurrentUser(productManager);
        
        // Set base data
        setWorkspace(baseData.workspace);
        setInitiatives(baseData.initiatives);
        setRoadmapViews(baseData.roadmapViews);
        
        // Set enhanced data
        setGoals(enhancedData.goals);
        setReleases(enhancedData.releases);
        setEpics(enhancedData.epics);
        setFeatures(enhancedData.features);
        setFeedback(enhancedData.feedback);
        setTasks(enhancedData.tasks);
        
        // Set default view
        const defaultView = baseData.roadmapViews.find(v => v.isDefault) || baseData.roadmapViews[0];
        setCurrentView(defaultView);
        
        console.log("Enhanced data loaded:", {
          goals: enhancedData.goals.length,
          releases: enhancedData.releases.length,
          epics: enhancedData.epics.length,
          features: enhancedData.features.length,
          feedback: enhancedData.feedback.length,
          tasks: enhancedData.tasks.length
        });
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load application data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

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
