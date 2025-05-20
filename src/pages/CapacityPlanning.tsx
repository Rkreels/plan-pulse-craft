
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { CapacityPlanningDashboard } from "@/components/capacity/CapacityPlanningDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Calendar, BarChart3, Pencil } from "lucide-react";
import { toast } from "sonner";

interface Team {
  id: string;
  name: string;
  capacity: number;
  members: number;
  lead: string;
  allocation: {
    development: number;
    maintenance: number;
    research: number;
    other: number;
  };
}

interface ResourceAllocation {
  id: string;
  teamId: string;
  project: string;
  allocated: number;
  start: string;
  end: string;
  status: string;
}

const CapacityPlanning = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [isAllocationDialogOpen, setIsAllocationDialogOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "team-1",
      name: "Frontend Team",
      capacity: 160,
      members: 5,
      lead: "Sarah Johnson",
      allocation: {
        development: 60,
        maintenance: 20,
        research: 10,
        other: 10
      }
    },
    {
      id: "team-2",
      name: "Backend Team",
      capacity: 200,
      members: 6,
      lead: "Michael Chen",
      allocation: {
        development: 70,
        maintenance: 15,
        research: 10,
        other: 5
      }
    },
    {
      id: "team-3",
      name: "QA Team",
      capacity: 120,
      members: 4,
      lead: "Emily Rodriguez",
      allocation: {
        development: 20,
        maintenance: 10,
        research: 5,
        other: 65
      }
    }
  ]);

  const [allocations, setAllocations] = useState<ResourceAllocation[]>([
    {
      id: "alloc-1",
      teamId: "team-1",
      project: "User Dashboard Redesign",
      allocated: 80,
      start: "2025-06-01",
      end: "2025-06-30",
      status: "in-progress"
    },
    {
      id: "alloc-2",
      teamId: "team-2",
      project: "API Optimization",
      allocated: 100,
      start: "2025-06-15",
      end: "2025-07-15",
      status: "planned"
    },
    {
      id: "alloc-3",
      teamId: "team-3",
      project: "Release Testing",
      allocated: 70,
      start: "2025-06-20",
      end: "2025-06-30",
      status: "planned"
    }
  ]);

  const [currentTeam, setCurrentTeam] = useState<Team>({
    id: "",
    name: "",
    capacity: 160,
    members: 5,
    lead: "",
    allocation: {
      development: 60,
      maintenance: 20,
      research: 10,
      other: 10
    }
  });

  const [currentAllocation, setCurrentAllocation] = useState<ResourceAllocation>({
    id: "",
    teamId: "",
    project: "",
    allocated: 0,
    start: "",
    end: "",
    status: "planned"
  });

  const handleAddTeam = () => {
    const newTeam = {
      ...currentTeam,
      id: `team-${Date.now()}`
    };
    
    setTeams([...teams, newTeam]);
    setIsTeamDialogOpen(false);
    toast.success("Team added successfully");
  };

  const handleAddAllocation = () => {
    const newAllocation = {
      ...currentAllocation,
      id: `alloc-${Date.now()}`
    };
    
    setAllocations([...allocations, newAllocation]);
    setIsAllocationDialogOpen(false);
    toast.success("Resource allocation added successfully");
  };

  return (
    <>
      <PageTitle
        title="Capacity Planning"
        description="Plan and manage your team's capacity across sprints"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Capacity Dashboard</TabsTrigger>
          <TabsTrigger value="allocation">Resource Allocation</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-4">
          <CapacityPlanningDashboard />
        </TabsContent>
        
        <TabsContent value="allocation" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Resource Allocation</h2>
            <Button onClick={() => {
              setCurrentAllocation({
                id: "",
                teamId: teams[0]?.id || "",
                project: "",
                allocated: 0,
                start: "",
                end: "",
                status: "planned"
              });
              setIsAllocationDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" /> 
              Add Allocation
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {allocations.map(allocation => {
              const team = teams.find(t => t.id === allocation.teamId);
              return (
                <Card key={allocation.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{allocation.project}</CardTitle>
                        <CardDescription>
                          {team?.name || "Unknown Team"}
                        </CardDescription>
                      </div>
                      <Badge 
                        className={
                          allocation.status === "completed" ? "bg-green-500" :
                          allocation.status === "in-progress" ? "bg-blue-500" :
                          "bg-amber-500"
                        }
                      >
                        {allocation.status === "in-progress" ? "In Progress" : 
                         allocation.status === "completed" ? "Completed" : "Planned"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          <span className="font-medium">{allocation.allocated}</span> hours allocated
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>From {new Date(allocation.start).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>To {new Date(allocation.end).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" size="sm" className="ml-auto">
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="teams" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Teams</h2>
            <Button onClick={() => {
              setCurrentTeam({
                id: "",
                name: "",
                capacity: 160,
                members: 5,
                lead: "",
                allocation: {
                  development: 60,
                  maintenance: 20,
                  research: 10,
                  other: 10
                }
              });
              setIsTeamDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" /> 
              Add Team
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map(team => (
              <Card key={team.id}>
                <CardHeader>
                  <CardTitle>{team.name}</CardTitle>
                  <CardDescription>Lead: {team.lead}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Team Members</span>
                    <Badge variant="outline">{team.members}</Badge>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-sm">Total Capacity</span>
                    <Badge variant="outline">{team.capacity} hours</Badge>
                  </div>
                  
                  <h4 className="text-sm font-medium mb-2">Capacity Allocation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Development</span>
                      <span>{team.allocation.development}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${team.allocation.development}%` }} 
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span>Maintenance</span>
                      <span>{team.allocation.maintenance}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded overflow-hidden">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${team.allocation.maintenance}%` }} 
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span>Research</span>
                      <span>{team.allocation.research}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded overflow-hidden">
                      <div 
                        className="h-full bg-purple-500" 
                        style={{ width: `${team.allocation.research}%` }} 
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span>Other</span>
                      <span>{team.allocation.other}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded overflow-hidden">
                      <div 
                        className="h-full bg-gray-500" 
                        style={{ width: `${team.allocation.other}%` }} 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button variant="outline" size="sm" className="ml-auto">Manage Team</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add Team Dialog */}
      <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Team</DialogTitle>
            <DialogDescription>
              Create a new team for capacity planning
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                value={currentTeam.name}
                onChange={(e) => setCurrentTeam({...currentTeam, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="team-capacity">Total Capacity (hours)</Label>
                <Input
                  id="team-capacity"
                  type="number"
                  value={currentTeam.capacity}
                  onChange={(e) => setCurrentTeam({...currentTeam, capacity: Number(e.target.value)})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="team-members">Team Members</Label>
                <Input
                  id="team-members"
                  type="number"
                  value={currentTeam.members}
                  onChange={(e) => setCurrentTeam({...currentTeam, members: Number(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team-lead">Team Lead</Label>
              <Input
                id="team-lead"
                value={currentTeam.lead}
                onChange={(e) => setCurrentTeam({...currentTeam, lead: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Capacity Allocation</Label>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Label htmlFor="allocation-dev" className="text-sm">Development (%)</Label>
                  <Input
                    id="allocation-dev"
                    type="number"
                    value={currentTeam.allocation.development}
                    onChange={(e) => setCurrentTeam({
                      ...currentTeam, 
                      allocation: {...currentTeam.allocation, development: Number(e.target.value)}
                    })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Label htmlFor="allocation-maint" className="text-sm">Maintenance (%)</Label>
                  <Input
                    id="allocation-maint"
                    type="number"
                    value={currentTeam.allocation.maintenance}
                    onChange={(e) => setCurrentTeam({
                      ...currentTeam, 
                      allocation: {...currentTeam.allocation, maintenance: Number(e.target.value)}
                    })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Label htmlFor="allocation-research" className="text-sm">Research (%)</Label>
                  <Input
                    id="allocation-research"
                    type="number"
                    value={currentTeam.allocation.research}
                    onChange={(e) => setCurrentTeam({
                      ...currentTeam, 
                      allocation: {...currentTeam.allocation, research: Number(e.target.value)}
                    })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Label htmlFor="allocation-other" className="text-sm">Other (%)</Label>
                  <Input
                    id="allocation-other"
                    type="number"
                    value={currentTeam.allocation.other}
                    onChange={(e) => setCurrentTeam({
                      ...currentTeam, 
                      allocation: {...currentTeam.allocation, other: Number(e.target.value)}
                    })}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Total: {currentTeam.allocation.development + 
                           currentTeam.allocation.maintenance + 
                           currentTeam.allocation.research + 
                           currentTeam.allocation.other}% 
                  (should be 100%)
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTeamDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddTeam}
              disabled={!currentTeam.name || !currentTeam.lead}
            >
              Add Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Allocation Dialog */}
      <Dialog open={isAllocationDialogOpen} onOpenChange={setIsAllocationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Resource Allocation</DialogTitle>
            <DialogDescription>
              Allocate team resources to projects
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="allocation-project">Project</Label>
              <Input
                id="allocation-project"
                value={currentAllocation.project}
                onChange={(e) => setCurrentAllocation({...currentAllocation, project: e.target.value})}
                placeholder="Project name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="allocation-team">Team</Label>
              <Select 
                value={currentAllocation.teamId}
                onValueChange={(value) => setCurrentAllocation({...currentAllocation, teamId: value})}
              >
                <SelectTrigger id="allocation-team">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="allocation-start">Start Date</Label>
                <Input
                  id="allocation-start"
                  type="date"
                  value={currentAllocation.start}
                  onChange={(e) => setCurrentAllocation({...currentAllocation, start: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="allocation-end">End Date</Label>
                <Input
                  id="allocation-end"
                  type="date"
                  value={currentAllocation.end}
                  onChange={(e) => setCurrentAllocation({...currentAllocation, end: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="allocation-hours">Allocated Hours</Label>
                <Input
                  id="allocation-hours"
                  type="number"
                  value={currentAllocation.allocated}
                  onChange={(e) => setCurrentAllocation({...currentAllocation, allocated: Number(e.target.value)})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="allocation-status">Status</Label>
                <Select 
                  value={currentAllocation.status}
                  onValueChange={(value) => setCurrentAllocation({...currentAllocation, status: value})}
                >
                  <SelectTrigger id="allocation-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAllocationDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddAllocation}
              disabled={!currentAllocation.project || !currentAllocation.teamId}
            >
              Add Allocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CapacityPlanning;
