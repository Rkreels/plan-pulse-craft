
import React from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerFeedbackPortal } from "@/components/customer-portal/CustomerFeedbackPortal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/contexts/AppContext";
import { MessageSquare, Users, TrendingUp, Clock } from "lucide-react";

const CustomerPortal = () => {
  const { feedback, currentUser } = useAppContext();
  
  const portalStats = {
    totalFeedback: feedback.length,
    activeFeedback: feedback.filter(f => f.status === "new" || f.status === "reviewed").length,
    resolvedFeedback: feedback.filter(f => f.status === "closed").length,
    avgResponseTime: "2.5 days"
  };

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Customer Portal" 
        description="Manage customer feedback and communication"
      />
      
      {/* Portal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Feedback</p>
                <p className="text-2xl font-bold">{portalStats.totalFeedback}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Items</p>
                <p className="text-2xl font-bold">{portalStats.activeFeedback}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{portalStats.resolvedFeedback}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">{portalStats.avgResponseTime}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="feedback" className="space-y-4">
        <TabsList>
          <TabsTrigger value="feedback">Customer Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Portal Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feedback">
          <CustomerFeedbackPortal />
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Categories</CardTitle>
                <CardDescription>Distribution of feedback types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Feature Requests</span>
                    <Badge variant="secondary">45%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bug Reports</span>
                    <Badge variant="secondary">30%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Improvements</span>
                    <Badge variant="secondary">20%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Questions</span>
                    <Badge variant="secondary">5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Response Metrics</CardTitle>
                <CardDescription>Customer satisfaction trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>First Response Time</span>
                    <Badge variant="outline">2.5 days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Resolution Time</span>
                    <Badge variant="outline">5.2 days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Customer Satisfaction</span>
                    <Badge className="bg-green-500">92%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Conversations</span>
                    <Badge variant="secondary">{portalStats.activeFeedback}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Portal Configuration</CardTitle>
              <CardDescription>Manage customer portal settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Public Feedback</h4>
                    <p className="text-sm text-muted-foreground">Allow customers to view other feedback</p>
                  </div>
                  <Badge className="bg-green-500">Enabled</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Auto-notifications</h4>
                    <p className="text-sm text-muted-foreground">Send email updates on feedback status</p>
                  </div>
                  <Badge className="bg-green-500">Enabled</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Voting System</h4>
                    <p className="text-sm text-muted-foreground">Allow customers to vote on feedback</p>
                  </div>
                  <Badge className="bg-green-500">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerPortal;
