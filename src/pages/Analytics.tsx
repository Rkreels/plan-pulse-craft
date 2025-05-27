
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
  LineChart,
  RefreshCw,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';
import { toast } from "sonner";

const Analytics = () => {
  const { features, epics, releases } = useAppContext();
  const [view, setView] = useState("dashboard");
  const [reportType, setReportType] = useState("feature");
  const [timeRange, setTimeRange] = useState("last_30_days");
  const [dashboardConfig, setDashboardConfig] = useState("default");

  // Calculate comprehensive statistics
  const totalFeatures = features.length;
  const completedFeatures = features.filter(f => f.status === 'completed').length;
  const inProgressFeatures = features.filter(f => f.status === 'in_progress').length;
  const completionRate = totalFeatures ? (completedFeatures / totalFeatures * 100).toFixed(1) : 0;

  const featuresByStatus = [
    { name: 'Idea', value: features.filter(f => f.status === 'idea').length, color: '#8884d8' },
    { name: 'Backlog', value: features.filter(f => f.status === 'backlog').length, color: '#82ca9d' },
    { name: 'Planned', value: features.filter(f => f.status === 'planned').length, color: '#ffc658' },
    { name: 'In Progress', value: features.filter(f => f.status === 'in_progress').length, color: '#ff7300' },
    { name: 'Review', value: features.filter(f => f.status === 'review').length, color: '#00ff00' },
    { name: 'Completed', value: features.filter(f => f.status === 'completed').length, color: '#0088fe' },
  ];

  const featuresByPriority = [
    { name: 'Critical', value: features.filter(f => f.priority === 'critical').length, color: '#ff4444' },
    { name: 'High', value: features.filter(f => f.priority === 'high').length, color: '#ff8800' },
    { name: 'Medium', value: features.filter(f => f.priority === 'medium').length, color: '#ffcc00' },
    { name: 'Low', value: features.filter(f => f.priority === 'low').length, color: '#44ff44' },
  ];

  const epicProgress = epics.map(epic => ({
    name: epic.title.length > 20 ? `${epic.title.substring(0, 20)}...` : epic.title,
    progress: epic.progress,
    features: epic.features.length
  }));

  const releaseData = releases.map(release => ({
    name: release.name,
    totalFeatures: release.features.length,
    completedFeatures: release.features.filter(fId => {
      const feature = features.find(f => f.id === fId);
      return feature?.status === 'completed';
    }).length,
    progress: release.features.length > 0 
      ? Math.round((release.features.filter(fId => {
          const feature = features.find(f => f.id === fId);
          return feature?.status === 'completed';
        }).length / release.features.length) * 100)
      : 0
  }));

  // Mock velocity data
  const velocityData = [
    { sprint: 'Sprint 1', planned: 20, completed: 18, velocity: 90 },
    { sprint: 'Sprint 2', planned: 22, completed: 24, velocity: 109 },
    { sprint: 'Sprint 3', planned: 25, completed: 23, velocity: 92 },
    { sprint: 'Sprint 4', planned: 23, completed: 25, velocity: 109 },
  ];

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  const handleSaveDashboard = () => {
    toast.success("Dashboard configuration saved successfully");
  };

  const handleShareDashboard = () => {
    toast.success("Dashboard sharing link copied to clipboard");
  };

  const handleExportReport = () => {
    toast.success(`Exporting ${reportType} report for ${timeRange}`);
  };

  const handleCreateReport = () => {
    toast.success("Opening report builder...");
  };

  const handleRefreshData = () => {
    toast.success("Analytics data refreshed");
  };

  return (
    <>
      <PageTitle
        title="Analytics & Reporting"
        description="Track product metrics, analyze trends, and generate comprehensive reports with real-time data"
        action={{
          label: "Export Report",
          icon: <Download className="h-4 w-4" />,
          onClick: handleExportReport
        }}
      />
      
      <Tabs value={view} onValueChange={setView} className="w-full">
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reports">Custom Reports</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-wrap gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_7_days">Last 7 days</SelectItem>
                <SelectItem value="last_30_days">Last 30 days</SelectItem>
                <SelectItem value="last_90_days">Last 90 days</SelectItem>
                <SelectItem value="last_year">Last year</SelectItem>
              </SelectContent>
            </Select>

            {view === "dashboard" && (
              <>
                <Button variant="outline" size="sm" onClick={handleRefreshData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={handleSaveDashboard}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Dashboard
                </Button>
                <Button variant="outline" size="sm" onClick={handleShareDashboard}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </>
            )}
            
            {view === "reports" && (
              <>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feature">Feature Analysis</SelectItem>
                    <SelectItem value="velocity">Team Velocity</SelectItem>
                    <SelectItem value="release">Release Planning</SelectItem>
                    <SelectItem value="epic">Epic Progress</SelectItem>
                    <SelectItem value="custom">Custom Report</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleCreateReport}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Report
                </Button>
              </>
            )}
          </div>
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
                <Progress value={(inProgressFeatures / totalFeatures) * 100} className="mt-2" />
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
                <Progress value={(completedFeatures / totalFeatures) * 100} className="mt-2" />
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
                  vs. target 80%
                </p>
                <Progress value={Number(completionRate)} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Features by Status
                  <Badge variant="outline">{timeRange}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={featuresByStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={featuresByPriority}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {featuresByPriority.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Release Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={releaseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalFeatures" fill="#8884d8" name="Total Features" />
                    <Bar dataKey="completedFeatures" fill="#82ca9d" name="Completed Features" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Velocity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={velocityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sprint" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="planned" stroke="#8884d8" name="Planned" />
                    <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Completed" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Epic Progress Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Epic Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {epicProgress.slice(0, 5).map((epic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{epic.name}</div>
                      <div className="text-xs text-muted-foreground">{epic.features} features</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${epic.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12">{epic.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Custom Report Builder
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 border-2 border-dashed border-gray-200 hover:border-primary cursor-pointer">
                  <div className="text-center">
                    <LineChart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">Feature Analysis</h3>
                    <p className="text-xs text-muted-foreground">
                      Analyze feature completion, status distribution, and trends
                    </p>
                  </div>
                </Card>
                
                <Card className="p-4 border-2 border-dashed border-gray-200 hover:border-primary cursor-pointer">
                  <div className="text-center">
                    <LineChart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">Velocity Report</h3>
                    <p className="text-xs text-muted-foreground">
                      Track team velocity and sprint performance over time
                    </p>
                  </div>
                </Card>
                
                <Card className="p-4 border-2 border-dashed border-gray-200 hover:border-primary cursor-pointer">
                  <div className="text-center">
                    <LineChart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">Release Planning</h3>
                    <p className="text-xs text-muted-foreground">
                      Plan releases with feature allocation and timeline analysis
                    </p>
                  </div>
                </Card>
              </div>
              
              <div className="text-center py-8">
                <h3 className="font-semibold text-lg mb-2">Create a Custom Report</h3>
                <p className="text-center text-muted-foreground mb-6">
                  Select a report type above or build a completely custom report with your own metrics, 
                  filters, and visualizations.
                </p>
                <Button onClick={handleCreateReport} size="lg">
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Build Custom Report
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
