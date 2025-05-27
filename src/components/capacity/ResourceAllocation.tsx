
import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Users,
  Clock,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export const ResourceAllocation = () => {
  const { features, releases } = useAppContext();
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedProject, setSelectedProject] = useState("all");
  
  // Mock allocation data
  const allocations = [
    {
      id: "1",
      resource: "John Doe",
      team: "Frontend",
      project: "Mobile App Redesign",
      allocation: 80,
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      skills: ["React", "TypeScript", "UI/UX"]
    },
    {
      id: "2",
      resource: "Jane Smith",
      team: "Backend",
      project: "API Enhancement",
      allocation: 100,
      startDate: "2025-01-15",
      endDate: "2025-04-15",
      skills: ["Node.js", "PostgreSQL", "AWS"]
    },
    {
      id: "3",
      resource: "Mike Johnson",
      team: "Design",
      project: "Design System",
      allocation: 60,
      startDate: "2025-02-01",
      endDate: "2025-05-01",
      skills: ["Figma", "Design Systems", "Prototyping"]
    },
    {
      id: "4",
      resource: "Sarah Wilson",
      team: "QA",
      project: "Testing Automation",
      allocation: 90,
      startDate: "2025-01-10",
      endDate: "2025-03-10",
      skills: ["Selenium", "Jest", "Cypress"]
    }
  ];

  const teams = ["Frontend", "Backend", "Design", "QA"];
  const projects = ["Mobile App Redesign", "API Enhancement", "Design System", "Testing Automation"];

  const filteredAllocations = allocations.filter(allocation => {
    if (selectedTeam !== "all" && allocation.team !== selectedTeam) return false;
    if (selectedProject !== "all" && allocation.project !== selectedProject) return false;
    return true;
  });

  const handleAddAllocation = () => {
    toast.success("Add allocation dialog would open here");
  };

  const handleEditAllocation = (id: string) => {
    toast.success(`Edit allocation ${id} dialog would open here`);
  };

  const handleDeleteAllocation = (id: string) => {
    toast.success(`Allocation ${id} deleted`);
  };

  const handleSaveAllocation = () => {
    toast.success("Allocation saved successfully");
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {teams.map(team => (
                <SelectItem key={team} value={team}>{team}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map(project => (
                <SelectItem key={project} value={project}>{project}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleAddAllocation}>
          <Plus className="h-4 w-4 mr-2" />
          Add Allocation
        </Button>
      </div>

      {/* Allocation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allocations.length}</div>
            <p className="text-xs text-muted-foreground">Active allocations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Allocation</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(allocations.reduce((sum, a) => sum + a.allocation, 0) / allocations.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Team average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Over-allocated</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allocations.filter(a => a.allocation > 90).length}
            </div>
            <p className="text-xs text-muted-foreground">Resources at risk</p>
          </CardContent>
        </Card>
      </div>

      {/* Allocation Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Allocations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAllocations.map(allocation => (
              <div key={allocation.id} className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{allocation.resource}</h3>
                      <Badge variant="outline">{allocation.team}</Badge>
                      <Badge 
                        variant={allocation.allocation > 90 ? "destructive" : "default"}
                      >
                        {allocation.allocation}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {allocation.project}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {allocation.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {allocation.startDate} - {allocation.endDate}
                    </div>
                    <Progress value={allocation.allocation} className="mt-2" />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditAllocation(allocation.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteAllocation(allocation.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Allocation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Resource</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select resource" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john">John Doe</SelectItem>
                  <SelectItem value="jane">Jane Smith</SelectItem>
                  <SelectItem value="mike">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Project</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project} value={project}>{project}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Allocation %</Label>
              <Input type="number" placeholder="80" min="0" max="100" />
            </div>
            
            <div className="flex items-end">
              <Button onClick={handleSaveAllocation} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
