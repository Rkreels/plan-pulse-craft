
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { Users, Plus, Mail, Calendar, CheckCircle, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: "active" | "away" | "busy" | "offline";
  tasksAssigned: number;
  tasksCompleted: number;
  workload: number; // percentage
  lastActive: string;
  skills: string[];
  currentSprint?: string;
}

export const TeamDashboard = () => {
  const { toast } = useToast();
  const { tasks, features, currentUser } = useAppContext();
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "member-1",
      name: "John Doe",
      email: "john@example.com",
      role: "Frontend Developer",
      status: "active",
      tasksAssigned: 8,
      tasksCompleted: 6,
      workload: 85,
      lastActive: new Date().toISOString(),
      skills: ["React", "TypeScript", "CSS"],
      currentSprint: "Sprint 23"
    },
    {
      id: "member-2", 
      name: "Sarah Smith",
      email: "sarah@example.com",
      role: "Backend Developer",
      status: "busy",
      tasksAssigned: 12,
      tasksCompleted: 9,
      workload: 92,
      lastActive: new Date(Date.now() - 1800000).toISOString(),
      skills: ["Node.js", "Python", "PostgreSQL"],
      currentSprint: "Sprint 23"
    },
    {
      id: "member-3",
      name: "Mike Johnson",
      email: "mike@example.com", 
      role: "UX Designer",
      status: "active",
      tasksAssigned: 5,
      tasksCompleted: 4,
      workload: 68,
      lastActive: new Date(Date.now() - 900000).toISOString(),
      skills: ["Figma", "User Research", "Prototyping"],
      currentSprint: "Sprint 23"
    },
    {
      id: "member-4",
      name: "Emily Davis",
      email: "emily@example.com",
      role: "QA Engineer", 
      status: "away",
      tasksAssigned: 6,
      tasksCompleted: 5,
      workload: 75,
      lastActive: new Date(Date.now() - 3600000).toISOString(),
      skills: ["Testing", "Automation", "Cypress"],
      currentSprint: "Sprint 22"
    }
  ]);

  const handleInviteMember = () => {
    toast({
      title: "Invite sent",
      description: "Team member invitation has been sent via email"
    });
  };

  const handleUpdateWorkload = (memberId: string, newWorkload: number) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, workload: newWorkload }
        : member
    ));
    
    toast({
      title: "Workload updated",
      description: "Team member workload has been updated"
    });
  };

  const getStatusColor = (status: TeamMember["status"]) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "busy": return "bg-red-500"; 
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return "text-red-600";
    if (workload >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  const teamStats = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === "active").length,
    averageWorkload: Math.round(teamMembers.reduce((sum, m) => sum + m.workload, 0) / teamMembers.length),
    totalTasksAssigned: teamMembers.reduce((sum, m) => sum + m.tasksAssigned, 0),
    totalTasksCompleted: teamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0)
  };

  const workloadData = teamMembers.map(member => ({
    name: member.name.split(' ')[0],
    workload: member.workload,
    tasksCompleted: member.tasksCompleted,
    tasksAssigned: member.tasksAssigned
  }));

  const performanceData = [
    { week: 'Week 1', completed: 18, assigned: 25 },
    { week: 'Week 2', completed: 22, assigned: 28 },
    { week: 'Week 3', completed: 25, assigned: 30 },
    { week: 'Week 4', completed: 28, assigned: 32 }
  ];

  return (
    <div className="space-y-6">
      {/* Team Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{teamStats.totalMembers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Now</p>
                <p className="text-2xl font-bold">{teamStats.activeMembers}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Workload</p>
                <p className="text-2xl font-bold">{teamStats.averageWorkload}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round((teamStats.totalTasksCompleted / teamStats.totalTasksAssigned) * 100)}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="workload">Workload Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Team Members</h3>
            <Button onClick={handleInviteMember} className="gap-2">
              <Plus className="h-4 w-4" />
              Invite Member
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map(member => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                    </div>
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <CardDescription>{member.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span>Tasks: {member.tasksCompleted}/{member.tasksAssigned}</span>
                    <Badge variant="outline">
                      {Math.round((member.tasksCompleted / member.tasksAssigned) * 100)}%
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span>Workload</span>
                      <span className={getWorkloadColor(member.workload)}>
                        {member.workload}%
                      </span>
                    </div>
                    <Progress value={member.workload} className="h-2" />
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {member.skills.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Mail className="h-3 w-3" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="workload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Workload Distribution</CardTitle>
              <CardDescription>Current workload across team members</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workloadData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="workload" fill="#3b82f6" name="Workload %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Trends</CardTitle>
              <CardDescription>Task completion vs assignment over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" name="Completed" />
                  <Line type="monotone" dataKey="assigned" stroke="#3b82f6" name="Assigned" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
