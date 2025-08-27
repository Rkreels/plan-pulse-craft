import React from 'react';
import { WorkflowAutomation } from '@/components/missing-features/WorkflowAutomation';
import { PageTitle } from '@/components/common/PageTitle';

const WorkflowAutomationPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageTitle 
        title="Workflow Automation" 
        description="Automate repetitive tasks and streamline your product management workflows"
      />
      <WorkflowAutomation />
    </div>
  );
};

export default WorkflowAutomationPage;