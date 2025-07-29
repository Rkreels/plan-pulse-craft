import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, RotateCcw, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VoiceTrainingContextType {
  isActive: boolean;
  isPlaying: boolean;
  currentModule: string;
  currentGuide: VoiceGuide | null;
  startTraining: (module: string, guide: VoiceGuide) => void;
  stopTraining: () => void;
  pauseTraining: () => void;
  resumeTraining: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  setSpeed: (speed: number) => void;
  speed: number;
}

interface VoiceGuide {
  id: string;
  module: string;
  title: string;
  overview: string;
  steps: VoiceStep[];
  tips: string[];
  useCases: string[];
  shortcuts?: string[];
}

interface VoiceStep {
  id: string;
  action: string;
  description: string;
  element?: string;
  duration?: number;
}

const VoiceTrainingContext = createContext<VoiceTrainingContextType | undefined>(undefined);

export const useVoiceTraining = () => {
  const context = useContext(VoiceTrainingContext);
  if (!context) {
    throw new Error('useVoiceTraining must be used within VoiceTrainingProvider');
  }
  return context;
};

// Comprehensive voice guides for all modules
export const VOICE_GUIDES: Record<string, VoiceGuide> = {
  dashboard: {
    id: 'dashboard',
    module: 'Dashboard',
    title: 'Product Management Dashboard',
    overview: 'The dashboard provides a comprehensive overview of your product management activities, featuring key metrics, progress tracking, and recent activity monitoring.',
    steps: [
      {
        id: '1',
        action: 'View Key Metrics',
        description: 'The top section displays four key metric cards showing Features, Goals, Tasks, and Feedback counts with completion rates and progress bars.',
        element: 'metric-cards'
      },
      {
        id: '2',
        action: 'Monitor Alerts',
        description: 'Alert cards appear when you have overdue tasks or upcoming releases, providing quick access to relevant sections.',
        element: 'alert-section'
      },
      {
        id: '3',
        action: 'Analyze Progress Charts',
        description: 'The progress overview chart shows weekly completion trends for features and tasks, while the pie chart displays feature status distribution.',
        element: 'charts-section'
      },
      {
        id: '4',
        action: 'Review Priority Items',
        description: 'The right sidebar shows high priority features requiring immediate attention, with quick access buttons.',
        element: 'priority-sidebar'
      }
    ],
    tips: [
      'Use the dashboard daily to track overall product health',
      'Pay attention to alert notifications for critical items',
      'Review weekly trends to identify productivity patterns',
      'Click on any metric card to navigate to detailed views'
    ],
    useCases: [
      'Daily standup preparation - Get overview of team progress',
      'Executive reporting - Extract key metrics and trends',
      'Bottleneck identification - Spot delayed items quickly',
      'Resource planning - Understand workload distribution'
    ]
  },
  features: {
    id: 'features',
    module: 'Features',
    title: 'Feature Management System',
    overview: 'Manage your product features throughout their lifecycle, from ideation to completion, with comprehensive tracking and prioritization.',
    steps: [
      {
        id: '1',
        action: 'Create New Feature',
        description: 'Click the "New Feature" button to open the feature creation dialog. Fill in title, description, user story, and acceptance criteria.',
        element: 'new-feature-button'
      },
      {
        id: '2',
        action: 'Set Priority and Effort',
        description: 'Use the priority dropdown to set importance level and the effort slider to estimate development complexity from 1 to 10.',
        element: 'priority-effort-controls'
      },
      {
        id: '3',
        action: 'Assign Team Members',
        description: 'Select team members from the assignee dropdown to assign responsibility for feature development.',
        element: 'assignee-selector'
      },
      {
        id: '4',
        action: 'Link to Epics and Releases',
        description: 'Connect features to epics for strategic alignment and releases for delivery planning.',
        element: 'linking-controls'
      },
      {
        id: '5',
        action: 'Track Progress',
        description: 'Update feature status as work progresses and use the progress slider to indicate completion percentage.',
        element: 'progress-tracking'
      }
    ],
    tips: [
      'Always include clear acceptance criteria for better estimation',
      'Use tags to categorize features by theme or platform',
      'Regular status updates help maintain accurate roadmaps',
      'Link customer feedback to validate feature importance'
    ],
    useCases: [
      'Feature backlog management - Organize and prioritize development queue',
      'Sprint planning - Select features based on effort and priority',
      'Stakeholder communication - Share feature progress and status',
      'Dependency tracking - Identify blocking relationships'
    ],
    shortcuts: ['Ctrl+N: New Feature', 'Ctrl+F: Search Features', 'Ctrl+S: Save Changes']
  },
  roadmap: {
    id: 'roadmap',
    module: 'Roadmap',
    title: 'Strategic Roadmap Planning',
    overview: 'Visualize your product strategy over time with interactive roadmap views, timeline management, and strategic alignment tools.',
    steps: [
      {
        id: '1',
        action: 'Select View Type',
        description: 'Choose between Timeline, Board, Gantt, or List views using the view selector tabs to match your planning needs.',
        element: 'view-selector'
      },
      {
        id: '2',
        action: 'Apply Filters',
        description: 'Use the filter controls to show specific features, releases, or epics based on status, priority, or assignment.',
        element: 'filter-controls'
      },
      {
        id: '3',
        action: 'Adjust Time Range',
        description: 'Select different time ranges (quarter, year, custom) to focus on short-term or long-term planning.',
        element: 'time-range-selector'
      },
      {
        id: '4',
        action: 'Drag and Drop Items',
        description: 'In timeline view, drag features and releases to adjust dates and dependencies visually.',
        element: 'timeline-items'
      },
      {
        id: '5',
        action: 'Group by Categories',
        description: 'Group roadmap items by epic, team, or priority to organize information effectively.',
        element: 'grouping-options'
      }
    ],
    tips: [
      'Use different views for different audiences (board for teams, timeline for executives)',
      'Save custom filters as views for recurring planning sessions',
      'Color-code items by status for quick visual assessment',
      'Export roadmaps for sharing with stakeholders'
    ],
    useCases: [
      'Quarterly planning - Set and communicate quarterly objectives',
      'Stakeholder alignment - Share strategic direction visually',
      'Resource planning - Identify capacity needs over time',
      'Dependency management - Visualize feature relationships'
    ]
  },
  goals: {
    id: 'goals',
    module: 'Goals',
    title: 'Strategic Goal Management',
    overview: 'Define, track, and achieve strategic objectives with comprehensive goal management, progress tracking, and alignment tools.',
    steps: [
      {
        id: '1',
        action: 'Create Strategic Goals',
        description: 'Click "New Goal" to define strategic objectives with clear titles, descriptions, and success metrics.',
        element: 'new-goal-button'
      },
      {
        id: '2',
        action: 'Set Target Dates',
        description: 'Define start and target dates to establish clear timelines for goal achievement.',
        element: 'date-pickers'
      },
      {
        id: '3',
        action: 'Assign Ownership',
        description: 'Assign goal owners to ensure accountability and clear responsibility for execution.',
        element: 'owner-assignment'
      },
      {
        id: '4',
        action: 'Track Progress',
        description: 'Update progress percentage regularly and monitor status changes from not started to completed.',
        element: 'progress-tracking'
      },
      {
        id: '5',
        action: 'Link to Initiatives',
        description: 'Connect goals to specific initiatives and features to ensure strategic alignment.',
        element: 'initiative-linking'
      }
    ],
    tips: [
      'Make goals SMART: Specific, Measurable, Achievable, Relevant, Time-bound',
      'Review goal progress weekly in team meetings',
      'Use the at-risk status to flag potential issues early',
      'Celebrate goal completions to maintain team motivation'
    ],
    useCases: [
      'OKR management - Set and track Objectives and Key Results',
      'Strategic planning - Align product development with business objectives',
      'Performance review - Assess individual and team achievements',
      'Board reporting - Communicate strategic progress to leadership'
    ]
  },
  tasks: {
    id: 'tasks',
    module: 'Tasks',
    title: 'Task Management System',
    overview: 'Organize, assign, and track detailed work items with comprehensive task management, time tracking, and dependency management.',
    steps: [
      {
        id: '1',
        action: 'Create Tasks',
        description: 'Use the "Add Task" button to create new work items with detailed descriptions and requirements.',
        element: 'add-task-button'
      },
      {
        id: '2',
        action: 'Set Priority and Estimates',
        description: 'Assign priority levels and add time estimates for better planning and resource allocation.',
        element: 'priority-estimates'
      },
      {
        id: '3',
        action: 'Assign Team Members',
        description: 'Assign tasks to specific team members and set due dates for accountability.',
        element: 'task-assignment'
      },
      {
        id: '4',
        action: 'Link to Features',
        description: 'Connect tasks to features or epics to maintain traceability and context.',
        element: 'feature-linking'
      },
      {
        id: '5',
        action: 'Track Time and Progress',
        description: 'Log actual hours worked and update task status as work progresses through different stages.',
        element: 'time-tracking'
      }
    ],
    tips: [
      'Break large tasks into smaller, manageable subtasks',
      'Use tags to categorize tasks by skill set or component',
      'Set realistic time estimates based on historical data',
      'Review blocked tasks daily to remove impediments'
    ],
    useCases: [
      'Sprint planning - Break features into actionable tasks',
      'Daily standups - Review task progress and blockers',
      'Time tracking - Monitor effort spent on different activities',
      'Resource utilization - Understand team capacity and workload'
    ]
  },
  feedback: {
    id: 'feedback',
    module: 'Feedback',
    title: 'Customer Feedback Management',
    overview: 'Collect, organize, and act on customer feedback to drive product decisions and improvements.',
    steps: [
      {
        id: '1',
        action: 'Collect Feedback',
        description: 'Feedback can be submitted through various sources including customer support, sales, and direct user input.',
        element: 'feedback-sources'
      },
      {
        id: '2',
        action: 'Categorize and Prioritize',
        description: 'Organize feedback by source, votes, and impact to identify the most important customer needs.',
        element: 'feedback-categorization'
      },
      {
        id: '3',
        action: 'Link to Features',
        description: 'Connect customer feedback to existing features or use it to justify new feature development.',
        element: 'feedback-linking'
      },
      {
        id: '4',
        action: 'Track Resolution',
        description: 'Update feedback status as features are developed and communicate back to customers.',
        element: 'resolution-tracking'
      }
    ],
    tips: [
      'Respond to customer feedback quickly to show engagement',
      'Use voting to democratically prioritize customer requests',
      'Group similar feedback items to identify patterns',
      'Close the loop by notifying customers when features are delivered'
    ],
    useCases: [
      'Feature prioritization - Use customer demand to guide development',
      'Customer success - Address user pain points proactively',
      'Product validation - Confirm feature-market fit',
      'Competitive analysis - Understand market requirements'
    ]
  },
  releases: {
    id: 'releases',
    module: 'Releases',
    title: 'Release Planning and Management',
    overview: 'Plan, organize, and track product releases with comprehensive release management and delivery coordination.',
    steps: [
      {
        id: '1',
        action: 'Plan Releases',
        description: 'Create release plans with clear versions, dates, and scope definition including features and epics.',
        element: 'release-planning'
      },
      {
        id: '2',
        action: 'Assign Features',
        description: 'Add features and epics to releases based on priority, dependencies, and capacity.',
        element: 'feature-assignment'
      },
      {
        id: '3',
        action: 'Track Progress',
        description: 'Monitor release progress through feature completion and overall release health metrics.',
        element: 'progress-monitoring'
      },
      {
        id: '4',
        action: 'Manage Dependencies',
        description: 'Identify and resolve blocking dependencies between features within and across releases.',
        element: 'dependency-management'
      },
      {
        id: '5',
        action: 'Prepare Release Notes',
        description: 'Document release contents, changes, and impacts for stakeholder communication.',
        element: 'release-notes'
      }
    ],
    tips: [
      'Plan releases around business cycles and market events',
      'Include buffer time for testing and bug fixes',
      'Communicate release plans early and often',
      'Use release themes to maintain focus and coherence'
    ],
    useCases: [
      'Go-to-market planning - Coordinate product launches',
      'Development scheduling - Organize engineering sprints',
      'Stakeholder communication - Share delivery timelines',
      'Risk management - Identify and mitigate release risks'
    ]
  },
  analytics: {
    id: 'analytics',
    module: 'Analytics',
    title: 'Product Analytics and Insights',
    overview: 'Analyze product performance, user behavior, and business metrics to make data-driven decisions.',
    steps: [
      {
        id: '1',
        action: 'Select Metrics',
        description: 'Choose from various product metrics including user engagement, feature adoption, and business KPIs.',
        element: 'metrics-selector'
      },
      {
        id: '2',
        action: 'Configure Time Ranges',
        description: 'Set date ranges and comparison periods to analyze trends and identify patterns over time.',
        element: 'time-range-controls'
      },
      {
        id: '3',
        action: 'Apply Filters',
        description: 'Filter data by user segments, feature categories, or other dimensions for focused analysis.',
        element: 'analytics-filters'
      },
      {
        id: '4',
        action: 'Create Custom Charts',
        description: 'Build custom visualizations to explore data relationships and communicate insights.',
        element: 'chart-builder'
      },
      {
        id: '5',
        action: 'Generate Reports',
        description: 'Export analytics data and insights for sharing with stakeholders and decision makers.',
        element: 'report-generation'
      }
    ],
    tips: [
      'Set up regular reporting dashboards for key stakeholders',
      'Use cohort analysis to understand user behavior over time',
      'Combine quantitative data with qualitative feedback',
      'Focus on actionable metrics that drive business decisions'
    ],
    useCases: [
      'Product performance - Measure feature success and adoption',
      'User behavior analysis - Understand how users interact with features',
      'Business intelligence - Connect product metrics to business outcomes',
      'A/B testing - Analyze experiment results and optimize features'
    ]
  },
  reports: {
    id: 'reports',
    module: 'Reports',
    title: 'Reporting and Business Intelligence',
    overview: 'Create, customize, and share comprehensive reports for stakeholders with advanced filtering and visualization.',
    steps: [
      {
        id: '1',
        action: 'Select Report Type',
        description: 'Choose from predefined report templates or create custom reports from scratch.',
        element: 'report-templates'
      },
      {
        id: '2',
        action: 'Configure Data Sources',
        description: 'Select data sources including features, goals, tasks, and feedback for comprehensive reporting.',
        element: 'data-sources'
      },
      {
        id: '3',
        action: 'Apply Filters and Grouping',
        description: 'Use advanced filtering and grouping options to focus on specific data segments.',
        element: 'report-filters'
      },
      {
        id: '4',
        action: 'Customize Visualizations',
        description: 'Choose chart types, colors, and layouts to create compelling visual presentations.',
        element: 'visualization-options'
      },
      {
        id: '5',
        action: 'Schedule and Share',
        description: 'Set up automated report delivery and share with stakeholders via email or dashboard.',
        element: 'sharing-options'
      }
    ],
    tips: [
      'Create report templates for recurring needs',
      'Use consistent color schemes and branding',
      'Include executive summaries for high-level stakeholders',
      'Automate report generation for regular updates'
    ],
    useCases: [
      'Executive dashboards - High-level metrics for leadership',
      'Team performance - Track productivity and progress',
      'Customer insights - Analyze feedback and satisfaction trends',
      'Project status - Comprehensive project health reports'
    ]
  },
  capacity: {
    id: 'capacity',
    module: 'Capacity Planning',
    title: 'Resource and Capacity Management',
    overview: 'Plan and optimize team capacity, resource allocation, and workload distribution across projects and time.',
    steps: [
      {
        id: '1',
        action: 'View Team Capacity',
        description: 'See current team member availability, skills, and workload distribution across time periods.',
        element: 'capacity-overview'
      },
      {
        id: '2',
        action: 'Plan Resource Allocation',
        description: 'Assign team members to projects and features based on capacity and skill requirements.',
        element: 'resource-allocation'
      },
      {
        id: '3',
        action: 'Identify Bottlenecks',
        description: 'Spot overallocated resources and capacity constraints that could impact delivery.',
        element: 'bottleneck-analysis'
      },
      {
        id: '4',
        action: 'Forecast Needs',
        description: 'Project future capacity requirements based on planned features and release schedules.',
        element: 'capacity-forecasting'
      },
      {
        id: '5',
        action: 'Optimize Allocation',
        description: 'Rebalance workloads and adjust timelines to optimize resource utilization.',
        element: 'optimization-tools'
      }
    ],
    tips: [
      'Account for vacation time and holidays in capacity planning',
      'Include time for meetings, code review, and other non-development activities',
      'Use historical velocity data for more accurate estimates',
      'Plan for 20% buffer time to handle unexpected issues'
    ],
    useCases: [
      'Sprint planning - Ensure realistic sprint commitments',
      'Hiring decisions - Identify when to bring in additional resources',
      'Project scheduling - Set realistic delivery timelines',
      'Skills gap analysis - Identify training or hiring needs'
    ]
  },
  settings: {
    id: 'settings',
    module: 'Settings',
    title: 'System Configuration and Administration',
    overview: 'Configure system settings, manage users, customize workflows, and maintain system security.',
    steps: [
      {
        id: '1',
        action: 'Manage User Accounts',
        description: 'Add, edit, and remove user accounts, assign roles, and manage permissions.',
        element: 'user-management'
      },
      {
        id: '2',
        action: 'Configure Workflows',
        description: 'Customize status workflows for features, tasks, and other entities to match your processes.',
        element: 'workflow-config'
      },
      {
        id: '3',
        action: 'Set Up Integrations',
        description: 'Connect with external tools like Jira, Slack, GitHub, and other development tools.',
        element: 'integration-setup'
      },
      {
        id: '4',
        action: 'Customize Fields',
        description: 'Add custom fields and properties to capture organization-specific information.',
        element: 'field-customization'
      },
      {
        id: '5',
        action: 'Security Settings',
        description: 'Configure security policies, access controls, and audit logging.',
        element: 'security-config'
      }
    ],
    tips: [
      'Regularly review user access and permissions',
      'Back up configuration settings before making changes',
      'Test integrations in a staging environment first',
      'Document custom configurations for team reference'
    ],
    useCases: [
      'Onboarding - Set up new team members and permissions',
      'Process optimization - Customize workflows for efficiency',
      'Tool integration - Connect with existing development stack',
      'Compliance - Ensure security and audit requirements are met'
    ]
  }
};

export const VoiceTrainingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentModule, setCurrentModule] = useState('');
  const [currentGuide, setCurrentGuide] = useState<VoiceGuide | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    
    // Stop voice training when user navigates or interacts
    const handleUserInteraction = () => {
      if (isActive && isPlaying) {
        pauseTraining();
      }
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [isActive, isPlaying]);

  const speak = useCallback((text: string) => {
    if (!synthRef.current || isMuted) return;

    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    utterance.onerror = () => {
      setIsPlaying(false);
    };
    
    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
  }, [isMuted, speed]);

  const startTraining = useCallback((module: string, guide: VoiceGuide) => {
    setIsActive(true);
    setCurrentModule(module);
    setCurrentGuide(guide);
    setCurrentStepIndex(0);
    
    const introText = `Welcome to ${guide.title} training. ${guide.overview}`;
    speak(introText);
  }, [speak]);

  const stopTraining = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsActive(false);
    setIsPlaying(false);
    setCurrentModule('');
    setCurrentGuide(null);
    setCurrentStepIndex(0);
  }, []);

  const pauseTraining = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
  }, []);

  const resumeTraining = useCallback(() => {
    if (currentGuide && currentStepIndex < currentGuide.steps.length) {
      const step = currentGuide.steps[currentStepIndex];
      speak(`${step.action}: ${step.description}`);
    }
  }, [currentGuide, currentStepIndex, speak]);

  const nextStep = useCallback(() => {
    if (currentGuide && currentStepIndex < currentGuide.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const step = currentGuide.steps[nextIndex];
      speak(`Step ${nextIndex + 1}: ${step.action}. ${step.description}`);
    } else if (currentGuide) {
      // Training complete
      speak('Training complete! You can now start using this module. Would you like to hear some tips and use cases?');
    }
  }, [currentGuide, currentStepIndex, speak]);

  const speakTips = useCallback(() => {
    if (currentGuide) {
      const tipsText = `Here are some helpful tips: ${currentGuide.tips.join('. ')}`;
      speak(tipsText);
    }
  }, [currentGuide, speak]);

  const speakUseCases = useCallback(() => {
    if (currentGuide) {
      const useCasesText = `Common use cases include: ${currentGuide.useCases.join('. ')}`;
      speak(useCasesText);
    }
  }, [currentGuide, speak]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    if (!isMuted && synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  }, [isMuted]);

  const contextValue: VoiceTrainingContextType = {
    isActive,
    isPlaying,
    currentModule,
    currentGuide,
    startTraining,
    stopTraining,
    pauseTraining,
    resumeTraining,
    isMuted,
    toggleMute,
    setSpeed,
    speed
  };

  return (
    <VoiceTrainingContext.Provider value={contextValue}>
      {children}
      
      {isActive && currentGuide && (
        <div className="fixed bottom-4 right-4 z-50 w-80">
          <Card className="border-primary/20 shadow-lg">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="font-semibold">
                  Voice Training: {currentGuide.module}
                </Badge>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="h-8 w-8 p-0"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={stopTraining}
                    className="h-8 w-8 p-0"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Step {currentStepIndex + 1} of {currentGuide.steps.length}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={isPlaying ? pauseTraining : resumeTraining}
                      className="h-8 w-8 p-0"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextStep}
                      className="h-8 w-8 p-0"
                    >
                      ⏭️
                    </Button>
                  </div>
                </div>
                
                {currentStepIndex < currentGuide.steps.length && (
                  <div className="text-sm">
                    <div className="font-medium">{currentGuide.steps[currentStepIndex].action}</div>
                    <div className="text-muted-foreground text-xs">
                      {currentGuide.steps[currentStepIndex].description}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={speakTips}
                  className="flex-1 text-xs"
                >
                  💡 Tips
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={speakUseCases}
                  className="flex-1 text-xs"
                >
                  🎯 Use Cases
                </Button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span>Speed:</span>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span>{speed}x</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </VoiceTrainingContext.Provider>
  );
};