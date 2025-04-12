
// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "product_manager" | "executive" | "developer" | "customer";
}

// Workspace Types
export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  createdAt: Date;
  ownerId: string;
}

// Core Entity Types
export interface Goal {
  id: string;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "completed" | "at_risk";
  progress: number; // 0-100
  startDate?: Date;
  targetDate?: Date;
  ownerId: string;
  workspaceId: string;
}

export interface Initiative {
  id: string;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "completed" | "at_risk";
  progress: number;
  goals: string[]; // Goal IDs
  startDate?: Date;
  targetDate?: Date;
  ownerId: string;
  workspaceId: string;
}

export interface Release {
  id: string;
  name: string;
  description: string;
  status: "planned" | "in_progress" | "completed" | "delayed";
  version: string;
  releaseDate: Date;
  features: string[]; // Feature IDs
  epics: string[]; // Epic IDs
  notes?: string;
  workspaceId: string;
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  status: "backlog" | "planned" | "in_progress" | "review" | "completed";
  progress: number; // 0-100
  features: string[]; // Feature IDs
  startDate?: Date;
  targetDate?: Date;
  ownerId: string;
  initiativeId?: string; // Optional link to initiative
  releaseId?: string; // Optional link to release
  workspaceId: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  status: "idea" | "backlog" | "planned" | "in_progress" | "review" | "completed";
  userStory?: string;
  acceptanceCriteria?: string[];
  priority: "low" | "medium" | "high" | "critical";
  effort: number; // 1-10
  value: number; // 1-10
  score?: number; // Calculated priority score
  tags: string[];
  assignedTo?: string; // User ID
  epicId?: string; // Optional link to epic
  releaseId?: string; // Optional link to release
  feedback: string[]; // Feedback IDs
  votes: number;
  createdAt: Date;
  updatedAt: Date;
  workspaceId: string;
}

export interface Feedback {
  id: string;
  title: string;
  description: string;
  source: "internal" | "customer" | "sales" | "support";
  status: "new" | "reviewed" | "linked" | "closed";
  votes: number;
  features: string[]; // Feature IDs this feedback is linked to
  submittedBy: string; // User ID or email if external
  createdAt: Date;
  workspaceId: string;
}

// Prioritization Framework Types
export interface ScoringModel {
  id: string;
  name: string;
  description: string;
  type: "rice" | "moscow" | "value_effort" | "custom";
  fields: ScoringField[];
  workspaceId: string;
}

export interface ScoringField {
  id: string;
  name: string;
  weight: number; // Multiplier for this field
  scale: number; // Max value (typically 5 or 10)
}

// View Types
export interface RoadmapView {
  id: string;
  name: string;
  type: "timeline" | "board" | "gantt" | "list";
  filters: ViewFilter[];
  sortBy?: string;
  groupBy?: string;
  isDefault: boolean;
  ownerId: string;
  workspaceId: string;
}

export interface ViewFilter {
  field: string;
  operator: "equals" | "contains" | "greater_than" | "less_than";
  value: string | number | boolean | Date;
}
