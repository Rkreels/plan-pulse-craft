
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Clock, TrendingUp, AlertTriangle, Plus, Edit, Download, UserPlus } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  capacity: number;
  allocated: number;
  skills: string[];
  currentTasks: number;
}

interface SprintCapacity {
  sprintNumber: number;
  totalCapacity: number;
  allocated: number;
  completed: number;
  velocity: number;
}

export const CapacityDashboard = () => {
  const [timeRange, setTimeRange] = useState("current");
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showRebalanceDialog, setShowRebalanceDialog] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [newMemberCapacity, setNewMemberCapacity] = useState(40);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "1", name: "Alex Kim", role: "Frontend Developer", capacity: 40, allocated: 34, skills: ["React", "TypeScript", "CSS"], currentTasks: 5 },
    { id: "2", name: "Sarah Chen", role: "Backend Developer", capacity: 40, allocated: 37, skills: ["Node.js", "Python", "PostgreSQL"], currentTasks: 6 },
    { id: "3", name: "Mike Johnson", role: "UI/UX Designer", capacity: 35, allocated: 28, skills: ["Figma", "Prototyping", "User Research"], currentTasks: 4 },
    { id: "4", name: "Emily Davis", role: "QA Engineer", capacity: 40, allocated: 32, skills: ["Automation", "Manual Testing", "Cypress"], currentTasks: 7 },
    { id: "5", name: "David Wilson", role: "DevOps Engineer", capacity: 30, allocated: 20, skills: ["AWS", "Docker", "Kubernetes"], currentTasks: 3 }
  ]);

  const [sprintData, setSprintData] = useState<SprintCapacity[]>([
    { sprintNumber: 1, totalCapacity: 185, allocated: 170, completed: 162, velocity: 38 },
    { sprintNumber: 2, totalCapacity: 185, allocated: 175, completed: 168, velocity: 40 },
    { sprintNumber: 3, totalCapacity: 185, allocated: 180, completed: 172, velocity: 42 },
    { sprintNumber: 4, totalCapacity: 200, allocated: 190, completed: 182, velocity: 45 },
    { sprintNumber: 5, totalCapacity: 200, allocated: 195, completed: 185, velocity: 47 },
    { sprintNumber: 6, totalCapacity: 215, allocated: 205, completed: 200, velocity: 50 }
  ]);

  const currentSprint = sprintData[sprintData.length - 1];
  const totalCapacity = teamMembers.reduce((sum, member) => sum + member.capacity, 0);
  const totalAllocated = teamMembers.reduce((sum, member) => sum + member.allocated, 0);
  const utilizationRate = (totalAllocated / totalCapacity) * 100;
  const atRiskMembers = teamMembers.filter(member => (member.allocated / member.capacity) > 0.9);

  const teamCapacity = teamMembers.map(member => ({
    name: member.name,
    role: member.role,
    allocated: member.allocated,
    available: member.capacity,
    utilization: (member.allocated / member.capacity) * 100,
    currentTasks: member.currentTasks,
    skills: member.skills
  }));

  const utilizationTrend = [
    { week: "W1", frontend: 80, backend: 85, design: 75, qa: 70, devops: 60 },
    { week: "W2", frontend: 85, backend: 90, design: 80, qa: 75, devops: 65 },
    { week: "W3", frontend: 88, backend: 95, design: 85, qa: 80, devops: 70 },
    { week: "W4", frontend: 85, backend: 92, design: 88, qa: 85, devops: 67 }
  ];

  const handleAddMember = () => {
    if (!newMemberName || !newMemberRole) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberName,
      role: newMemberRole,
      capacity: newMemberCapacity,
      allocated: 0,
      skills: [],
      currentTasks: 0
    };

    setTeamMembers(prev => [...prev, newMember]);
    setNewMemberName("");
    setNewMemberRole("");
    setNewMemberCapacity(40);
    setShowAddMemberDialog(false);
    toast.success(`${newMemberName} has been added to the team`);
  };

  const handleRebalanceWorkload = () => {
    const rebalanced = teamMembers.map(member => {
      const targetUtilization = 0.8; // 80% target utilization
      const newAllocation = Math.min(member.capacity * targetUtilization, member.allocated);
      return { ...member, allocated: newAllocation };
    });
    
    setTeamMembers(rebalanced);
    setShowRebalanceDialog(false);
    toast.success("Workload has been rebalanced across the team");
  };

  const handleExportReport = () => {
    const reportData = {
      summary: {
        totalCapacity,
        totalAllocated,
        utilizationRate: utilizationRate.toFixed(1),
        atRiskMembers: atRiskMembers.length,
        currentVelocity: currentSprint.velocity
      },
      teamMembers: teamCapacity,
      sprintData,
      generatedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `capacity_report_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Capacity report exported successfully");
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-red-600";
    if (utilization >= 80) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Capacity Planning</h2>
          <p className="text-muted-foreground">Monitor team capacity and resource allocation</p>
        </div>
        <div className="flex gap-2">
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
          <Button variant="outline" onClick={() => setShowAddMemberDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Total Capacity</span>
            </div>
            <div className="text-2xl font-bold mt-2">{totalCapacity}h</div>
            <div className="text-sm text-muted-foreground">This sprint</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              <span className="font-medium">Allocated</span>
            </div>
            <div className="text-2xl font-bold mt-2">{totalAllocated}h</div>
            <div className={`text-sm ${getUtilizationColor(utilizationRate)}`}>
              {utilizationRate.toFixed(1)}% utilization
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Velocity</span>
            </div>
            <div className="text-2xl font-bold mt-2">{currentSprint.velocity}</div>
            <div className="text-sm text-green-600">+6% from last sprint</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span className="font-medium">At Risk</span>
            </div>
            <div className="text-2xl font-bold mt-2">{atRiskMembers.length}</div>
            <div className="text-sm text-orange-600">Members over capacity</div>
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
              {teamCapacity.map(member => (
                <div key={member.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{member.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">({member.role})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getUtilizationColor(member.utilization)}`}>
                        {member.utilization.toFixed(0)}%
                      </span>
                      <Badge variant={member.utilization >= 90 ? "destructive" : member.utilization >= 80 ? "secondary" : "default"}>
                        {member.allocated}h / {member.available}h
                      </Badge>
                    </div>
                  </div>
                  <Progress value={member.utilization} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{member.currentTasks} active tasks</span>
                    <span>Skills: {member.skills.join(", ")}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sprint Performance</CardTitle>
            <CardDescription>Capacity vs delivered story points</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sprintData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sprintNumber" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalCapacity" fill="#e5e7eb" name="Total Capacity" />
                <Bar dataKey="allocated" fill="#8884d8" name="Allocated" />
                <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
              </BarChart>
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
              {atRiskMembers.map(member => (
                <div key={member.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">{member.name} Over Capacity</p>
                    <p className="text-sm text-red-700">
                      Currently at {((member.allocated / member.capacity) * 100).toFixed(0)}% utilization. 
                      Consider redistributing {member.currentTasks} tasks.
                    </p>
                  </div>
                </div>
              ))}
              {atRiskMembers.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No capacity alerts at this time
                </div>
              )}
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
                <Calendar className="h-4 w-4 mr-2" />
                Plan Next Sprint
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setShowRebalanceDialog(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Rebalance Workload
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setShowAddMemberDialog(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={handleExportReport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Capacity Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new team member to the capacity planning system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="memberName" className="text-sm font-medium">Name</label>
              <Input
                id="memberName"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Enter member name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="memberRole" className="text-sm font-medium">Role</label>
              <Input
                id="memberRole"
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                placeholder="Enter role (e.g., Frontend Developer)"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="memberCapacity" className="text-sm font-medium">Capacity (hours per sprint)</label>
              <Input
                id="memberCapacity"
                type="number"
                value={newMemberCapacity}
                onChange={(e) => setNewMemberCapacity(Number(e.target.value))}
                min="1"
                max="80"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rebalance Dialog */}
      <Dialog open={showRebalanceDialog} onOpenChange={setShowRebalanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rebalance Workload</DialogTitle>
            <DialogDescription>
              This will automatically redistribute work to achieve optimal team utilization (80% target).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRebalanceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRebalanceWorkload}>Rebalance Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
