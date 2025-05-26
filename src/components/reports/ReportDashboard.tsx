
import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Calendar,
  Download,
  RefreshCw,
  Filter
} from "lucide-react";

export const ReportDashboard = () => {
  const { features, releases, epics, goals } = useAppContext();
  const [timeFrame, setTimeFrame] = useState("last30days");
  const [chartType, setChartType] = useState("overview");

  // Calculate comprehensive metrics
  const totalFeatures = features.length;
  const completedFeatures = features.filter(f => f.status === 'completed').length;
  const inProgressFeatures = features.filter(f => f.status === 'in_progress').length;
  const completionRate = totalFeatures ? ((completedFeatures / totalFeatures) * 100).toFixed(1) : "0";

  // Feature status distribution
  const statusData = [
    { name: 'Idea', value: features.filter(f => f.status === 'idea').length, color: '#8884d8' },
    { name: 'Backlog', value: features.filter(f => f.status === 'backlog').length, color: '#82ca9d' },
    { name: 'Planned', value: features.filter(f => f.status === 'planned').length, color: '#ffc658' },
    { name: 'In Progress', value: features.filter(f => f.status === 'in_progress').length, color: '#ff7300' },
    { name: 'Review', value: features.filter(f => f.status === 'review').length, color: '#00ff00' },
    { name: 'Completed', value: features.filter(f => f.status === 'completed').length, color: '#0088fe' }
  ];

  // Priority distribution
  const priorityData = [
    { name: 'Critical', value: features.filter(f => f.priority === 'critical').length, color: '#ff4444' },
    { name: 'High', value: features.filter(f => f.priority === 'high').length, color: '#ff8800' },
    { name: 'Medium', value: features.filter(f => f.priority === 'medium').length, color: '#ffcc00' },
    { name: 'Low', value: features.filter(f => f.priority === 'low').length, color: '#44ff44' }
  ];

  // Release progress
  const releaseData = releases.map(release => ({
    name: release.name,
    features: release.features.length,
    completed: release.features.filter(fId => {
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

  // Epic progress
  const epicData = epics.map(epic => ({
    name: epic.title.length > 15 ? `${epic.title.substring(0, 15)}...` : epic.title,
    progress: epic.progress,
    features: epic.features.length
  }));

  // Mock velocity data (in real app, this would be calculated from historical data)
  const velocityData = [
    { week: 'Week 1', completed: 8, planned: 10 },
    { week: 'Week 2', completed: 12, planned: 12 },
    { week: 'Week 3', completed: 15, planned: 14 },
    { week: 'Week 4', completed: 11, planned: 13 }
  ];

  const renderChart = () => {
    switch (chartType) {
      case "status":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "priority":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case "velocity":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={velocityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="planned" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="completed" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={releaseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="progress" stroke="#8884d8" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last90days">Last 90 days</SelectItem>
              <SelectItem value="lastYear">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Release Progress</SelectItem>
              <SelectItem value="status">Feature Status</SelectItem>
              <SelectItem value="priority">Priority Distribution</SelectItem>
              <SelectItem value="velocity">Team Velocity</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Features</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFeatures}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressFeatures}</div>
            <p className="text-xs text-muted-foreground">
              Active development
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1 text-red-500" />
              -2% from target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Releases</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{releases.length}</div>
            <p className="text-xs text-muted-foreground">
              Planned releases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{chartType === 'overview' ? 'Release Progress' : 
                   chartType === 'status' ? 'Feature Status Distribution' :
                   chartType === 'priority' ? 'Priority Distribution' : 'Team Velocity'}</span>
            <Badge variant="outline">{timeFrame}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Epic Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {epicData.slice(0, 5).map((epic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{epic.name}</div>
                    <div className="text-xs text-muted-foreground">{epic.features} features</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${epic.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-10">{epic.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Release Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {releaseData.slice(0, 5).map((release, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{release.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {release.completed} of {release.features} features complete
                    </div>
                  </div>
                  <Badge variant={release.progress === 100 ? "default" : "secondary"}>
                    {release.progress}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
