
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowDown,
  Download, 
  PlusCircle, 
  Save, 
  Share2,
  LineChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Analytics = () => {
  const { features, epics, releases } = useAppContext();
  const [view, setView] = useState("dashboard");
  const [reportType, setReportType] = useState("feature");

  // Calculate statistics
  const featuresByStatus = [
    { name: 'Idea', value: features.filter(f => f.status === 'idea').length },
    { name: 'Backlog', value: features.filter(f => f.status === 'backlog').length },
    { name: 'Planned', value: features.filter(f => f.status === 'planned').length },
    { name: 'In Progress', value: features.filter(f => f.status === 'in_progress').length },
    { name: 'Review', value: features.filter(f => f.status === 'review').length },
    { name: 'Completed', value: features.filter(f => f.status === 'completed').length },
  ];

  const epicProgress = epics.map(epic => ({
    name: epic.title.length > 20 ? `${epic.title.substring(0, 20)}...` : epic.title,
    progress: epic.progress
  }));

  const releaseData = releases.map(release => ({
    name: release.name,
    features: release.features.length
  }));

  const featuresByPriority = [
    { name: 'Critical', value: features.filter(f => f.priority === 'critical').length },
    { name: 'High', value: features.filter(f => f.priority === 'high').length },
    { name: 'Medium', value: features.filter(f => f.priority === 'medium').length },
    { name: 'Low', value: features.filter(f => f.priority === 'low').length },
  ];

  // Summary statistics
  const totalFeatures = features.length;
  const completedFeatures = features.filter(f => f.status === 'completed').length;
  const inProgressFeatures = features.filter(f => f.status === 'in_progress').length;
  const completionRate = totalFeatures ? (completedFeatures / totalFeatures * 100).toFixed(1) : 0;
  
  // Get current month
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <>
      <PageTitle
        title="Analytics & Reporting"
        description="Track product metrics and generate customized reports"
        action={{
          label: "Export Report",
          icon: <Download className="h-4 w-4" />,
          onClick: () => {
            // In a real app, this would export a report
          }
        }}
      />
      
      <Tabs value={view} onValueChange={setView} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between mb-6">
          <TabsList className="mb-4 sm:mb-0">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reports">Custom Reports</TabsTrigger>
          </TabsList>
          
          {view === "dashboard" && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" /> Save Dashboard
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>
          )}
          
          {view === "reports" && (
            <div className="flex gap-2">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">Feature Status</SelectItem>
                  <SelectItem value="velocity">Velocity</SelectItem>
                  <SelectItem value="release">Release Planning</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" /> New Report
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFeatures}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentMonth}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressFeatures}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active development
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedFeatures}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ready to ship
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completionRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <ArrowDown className="inline h-3 w-3 mr-1 text-red-500" />
                  Compared to target
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Placeholder for charts that would be implemented with actual chart components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Features by Status Chart</p>
              </div>
            </Card>
            <Card className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Epic Progress Chart</p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Create and save custom reports based on your specific needs. Select metrics, filters, and visualizations to
                generate insightful reports.
              </p>
              <div className="border rounded-md p-8 flex flex-col items-center justify-center">
                <LineChart className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg">Select a report type</h3>
                <p className="text-center text-muted-foreground mt-2">
                  Choose a report type from the dropdown above to get started or create a new custom report.
                </p>
                <Button className="mt-6">
                  <PlusCircle className="h-4 w-4 mr-2" /> New Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Analytics;
