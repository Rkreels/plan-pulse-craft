import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TeamMemberInviteDialog } from "./TeamMemberInviteDialog";
import { toast } from "sonner";
import { 
  Plus, 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Trash2,
  Users,
  Activity,
  Settings,
  Shield,
  Clock,
  BarChart3
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  joinedAt: string;
  lastActive: string;
  department?: string;
  location?: string;
  phone?: string;
  skills: string[];
  workload: number; // 0-100%
  projectsCount: number;
  tasksCompleted: number;
}

interface TeamManagementEnhancedProps {
  initialMembers?: TeamMember[];
}

export const TeamManagementEnhanced = ({ initialMembers = [] }: TeamManagementEnhancedProps) => {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "product_manager",
      avatar: "/api/placeholder/40/40",
      status: "active",
      joinedAt: "2024-01-15",
      lastActive: "2024-03-20T10:30:00Z",
      department: "Product",
      location: "San Francisco, CA",
      phone: "+1 (555) 123-4567",
      skills: ["Product Strategy", "User Research", "Agile"],
      workload: 85,
      projectsCount: 3,
      tasksCompleted: 42
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael@company.com",
      role: "developer",
      avatar: "/api/placeholder/40/40",
      status: "active",
      joinedAt: "2024-02-01",
      lastActive: "2024-03-20T09:15:00Z",
      department: "Engineering",
      location: "New York, NY",
      phone: "+1 (555) 987-6543",
      skills: ["React", "Node.js", "TypeScript"],
      workload: 75,
      projectsCount: 2,
      tasksCompleted: 38
    },
    {
      id: "3",
      name: "Emily Davis",
      email: "emily@company.com",
      role: "designer",
      avatar: "/api/placeholder/40/40",
      status: "pending",
      joinedAt: "2024-03-10",
      lastActive: "2024-03-19T16:45:00Z",
      department: "Design",
      location: "Austin, TX",
      phone: "+1 (555) 456-7890",
      skills: ["UI/UX", "Figma", "Design Systems"],
      workload: 60,
      projectsCount: 1,
      tasksCompleted: 15
    }
    // Add more sample members...
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || member.role === filterRole;
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleInviteMember = (email: string, role: string, message?: string) => {
    // Simulate invite process
    const newMember: TeamMember = {
      id: `temp-${Date.now()}`,
      name: email.split('@')[0], // temporary name
      email,
      role,
      status: 'pending',
      joinedAt: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString(),
      skills: [],
      workload: 0,
      projectsCount: 0,
      tasksCompleted: 0
    };

    setMembers(prev => [...prev, newMember]);
    toast.success(`Invitation sent to ${email}`, {
      description: message ? `Message: ${message}` : "They will receive an email with instructions to join."
    });
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
    toast.success("Team member removed");
  };

  const handleUpdateMemberRole = (memberId: string, newRole: string) => {
    setMembers(prev => prev.map(m => 
      m.id === memberId ? { ...m, role: newRole } : m
    ));
    toast.success("Role updated successfully");
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      'product_manager': 'Product Manager',
      'developer': 'Developer',
      'designer': 'Designer',
      'qa_engineer': 'QA Engineer',
      'admin': 'Admin',
      'executive': 'Executive',
      'customer': 'Customer'
    };
    return roleMap[role] || role;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, label: "Active" },
      inactive: { variant: "secondary" as const, label: "Inactive" },
      pending: { variant: "outline" as const, label: "Pending" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return "text-red-600";
    if (workload >= 75) return "text-orange-600";
    if (workload >= 50) return "text-yellow-600";
    return "text-green-600";
  };

  const teamStats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    pending: members.filter(m => m.status === 'pending').length,
    avgWorkload: Math.round(members.reduce((sum, m) => sum + m.workload, 0) / members.length),
    totalProjects: members.reduce((sum, m) => sum + m.projectsCount, 0),
    totalTasks: members.reduce((sum, m) => sum + m.tasksCompleted, 0)
  };

  return (
    <div className="space-y-6">
      {/* Team Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{teamStats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold text-green-600">{teamStats.active}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Workload</p>
                <p className={`text-2xl font-bold ${getWorkloadColor(teamStats.avgWorkload)}`}>
                  {teamStats.avgWorkload}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-bold">{teamStats.totalTasks}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Manage team members, roles, and permissions</CardDescription>
            </div>
            <Button onClick={() => setIsInviteDialogOpen(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="members" className="space-y-4">
            <TabsList>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="product_manager">Product Manager</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="qa_engineer">QA Engineer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Members List */}
              <div className="space-y-4">
                {filteredMembers.map((member) => (
                  <Card key={member.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                        <div className="lg:col-span-4 flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {member.email}
                            </p>
                            {member.phone && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {member.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="lg:col-span-2">
                          <Badge variant="outline">{getRoleDisplay(member.role)}</Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {member.department}
                          </p>
                        </div>

                        <div className="lg:col-span-2">
                          {getStatusBadge(member.status)}
                          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {member.location}
                          </p>
                        </div>

                        <div className="lg:col-span-2">
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Workload</span>
                              <span className={getWorkloadColor(member.workload)}>
                                {member.workload}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  member.workload >= 90 ? 'bg-red-500' :
                                  member.workload >= 75 ? 'bg-orange-500' :
                                  member.workload >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${member.workload}%` }}
                              />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {member.projectsCount} projects • {member.tasksCompleted} tasks
                          </p>
                        </div>

                        <div className="lg:col-span-2 flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              if (confirm("Are you sure you want to remove this team member?")) {
                                handleRemoveMember(member.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Skills */}
                      {member.skills.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex flex-wrap gap-1">
                            {member.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredMembers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No members found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterRole !== "all" || filterStatus !== "all"
                      ? "Try adjusting your filters"
                      : "Invite your first team member to get started"
                    }
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="roles" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Role Permissions</CardTitle>
                    <CardDescription>Configure what each role can access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { role: "Admin", permissions: ["Full Access", "User Management", "Settings"] },
                        { role: "Product Manager", permissions: ["Features", "Roadmap", "Reports"] },
                        { role: "Developer", permissions: ["Tasks", "Features", "Code Review"] },
                        { role: "Designer", permissions: ["Features", "Tasks", "Assets"] }
                      ].map((roleConfig) => (
                        <div key={roleConfig.role} className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">{roleConfig.role}</h4>
                          <div className="flex flex-wrap gap-1">
                            {roleConfig.permissions.map((permission) => (
                              <Badge key={permission} variant="outline">{permission}</Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Access Levels</CardTitle>
                    <CardDescription>Define system access levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { level: "Full Access", description: "Complete system access", roles: ["Admin"] },
                        { level: "Management", description: "Project and team management", roles: ["Product Manager", "Executive"] },
                        { level: "Contributor", description: "Create and edit content", roles: ["Developer", "Designer"] },
                        { level: "Viewer", description: "Read-only access", roles: ["Customer", "Stakeholder"] }
                      ].map((access) => (
                        <div key={access.level} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <h4 className="font-medium">{access.level}</h4>
                            <p className="text-sm text-muted-foreground">{access.description}</p>
                          </div>
                          <div className="flex gap-1">
                            {access.roles.map((role) => (
                              <Badge key={role} variant="secondary" className="text-xs">{role}</Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Most Active Member</span>
                        <Badge>{members.find(m => m.tasksCompleted === Math.max(...members.map(m => m.tasksCompleted)))?.name}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Highest Workload</span>
                        <Badge variant="outline">
                          {members.find(m => m.workload === Math.max(...members.map(m => m.workload)))?.name}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Team Velocity</span>
                        <Badge className="bg-green-500">{Math.round(teamStats.totalTasks / teamStats.active)} tasks/member</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Department Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(
                        members.reduce((acc, member) => {
                          const dept = member.department || "Unknown";
                          acc[dept] = (acc[dept] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([dept, count]) => (
                        <div key={dept} className="flex justify-between items-center">
                          <span>{dept}</span>
                          <Badge variant="outline">{count} member{count !== 1 ? 's' : ''}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <TeamMemberInviteDialog
        isOpen={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onInvite={handleInviteMember}
      />
    </div>
  );
};