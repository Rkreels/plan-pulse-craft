import React, { useState, useMemo } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { VoiceTrainingButton } from "@/components/voice-training/VoiceTrainingButton";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users, 
  Calendar, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Plus
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const Index = () => {
  const { features, goals, releases, tasks, epics, feedback, currentUser } = useAppContext();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Calculate comprehensive dashboard metrics
  const dashboardMetrics = useMemo(() => {
    const totalFeatures = features.length;
    const completedFeatures = features.filter(f => f.status === "completed").length;
    const inProgressFeatures = features.filter(f => f.status === "in_progress").length;
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.status === "completed").length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const totalFeedback = feedback.length;
    const unreadFeedback = feedback.filter(f => f.status === "new").length;
    
    const upcomingReleases = releases.filter(r => 
      new Date(r.releaseDate) > new Date() && r.status !== "completed"
    ).length;
    
    const overdueTasks = tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed"
    ).length;

    return {
      totalFeatures,
      completedFeatures,
      inProgressFeatures,
      totalGoals,
      completedGoals,
      totalTasks,
      completedTasks,
      totalFeedback,
      unreadFeedback,
      upcomingReleases,
      overdueTasks,
      featureCompletionRate: totalFeatures > 0 ? (completedFeatures / totalFeatures) * 100 : 0,
      goalCompletionRate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0,
      taskCompletionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    };
  }, [features, goals, tasks, feedback, releases]);

  // Feature status distribution for chart
  const featureStatusData = [
    { name: 'Completed', value: features.filter(f => f.status === 'completed').length, color: '#10b981' },
    { name: 'In Progress', value: features.filter(f => f.status === 'in_progress').length, color: '#3b82f6' },
    { name: 'Planned', value: features.filter(f => f.status === 'planned').length, color: '#f59e0b' },
    { name: 'Backlog', value: features.filter(f => f.status === 'backlog').length, color: '#6b7280' }
  ];

  // Weekly progress data
  const weeklyProgressData = [
    { name: 'Mon', features: 2, tasks: 5 },
    { name: 'Tue', features: 4, tasks: 8 },
    { name: 'Wed', features: 3, tasks: 6 },
    { name: 'Thu', features: 5, tasks: 12 },
    { name: 'Fri', features: 3, tasks: 9 },
    { name: 'Sat', features: 1, tasks: 3 },
    { name: 'Sun', features: 2, tasks: 4 }
  ];

  const recentActivities = [
    { id: 1, type: 'feature', title: 'User Authentication completed', time: '2 hours ago', status: 'completed' },
    { id: 2, type: 'task', title: 'Database migration in progress', time: '4 hours ago', status: 'in_progress' },
    { id: 3, type: 'feedback', title: 'New feedback received', time: '6 hours ago', status: 'new' },
    { id: 4, type: 'goal', title: 'Q4 Revenue target updated', time: '1 day ago', status: 'updated' }
  ];

  const priorityFeatures = features
    .filter(f => f.priority === 'high' || f.priority === 'critical')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageTitle 
          title={`Welcome back, ${currentUser?.name}`} 
          description="Here's what's happening in your product roadmap"
        />
        <div className="flex gap-2">
          <VoiceTrainingButton />
          <Button variant="outline" onClick={() => navigate("/features")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
          <Button onClick={() => navigate("/roadmap")}>
            View Roadmap
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Features</p>
                <p className="text-2xl font-bold">{dashboardMetrics.totalFeatures}</p>
                <p className="text-xs text-muted-foreground">
                  {dashboardMetrics.completedFeatures} completed
                </p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={dashboardMetrics.featureCompletionRate} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Goals</p>
                <p className="text-2xl font-bold">{dashboardMetrics.totalGoals}</p>
                <p className="text-xs text-muted-foreground">
                  {dashboardMetrics.completedGoals} achieved
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={dashboardMetrics.goalCompletionRate} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks</p>
                <p className="text-2xl font-bold">{dashboardMetrics.totalTasks}</p>
                <p className="text-xs text-muted-foreground">
                  {dashboardMetrics.completedTasks} completed
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
            <Progress value={dashboardMetrics.taskCompletionRate} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Feedback</p>
                <p className="text-2xl font-bold">{dashboardMetrics.totalFeedback}</p>
                <p className="text-xs text-muted-foreground">
                  {dashboardMetrics.unreadFeedback} unread
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(dashboardMetrics.overdueTasks > 0 || dashboardMetrics.upcomingReleases > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardMetrics.overdueTasks > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-red-900">Overdue Tasks</p>
                    <p className="text-sm text-red-700">
                      {dashboardMetrics.overdueTasks} tasks are past their due date
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-auto"
                    onClick={() => navigate("/tasks")}
                  >
                    View Tasks
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {dashboardMetrics.upcomingReleases > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-900">Upcoming Releases</p>
                    <p className="text-sm text-blue-700">
                      {dashboardMetrics.upcomingReleases} releases scheduled
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-auto"
                    onClick={() => navigate("/releases")}
                  >
                    View Releases
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
              <CardDescription>Weekly completion trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
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
              <CardTitle>Feature Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={featureStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {featureStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-4 mt-4">
                {featureStatusData.map((item) => (
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
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Priority Features */}
          <Card>
            <CardHeader>
              <CardTitle>High Priority Features</CardTitle>
              <CardDescription>Critical items requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {priorityFeatures.length > 0 ? (
                priorityFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{feature.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          className={
                            feature.priority === 'critical' 
                              ? 'bg-red-500' 
                              : 'bg-orange-500'
                          }
                        >
                          {feature.priority}
                        </Badge>
                        <Badge variant="outline">{feature.status}</Badge>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/features/${feature.id}`)}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No high priority features</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
