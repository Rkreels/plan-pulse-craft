
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Volume2 } from 'lucide-react';
import { useVoiceTraining, VOICE_GUIDES } from './EnhancedVoiceTrainingProvider';
import { useLocation } from 'react-router-dom';

interface VoiceTrainingButtonProps {
  module?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const VoiceTrainingButton: React.FC<VoiceTrainingButtonProps> = ({
  module,
  variant = 'outline',
  size = 'sm',
  className = ''
}) => {
  const { startTraining, isActive, currentModule } = useVoiceTraining();
  const location = useLocation();

  // Auto-detect module from current route if not provided
  const detectModuleFromRoute = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    if (path.startsWith('/features')) return 'features';
    if (path.startsWith('/ideas')) return 'ideas';
    if (path.startsWith('/roadmap')) return 'roadmap';
    if (path.startsWith('/goals')) return 'goals';
    if (path.startsWith('/tasks')) return 'tasks';
    if (path.startsWith('/feedback')) return 'feedback';
    if (path.startsWith('/releases')) return 'releases';
    if (path.startsWith('/analytics')) return 'analytics';
    if (path.startsWith('/reports')) return 'reports';
    if (path.startsWith('/capacity')) return 'capacity';
    if (path.startsWith('/settings')) return 'settings';
    if (path.startsWith('/team')) return 'team';
    if (path.startsWith('/competitor-analysis')) return 'competitor';
    if (path.startsWith('/workflow-automation')) return 'workflow';
    if (path.startsWith('/portfolio')) return 'portfolio';
    if (path.startsWith('/idea-scoring')) return 'ideaScoring';
    return 'dashboard';
  };

  const currentModuleKey = module || detectModuleFromRoute();
  const guide = VOICE_GUIDES[currentModuleKey];

  if (!guide) return null;

  const handleStartTraining = () => {
    startTraining(currentModuleKey, guide);
  };

  const isCurrentlyActive = isActive && currentModule === currentModuleKey;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleStartTraining}
      className={`${className} ${isCurrentlyActive ? 'bg-primary/10 border-primary' : ''}`}
      disabled={isCurrentlyActive}
    >
      {isCurrentlyActive ? (
        <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
      ) : (
        <BookOpen className="h-4 w-4 mr-2" />
      )}
      {isCurrentlyActive ? 'Training Active' : 'Voice Guide'}
    </Button>
  );
};
