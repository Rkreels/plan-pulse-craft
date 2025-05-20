
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PieChart, LineChart, BarChart3 } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { PieChart as Pie, Cell, ResponsiveContainer, Sector, Tooltip as ChartTooltip } from "recharts";
import { LineChart as Line, CartesianGrid, XAxis, YAxis, Legend, Line as ChartLine, Tooltip, BarChart, Bar } from "recharts";

export function CustomerInsights() {
  const { feedback } = useAppContext();
  const [timeRange, setTimeRange] = useState("30days");
  const [insightType, setInsightType] = useState("feedback");
  
  // Feedback by category data
  const categoryData = [
    { name: "Feature Requests", value: 42 },
    { name: "Bug Reports", value: 28 },
    { name: "Improvements", value: 15 },
    { name: "Questions", value: 10 },
    { name: "Others", value: 5 }
  ];
  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  
  // Feedback over time data
  const timelineData = [
    { name: "Week 1", requests: 10, bugs: 8, improvements: 5 },
    { name: "Week 2", requests: 12, bugs: 6, improvements: 3 },
    { name: "Week 3", requests: 8, bugs: 7, improvements: 4 },
    { name: "Week 4", requests: 15, bugs: 5, improvements: 2 },
    { name: "Week 5", requests: 7, bugs: 2, improvements: 1 }
  ];
  
  // Top voted features data
  const topVotedData = [
    { name: "Dark Mode", votes: 45 },
    { name: "Export to PDF", votes: 38 },
    { name: "Mobile App", votes: 32 },
    { name: "Dashboard Widgets", votes: 28 },
    { name: "API Integration", votes: 24 }
  ];
  
  // Custom label renderer for pie charts
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Tabs value={insightType} onValueChange={setInsightType} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Button variant="outline">Export Report</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold">{feedback.length}</div>
            <p className="text-muted-foreground text-sm">+12% from last period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Open Items</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold">{feedback.filter(f => f.status === "new" || f.status === "reviewed").length}</div>
            <p className="text-muted-foreground text-sm">24% needing review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Customer Sentiment</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold">76%</div>
            <p className="text-muted-foreground text-sm">+5% from last period</p>
          </CardContent>
        </Card>
      </div>
      
      {insightType === "feedback" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Feedback by Category</CardTitle>
              <CardDescription>Distribution of feedback by type</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} labelLine={false} labelPosition="inside" label={renderCustomizedLabel}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-xs">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Feedback Over Time</CardTitle>
              <CardDescription>Trend of feedback submissions</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <Line data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <ChartLine type="monotone" dataKey="requests" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <ChartLine type="monotone" dataKey="bugs" stroke="#82ca9d" />
                  <ChartLine type="monotone" dataKey="improvements" stroke="#ffc658" />
                </Line>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Top Voted Features</CardTitle>
              <CardDescription>Features with the most user votes</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topVotedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="votes" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
      
      {insightType === "engagement" && (
        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>Analysis of customer portal usage</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <div className="text-center p-10">
              <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Engagement Analytics</h3>
              <p className="text-muted-foreground">This will display detailed user engagement metrics for the customer portal.</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {insightType === "satisfaction" && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
            <CardDescription>Analysis of customer satisfaction metrics</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <div className="text-center p-10">
              <LineChart className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Satisfaction Metrics</h3>
              <p className="text-muted-foreground">This will display detailed customer satisfaction analytics and trends.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
