
import React, { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerFeedbackPortal } from "@/components/customer-portal/CustomerFeedbackPortal";
import { CustomerInsights } from "@/components/customer-portal/CustomerInsights";
import { AdvancedAnalytics } from "@/components/customer-portal/AdvancedAnalytics";
import { NotificationCenter } from "@/components/customer-portal/NotificationCenter";
import { UserManagement } from "@/components/customer-portal/UserManagement";
import { FeedbackSubmissionWorkflow } from "@/components/customer-portal/FeedbackSubmissionWorkflow";
import { PortalManagement } from "@/components/customer-portal/PortalManagement";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  BarChart3, 
  Users, 
  Bell, 
  Settings, 
  Lightbulb,
  Target,
  TrendingUp,
  FileText,
  Globe,
  Zap
} from "lucide-react";

const CustomerPortal = () => {
  const [activeTab, setActiveTab] = useState("feedback");

  // Portal statistics
  const portalStats = {
    totalFeedback: 1247,
    activeUsers: 456,
    avgResponseTime: "2.3h",
    satisfaction: 4.2,
    monthlyGrowth: 23,
    resolvedIssues: 89,
    pendingReviews: 15,
    featuresImplemented: 34
  };

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Customer Portal" 
        description="Comprehensive customer feedback management and portal administration"
      />
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Total Feedback</span>
            </div>
            <div className="text-2xl font-bold mt-2">{portalStats.totalFeedback.toLocaleString()}</div>
            <div className="text-sm text-green-600">+{portalStats.monthlyGrowth}% this month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <span className="font-medium">Active Users</span>
            </div>
            <div className="text-2xl font-bold mt-2">{portalStats.activeUsers}</div>
            <div className="text-sm text-green-600">+12% this month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Avg Response Time</span>
            </div>
            <div className="text-2xl font-bold mt-2">{portalStats.avgResponseTime}</div>
            <div className="text-sm text-green-600">-15% improvement</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Satisfaction</span>
            </div>
            <div className="text-2xl font-bold mt-2">{portalStats.satisfaction}/5</div>
            <div className="text-sm text-green-600">+0.3 this month</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Portal Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="feedback" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Feedback
          </TabsTrigger>
          <TabsTrigger value="submissions" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Submissions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2">
            <FileText className="h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="management" className="gap-2">
            <Globe className="h-4 w-4" />
            Management
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="feedback" className="mt-6">
          <CustomerFeedbackPortal />
        </TabsContent>

        <TabsContent value="submissions" className="mt-6">
          <FeedbackSubmissionWorkflow />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <AdvancedAnalytics />
        </TabsContent>
        
        <TabsContent value="insights" className="mt-6">
          <CustomerInsights />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <NotificationCenter />
        </TabsContent>

        <TabsContent value="management" className="mt-6">
          <PortalManagement />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portal Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Portal Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">System Status</span>
                    <Badge className="bg-green-500">Operational</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database Performance</span>
                    <Badge className="bg-green-500">Good</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">API Response Time</span>
                    <Badge className="bg-yellow-500">Average</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Storage Usage</span>
                    <span className="text-sm">67% (2.1GB / 3GB)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monthly Requests</span>
                    <span className="text-sm">12,450 / 50,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="text-sm">
                      <strong>New feedback submitted</strong> - "Add dark mode support"
                      <div className="text-muted-foreground">2 minutes ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="text-sm">
                      <strong>Feature request implemented</strong> - "Export functionality"
                      <div className="text-muted-foreground">1 hour ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="text-sm">
                      <strong>User joined portal</strong> - john.doe@example.com
                      <div className="text-muted-foreground">3 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="text-sm">
                      <strong>Integration updated</strong> - Slack notifications
                      <div className="text-muted-foreground">5 hours ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" size="sm">
                    Bulk Export
                  </Button>
                  <Button variant="outline" size="sm">
                    Send Newsletter
                  </Button>
                  <Button variant="outline" size="sm">
                    Backup Data
                  </Button>
                  <Button variant="outline" size="sm">
                    Update Portal
                  </Button>
                  <Button variant="outline" size="sm">
                    Generate Report
                  </Button>
                  <Button variant="outline" size="sm">
                    Clean Cache
                  </Button>
                  <Button variant="outline" size="sm">
                    Test Webhooks
                  </Button>
                  <Button variant="outline" size="sm">
                    View Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerPortal;
