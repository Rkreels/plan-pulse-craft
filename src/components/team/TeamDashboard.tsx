
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/contexts/AppContext";
import { 
  Users, 
  Mail, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Settings,
  BarChart3,
  Target
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: "active" | "away" | "busy";
  workload: number;
  tasksCompleted: number;
  tasksAssigned: number;
  joinedAt: Date;
}

export const TeamDashboard = () => {
  const { features, tasks, goals, currentUser } = useAppContext();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Mock team data - in real app, this would come from context/API
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Product Manager",
      status: "active",
      workload: 85,
      tasksCompleted: 23,
      tasksAssigned: 27,
      joinedAt: new Date("2023-01-15")
    },
    {
      id: "2", 
      name: "Mike Chen",
      email: "mike@company.com",
      role: "Senior Developer",
      status: "busy",
      workload: 92,
      tasksCompleted: 31,
      tasksAssigned: 34,
      joinedAt: new Date("2022-08-10")
    },
    {
      id: "3",
      name: "Emma Davis",
      email: "emma@company.com", 
      role: "UX Designer",
      status: "active",
      workload: 78,
      tasksCompleted: 18,
      tasksAssigned: 23,
      joinedAt: new Date("2023-03-20")
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      email: "alex@company.com",
      role: "Developer",
      status: "away",
      workload: 45,
      tasksCompleted: 12,
      tasksAssigned: 19,
      joinedAt: new Date("2023-06-01")
    }
  ];

  const teamStats = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === "active").length,
    avgWorkload: teamMembers.reduce((sum, m) => sum + m.workload, 0) / teamMembers.length,
    totalTasksCompleted: teamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0),
    totalTasksAssigned: teamMembers.reduce((sum, m) => sum + m.tasksAssigned, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "busy": return "bg-yellow-500";
      case "away": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return "text-red-600";
    if (workload >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Size</p>
                <p className="text-2xl font-bold">{teamStats.totalMembers}</p>
                <p className="text-xs text-muted-foreground">{teamStats.activeMembers} active</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Workload</p>
                <p className="text-2xl font-bold">{Math.round(teamStats.avgWorkload)}%</p>
                <p className="text-xs text-muted-foreground">across team</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-bold">{teamStats.totalTasksCompleted}</p>
                <p className="text-xs text-muted-foreground">this month</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round((teamStats.totalTasksCompleted / teamStats.totalTasksAssigned) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground">task success rate</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="workload">Workload Distribution</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>
        
        <TabsContent value="members" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <Card key={member.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div 
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {member.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Workload</span>
                        <span className={getWorkloadColor(member.workload)}>
                          {member.workload}%
                        </span>
                      </div>
                      <Progress value={member.workload} className="h-2" />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tasks:</span>
                      <span>{member.tasksCompleted}/{member.tasksAssigned}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Joined:</span>
                      <span>{member.joinedAt.toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Mail className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="workload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workload Distribution</CardTitle>
              <CardDescription>Current task allocation across team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-4">
                    <div className="flex items-center gap-3 min-w-48">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                    <div className="flex-1">
                      <Progress value={member.workload} className="h-3" />
                    </div>
                    <div className="flex items-center gap-4 min-w-32">
                      <span className={`font-medium ${getWorkloadColor(member.workload)}`}>
                        {member.workload}%
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {member.tasksAssigned} tasks
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Workload Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.filter(m => m.workload > 90).length > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-900">Overloaded Members</p>
                      <p className="text-sm text-red-700">
                        {teamMembers.filter(m => m.workload > 90).map(m => m.name).join(', ')} 
                        {teamMembers.filter(m => m.workload > 90).length === 1 ? ' is' : ' are'} above 90% capacity
                      </p>
                    </div>
                  </div>
                )}
                
                {teamMembers.filter(m => m.workload < 60).length > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-blue-900">Available Capacity</p>
                      <p className="text-sm text-blue-700">
                        {teamMembers.filter(m => m.workload < 60).map(m => m.name).join(', ')} 
                        {teamMembers.filter(m => m.workload < 60).length === 1 ? ' has' : ' have'} available capacity
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Based on task completion rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers
                    .sort((a, b) => (b.tasksCompleted / b.tasksAssigned) - (a.tasksCompleted / a.tasksAssigned))
                    .slice(0, 3)
                    .map((member, index) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          {index + 1}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {Math.round((member.tasksCompleted / member.tasksAssigned) * 100)}% completion rate
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Team member actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Mike Chen completed "User Authentication"</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Sarah Johnson updated goal progress</p>
                      <p className="text-xs text-muted-foreground">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Emma Davis started "Design System"</p>
                      <p className="text-xs text-muted-foreground">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Settings</CardTitle>
              <CardDescription>Manage team permissions and configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Invite Members</div>
                    <div className="text-sm text-muted-foreground">Add new team members</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Role Management</div>
                    <div className="text-sm text-muted-foreground">Configure roles and permissions</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Notification Settings</div>
                    <div className="text-sm text-muted-foreground">Manage team notifications</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Workflow Configuration</div>
                    <div className="text-sm text-muted-foreground">Setup team workflows</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
