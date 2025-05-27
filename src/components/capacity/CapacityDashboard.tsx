
import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  LineChart,
  Line
} from 'recharts';
import { 
  Users, 
  Clock, 
  Target, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  RefreshCw
} from "lucide-react";

export const CapacityDashboard = () => {
  const { features, releases } = useAppContext();
  const [timeRange, setTimeRange] = useState("current_quarter");
  const [viewType, setViewType] = useState("team");

  // Mock team data - in real app, this would come from API
  const teams = [
    { id: "frontend", name: "Frontend Team", members: 5, capacity: 40, allocated: 32, utilization: 80 },
    { id: "backend", name: "Backend Team", members: 4, capacity: 32, allocated: 28, utilization: 88 },
    { id: "design", name: "Design Team", members: 3, capacity: 24, allocated: 20, utilization: 83 },
    { id: "qa", name: "QA Team", members: 3, capacity: 24, allocated: 18, utilization: 75 }
  ];

  const capacityData = teams.map(team => ({
    name: team.name,
    capacity: team.capacity,
    allocated: team.allocated,
    available: team.capacity - team.allocated,
    utilization: team.utilization
  }));

  const utilizationData = [
    { week: 'Week 1', frontend: 75, backend: 85, design: 90, qa: 70 },
    { week: 'Week 2', frontend: 80, backend: 90, design: 85, qa: 75 },
    { week: 'Week 3', frontend: 85, backend: 88, design: 80, qa: 80 },
    { week: 'Week 4', frontend: 78, backend: 92, design: 88, qa: 72 }
  ];

  const totalCapacity = teams.reduce((sum, team) => sum + team.capacity, 0);
  const totalAllocated = teams.reduce((sum, team) => sum + team.allocated, 0);
  const totalAvailable = totalCapacity - totalAllocated;
  const overallUtilization = Math.round((totalAllocated / totalCapacity) * 100);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_week">Current Week</SelectItem>
              <SelectItem value="current_month">Current Month</SelectItem>
              <SelectItem value="current_quarter">Current Quarter</SelectItem>
              <SelectItem value="next_quarter">Next Quarter</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={viewType} onValueChange={setViewType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="team">By Team</SelectItem>
              <SelectItem value="project">By Project</SelectItem>
              <SelectItem value="skill">By Skill</SelectItem>
              <SelectItem value="individual">By Individual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity}h</div>
            <p className="text-xs text-muted-foreground">
              <Calendar className="inline h-3 w-3 mr-1" />
              Current quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Allocated</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAllocated}h</div>
            <Progress value={(totalAllocated / totalCapacity) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAvailable}h</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              Ready for allocation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallUtilization}%</div>
            <p className="text-xs text-muted-foreground">
              {overallUtilization > 85 ? (
                <AlertTriangle className="inline h-3 w-3 mr-1 text-red-500" />
              ) : (
                <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              )}
              {overallUtilization > 85 ? 'Over capacity' : 'Healthy'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Capacity Overview Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Team Capacity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={capacityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="capacity" fill="#8884d8" name="Total Capacity" />
              <Bar dataKey="allocated" fill="#82ca9d" name="Allocated" />
              <Bar dataKey="available" fill="#ffc658" name="Available" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Team Details and Utilization Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teams.map(team => (
                <div key={team.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{team.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {team.members} members • {team.capacity}h capacity
                    </div>
                    <Progress value={team.utilization} className="mt-2" />
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={team.utilization > 85 ? "destructive" : "default"}
                      className="mb-1"
                    >
                      {team.utilization}%
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {team.allocated}h / {team.capacity}h
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utilization Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="frontend" stroke="#8884d8" name="Frontend" />
                <Line type="monotone" dataKey="backend" stroke="#82ca9d" name="Backend" />
                <Line type="monotone" dataKey="design" stroke="#ffc658" name="Design" />
                <Line type="monotone" dataKey="qa" stroke="#ff7300" name="QA" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
