
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  User, Workspace, Goal, Initiative, Release, 
  Epic, Feature, Feedback, RoadmapView 
} from "@/types";
import { getAllMockData } from "@/utils/mockData";

// Define the context shape
interface AppContextType {
  currentUser: User | null;
  workspace: Workspace | null;
  goals: Goal[];
  initiatives: Initiative[];
  releases: Release[];
  epics: Epic[];
  features: Feature[];
  feedback: Feedback[];
  roadmapViews: RoadmapView[];
  currentView: RoadmapView | null;
  isLoading: boolean;
  // Actions
  setCurrentUser: (user: User | null) => void;
  setCurrentView: (view: RoadmapView | null) => void;
  updateFeature: (feature: Feature) => void;
  updateEpic: (epic: Epic) => void;
  updateGoal: (goal: Goal) => void;
  updateRelease: (release: Release) => void;
  addFeedback: (feedback: Feedback) => void;
}

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
  const [currentView, setCurrentView] = useState<RoadmapView | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Action handlers
  const updateFeature = (updatedFeature: Feature) => {
    setFeatures(prev => prev.map(f => 
      f.id === updatedFeature.id ? updatedFeature : f
    ));
  };

  const updateEpic = (updatedEpic: Epic) => {
    setEpics(prev => prev.map(e => 
      e.id === updatedEpic.id ? updatedEpic : e
    ));
  };

  const updateGoal = (updatedGoal: Goal) => {
    setGoals(prev => prev.map(g => 
      g.id === updatedGoal.id ? updatedGoal : g
    ));
  };

  const updateRelease = (updatedRelease: Release) => {
    setReleases(prev => prev.map(r => 
      r.id === updatedRelease.id ? updatedRelease : r
    ));
  };

  const addFeedback = (newFeedback: Feedback) => {
    setFeedback(prev => [...prev, newFeedback]);
  };

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
    currentView,
    isLoading,
    setCurrentUser,
    setCurrentView,
    updateFeature,
    updateEpic,
    updateGoal,
    updateRelease,
    addFeedback
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
