
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  User, Workspace, Goal, Initiative, Release, 
  Epic, Feature, Feedback, RoadmapView 
} from "@/types";
import { getAllMockData } from "@/utils/mockData";
import { useToast } from "@/hooks/use-toast";

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
  addFeature: (feature: Feature) => void;
  deleteFeature: (featureId: string) => void;
  updateEpic: (epic: Epic) => void;
  addEpic: (epic: Epic) => void;
  deleteEpic: (epicId: string) => void;
  updateGoal: (goal: Goal) => void;
  addGoal: (goal: Goal) => void;
  deleteGoal: (goalId: string) => void;
  updateRelease: (release: Release) => void;
  addRelease: (release: Release) => void;
  deleteRelease: (releaseId: string) => void;
  addFeedback: (feedback: Feedback) => void;
  updateFeedback: (feedback: Feedback) => void;
  deleteFeedback: (feedbackId: string) => void;
  switchRole: (role: User["role"]) => void;
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
  const { toast } = useToast();

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

  // Feature CRUD operations
  const addFeature = (newFeature: Feature) => {
    setFeatures(prev => [...prev, newFeature]);
    toast({
      title: "Feature added",
      description: `${newFeature.title} has been added successfully.`
    });
  };

  const updateFeature = (updatedFeature: Feature) => {
    setFeatures(prev => prev.map(f => 
      f.id === updatedFeature.id ? updatedFeature : f
    ));
    toast({
      title: "Feature updated",
      description: `${updatedFeature.title} has been updated successfully.`
    });
  };

  const deleteFeature = (featureId: string) => {
    const featureToDelete = features.find(f => f.id === featureId);
    setFeatures(prev => prev.filter(f => f.id !== featureId));
    toast({
      title: "Feature deleted",
      description: featureToDelete ? `${featureToDelete.title} has been deleted.` : "Feature has been deleted."
    });
  };

  // Epic CRUD operations
  const addEpic = (newEpic: Epic) => {
    setEpics(prev => [...prev, newEpic]);
    toast({
      title: "Epic added",
      description: `${newEpic.title} has been added successfully.`
    });
  };

  const updateEpic = (updatedEpic: Epic) => {
    setEpics(prev => prev.map(e => 
      e.id === updatedEpic.id ? updatedEpic : e
    ));
    toast({
      title: "Epic updated",
      description: `${updatedEpic.title} has been updated successfully.`
    });
  };

  const deleteEpic = (epicId: string) => {
    const epicToDelete = epics.find(e => e.id === epicId);
    setEpics(prev => prev.filter(e => e.id !== epicId));
    toast({
      title: "Epic deleted",
      description: epicToDelete ? `${epicToDelete.title} has been deleted.` : "Epic has been deleted."
    });
  };

  // Goal CRUD operations
  const addGoal = (newGoal: Goal) => {
    setGoals(prev => [...prev, newGoal]);
    toast({
      title: "Goal added",
      description: `${newGoal.title} has been added successfully.`
    });
  };

  const updateGoal = (updatedGoal: Goal) => {
    setGoals(prev => prev.map(g => 
      g.id === updatedGoal.id ? updatedGoal : g
    ));
    toast({
      title: "Goal updated",
      description: `${updatedGoal.title} has been updated successfully.`
    });
  };

  const deleteGoal = (goalId: string) => {
    const goalToDelete = goals.find(g => g.id === goalId);
    setGoals(prev => prev.filter(g => g.id !== goalId));
    toast({
      title: "Goal deleted",
      description: goalToDelete ? `${goalToDelete.title} has been deleted.` : "Goal has been deleted."
    });
  };

  // Release CRUD operations
  const addRelease = (newRelease: Release) => {
    setReleases(prev => [...prev, newRelease]);
    toast({
      title: "Release added",
      description: `${newRelease.name} has been added successfully.`
    });
  };

  const updateRelease = (updatedRelease: Release) => {
    setReleases(prev => prev.map(r => 
      r.id === updatedRelease.id ? updatedRelease : r
    ));
    toast({
      title: "Release updated",
      description: `${updatedRelease.name} has been updated successfully.`
    });
  };

  const deleteRelease = (releaseId: string) => {
    const releaseToDelete = releases.find(r => r.id === releaseId);
    setReleases(prev => prev.filter(r => r.id !== releaseId));
    toast({
      title: "Release deleted",
      description: releaseToDelete ? `${releaseToDelete.name} has been deleted.` : "Release has been deleted."
    });
  };

  // Feedback CRUD operations
  const updateFeedback = (updatedFeedback: Feedback) => {
    setFeedback(prev => prev.map(f => 
      f.id === updatedFeedback.id ? updatedFeedback : f
    ));
    toast({
      title: "Feedback updated",
      description: `${updatedFeedback.title} has been updated successfully.`
    });
  };

  const deleteFeedback = (feedbackId: string) => {
    const feedbackToDelete = feedback.find(f => f.id === feedbackId);
    setFeedback(prev => prev.filter(f => f.id !== feedbackId));
    toast({
      title: "Feedback deleted",
      description: feedbackToDelete ? `${feedbackToDelete.title} has been deleted.` : "Feedback has been deleted."
    });
  };

  // For testing different roles
  const switchRole = (role: User["role"]) => {
    const data = getAllMockData();
    const user = data.users.find(u => u.role === role) || {
      ...currentUser!,
      role
    };
    
    setCurrentUser(user as User);
    toast({
      title: "Role switched",
      description: `Now viewing as ${role.replace('_', ' ')}`
    });
  };

  // Create the context value object
  // Function to add new feedback
  const addFeedback = (newFeedback: Feedback) => {
    setFeedback(prev => [...prev, newFeedback]);
    toast({
      title: "Feedback added",
      description: `${newFeedback.title} has been added successfully.`
    });
  };

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
    addFeature,
    deleteFeature,
    updateEpic,
    addEpic,
    deleteEpic,
    updateGoal,
    addGoal,
    deleteGoal,
    updateRelease,
    addRelease,
    deleteRelease,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    switchRole
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
