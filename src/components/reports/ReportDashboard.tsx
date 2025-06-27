
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Target, Users } from "lucide-react";

export const ReportDashboard = () => {
  const featureData = [
    { month: "Jan", completed: 12, planned: 15, inProgress: 8 },
    { month: "Feb", completed: 15, planned: 18, inProgress: 10 },
    { month: "Mar", completed: 18, planned: 20, inProgress: 12 },
    { month: "Apr", completed: 22, planned: 25, inProgress: 15 },
    { month: "May", completed: 28, planned: 30, inProgress: 18 },
    { month: "Jun", completed: 32, planned: 35, inProgress: 20 }
  ];

  const feedbackData = [
    { name: "Feature Requests", value: 45, color: "#8884d8" },
    { name: "Bug Reports", value: 30, color: "#82ca9d" },
    { name: "Improvements", value: 15, color: "#ffc658" },
    { name: "Questions", value: 10, color: "#ff7300" }
  ];

  const goalData = [
    { quarter: "Q1", achieved: 8, total: 10 },
    { quarter: "Q2", achieved: 12, total: 15 },
    { quarter: "Q3", achieved: 18, total: 20 },
    { quarter: "Q4", achieved: 22, total: 25 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Features Completed</span>
            </div>
            <div className="text-2xl font-bold mt-2">127</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+15% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <span className="font-medium">Customer Feedback</span>
            </div>
            <div className="text-2xl font-bold mt-2">89%</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>Satisfaction rate</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Goals Achieved</span>
            </div>
            <div className="text-2xl font-bold mt-2">85%</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>On track</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Team Velocity</span>
            </div>
            <div className="text-2xl font-bold mt-2">32</div>
            <div className="flex items-center gap-1 text-sm text-red-600">
              <TrendingDown className="h-3 w-3" />
              <span>Points per sprint</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Feature Development Trends</CardTitle>
            <CardDescription>Monthly feature completion vs planning</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={featureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="planned" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="inProgress" stroke="#ffc658" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback Distribution</CardTitle>
            <CardDescription>Types of customer feedback received</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feedbackData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {feedbackData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quarterly Goal Achievement</CardTitle>
            <CardDescription>Goals achieved vs total goals by quarter</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={goalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="achieved" fill="#8884d8" />
                <Bar dataKey="total" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
