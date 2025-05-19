
import { useState } from 'react';
import { PageTitle } from "@/components/common/PageTitle";
import { ReportsList } from "@/components/reports/ReportsList";
import { ReportBuilder } from "@/components/reports/ReportBuilder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Reports = () => {
  const [activeReport, setActiveReport] = useState<string | null>(null);

  return (
    <>
      <PageTitle
        title="Advanced Reports"
        description="Create, customize, and share insightful product reports"
      />
      
      <Tabs defaultValue="myReports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="myReports">My Reports</TabsTrigger>
          <TabsTrigger value="reportBuilder">Report Builder</TabsTrigger>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
        </TabsList>
        <TabsContent value="myReports" className="space-y-4">
          <ReportsList onSelectReport={(id) => setActiveReport(id)} />
        </TabsContent>
        <TabsContent value="reportBuilder" className="space-y-4">
          <ReportBuilder reportId={activeReport} />
        </TabsContent>
        <TabsContent value="dashboards" className="space-y-4">
          <h2 className="text-lg font-medium">Custom Dashboards</h2>
          <p className="text-muted-foreground">Create and view customized dashboards with multiple report widgets.</p>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Reports;
