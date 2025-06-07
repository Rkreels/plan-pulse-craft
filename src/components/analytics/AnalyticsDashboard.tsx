
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/contexts/AppContext";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from "recharts";
import { 
  TrendingUp, 
  Target, 
  Users, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  BarChart3
} from "lucide-react";

export const AnalyticsDashboard = () => {
  const { features, goals, releases, tasks, feedback, epics } = useAppContext();
  const [timeRange, setTimeRange] = useState("month");
  const [selectedMetric, setSelectedMetric] = useState("features");

  // Calculate comprehensive analytics
  const analytics = useMemo(() => {
    const now = new Date();
    const timeRanges = {
      week: 7,
      month: 30,
      quarter: 90,
      year: 365
    };
    
    const daysBack = timeRanges[timeRange as keyof typeof timeRanges] || 30;
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    // Feature analytics
    const featureMetrics = {
      total: features.length,
      completed: features.filter(f => f.status === "completed").length,
      inProgress: features.filter(f => f.status === "in_progress").length,
      velocity: features.filter(f => 
        f.status === "completed" && 
        new Date(f.updatedAt) >= startDate
      ).length,
      avgEffort: features.reduce((sum, f) => sum + f.effort, 0) / features.length || 0,
      avgValue: features.reduce((sum, f) => sum + f.value, 0) / features.length || 0
    };

    // Goal analytics
    const goalMetrics = {
      total: goals.length,
      completed: goals.filter(g => g.status === "completed").length,
      inProgress: goals.filter(g => g.status === "in_progress").length,
      atRisk: goals.filter(g => g.status === "at_risk").length,
      avgProgress: goals.reduce((sum, g) => sum + g.progress, 0) / goals.length || 0
    };

    // Task analytics
    const taskMetrics = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === "completed").length,
      inProgress: tasks.filter(t => t.status === "in_progress").length,
      blocked: tasks.filter(t => t.status === "blocked").length,
      overdue: tasks.filter(t => 
        t.dueDate && new Date(t.dueDate) < now && t.status !== "completed"
      ).length,
      avgProgress: tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length || 0
    };

    // Feedback analytics
    const feedbackMetrics = {
      total: feedback.length,
      new: feedback.filter(f => f.status === "new").length,
      reviewed: feedback.filter(f => f.status === "reviewed").length,
      linked: feedback.filter(f => f.status === "linked").length,
      avgVotes: feedback.reduce((sum, f) => sum + f.votes, 0) / feedback.length || 0
    };

    return {
      featureMetrics,
      goalMetrics,
      taskMetrics,
      feedbackMetrics
    };
  }, [features, goals, tasks, feedback, timeRange]);

  // Chart data
  const velocityData = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekStart = new Date(date.getTime() - date.getDay() * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const completedFeatures = features.filter(f => 
        f.status === "completed" && 
        new Date(f.updatedAt) >= weekStart &&
        new Date(f.updatedAt) < weekEnd
      ).length;
      
      const completedTasks = tasks.filter(t => 
        t.status === "completed" && 
        new Date(t.updatedAt) >= weekStart &&
        new Date(t.updatedAt) < weekEnd
      ).length;

      data.push({
        week: `Week ${i + 1}`,
        features: completedFeatures,
        tasks: completedTasks,
        date: weekStart.toLocaleDateString()
      });
    }
    return data;
  }, [features, tasks]);

  const priorityDistribution = [
    { name: 'Critical', value: features.filter(f => f.priority === 'critical').length, color: '#ef4444' },
    { name: 'High', value: features.filter(f => f.priority === 'high').length, color: '#f97316' },
    { name: 'Medium', value: features.filter(f => f.priority === 'medium').length, color: '#eab308' },
    { name: 'Low', value: features.filter(f => f.priority === 'low').length, color: '#22c55e' }
  ];

  const statusTrends = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthFeatures = features.filter(f => {
        const featureDate = new Date(f.createdAt);
        return featureDate.getMonth() === date.getMonth() && 
               featureDate.getFullYear() === date.getFullYear();
      });

      data.push({
        month: monthName,
        created: monthFeatures.length,
        completed: monthFeatures.filter(f => f.status === 'completed').length,
        inProgress: monthFeatures.filter(f => f.status === 'in_progress').length
      });
    }
    return data;
  }, [features]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="features">Features</SelectItem>
              <SelectItem value="goals">Goals</SelectItem>
              <SelectItem value="tasks">Tasks</SelectItem>
              <SelectItem value="feedback">Feedback</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline">
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Velocity</p>
                <p className="text-2xl font-bold">{analytics.featureMetrics.velocity}</p>
                <p className="text-xs text-muted-foreground">features completed</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Goal Progress</p>
                <p className="text-2xl font-bold">{Math.round(analytics.goalMetrics.avgProgress)}%</p>
                <p className="text-xs text-muted-foreground">average completion</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Task Efficiency</p>
                <p className="text-2xl font-bold">{Math.round(analytics.taskMetrics.avgProgress)}%</p>
                <p className="text-xs text-muted-foreground">average progress</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Feedback Score</p>
                <p className="text-2xl font-bold">{Math.round(analytics.feedbackMetrics.avgVotes * 10) / 10}</p>
                <p className="text-xs text-muted-foreground">average votes</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Velocity</CardTitle>
            <CardDescription>Features and tasks completed over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="features" fill="#3b82f6" name="Features" />
                <Bar dataKey="tasks" fill="#10b981" name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>Feature priorities breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                >
                  {priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-4">
              {priorityDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Status Trends</CardTitle>
            <CardDescription>Feature status changes over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={statusTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="created" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                <Area type="monotone" dataKey="inProgress" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                <Area type="monotone" dataKey="completed" stackId="1" stroke="#10b981" fill="#10b981" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Tables */}
      <Tabs defaultValue="features" className="w-full">
        <TabsList>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{analytics.featureMetrics.total}</div>
                  <div className="text-sm text-muted-foreground">Total Features</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{analytics.featureMetrics.completed}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analytics.featureMetrics.inProgress}</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{analytics.featureMetrics.avgEffort.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Avg Effort</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{analytics.featureMetrics.avgValue.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Avg Value</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{analytics.featureMetrics.velocity}</div>
                  <div className="text-sm text-muted-foreground">Velocity</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Goal Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{analytics.goalMetrics.total}</div>
                  <div className="text-sm text-muted-foreground">Total Goals</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{analytics.goalMetrics.completed}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analytics.goalMetrics.inProgress}</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{analytics.goalMetrics.atRisk}</div>
                  <div className="text-sm text-muted-foreground">At Risk</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{Math.round(analytics.goalMetrics.avgProgress)}%</div>
                  <div className="text-sm text-muted-foreground">Avg Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{analytics.taskMetrics.total}</div>
                  <div className="text-sm text-muted-foreground">Total Tasks</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{analytics.taskMetrics.completed}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analytics.taskMetrics.inProgress}</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{analytics.taskMetrics.blocked}</div>
                  <div className="text-sm text-muted-foreground">Blocked</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{analytics.taskMetrics.overdue}</div>
                  <div className="text-sm text-muted-foreground">Overdue</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{Math.round(analytics.taskMetrics.avgProgress)}%</div>
                  <div className="text-sm text-muted-foreground">Avg Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{analytics.feedbackMetrics.total}</div>
                  <div className="text-sm text-muted-foreground">Total Feedback</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analytics.feedbackMetrics.new}</div>
                  <div className="text-sm text-muted-foreground">New</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{analytics.feedbackMetrics.reviewed}</div>
                  <div className="text-sm text-muted-foreground">Reviewed</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{analytics.feedbackMetrics.linked}</div>
                  <div className="text-sm text-muted-foreground">Linked</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{analytics.feedbackMetrics.avgVotes.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Avg Votes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
