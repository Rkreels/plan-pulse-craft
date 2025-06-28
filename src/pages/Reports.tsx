
import React, { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { ReportsList } from "@/components/reports/ReportsList";
import { ReportViewer } from "@/components/reports/ReportViewer";
import { ReportBuilder } from "@/components/reports/ReportBuilder";
import { useAppContext } from "@/contexts/AppContext";

const Reports = () => {
  const { features, feedback, goals } = useAppContext();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Mock report data - in real app this would come from API
  const reports = [
    {
      id: "1",
      name: "Feature Progress Report",
      type: "features" as const,
      data: features,
      generatedAt: new Date().toISOString(),
      metrics: {
        total: features.length,
        completed: features.filter(f => f.status === "completed").length,
        inProgress: features.filter(f => f.status === "in_progress").length,
        pending: features.filter(f => f.status === "backlog").length,
      }
    },
    {
      id: "2",
      name: "Customer Feedback Analysis",
      type: "feedback" as const,
      data: feedback,
      generatedAt: new Date(Date.now() - 86400000).toISOString(),
      metrics: {
        total: feedback.length,
        completed: feedback.filter(f => f.status === "closed").length,
        inProgress: feedback.filter(f => f.status === "reviewed").length,
        pending: feedback.filter(f => f.status === "new").length,
      }
    }
  ];

  const selectedReport = reports.find(r => r.id === selectedReportId);

  const handleReportSaved = () => {
    setIsBuilding(false);
    setRefreshTrigger(prev => prev + 1);
  };

  if (isBuilding) {
    return (
      <div className="space-y-6">
        <PageTitle 
          title="Report Builder" 
          description="Create custom reports and analytics"
        />
        <ReportBuilder 
          reportId={null}
          onReportSaved={handleReportSaved}
        />
      </div>
    );
  }

  if (selectedReport) {
    return (
      <div className="space-y-6">
        <ReportViewer 
          report={selectedReport}
          onBack={() => setSelectedReportId(null)}
          onEdit={() => setIsBuilding(true)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Reports & Analytics" 
        description="Generate insights and track progress with custom reports"
      />
      
      <ReportsList 
        onSelectReport={setSelectedReportId}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
};

export default Reports;
