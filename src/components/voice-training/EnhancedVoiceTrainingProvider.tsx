import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, RotateCcw, BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';

interface VoiceTrainingContextType {
  isActive: boolean;
  isPlaying: boolean;
  currentModule: string;
  currentGuide: VoiceGuide | null;
  currentStepIndex: number;
  startTraining: (module: string, guide: VoiceGuide) => void;
  stopTraining: () => void;
  pauseTraining: () => void;
  resumeTraining: () => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (index: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  setSpeed: (speed: number) => void;
  speed: number;
  speakTips: () => void;
  speakUseCases: () => void;
  highlightElement: (selector: string) => void;
  clearHighlight: () => void;
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
  interactionType?: 'click' | 'hover' | 'scroll' | 'type' | 'observe';
  targetSelector?: string;
}

const VoiceTrainingContext = createContext<VoiceTrainingContextType | undefined>(undefined);

export const useVoiceTraining = () => {
  const context = useContext(VoiceTrainingContext);
  if (!context) {
    throw new Error('useVoiceTraining must be used within VoiceTrainingProvider');
  }
  return context;
};

// Enhanced voice guides with interactive elements
export const VOICE_GUIDES: Record<string, VoiceGuide> = {
  dashboard: {
    id: 'dashboard',
    module: 'Dashboard',
    title: 'Product Management Dashboard',
    overview: 'Learn to navigate and use the comprehensive dashboard to monitor your product management activities.',
    steps: [
      {
        id: '1',
        action: 'Welcome to Dashboard',
        description: 'This is your main control center. Let me guide you through each section.',
        interactionType: 'observe'
      },
      {
        id: '2',
        action: 'View Key Metrics',
        description: 'Look at the metric cards at the top showing Features, Goals, Tasks, and Feedback with progress bars.',
        element: 'metric-cards',
        targetSelector: '.grid-cols-4',
        interactionType: 'hover'
      },
      {
        id: '3',
        action: 'Check Alert Notifications',
        description: 'Below metrics, you\'ll see alerts for overdue items and upcoming deadlines.',
        element: 'alerts',
        targetSelector: '[data-testid="alerts-section"]',
        interactionType: 'observe'
      },
      {
        id: '4',
        action: 'Analyze Progress Charts',
        description: 'The charts section shows completion trends and status distribution.',
        element: 'charts',
        targetSelector: '.recharts-wrapper',
        interactionType: 'hover'
      },
      {
        id: '5',
        action: 'Review Priority Items',
        description: 'The sidebar shows high-priority features needing attention.',
        element: 'priority-sidebar',
        targetSelector: '.space-y-4',
        interactionType: 'scroll'
      }
    ],
    tips: [
      'Check the dashboard daily for a quick overview',
      'Click on any metric to drill down into details',
      'Use alerts to prioritize your daily work',
      'Export charts for presentations'
    ],
    useCases: [
      'Daily standup preparation',
      'Executive reporting',
      'Team performance tracking',
      'Identifying bottlenecks'
    ]
  },
  features: {
    id: 'features',
    module: 'Features',
    title: 'Feature Management System',
    overview: 'Master the complete feature lifecycle from creation to delivery.',
    steps: [
      {
        id: '1',
        action: 'Create New Feature',
        description: 'Click the "New Feature" button to open the creation dialog.',
        element: 'new-feature-button',
        targetSelector: 'button:contains("New Feature")',
        interactionType: 'click'
      },
      {
        id: '2',
        action: 'Fill Feature Details',
        description: 'Enter title, description, user story, and acceptance criteria.',
        element: 'feature-form',
        targetSelector: 'form',
        interactionType: 'type'
      },
      {
        id: '3',
        action: 'Set Priority and Effort',
        description: 'Use the priority dropdown and effort slider to estimate complexity.',
        element: 'priority-effort',
        targetSelector: 'select, input[type="range"]',
        interactionType: 'click'
      },
      {
        id: '4',
        action: 'Assign Team Members',
        description: 'Select responsible team members from the assignee dropdown.',
        element: 'assignees',
        targetSelector: '[role="combobox"]',
        interactionType: 'click'
      },
      {
        id: '5',
        action: 'Link to Epic and Release',
        description: 'Connect this feature to strategic epics and delivery releases.',
        element: 'linking',
        targetSelector: 'select[name="epic"], select[name="release"]',
        interactionType: 'click'
      },
      {
        id: '6',
        action: 'Save Feature',
        description: 'Click Save to create your feature and add it to the backlog.',
        element: 'save-button',
        targetSelector: 'button[type="submit"]',
        interactionType: 'click'
      }
    ],
    tips: [
      'Write clear acceptance criteria for better estimates',
      'Use tags to categorize features',
      'Link customer feedback to validate importance',
      'Regular status updates keep roadmaps accurate'
    ],
    useCases: [
      'Backlog management',
      'Sprint planning',
      'Stakeholder communication',
      'Dependency tracking'
    ],
    shortcuts: ['Ctrl+N: New Feature', 'Ctrl+F: Search Features', 'Ctrl+S: Save Changes']
  }
  // Add other modules...
};

export const EnhancedVoiceTrainingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentModule, setCurrentModule] = useState('');
  const [currentGuide, setCurrentGuide] = useState<VoiceGuide | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const highlightStylesRef = useRef<HTMLStyleElement | null>(null);

  // Initialize speech synthesis and create highlight styles
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Create dynamic highlight styles
    const style = document.createElement('style');
    style.textContent = `
      .voice-training-highlight {
        position: relative !important;
        z-index: 9999 !important;
        animation: pulse-highlight 2s infinite !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5) !important;
        border-radius: 4px !important;
      }
      
      .voice-training-highlight::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: rgba(59, 130, 246, 0.1);
        border: 2px solid #3b82f6;
        border-radius: 6px;
        pointer-events: none;
        z-index: 10000;
      }
      
      @keyframes pulse-highlight {
        0%, 100% { 
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
        }
        50% { 
          box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.3);
        }
      }
      
      .voice-training-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border-radius: 50%;
        z-index: 10001;
        pointer-events: none;
        transition: all 0.3s ease;
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
      }
    `;
    document.head.appendChild(style);
    highlightStylesRef.current = style;

    // Auto-stop on user interaction
    const handleUserInteraction = (e: Event) => {
      if (isActive && !(e.target as HTMLElement)?.closest('.voice-training-controls')) {
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
      if (highlightStylesRef.current) {
        document.head.removeChild(highlightStylesRef.current);
      }
    };
  }, [isActive]);

  const highlightElement = useCallback((selector: string) => {
    clearHighlight();
    
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.classList.add('voice-training-highlight');
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedElement(element);

      // Animate cursor to element
      const rect = element.getBoundingClientRect();
      const cursor = document.createElement('div');
      cursor.className = 'voice-training-cursor';
      cursor.style.left = `${rect.left + rect.width / 2}px`;
      cursor.style.top = `${rect.top + rect.height / 2}px`;
      document.body.appendChild(cursor);

      setTimeout(() => {
        cursor.remove();
      }, 3000);
    }
  }, []);

  const clearHighlight = useCallback(() => {
    if (highlightedElement) {
      highlightedElement.classList.remove('voice-training-highlight');
      setHighlightedElement(null);
    }
    
    // Remove any existing cursors
    document.querySelectorAll('.voice-training-cursor').forEach(cursor => cursor.remove());
  }, [highlightedElement]);

  const speak = useCallback((text: string, onComplete?: () => void) => {
    if (!synthRef.current || isMuted) {
      onComplete?.();
      return;
    }

    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onend = () => {
      setIsPlaying(false);
      onComplete?.();
    };
    
    utterance.onerror = () => {
      setIsPlaying(false);
      onComplete?.();
    };
    
    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
  }, [isMuted, speed]);

  const executeStep = useCallback((step: VoiceStep) => {
    const stepText = `${step.action}. ${step.description}`;
    
    speak(stepText, () => {
      // Highlight element after speaking
      if (step.targetSelector) {
        setTimeout(() => {
          highlightElement(step.targetSelector!);
        }, 500);
      }
    });
  }, [speak, highlightElement]);

  const startTraining = useCallback((module: string, guide: VoiceGuide) => {
    clearHighlight();
    setIsActive(true);
    setCurrentModule(module);
    setCurrentGuide(guide);
    setCurrentStepIndex(0);
    
    const introText = `Welcome to ${guide.title} training. ${guide.overview} Let's begin with step 1.`;
    speak(introText, () => {
      if (guide.steps.length > 0) {
        setTimeout(() => executeStep(guide.steps[0]), 1000);
      }
    });
  }, [speak, executeStep, clearHighlight]);

  const stopTraining = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    clearHighlight();
    setIsActive(false);
    setIsPlaying(false);
    setCurrentModule('');
    setCurrentGuide(null);
    setCurrentStepIndex(0);
  }, [clearHighlight]);

  const pauseTraining = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
  }, []);

  const resumeTraining = useCallback(() => {
    if (currentGuide && currentStepIndex < currentGuide.steps.length) {
      executeStep(currentGuide.steps[currentStepIndex]);
    }
  }, [currentGuide, currentStepIndex, executeStep]);

  const nextStep = useCallback(() => {
    if (currentGuide && currentStepIndex < currentGuide.steps.length - 1) {
      clearHighlight();
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setTimeout(() => executeStep(currentGuide.steps[nextIndex]), 300);
    } else if (currentGuide) {
      clearHighlight();
      speak('Training complete! You can now use this module effectively. Would you like to hear tips or use cases?');
    }
  }, [currentGuide, currentStepIndex, executeStep, clearHighlight, speak]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      clearHighlight();
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      if (currentGuide) {
        setTimeout(() => executeStep(currentGuide.steps[prevIndex]), 300);
      }
    }
  }, [currentStepIndex, currentGuide, executeStep, clearHighlight]);

  const goToStep = useCallback((index: number) => {
    if (currentGuide && index >= 0 && index < currentGuide.steps.length) {
      clearHighlight();
      setCurrentStepIndex(index);
      setTimeout(() => executeStep(currentGuide.steps[index]), 300);
    }
  }, [currentGuide, executeStep, clearHighlight]);

  const speakTips = useCallback(() => {
    if (currentGuide) {
      const tipsText = `Here are helpful tips for ${currentGuide.module}: ${currentGuide.tips.join('. ')}`;
      speak(tipsText);
    }
  }, [currentGuide, speak]);

  const speakUseCases = useCallback(() => {
    if (currentGuide) {
      const useCasesText = `Common use cases for ${currentGuide.module} include: ${currentGuide.useCases.join('. ')}`;
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
    currentStepIndex,
    startTraining,
    stopTraining,
    pauseTraining,
    resumeTraining,
    nextStep,
    previousStep,
    goToStep,
    isMuted,
    toggleMute,
    setSpeed,
    speed,
    speakTips,
    speakUseCases,
    highlightElement,
    clearHighlight
  };

  const progressPercentage = currentGuide 
    ? ((currentStepIndex + 1) / currentGuide.steps.length) * 100 
    : 0;

  return (
    <VoiceTrainingContext.Provider value={contextValue}>
      {children}
      
      {isActive && currentGuide && (
        <div className="fixed bottom-4 right-4 z-50 w-96 voice-training-controls">
          <Card className="border-primary/20 shadow-2xl bg-background/95 backdrop-blur-sm">
            <CardContent className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <Badge variant="secondary" className="font-semibold">
                    {currentGuide.module}
                  </Badge>
                </div>
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
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Step {currentStepIndex + 1} of {currentGuide.steps.length}</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {/* Current Step */}
              {currentStepIndex < currentGuide.steps.length && (
                <div className="space-y-2">
                  <div className="font-medium text-sm">
                    {currentGuide.steps[currentStepIndex].action}
                  </div>
                  <div className="text-muted-foreground text-xs leading-relaxed">
                    {currentGuide.steps[currentStepIndex].description}
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={previousStep}
                    disabled={currentStepIndex === 0}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
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
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={speakTips}
                    className="text-xs h-7"
                  >
                    💡 Tips
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={speakUseCases}
                    className="text-xs h-7"
                  >
                    🎯 Cases
                  </Button>
                </div>
              </div>

              {/* Speed Control */}
              <div className="flex items-center gap-2 text-xs">
                <span>Speed:</span>
                <Slider
                  value={[speed]}
                  onValueChange={(value) => setSpeed(value[0])}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="flex-1"
                />
                <span className="w-8">{speed}x</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </VoiceTrainingContext.Provider>
  );
};