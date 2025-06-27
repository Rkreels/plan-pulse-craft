
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";

export const CapacityDashboard = () => {
  const [timeRange, setTimeRange] = useState("current");

  const teamCapacity = [
    { name: "Frontend", allocated: 85, available: 100, utilization: 85 },
    { name: "Backend", allocated: 92, available: 100, utilization: 92 },
    { name: "Design", allocated: 70, available: 80, utilization: 87.5 },
    { name: "QA", allocated: 65, available: 80, utilization: 81.25 },
    { name: "DevOps", allocated: 40, available: 60, utilization: 66.67 }
  ];

  const sprintData = [
    { sprint: "Sprint 1", planned: 40, completed: 38, capacity: 45 },
    { sprint: "Sprint 2", planned: 42, completed: 40, capacity: 45 },
    { sprint: "Sprint 3", planned: 45, completed: 42, capacity: 45 },
    { sprint: "Sprint 4", planned: 48, completed: 45, capacity: 50 },
    { sprint: "Sprint 5", planned: 50, completed: 47, capacity: 50 },
    { sprint: "Sprint 6", planned: 52, completed: 50, capacity: 55 }
  ];

  const utilizationTrend = [
    { week: "W1", frontend: 80, backend: 85, design: 75, qa: 70 },
    { week: "W2", frontend: 85, backend: 90, design: 80, qa: 75 },
    { week: "W3", frontend: 88, backend: 95, design: 85, qa: 80 },
    { week: "W4", frontend: 85, backend: 92, design: 88, qa: 85 }
  ];

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-red-600";
    if (utilization >= 80) return "text-yellow-600";
    return "text-green-600";
  };

  const getProgressColor = (utilization: number) => {
    if (utilization >= 90) return "bg-red-500";
    if (utilization >= 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Capacity Planning</h2>
          <p className="text-muted-foreground">Monitor team capacity and resource allocation</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Sprint</SelectItem>
            <SelectItem value="next">Next Sprint</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Total Capacity</span>
            </div>
            <div className="text-2xl font-bold mt-2">375h</div>
            <div className="text-sm text-muted-foreground">This sprint</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              <span className="font-medium">Allocated</span>
            </div>
            <div className="text-2xl font-bold mt-2">352h</div>
            <div className="text-sm text-green-600">94% utilization</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Velocity</span>
            </div>
            <div className="text-2xl font-bold mt-2">47</div>
            <div className="text-sm text-green-600">+6% from last sprint</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span className="font-medium">At Risk</span>
            </div>
            <div className="text-2xl font-bold mt-2">2</div>
            <div className="text-sm text-orange-600">Teams over capacity</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Capacity Overview</CardTitle>
            <CardDescription>Current allocation vs available capacity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamCapacity.map(team => (
                <div key={team.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{team.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getUtilizationColor(team.utilization)}`}>
                        {team.utilization.toFixed(0)}%
                      </span>
                      <Badge variant={team.utilization >= 90 ? "destructive" : team.utilization >= 80 ? "secondary" : "default"}>
                        {team.allocated}h / {team.available}h
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={team.utilization} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sprint Performance</CardTitle>
            <CardDescription>Planned vs completed story points</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sprintData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sprint" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="capacity" fill="#e5e7eb" name="Capacity" />
                <Bar dataKey="planned" fill="#8884d8" name="Planned" />
                <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Utilization Trends</CardTitle>
            <CardDescription>Team utilization over the last 4 weeks</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={utilizationTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="frontend" stroke="#8884d8" strokeWidth={2} name="Frontend" />
                <Line type="monotone" dataKey="backend" stroke="#82ca9d" strokeWidth={2} name="Backend" />
                <Line type="monotone" dataKey="design" stroke="#ffc658" strokeWidth={2} name="Design" />
                <Line type="monotone" dataKey="qa" stroke="#ff7300" strokeWidth={2} name="QA" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Capacity Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Backend Team Over Capacity</p>
                  <p className="text-sm text-red-700">Currently at 92% utilization. Consider redistributing work.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Design Team Approaching Limit</p>
                  <p className="text-sm text-yellow-700">At 87% utilization. Monitor for next sprint planning.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                Plan Next Sprint
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Rebalance Workload
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Add Team Member
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Export Capacity Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
