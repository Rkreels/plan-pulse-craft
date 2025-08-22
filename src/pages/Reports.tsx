
import React, { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { ReportsList } from "@/components/reports/ReportsList";
import { ReportViewer } from "@/components/reports/ReportViewer";
import { ReportBuilder } from "@/components/reports/ReportBuilder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/contexts/AppContext";
import { VoiceTrainingButton } from "@/components/voice-training/VoiceTrainingButton";
import { BarChart3, FileText, TrendingUp, Users, Target, Calendar } from "lucide-react";
import { toast } from "sonner";

const Reports = () => {
  const { features, feedback, goals, tasks } = useAppContext();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Enhanced report data with proper calculations
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
        completionRate: features.length > 0 ? Math.round((features.filter(f => f.status === "completed").length / features.length) * 100) : 0
      },
      description: "Comprehensive overview of feature development progress"
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
        avgRating: feedback.length > 0 ? Math.round((feedback.reduce((sum, f) => sum + (f.votes || 0), 0) / feedback.length) * 10) / 10 : 0
      },
      description: "Analysis of customer feedback trends and satisfaction"
    },
    {
      id: "3",
      name: "Goals Achievement Report",
      type: "goals" as const,
      data: goals,
      generatedAt: new Date(Date.now() - 172800000).toISOString(),
      metrics: {
        total: goals.length,
        completed: goals.filter(g => g.progress >= 100).length,
        inProgress: goals.filter(g => g.progress > 0 && g.progress < 100).length,
        pending: goals.filter(g => g.progress === 0).length,
        avgProgress: goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0
      },
      description: "Strategic goals tracking and achievement status"
    },
    {
      id: "4",
      name: "Task Performance Report",
      type: "tasks" as const,
      data: tasks,
      generatedAt: new Date(Date.now() - 259200000).toISOString(),
      metrics: {
        total: tasks.length,
        completed: tasks.filter(t => t.status === "completed").length,
        inProgress: tasks.filter(t => t.status === "in_progress").length,
        pending: tasks.filter(t => t.status === "not_started").length,
        productivity: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === "completed").length / tasks.length) * 100) : 0
      },
      description: "Team productivity and task completion analysis"
    }
  ];

  const selectedReport = reports.find(r => r.id === selectedReportId);

  const handleReportSaved = () => {
    setIsBuilding(false);
    setRefreshTrigger(prev => prev + 1);
    toast.success("Report saved successfully");
  };

  const handleGenerateReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setSelectedReportId(reportId);
      toast.success(`Generated ${report.name}`, {
        description: `Report contains ${report.metrics.total} items`
      });
    }
  };

  const handleExportReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      try {
        const exportData = {
          reportName: report.name,
          generatedAt: new Date().toISOString(),
          metrics: report.metrics,
          data: report.data
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        toast.success("Report exported successfully", {
          description: `${report.name} has been downloaded`
        });
      } catch (error) {
        toast.error("Export failed", {
          description: "Please try again"
        });
      }
    }
  };

  if (isBuilding) {
    return (
      <div className="space-y-6">
        <PageTitle 
          title="Report Builder" 
          description="Create custom reports and analytics"
        />
        <div className="flex justify-end mb-4">
          <VoiceTrainingButton module="reports" />
        </div>
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
      
      <div className="flex justify-end mb-4">
        <VoiceTrainingButton module="reports" />
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">Available reports</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Features Tracked</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{features.length}</div>
            <p className="text-xs text-muted-foreground">
              {features.filter(f => f.status === "completed").length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feedback Items</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedback.length}</div>
            <p className="text-xs text-muted-foreground">Customer insights</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
            <p className="text-xs text-muted-foreground">Strategic objectives</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(report.generatedAt).toLocaleDateString()}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{report.metrics.total}</div>
                  <div className="text-sm text-muted-foreground">Total Items</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{report.metrics.completed}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => handleGenerateReport(report.id)}
                  className="flex-1"
                >
                  View Report
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExportReport(report.id)}
                >
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Report Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Custom Report Builder
          </CardTitle>
          <CardDescription>
            Create tailored reports with specific metrics and filters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsBuilding(true)} className="w-full">
            Build Custom Report
          </Button>
        </CardContent>
      </Card>
      
      <ReportsList 
        onSelectReport={setSelectedReportId}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
};

export default Reports;
