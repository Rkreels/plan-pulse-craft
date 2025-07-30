import React from 'react';
import { WorkflowAutomation } from '@/components/missing-features/WorkflowAutomation';
import { PageTitle } from '@/components/common/PageTitle';
import { VoiceTrainingButton } from '@/components/voice-training/VoiceTrainingButton';

const WorkflowAutomationPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle 
          title="Workflow Automation" 
          description="Automate repetitive tasks and streamline your product management workflows"
        />
        <VoiceTrainingButton module="workflow-automation" />
      </div>
      <WorkflowAutomation />
    </div>
  );
};

export default WorkflowAutomationPage;