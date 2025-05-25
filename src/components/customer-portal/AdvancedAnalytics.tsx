
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, MessageSquare, Clock, Target } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

export function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState("30days");

  const submissionTrends = [
    { month: "Jan", submissions: 45, responses: 38 },
    { month: "Feb", submissions: 52, responses: 45 },
    { month: "Mar", submissions: 48, responses: 42 },
    { month: "Apr", submissions: 61, responses: 55 },
    { month: "May", submissions: 58, responses: 52 },
    { month: "Jun", submissions: 67, responses: 61 },
  ];

  const categoryBreakdown = [
    { name: "Feature Requests", value: 45, color: "#8884d8" },
    { name: "Bug Reports", value: 30, color: "#82ca9d" },
    { name: "Improvements", value: 15, color: "#ffc658" },
    { name: "Questions", value: 10, color: "#ff7300" },
  ];

  const customerSegments = [
    { segment: "Enterprise", feedback: 120, satisfaction: 4.5 },
    { segment: "Pro", feedback: 85, satisfaction: 4.2 },
    { segment: "Starter", feedback: 45, satisfaction: 3.9 },
    { segment: "Free", feedback: 30, satisfaction: 3.6 },
  ];

  const responseMetrics = {
    avgResponseTime: "2.3 hours",
    resolutionRate: 87,
    customerSatisfaction: 4.2,
    escalationRate: 8
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advanced Analytics</h2>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Avg Response Time</span>
            </div>
            <div className="text-2xl font-bold mt-2">{responseMetrics.avgResponseTime}</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingDown className="h-3 w-3" />
              <span>-15% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Resolution Rate</span>
            </div>
            <div className="text-2xl font-bold mt-2">{responseMetrics.resolutionRate}%</div>
            <Progress value={responseMetrics.resolutionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Customer Satisfaction</span>
            </div>
            <div className="text-2xl font-bold mt-2">{responseMetrics.customerSatisfaction}/5</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+0.2 from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Escalation Rate</span>
            </div>
            <div className="text-2xl font-bold mt-2">{responseMetrics.escalationRate}%</div>
            <Progress value={responseMetrics.escalationRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends">
        <TabsList>
          <TabsTrigger value="trends">Submission Trends</TabsTrigger>
          <TabsTrigger value="categories">Category Analysis</TabsTrigger>
          <TabsTrigger value="segments">Customer Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Submission Trends</CardTitle>
              <CardDescription>Track feedback volume and response patterns over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={submissionTrends}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="submissions" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="responses" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feedback by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryBreakdown.map((entry, index) => (
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
                <CardTitle>Category Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryBreakdown.map((category, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{category.value}</div>
                        <div className="text-sm text-muted-foreground">
                          {((category.value / categoryBreakdown.reduce((sum, c) => sum + c.value, 0)) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="segments">
          <Card>
            <CardHeader>
              <CardTitle>Customer Segment Analysis</CardTitle>
              <CardDescription>Feedback patterns across different customer tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerSegments.map((segment, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{segment.segment}</h3>
                      <Badge variant="outline">{segment.feedback} feedback items</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Satisfaction Score</span>
                        <div className="text-2xl font-bold">{segment.satisfaction}/5</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Engagement Level</span>
                        <Progress value={(segment.feedback / 120) * 100} className="mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
