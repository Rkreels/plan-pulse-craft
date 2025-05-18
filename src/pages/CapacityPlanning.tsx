
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { useAppContext } from "@/contexts/AppContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Plus, 
  Users, 
  CalendarDays,
  RefreshCcw,
  Download
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Example team members
const teamMembers = [
  { id: 'tm1', name: 'John Smith', role: 'Developer', capacity: 40, allocated: 32 },
  { id: 'tm2', name: 'Emily Johnson', role: 'Designer', capacity: 40, allocated: 36 },
  { id: 'tm3', name: 'Michael Brown', role: 'QA Engineer', capacity: 40, allocated: 26 },
  { id: 'tm4', name: 'Sarah Davis', role: 'Developer', capacity: 40, allocated: 40 },
  { id: 'tm5', name: 'David Wilson', role: 'Product Manager', capacity: 40, allocated: 38 },
];

// Example sprints
const sprints = [
  { id: 'sp1', name: 'Sprint 1', startDate: '2025-05-01', endDate: '2025-05-14', capacity: 180, allocated: 165, status: 'completed' },
  { id: 'sp2', name: 'Sprint 2', startDate: '2025-05-15', endDate: '2025-05-28', capacity: 180, allocated: 170, status: 'in_progress' },
  { id: 'sp3', name: 'Sprint 3', startDate: '2025-05-29', endDate: '2025-06-11', capacity: 180, allocated: 120, status: 'planned' },
  { id: 'sp4', name: 'Sprint 4', startDate: '2025-06-12', endDate: '2025-06-25', capacity: 180, allocated: 90, status: 'planned' },
];

const CapacityPlanning = () => {
  const { features } = useAppContext();
  const [selectedTimeframe, setSelectedTimeframe] = useState("sprint");
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [currentSprint, setCurrentSprint] = useState("sp2");
  const [newResourceName, setNewResourceName] = useState("");
  const [newResourceRole, setNewResourceRole] = useState("Developer");
  
  const totalCapacity = teamMembers.reduce((sum, member) => sum + member.capacity, 0);
  const totalAllocated = teamMembers.reduce((sum, member) => sum + member.allocated, 0);
  const utilizationRate = Math.round((totalAllocated / totalCapacity) * 100);

  const handleAddResource = () => {
    if (!newResourceName.trim()) {
      toast.error("Resource name is required");
      return;
    }
    
    toast.success(`Resource "${newResourceName}" added successfully`);
    setIsAddingResource(false);
    setNewResourceName("");
  };

  const handleBalanceWorkload = () => {
    toast.success("Workload balanced across team members");
  };

  return (
    <>
      <PageTitle
        title="Capacity Planning"
        description="Manage team resources and workloads"
        action={{
          label: "Export Plan",
          icon: <Download className="h-4 w-4" />,
          onClick: () => toast.success("Capacity plan exported")
        }}
      />

      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <TabsList>
              <TabsTrigger value="sprint">Sprints</TabsTrigger>
              <TabsTrigger value="month">Monthly</TabsTrigger>
              <TabsTrigger value="quarter">Quarterly</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsAddingResource(true)}>
              <Users className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
            <Button variant="outline" onClick={handleBalanceWorkload}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Balance Workload
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Team Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCapacity} hours/week</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total available hours across {teamMembers.length} team members
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Allocated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAllocated} hours/week</div>
              <p className="text-xs text-muted-foreground mt-1">
                Hours allocated to tasks and features
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{utilizationRate}%</div>
              <Progress value={utilizationRate} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {utilizationRate > 85 ? 'High utilization' : utilizationRate > 70 ? 'Optimal utilization' : 'Low utilization'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <TabsContent value="sprint" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap justify-between items-center">
                <CardTitle>Sprint Planning</CardTitle>
                <Select value={currentSprint} onValueChange={setCurrentSprint}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select sprint" />
                  </SelectTrigger>
                  <SelectContent>
                    {sprints.map(sprint => (
                      <SelectItem key={sprint.id} value={sprint.id}>
                        {sprint.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>
                {sprints.find(s => s.id === currentSprint)?.startDate} to {sprints.find(s => s.id === currentSprint)?.endDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Available Hours</TableHead>
                    <TableHead>Allocated Hours</TableHead>
                    <TableHead>Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.capacity} hrs</TableCell>
                      <TableCell>{member.allocated} hrs</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={(member.allocated / member.capacity) * 100} className="h-2 w-[100px]" />
                          <span>{Math.round((member.allocated / member.capacity) * 100)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Capacity</CardTitle>
              <CardDescription>May 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px]">
                <CalendarDays className="h-16 w-16 text-muted-foreground" />
                <p className="ml-4 text-muted-foreground">
                  Monthly capacity view shows team availability and allocation across the entire month
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quarter" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Capacity</CardTitle>
              <CardDescription>Q2 2025 (Apr-Jun)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px]">
                <Calendar className="h-16 w-16 text-muted-foreground" />
                <p className="ml-4 text-muted-foreground">
                  Quarterly capacity view shows team availability and allocation across the entire quarter
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>

      {/* Add Resource Dialog */}
      <Dialog open={isAddingResource} onOpenChange={setIsAddingResource}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new team member to the capacity planning
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={newResourceName}
                onChange={(e) => setNewResourceName(e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={newResourceRole}
                onValueChange={setNewResourceRole}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                  <SelectItem value="Product Manager">Product Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Weekly Capacity
              </Label>
              <Input
                id="capacity"
                className="col-span-3"
                type="number"
                defaultValue={40}
                placeholder="Hours per week"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingResource(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddResource}>
              Add Team Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CapacityPlanning;
