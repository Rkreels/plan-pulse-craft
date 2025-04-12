
import { 
  User, Workspace, Goal, Initiative, Release, 
  Epic, Feature, Feedback, RoadmapView 
} from "@/types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Alex Kim",
    email: "alex@example.com",
    avatar: "https://ui-avatars.com/api/?name=Alex+Kim&background=6E59A5&color=fff",
    role: "product_manager"
  },
  {
    id: "u2",
    name: "Jamie Singh",
    email: "jamie@example.com",
    avatar: "https://ui-avatars.com/api/?name=Jamie+Singh&background=0EA5E9&color=fff",
    role: "executive"
  },
  {
    id: "u3",
    name: "Taylor Wong",
    email: "taylor@example.com",
    avatar: "https://ui-avatars.com/api/?name=Taylor+Wong&background=22C55E&color=fff",
    role: "developer"
  },
  {
    id: "u4",
    name: "Morgan Lee",
    email: "morgan@example.com",
    avatar: "https://ui-avatars.com/api/?name=Morgan+Lee&background=F59E0B&color=fff",
    role: "customer"
  }
];

// Mock Workspace
export const mockWorkspace: Workspace = {
  id: "w1",
  name: "SaaS Product Suite",
  slug: "saas-product-suite",
  logo: "",
  createdAt: new Date("2023-01-01"),
  ownerId: "u1"
};

// Mock Goals
export const mockGoals: Goal[] = [
  {
    id: "g1",
    title: "Increase user activation by 25%",
    description: "Focus on improving first-time user experience to boost activation metrics",
    status: "in_progress",
    progress: 60,
    startDate: new Date("2023-01-15"),
    targetDate: new Date("2023-06-30"),
    ownerId: "u2",
    workspaceId: "w1"
  },
  {
    id: "g2",
    title: "Reduce customer churn to under 5%",
    description: "Identify and address key pain points causing users to leave",
    status: "in_progress",
    progress: 40,
    startDate: new Date("2023-02-01"),
    targetDate: new Date("2023-07-31"),
    ownerId: "u1",
    workspaceId: "w1"
  },
  {
    id: "g3",
    title: "Launch enterprise offering",
    description: "Develop and release enterprise-grade features with SSO and admin controls",
    status: "not_started",
    progress: 0,
    startDate: new Date("2023-07-01"),
    targetDate: new Date("2023-12-15"),
    ownerId: "u2",
    workspaceId: "w1"
  }
];

// Mock Initiatives
export const mockInitiatives: Initiative[] = [
  {
    id: "i1",
    title: "First-Time User Experience Revamp",
    description: "Redesign onboarding to guide users to their first success moment",
    status: "in_progress",
    progress: 65,
    goals: ["g1"],
    startDate: new Date("2023-01-20"),
    targetDate: new Date("2023-05-15"),
    ownerId: "u1",
    workspaceId: "w1"
  },
  {
    id: "i2",
    title: "Retention Improvement Program",
    description: "Identify and implement features that increase long-term user engagement",
    status: "in_progress",
    progress: 30,
    goals: ["g2"],
    startDate: new Date("2023-02-15"),
    targetDate: new Date("2023-06-30"),
    ownerId: "u1",
    workspaceId: "w1"
  },
  {
    id: "i3",
    title: "Enterprise Security & Compliance",
    description: "Build enterprise-grade security features and compliance certifications",
    status: "not_started",
    progress: 0,
    goals: ["g3"],
    startDate: new Date("2023-07-01"),
    targetDate: new Date("2023-11-30"),
    ownerId: "u2",
    workspaceId: "w1"
  }
];

// Mock Releases
export const mockReleases: Release[] = [
  {
    id: "r1",
    name: "Spring Release",
    description: "Focus on onboarding improvements and core feature enhancements",
    status: "in_progress",
    version: "2.5.0",
    releaseDate: new Date("2023-04-30"),
    features: ["f1", "f3", "f5"],
    epics: ["e1"],
    notes: "This release aims to improve conversion from trial to paid by 15%",
    workspaceId: "w1"
  },
  {
    id: "r2",
    name: "Summer Release",
    description: "Retention features and analytics improvements",
    status: "planned",
    version: "2.6.0",
    releaseDate: new Date("2023-07-15"),
    features: ["f2", "f4", "f6"],
    epics: ["e2"],
    workspaceId: "w1"
  },
  {
    id: "r3",
    name: "Fall Enterprise Release",
    description: "Enterprise features launch",
    status: "planned",
    version: "3.0.0",
    releaseDate: new Date("2023-10-30"),
    features: ["f7", "f8"],
    epics: ["e3"],
    workspaceId: "w1"
  }
];

// Mock Epics
export const mockEpics: Epic[] = [
  {
    id: "e1",
    title: "Onboarding 2.0",
    description: "Reimagined user onboarding experience with personalized flows",
    status: "in_progress",
    progress: 70,
    features: ["f1", "f3", "f5"],
    startDate: new Date("2023-01-25"),
    targetDate: new Date("2023-04-15"),
    ownerId: "u1",
    initiativeId: "i1",
    releaseId: "r1",
    workspaceId: "w1"
  },
  {
    id: "e2",
    title: "User Engagement Dashboard",
    description: "Analytics and insights to help users understand their usage patterns",
    status: "planned",
    progress: 20,
    features: ["f2", "f4", "f6"],
    startDate: new Date("2023-05-01"),
    targetDate: new Date("2023-07-10"),
    ownerId: "u1",
    initiativeId: "i2",
    releaseId: "r2",
    workspaceId: "w1"
  },
  {
    id: "e3",
    title: "SSO & Role-Based Access",
    description: "Enterprise authentication and authorization features",
    status: "backlog",
    progress: 0,
    features: ["f7", "f8"],
    startDate: new Date("2023-08-01"),
    targetDate: new Date("2023-10-15"),
    ownerId: "u2",
    initiativeId: "i3",
    releaseId: "r3",
    workspaceId: "w1"
  }
];

// Mock Features
export const mockFeatures: Feature[] = [
  {
    id: "f1",
    title: "Interactive Product Tour",
    description: "Guide users through key features with interactive tooltips",
    status: "in_progress",
    userStory: "As a new user, I want guidance on key features so I can quickly become productive.",
    acceptanceCriteria: [
      "Tour highlights at least 5 key features",
      "User can skip or pause the tour",
      "Progress is saved if tour is interrupted"
    ],
    priority: "high",
    effort: 6,
    value: 8,
    score: 7.5,
    tags: ["onboarding", "ux"],
    assignedTo: "u3",
    epicId: "e1",
    releaseId: "r1",
    feedback: ["fb1"],
    votes: 24,
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2023-02-15"),
    workspaceId: "w1"
  },
  {
    id: "f2",
    title: "Personalized Activity Feed",
    description: "Show users relevant updates based on their usage patterns",
    status: "planned",
    userStory: "As a user, I want to see relevant updates so I can stay informed about what matters to me.",
    acceptanceCriteria: [
      "Feed algorithm prioritizes content based on user behavior",
      "Users can customize feed preferences",
      "Feed includes system and teammate updates"
    ],
    priority: "medium",
    effort: 7,
    value: 7,
    score: 7.0,
    tags: ["engagement", "personalization"],
    epicId: "e2",
    releaseId: "r2",
    feedback: ["fb3"],
    votes: 18,
    createdAt: new Date("2023-02-05"),
    updatedAt: new Date("2023-02-05"),
    workspaceId: "w1"
  },
  {
    id: "f3",
    title: "Success Milestone Tracking",
    description: "Track and celebrate user progress through key product milestones",
    status: "in_progress",
    priority: "medium",
    effort: 5,
    value: 8,
    score: 7.0,
    tags: ["onboarding", "engagement"],
    assignedTo: "u3",
    epicId: "e1",
    releaseId: "r1",
    feedback: [],
    votes: 12,
    createdAt: new Date("2023-01-22"),
    updatedAt: new Date("2023-02-10"),
    workspaceId: "w1"
  },
  {
    id: "f4",
    title: "Retention Analytics Dashboard",
    description: "Visualize user retention metrics and identify patterns",
    status: "backlog",
    priority: "high",
    effort: 8,
    value: 9,
    score: 8.5,
    tags: ["analytics", "retention"],
    epicId: "e2",
    releaseId: "r2",
    feedback: ["fb2"],
    votes: 15,
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
    workspaceId: "w1"
  },
  {
    id: "f5",
    title: "Contextual Help System",
    description: "Provide help resources based on the user's current context",
    status: "review",
    priority: "medium",
    effort: 6,
    value: 7,
    score: 6.5,
    tags: ["onboarding", "support"],
    assignedTo: "u3",
    epicId: "e1",
    releaseId: "r1",
    feedback: [],
    votes: 9,
    createdAt: new Date("2023-01-25"),
    updatedAt: new Date("2023-03-01"),
    workspaceId: "w1"
  },
  {
    id: "f6",
    title: "User Behavior Insights",
    description: "Provide insights on user behavior patterns and suggestions for engagement",
    status: "backlog",
    priority: "medium",
    effort: 7,
    value: 8,
    score: 7.5,
    tags: ["analytics", "engagement"],
    epicId: "e2",
    releaseId: "r2",
    feedback: [],
    votes: 11,
    createdAt: new Date("2023-02-15"),
    updatedAt: new Date("2023-02-15"),
    workspaceId: "w1"
  },
  {
    id: "f7",
    title: "SAML Single Sign-On",
    description: "Allow enterprise users to authenticate using their organization's identity provider",
    status: "backlog",
    priority: "critical",
    effort: 9,
    value: 10,
    score: 9.5,
    tags: ["enterprise", "security"],
    epicId: "e3",
    releaseId: "r3",
    feedback: ["fb4"],
    votes: 20,
    createdAt: new Date("2023-03-01"),
    updatedAt: new Date("2023-03-01"),
    workspaceId: "w1"
  },
  {
    id: "f8",
    title: "Advanced Permission Controls",
    description: "Granular role-based access controls for enterprise customers",
    status: "backlog",
    priority: "high",
    effort: 8,
    value: 9,
    score: 8.5,
    tags: ["enterprise", "security"],
    epicId: "e3",
    releaseId: "r3",
    feedback: [],
    votes: 16,
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-03-05"),
    workspaceId: "w1"
  }
];

// Mock Feedback
export const mockFeedback: Feedback[] = [
  {
    id: "fb1",
    title: "Onboarding is confusing",
    description: "I couldn't figure out how to set up my first project. Need better guidance.",
    source: "customer",
    status: "linked",
    votes: 8,
    features: ["f1"],
    submittedBy: "u4",
    createdAt: new Date("2023-01-10"),
    workspaceId: "w1"
  },
  {
    id: "fb2",
    title: "Need better analytics for user engagement",
    description: "Would love to see how users engage with specific features over time.",
    source: "internal",
    status: "linked",
    votes: 5,
    features: ["f4"],
    submittedBy: "u2",
    createdAt: new Date("2023-01-30"),
    workspaceId: "w1"
  },
  {
    id: "fb3",
    title: "Activity feed should be customizable",
    description: "I want to control what updates I see in my feed.",
    source: "customer",
    status: "linked",
    votes: 6,
    features: ["f2"],
    submittedBy: "u4",
    createdAt: new Date("2023-02-02"),
    workspaceId: "w1"
  },
  {
    id: "fb4",
    title: "Need enterprise SSO",
    description: "Our security team requires SAML SSO for all business tools.",
    source: "customer",
    status: "linked",
    votes: 12,
    features: ["f7"],
    submittedBy: "morgan.customer@example.com",
    createdAt: new Date("2023-02-20"),
    workspaceId: "w1"
  }
];

// Mock Roadmap Views
export const mockRoadmapViews: RoadmapView[] = [
  {
    id: "v1",
    name: "Product Timeline",
    type: "timeline",
    filters: [],
    sortBy: "targetDate",
    isDefault: true,
    ownerId: "u1",
    workspaceId: "w1"
  },
  {
    id: "v2",
    name: "Development Board",
    type: "board",
    filters: [
      {
        field: "status",
        operator: "equals",
        value: "in_progress"
      }
    ],
    isDefault: false,
    ownerId: "u1",
    workspaceId: "w1"
  },
  {
    id: "v3",
    name: "Release Planning",
    type: "gantt",
    filters: [],
    groupBy: "release",
    isDefault: false,
    ownerId: "u1",
    workspaceId: "w1"
  }
];

// Helper function to get all mock data
export const getAllMockData = () => {
  return {
    users: mockUsers,
    workspace: mockWorkspace,
    goals: mockGoals,
    initiatives: mockInitiatives,
    releases: mockReleases,
    epics: mockEpics,
    features: mockFeatures,
    feedback: mockFeedback,
    roadmapViews: mockRoadmapViews,
  };
};
