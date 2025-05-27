
import { useState } from 'react';
import { PageTitle } from "@/components/common/PageTitle";
import { ReportsList } from "@/components/reports/ReportsList";
import { ReportBuilder } from "@/components/reports/ReportBuilder";
import { ReportDashboard } from "@/components/reports/ReportDashboard";
import { AIInsights } from "@/components/reports/AIInsights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Reports = () => {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReportSaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <PageTitle
        title="Advanced Reports"
        description="Create, customize, and share insightful product reports with real-time analytics and AI-powered insights"
      />
      
      <Tabs defaultValue="myReports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="myReports">My Reports</TabsTrigger>
          <TabsTrigger value="reportBuilder">Report Builder</TabsTrigger>
          <TabsTrigger value="dashboard">Analytics Dashboard</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="myReports" className="space-y-4">
          <ReportsList 
            onSelectReport={(id) => setActiveReport(id)} 
            refreshTrigger={refreshTrigger}
          />
        </TabsContent>
        <TabsContent value="reportBuilder" className="space-y-4">
          <ReportBuilder 
            reportId={activeReport} 
            onReportSaved={handleReportSaved}
          />
        </TabsContent>
        <TabsContent value="dashboard" className="space-y-4">
          <ReportDashboard />
        </TabsContent>
        <TabsContent value="insights" className="space-y-4">
          <AIInsights />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Reports;
