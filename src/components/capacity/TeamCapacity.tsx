
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Clock, 
  Target, 
  Plus,
  Edit,
  Settings,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

export const TeamCapacity = () => {
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [timeRange, setTimeRange] = useState("current_month");

  // Mock team data with members
  const teams = [
    {
      id: "frontend",
      name: "Frontend Team",
      lead: "John Doe",
      totalCapacity: 160,
      allocated: 128,
      utilization: 80,
      members: [
        { id: "1", name: "John Doe", role: "Senior Developer", capacity: 40, allocated: 32, avatar: "/placeholder.svg" },
        { id: "2", name: "Alice Johnson", role: "Developer", capacity: 40, allocated: 36, avatar: "/placeholder.svg" },
        { id: "3", name: "Bob Smith", role: "Junior Developer", capacity: 40, allocated: 32, avatar: "/placeholder.svg" },
        { id: "4", name: "Carol Wilson", role: "Developer", capacity: 40, allocated: 28, avatar: "/placeholder.svg" }
      ]
    },
    {
      id: "backend",
      name: "Backend Team", 
      lead: "Jane Smith",
      totalCapacity: 120,
      allocated: 108,
      utilization: 90,
      members: [
        { id: "5", name: "Jane Smith", role: "Tech Lead", capacity: 40, allocated: 38, avatar: "/placeholder.svg" },
        { id: "6", name: "David Brown", role: "Senior Developer", capacity: 40, allocated: 36, avatar: "/placeholder.svg" },
        { id: "7", name: "Emma Davis", role: "Developer", capacity: 40, allocated: 34, avatar: "/placeholder.svg" }
      ]
    },
    {
      id: "design",
      name: "Design Team",
      lead: "Mike Johnson", 
      totalCapacity: 120,
      allocated: 96,
      utilization: 80,
      members: [
        { id: "8", name: "Mike Johnson", role: "Design Lead", capacity: 40, allocated: 32, avatar: "/placeholder.svg" },
        { id: "9", name: "Lisa Garcia", role: "UX Designer", capacity: 40, allocated: 32, avatar: "/placeholder.svg" },
        { id: "10", name: "Tom Martinez", role: "UI Designer", capacity: 40, allocated: 32, avatar: "/placeholder.svg" }
      ]
    }
  ];

  const filteredTeams = selectedTeam === "all" ? teams : teams.filter(team => team.id === selectedTeam);

  const handleAddMember = (teamId: string) => {
    toast.success(`Add member to ${teams.find(t => t.id === teamId)?.name}`);
  };

  const handleEditTeam = (teamId: string) => {
    toast.success(`Edit ${teams.find(t => t.id === teamId)?.name} settings`);
  };

  const handleMemberSettings = (memberId: string) => {
    toast.success(`Member settings for ${memberId}`);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {teams.map(team => (
                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_week">Current Week</SelectItem>
              <SelectItem value="current_month">Current Month</SelectItem>
              <SelectItem value="current_quarter">Current Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-muted-foreground">Active teams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teams.reduce((sum, team) => sum + team.members.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all teams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(teams.reduce((sum, team) => sum + team.utilization, 0) / teams.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              Healthy range
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Details */}
      <div className="space-y-6">
        {filteredTeams.map(team => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {team.name}
                    <Badge 
                      variant={team.utilization > 85 ? "destructive" : "default"}
                    >
                      {team.utilization}% utilization
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Team Lead: {team.lead} • {team.members.length} members
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAddMember(team.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditTeam(team.id)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Team Capacity: {team.allocated}h / {team.totalCapacity}h</span>
                  <span>{team.utilization}%</span>
                </div>
                <Progress value={team.utilization} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.members.map(member => (
                  <div key={member.id} className="border rounded-lg p-3">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.role}</div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleMemberSettings(member.id)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Allocation: {member.allocated}h / {member.capacity}h</span>
                        <span>{Math.round((member.allocated / member.capacity) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(member.allocated / member.capacity) * 100} 
                        className="h-2"
                      />
                      {(member.allocated / member.capacity) > 0.9 && (
                        <div className="flex items-center gap-1 text-xs text-orange-600">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Near capacity</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
