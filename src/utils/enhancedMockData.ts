
import { Goal, Release, Epic, Feature, Feedback, Task } from "@/types";

export const createEnhancedMockData = () => {
  // Enhanced Goals with realistic data
  const goals: Goal[] = [
    {
      id: "goal-1",
      title: "Increase User Engagement by 40%",
      description: "Implement features that drive daily active users and increase session duration through personalized experiences and gamification.",
      status: "in_progress",
      progress: 65,
      startDate: new Date("2024-01-15"),
      targetDate: new Date("2024-06-30"),
      ownerId: "user-1",
      workspaceId: "workspace-1"
    },
    {
      id: "goal-2",
      title: "Reduce Customer Support Tickets by 30%",
      description: "Build comprehensive self-service capabilities and improve product usability to reduce support burden.",
      status: "not_started",
      progress: 15,
      startDate: new Date("2024-02-01"),
      targetDate: new Date("2024-08-31"),
      ownerId: "user-1",
      workspaceId: "workspace-1"
    },
    {
      id: "goal-3",
      title: "Launch Mobile App",
      description: "Develop and launch native mobile applications for iOS and Android platforms to expand market reach.",
      status: "at_risk",
      progress: 45,
      startDate: new Date("2023-11-01"),
      targetDate: new Date("2024-05-15"),
      ownerId: "user-2",
      workspaceId: "workspace-1"
    },
    {
      id: "goal-4",
      title: "Achieve SOC 2 Compliance",
      description: "Implement security controls and processes to meet SOC 2 Type II compliance requirements.",
      status: "completed",
      progress: 100,
      startDate: new Date("2023-09-01"),
      targetDate: new Date("2024-03-01"),
      ownerId: "user-3",
      workspaceId: "workspace-1"
    }
  ];

  // Enhanced Releases with realistic schedules
  const releases: Release[] = [
    {
      id: "release-1",
      name: "Spring Release 2024",
      description: "Major feature release including advanced analytics, mobile app launch, and performance improvements.",
      status: "in_progress",
      version: "2.1.0",
      releaseDate: new Date("2024-04-15"),
      features: ["feature-1", "feature-3", "feature-7"],
      epics: ["epic-1", "epic-2"],
      notes: "Focus on user experience and mobile capabilities.",
      workspaceId: "workspace-1"
    },
    {
      id: "release-2",
      name: "Summer Security Update",
      description: "Security-focused release with enhanced authentication, audit logging, and compliance features.",
      status: "planned",
      version: "2.2.0",
      releaseDate: new Date("2024-07-01"),
      features: ["feature-4", "feature-5"],
      epics: ["epic-3"],
      notes: "Critical security and compliance improvements.",
      workspaceId: "workspace-1"
    },
    {
      id: "release-3",
      name: "Fall Feature Pack",
      description: "Advanced automation features, AI-powered insights, and integration marketplace.",
      status: "planned",
      version: "2.3.0",
      releaseDate: new Date("2024-10-31"),
      features: ["feature-8", "feature-9"],
      epics: ["epic-4"],
      notes: "Focus on automation and AI capabilities.",
      workspaceId: "workspace-1"
    }
  ];

  // Enhanced Epics with detailed planning
  const epics: Epic[] = [
    {
      id: "epic-1",
      title: "Advanced Analytics Dashboard",
      description: "Comprehensive analytics platform with real-time data visualization, custom reports, and predictive insights.",
      status: "in_progress",
      progress: 70,
      features: ["feature-1", "feature-2"],
      startDate: new Date("2024-01-01"),
      targetDate: new Date("2024-04-30"),
      ownerId: "user-1",
      releaseId: "release-1",
      workspaceId: "workspace-1"
    },
    {
      id: "epic-2",
      title: "Mobile Application Suite",
      description: "Native iOS and Android applications with offline capabilities and push notifications.",
      status: "in_progress",
      progress: 45,
      features: ["feature-3", "feature-6"],
      startDate: new Date("2023-12-01"),
      targetDate: new Date("2024-05-15"),
      ownerId: "user-2",
      releaseId: "release-1",
      workspaceId: "workspace-1"
    },
    {
      id: "epic-3",
      title: "Enterprise Security Suite",
      description: "Comprehensive security framework including SSO, audit logging, and compliance reporting.",
      status: "backlog",
      progress: 10,
      features: ["feature-4", "feature-5"],
      startDate: new Date("2024-04-01"),
      targetDate: new Date("2024-08-30"),
      ownerId: "user-3",
      releaseId: "release-2",
      workspaceId: "workspace-1"
    },
    {
      id: "epic-4",
      title: "AI-Powered Automation",
      description: "Machine learning driven automation for workflow optimization and intelligent recommendations.",
      status: "backlog",
      progress: 5,
      features: ["feature-8", "feature-9"],
      startDate: new Date("2024-07-01"),
      targetDate: new Date("2024-12-31"),
      ownerId: "user-1",
      releaseId: "release-3",
      workspaceId: "workspace-1"
    }
  ];

  // Enhanced Features with comprehensive details
  const features: Feature[] = [
    {
      id: "feature-1",
      title: "Real-time Data Visualization",
      description: "Interactive charts and graphs that update in real-time with customizable views and filters.",
      status: "in_progress",
      userStory: "As a data analyst, I want to see real-time updates on my dashboard so I can make informed decisions quickly.",
      acceptanceCriteria: [
        "Dashboard updates every 30 seconds",
        "Support for 10+ chart types",
        "Custom date range filtering",
        "Export functionality for reports"
      ],
      priority: "high",
      effort: 8,
      value: 9,
      score: 11.25,
      tags: ["analytics", "dashboard", "real-time"],
      assignedTo: ["user-1", "user-4"],
      epicId: "epic-1",
      releaseId: "release-1",
      feedback: ["feedback-1"],
      votes: 23,
      progress: 75,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-03-10"),
      workspaceId: "workspace-1"
    },
    {
      id: "feature-2",
      title: "Custom Report Builder",
      description: "Drag-and-drop interface for creating custom reports with scheduled delivery options.",
      status: "review",
      userStory: "As a manager, I want to create custom reports and schedule them for delivery so my team stays informed.",
      acceptanceCriteria: [
        "Drag-and-drop report builder",
        "Email scheduling functionality",
        "PDF and Excel export options",
        "Template library with 20+ templates"
      ],
      priority: "medium",
      effort: 6,
      value: 7,
      score: 11.67,
      tags: ["reports", "automation", "analytics"],
      assignedTo: ["user-2"],
      epicId: "epic-1",
      releaseId: "release-1",
      feedback: ["feedback-2"],
      votes: 18,
      progress: 90,
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-03-12"),
      workspaceId: "workspace-1"
    },
    {
      id: "feature-3",
      title: "iOS Mobile App",
      description: "Native iOS application with full feature parity and offline synchronization.",
      status: "in_progress",
      userStory: "As a mobile user, I want to access all features on my iPhone so I can work from anywhere.",
      acceptanceCriteria: [
        "Native iOS app in App Store",
        "Offline data synchronization",
        "Push notifications",
        "Face ID/Touch ID authentication"
      ],
      priority: "critical",
      effort: 10,
      value: 10,
      score: 10.0,
      tags: ["mobile", "ios", "offline"],
      assignedTo: ["user-2", "user-5"],
      epicId: "epic-2",
      releaseId: "release-1",
      feedback: ["feedback-3"],
      votes: 45,
      progress: 60,
      createdAt: new Date("2023-12-01"),
      updatedAt: new Date("2024-03-14"),
      workspaceId: "workspace-1"
    },
    {
      id: "feature-4",
      title: "Single Sign-On (SSO) Integration",
      description: "Enterprise SSO integration supporting SAML, OAuth, and Active Directory.",
      status: "backlog",
      userStory: "As an IT admin, I want SSO integration so users can access the platform with their corporate credentials.",
      acceptanceCriteria: [
        "SAML 2.0 support",
        "OAuth 2.0/OpenID Connect",
        "Active Directory integration",
        "Role-based access control"
      ],
      priority: "high",
      effort: 7,
      value: 8,
      score: 11.43,
      tags: ["security", "authentication", "enterprise"],
      assignedTo: ["user-3"],
      epicId: "epic-3",
      releaseId: "release-2",
      feedback: ["feedback-4"],
      votes: 31,
      progress: 0,
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-01"),
      workspaceId: "workspace-1"
    },
    {
      id: "feature-5",
      title: "Audit Logging System",
      description: "Comprehensive audit trail for all user actions and system events with search capabilities.",
      status: "idea",
      userStory: "As a compliance officer, I want detailed audit logs so I can track all system activities for compliance.",
      acceptanceCriteria: [
        "Log all user actions",
        "System event tracking",
        "Advanced search and filtering",
        "Tamper-proof log storage"
      ],
      priority: "medium",
      effort: 5,
      value: 6,
      score: 12.0,
      tags: ["security", "compliance", "logging"],
      assignedTo: ["user-3"],
      epicId: "epic-3",
      releaseId: "release-2",
      feedback: [],
      votes: 12,
      progress: 0,
      createdAt: new Date("2024-02-15"),
      updatedAt: new Date("2024-02-15"),
      workspaceId: "workspace-1"
    },
    {
      id: "feature-6",
      title: "Android Mobile App",
      description: "Native Android application with material design and tablet optimization.",
      status: "planned",
      userStory: "As an Android user, I want a native app that follows material design principles.",
      acceptanceCriteria: [
        "Material Design 3.0",
        "Tablet optimization",
        "Offline capability",
        "Google Play Store publication"
      ],
      priority: "high",
      effort: 9,
      value: 9,
      score: 10.0,
      tags: ["mobile", "android", "material-design"],
      assignedTo: ["user-2"],
      epicId: "epic-2",
      feedback: [],
      votes: 38,
      progress: 25,
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-03-01"),
      workspaceId: "workspace-1"
    },
    {
      id: "feature-7",
      title: "Performance Optimization",
      description: "Comprehensive performance improvements including page load times and database optimization.",
      status: "completed",
      userStory: "As a user, I want faster page loads so I can be more productive.",
      acceptanceCriteria: [
        "50% reduction in load times",
        "Database query optimization",
        "Image compression",
        "CDN implementation"
      ],
      priority: "high",
      effort: 4,
      value: 8,
      score: 20.0,
      tags: ["performance", "optimization", "backend"],
      assignedTo: ["user-4"],
      releaseId: "release-1",
      feedback: [],
      votes: 29,
      progress: 100,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-03-05"),
      workspaceId: "workspace-1"
    },
    {
      id: "feature-8",
      title: "AI-Powered Recommendations",
      description: "Machine learning system that provides intelligent recommendations based on user behavior.",
      status: "idea",
      userStory: "As a user, I want personalized recommendations so I can discover relevant features and content.",
      acceptanceCriteria: [
        "Behavioral analysis engine",
        "Personalized recommendations",
        "A/B testing framework",
        "Performance metrics tracking"
      ],
      priority: "medium",
      effort: 9,
      value: 7,
      score: 7.78,
      tags: ["ai", "machine-learning", "personalization"],
      assignedTo: [],
      epicId: "epic-4",
      releaseId: "release-3",
      feedback: [],
      votes: 15,
      progress: 0,
      createdAt: new Date("2024-02-20"),
      updatedAt: new Date("2024-02-20"),
      workspaceId: "workspace-1"
    },
    {
      id: "feature-9",
      title: "Workflow Automation Engine",
      description: "Visual workflow builder with triggers, conditions, and actions for process automation.",
      status: "idea",
      userStory: "As a process owner, I want to automate repetitive workflows so my team can focus on strategic work.",
      acceptanceCriteria: [
        "Visual workflow designer",
        "Event-based triggers",
        "Conditional logic support",
        "Integration with external systems"
      ],
      priority: "low",
      effort: 8,
      value: 6,
      score: 7.5,
      tags: ["automation", "workflow", "integration"],
      assignedTo: [],
      epicId: "epic-4",
      releaseId: "release-3",
      feedback: [],
      votes: 8,
      progress: 0,
      createdAt: new Date("2024-02-25"),
      updatedAt: new Date("2024-02-25"),
      workspaceId: "workspace-1"
    }
  ];

  // Enhanced Feedback with customer insights
  const feedback: Feedback[] = [
    {
      id: "feedback-1",
      title: "Dashboard Loading Too Slow",
      description: "The analytics dashboard takes over 10 seconds to load with large datasets. This impacts daily workflow significantly.",
      source: "customer",
      status: "linked",
      votes: 47,
      features: ["feature-1", "feature-7"],
      submittedBy: "customer@company.com",
      createdAt: new Date("2024-02-28"),
      workspaceId: "workspace-1"
    },
    {
      id: "feedback-2",
      title: "Need More Chart Types",
      description: "Would love to see waterfall charts, funnel charts, and heat maps in the reporting section.",
      source: "customer",
      status: "reviewed",
      votes: 23,
      features: ["feature-2"],
      submittedBy: "analyst@enterprise.com",
      createdAt: new Date("2024-03-02"),
      workspaceId: "workspace-1"
    },
    {
      id: "feedback-3",
      title: "Mobile App Offline Mode Request",
      description: "Really need offline capabilities for field work. Currently can't use the app without internet connection.",
      source: "sales",
      status: "linked",
      votes: 34,
      features: ["feature-3", "feature-6"],
      submittedBy: "sales@company.com",
      createdAt: new Date("2024-02-15"),
      workspaceId: "workspace-1"
    },
    {
      id: "feedback-4",
      title: "SSO Integration Critical",
      description: "Our IT department requires SSO integration before we can roll out to all employees. This is blocking our expansion.",
      source: "customer",
      status: "new",
      votes: 18,
      features: ["feature-4"],
      submittedBy: "it-admin@bigcorp.com",
      createdAt: new Date("2024-03-08"),
      workspaceId: "workspace-1"
    },
    {
      id: "feedback-5",
      title: "Export Functionality Enhancement",
      description: "Need ability to export data in multiple formats including Excel, CSV, and PDF with custom formatting options.",
      source: "support",
      status: "reviewed",
      votes: 29,
      features: ["feature-2"],
      submittedBy: "support@company.com",
      createdAt: new Date("2024-03-12"),
      workspaceId: "workspace-1"
    }
  ];

  // Enhanced Tasks with realistic project work
  const tasks: Task[] = [
    {
      id: "task-1",
      title: "Implement Real-time WebSocket Connection",
      description: "Set up WebSocket infrastructure for real-time data updates in the analytics dashboard.",
      status: "in_progress",
      priority: "high",
      assignedTo: ["user-1"],
      featureId: "feature-1",
      estimatedHours: 16,
      actualHours: 12,
      dueDate: new Date("2024-03-25"),
      tags: ["backend", "websocket", "real-time"],
      progress: 75,
      createdAt: new Date("2024-03-01"),
      updatedAt: new Date("2024-03-15"),
      createdBy: "user-1",
      workspaceId: "workspace-1"
    },
    {
      id: "task-2",
      title: "Design Report Builder UI Components",
      description: "Create reusable UI components for the drag-and-drop report builder interface.",
      status: "review",
      priority: "medium",
      assignedTo: ["user-2"],
      featureId: "feature-2",
      estimatedHours: 12,
      actualHours: 14,
      dueDate: new Date("2024-03-20"),
      tags: ["frontend", "ui-components", "design"],
      progress: 95,
      createdAt: new Date("2024-02-20"),
      updatedAt: new Date("2024-03-18"),
      createdBy: "user-2",
      workspaceId: "workspace-1"
    },
    {
      id: "task-3",
      title: "iOS App Store Submission",
      description: "Prepare and submit iOS application to Apple App Store following review guidelines.",
      status: "not_started",
      priority: "critical",
      assignedTo: ["user-5"],
      featureId: "feature-3",
      estimatedHours: 8,
      actualHours: 0,
      dueDate: new Date("2024-04-01"),
      tags: ["mobile", "ios", "app-store"],
      progress: 0,
      createdAt: new Date("2024-03-10"),
      updatedAt: new Date("2024-03-10"),
      createdBy: "user-2",
      workspaceId: "workspace-1"
    },
    {
      id: "task-4",
      title: "Database Performance Optimization",
      description: "Optimize database queries and implement indexing strategies for improved performance.",
      status: "completed",
      priority: "high",
      assignedTo: ["user-4"],
      featureId: "feature-7",
      estimatedHours: 20,
      actualHours: 18,
      dueDate: new Date("2024-03-01"),
      tags: ["backend", "database", "performance"],
      progress: 100,
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-03-01"),
      createdBy: "user-4",
      workspaceId: "workspace-1"
    },
    {
      id: "task-5",
      title: "SAML Integration Research",
      description: "Research and document SAML integration requirements and implementation approach.",
      status: "blocked",
      priority: "medium",
      assignedTo: ["user-3"],
      featureId: "feature-4",
      estimatedHours: 6,
      actualHours: 3,
      dueDate: new Date("2024-03-30"),
      tags: ["security", "research", "saml"],
      dependencies: ["task-6"],
      progress: 30,
      createdAt: new Date("2024-03-05"),
      updatedAt: new Date("2024-03-16"),
      createdBy: "user-3",
      workspaceId: "workspace-1"
    },
    {
      id: "task-6",
      title: "Security Framework Architecture",
      description: "Design overall security framework architecture before implementing specific features.",
      status: "in_progress",
      priority: "high",
      assignedTo: ["user-3"],
      featureId: "feature-4",
      estimatedHours: 24,
      actualHours: 16,
      dueDate: new Date("2024-03-28"),
      tags: ["security", "architecture", "design"],
      progress: 65,
      createdAt: new Date("2024-02-25"),
      updatedAt: new Date("2024-03-17"),
      createdBy: "user-3",
      workspaceId: "workspace-1"
    }
  ];

  return {
    goals,
    releases,
    epics,
    features,
    feedback,
    tasks
  };
};
