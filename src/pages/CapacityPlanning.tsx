
import React, { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useAppContext } from "@/contexts/AppContext";
import { CalendarIcon, ChevronDown, Download, Filter, Plus, Search } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  capacity: number;
  allocated: number;
  image?: string;
}

interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: "planning" | "active" | "completed";
  team: string[];
  storyPoints: number;
  completedPoints: number;
}

// Mock data
const initialTeamMembers: TeamMember[] = [
  {
    id: "tm1",
    name: "Alex Johnson",
    role: "Frontend Developer",
    capacity: 40,
    allocated: 32,
    image: "https://i.pravatar.cc/150?u=tm1"
  },
  {
    id: "tm2",
    name: "Sarah Miller",
    role: "Backend Developer",
    capacity: 40,
    allocated: 40,
    image: "https://i.pravatar.cc/150?u=tm2"
  },
  {
    id: "tm3",
    name: "David Chen",
    role: "UX Designer",
    capacity: 35,
    allocated: 28,
    image: "https://i.pravatar.cc/150?u=tm3"
  },
  {
    id: "tm4",
    name: "Mia Williams",
    role: "Product Manager",
    capacity: 30,
    allocated: 30,
    image: "https://i.pravatar.cc/150?u=tm4"
  },
  {
    id: "tm5",
    name: "Ryan Taylor",
    role: "QA Engineer",
    capacity: 40,
    allocated: 25,
    image: "https://i.pravatar.cc/150?u=tm5"
  },
];

const initialSprints: Sprint[] = [
  {
    id: "sp1",
    name: "Sprint 24",
    startDate: new Date(2025, 4, 1),
    endDate: new Date(2025, 4, 14),
    status: "active",
    team: ["tm1", "tm2", "tm3"],
    storyPoints: 45,
    completedPoints: 20
  },
  {
    id: "sp2",
    name: "Sprint 23",
    startDate: new Date(2025, 3, 17),
    endDate: new Date(2025, 3, 30),
    status: "completed",
    team: ["tm1", "tm2", "tm4", "tm5"],
    storyPoints: 50,
    completedPoints: 50
  },
  {
    id: "sp3",
    name: "Sprint 25",
    startDate: new Date(2025, 4, 15),
    endDate: new Date(2025, 4, 28),
    status: "planning",
    team: ["tm2", "tm3", "tm5"],
    storyPoints: 40,
    completedPoints: 0
  },
];

const CapacityPlanning = () => {
  const { features } = useAppContext();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints);
  const [view, setView] = useState("team");
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: "",
    role: "",
    capacity: 40,
    allocated: 0
  });
  const [isAddSprintDialogOpen, setIsAddSprintDialogOpen] = useState(false);
  const [newSprint, setNewSprint] = useState<Partial<Sprint>>({
    name: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    status: "planning",
    team: [],
    storyPoints: 0,
    completedPoints: 0
  });

  const handleAddMember = () => {
    if (!newMember.name || !newMember.role) return;
    
    const member: TeamMember = {
      id: `tm${Date.now()}`,
      name: newMember.name,
      role: newMember.role,
      capacity: newMember.capacity || 40,
      allocated: newMember.allocated || 0,
      image: `https://i.pravatar.cc/150?u=${Date.now()}`
    };
    
    setTeamMembers(prev => [...prev, member]);
    setNewMember({
      name: "",
      role: "",
      capacity: 40,
      allocated: 0
    });
    setIsAddMemberDialogOpen(false);
  };

  const handleAddSprint = () => {
    if (!newSprint.name || !newSprint.startDate || !newSprint.endDate) return;
    
    const sprint: Sprint = {
      id: `sp${Date.now()}`,
      name: newSprint.name || "",
      startDate: newSprint.startDate || new Date(),
      endDate: newSprint.endDate || new Date(),
      status: newSprint.status as "planning" | "active" | "completed" || "planning",
      team: newSprint.team || [],
      storyPoints: newSprint.storyPoints || 0,
      completedPoints: newSprint.completedPoints || 0
    };
    
    setSprints(prev => [...prev, sprint]);
    setNewSprint({
      name: "",
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: "planning",
      team: [],
      storyPoints: 0,
      completedPoints: 0
    });
    setIsAddSprintDialogOpen(false);
  };

  return (
    <div>
      <PageTitle 
        title="Capacity Planning"
        description="Manage team capacity and sprint planning"
        action={{
          label: view === "team" ? "Add Team Member" : "Add Sprint",
          icon: <Plus className="h-4 w-4" />,
          onClick: () => view === "team" ? setIsAddMemberDialogOpen(true) : setIsAddSprintDialogOpen(true)
        }}
      />
      
      <Tabs value={view} onValueChange={setView} className="w-full">
        <div className="flex justify-between mb-6">
          <TabsList>
            <TabsTrigger value="team">Team Capacity</TabsTrigger>
            <TabsTrigger value="sprints">Sprint Planning</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-8 w-[200px]" 
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Team Capacity View */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Capacity Overview</CardTitle>
              <CardDescription>Current capacity allocation for team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary-foreground">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {member.allocated}/{member.capacity} hours
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round(member.allocated / member.capacity * 100)}% allocated
                          </div>
                        </div>
                      </div>
                      <Progress 
                        value={member.allocated / member.capacity * 100} 
                        className={`h-2 ${
                          member.allocated / member.capacity > 0.9 ? 'bg-red-100' : 
                          member.allocated / member.capacity > 0.75 ? 'bg-yellow-100' : 
                          'bg-green-100'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sprint Planning View */}
        <TabsContent value="sprints" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="bg-yellow-50 dark:bg-yellow-900/20">
                <CardTitle>Planning</CardTitle>
                <CardDescription>{sprints.filter(s => s.status === 'planning').length} sprints</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {sprints
                  .filter(sprint => sprint.status === 'planning')
                  .map(sprint => (
                    <div key={sprint.id} className="p-4 border-b last:border-0">
                      <h4 className="font-medium">{sprint.name}</h4>
                      <div className="text-sm text-muted-foreground mt-1">
                        {format(new Date(sprint.startDate), 'MMM d')} - {format(new Date(sprint.endDate), 'MMM d, yyyy')}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm">
                          {sprint.storyPoints} story points
                        </div>
                        <div className="flex -space-x-2">
                          {sprint.team.slice(0, 3).map(teamId => {
                            const member = teamMembers.find(m => m.id === teamId);
                            return (
                              <div key={teamId} className="w-6 h-6 rounded-full overflow-hidden bg-muted border-2 border-background">
                                {member?.image ? (
                                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-primary/20 flex items-center justify-center text-xs">
                                    {member?.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {sprint.team.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                              +{sprint.team.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
                <CardTitle>Active</CardTitle>
                <CardDescription>{sprints.filter(s => s.status === 'active').length} sprints</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {sprints
                  .filter(sprint => sprint.status === 'active')
                  .map(sprint => (
                    <div key={sprint.id} className="p-4 border-b last:border-0">
                      <h4 className="font-medium">{sprint.name}</h4>
                      <div className="text-sm text-muted-foreground mt-1">
                        {format(new Date(sprint.startDate), 'MMM d')} - {format(new Date(sprint.endDate), 'MMM d, yyyy')}
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{Math.round(sprint.completedPoints / sprint.storyPoints * 100)}%</span>
                        </div>
                        <Progress value={sprint.completedPoints / sprint.storyPoints * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-green-50 dark:bg-green-900/20">
                <CardTitle>Completed</CardTitle>
                <CardDescription>{sprints.filter(s => s.status === 'completed').length} sprints</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {sprints
                  .filter(sprint => sprint.status === 'completed')
                  .map(sprint => (
                    <div key={sprint.id} className="p-4 border-b last:border-0">
                      <h4 className="font-medium">{sprint.name}</h4>
                      <div className="text-sm text-muted-foreground mt-1">
                        {format(new Date(sprint.startDate), 'MMM d')} - {format(new Date(sprint.endDate), 'MMM d, yyyy')}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm">
                          {sprint.storyPoints} story points completed
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add Team Member Dialog */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new team member to manage capacity planning.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Input
                id="role"
                value={newMember.role}
                onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacity (hours)
              </Label>
              <Input
                id="capacity"
                type="number"
                value={newMember.capacity}
                onChange={(e) => setNewMember({...newMember, capacity: Number(e.target.value)})}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMember}>Add Team Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Sprint Dialog */}
      <Dialog open={isAddSprintDialogOpen} onOpenChange={setIsAddSprintDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Sprint</DialogTitle>
            <DialogDescription>
              Create a new sprint for your team.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sprintName" className="text-right">
                Sprint Name
              </Label>
              <Input
                id="sprintName"
                value={newSprint.name}
                onChange={(e) => setNewSprint({...newSprint, name: e.target.value})}
                className="col-span-3"
                placeholder="e.g., Sprint 26"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newSprint.startDate ? format(newSprint.startDate, 'PPP') : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newSprint.startDate}
                      onSelect={(date) => date && setNewSprint({...newSprint, startDate: date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newSprint.endDate ? format(newSprint.endDate, 'PPP') : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newSprint.endDate}
                      onSelect={(date) => date && setNewSprint({...newSprint, endDate: date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="storyPoints" className="text-right">
                Story Points
              </Label>
              <Input
                id="storyPoints"
                type="number"
                value={newSprint.storyPoints}
                onChange={(e) => setNewSprint({...newSprint, storyPoints: Number(e.target.value)})}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSprintDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSprint}>Create Sprint</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CapacityPlanning;
