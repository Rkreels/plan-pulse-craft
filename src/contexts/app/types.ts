
import { User, Workspace, Goal, Initiative, Release, Epic, Feature, Feedback, RoadmapView, Task } from "@/types";

// Context interfaces
export interface AppContextType {
  currentUser: User | null;
  workspace: Workspace | null;
  goals: Goal[];
  initiatives: Initiative[];
  releases: Release[];
  epics: Epic[];
  features: Feature[];
  feedback: Feedback[];
  roadmapViews: RoadmapView[];
  tasks: Task[];
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
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  switchRole: (role: User["role"]) => void;
  // Strategic Planning Actions
  addInitiative: (initiative: Initiative) => void;
  updateInitiative: (initiative: Initiative) => void;
  deleteInitiative: (initiativeId: string) => void;
  linkInitiativeToGoal: (initiativeId: string, goalId: string) => void;
  unlinkInitiativeFromGoal: (initiativeId: string, goalId: string) => void;
}
