
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, MoreHorizontal, Filter, ArrowUp, ArrowDown } from "lucide-react";
import { RequirementItem } from "@/components/requirements/RequirementItem";
import { toast } from "sonner";
import { Requirement } from "@/types";

export const RequirementsList = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([
    {
      id: "req-001",
      title: "User Authentication",
      description: "System must support email/password authentication with social login options",
      priority: "high",
      status: "verified",
      type: "functional",
      featureId: "f1",
      createdBy: "u1",
      createdAt: "2025-04-15T10:30:00Z",
      updatedAt: "2025-05-01T14:20:00Z",
      version: 2,
      acceptanceCriteria: [
        { text: "Users can register with email", met: true },
        { text: "Users can login with Google", met: true },
        { text: "Password reset functionality works", met: true }
      ]
    },
    {
      id: "req-002",
      title: "Feature Prioritization",
      description: "Product managers must be able to prioritize features using customizable frameworks",
      priority: "high",
      status: "in_progress",
      type: "functional",
      featureId: "f2",
      createdBy: "u1",
      createdAt: "2025-04-17T09:15:00Z",
      updatedAt: "2025-05-02T11:30:00Z",
      version: 3,
      acceptanceCriteria: [
        { text: "Support for RICE scoring", met: true },
        { text: "Custom scoring frameworks", met: false },
        { text: "Bulk prioritization", met: false }
      ]
    },
    {
      id: "req-003",
      title: "99.9% System Uptime",
      description: "System must maintain 99.9% uptime during business hours",
      priority: "medium",
      status: "review",
      type: "non_functional",
      featureId: null,
      createdBy: "u2",
      createdAt: "2025-04-20T14:00:00Z",
      updatedAt: "2025-04-20T14:00:00Z",
      version: 1,
      acceptanceCriteria: [
        { text: "Monitoring system in place", met: true },
        { text: "Automated alerts for downtime", met: false },
        { text: "Disaster recovery plan", met: false }
      ]
    },
    {
      id: "req-004",
      title: "Export to PDF",
      description: "Users must be able to export roadmaps and reports to PDF format",
      priority: "low",
      status: "draft",
      type: "functional",
      featureId: "f4",
      createdBy: "u3",
      createdAt: "2025-05-01T09:30:00Z",
      updatedAt: "2025-05-01T09:30:00Z",
      version: 1,
      acceptanceCriteria: [
        { text: "PDF export preserves all formatting", met: false },
        { text: "Support for custom page sizes", met: false }
      ]
    },
    {
      id: "req-005",
      title: "API Rate Limiting",
      description: "Implement rate limiting for API endpoints to prevent abuse",
      priority: "medium",
      status: "draft",
      type: "technical",
      featureId: null,
      createdBy: "u3",
      createdAt: "2025-05-05T16:45:00Z",
      updatedAt: "2025-05-05T16:45:00Z",
      version: 1,
      acceptanceCriteria: [
        { text: "Configurable rate limits by endpoint", met: false },
        { text: "Rate limit headers in responses", met: false }
      ]
    }
  ]);

  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);

  const handleCreateRequirement = () => {
    toast.success("Create requirement dialog would open here");
  };

  const handleSelectRequirement = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
  };

  const handleDeleteRequirements = () => {
    if (selectedRequirements.length === 0) return;
    
    setRequirements(requirements.filter(req => !selectedRequirements.includes(req.id)));
    toast.success(`${selectedRequirements.length} requirements deleted`);
    setSelectedRequirements([]);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedRequirements(prev => 
      prev.includes(id) 
        ? prev.filter(reqId => reqId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRequirements(requirements.map(req => req.id));
    } else {
      setSelectedRequirements([]);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>Manage product requirements and specifications</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" /> Filter
              </Button>
              <Button onClick={handleCreateRequirement}>
                <Plus className="h-4 w-4 mr-1" /> New Requirement
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search requirements..."
                className="pl-8 w-full"
              />
            </div>
            {selectedRequirements.length > 0 && (
              <Button 
                variant="destructive" 
                onClick={handleDeleteRequirements}
              >
                Delete Selected
              </Button>
            )}
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedRequirements.length === requirements.length && requirements.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Priority</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirements.map((requirement) => (
                  <TableRow key={requirement.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedRequirements.includes(requirement.id)}
                        onCheckedChange={() => handleToggleSelect(requirement.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{requirement.id}</TableCell>
                    <TableCell>
                      <div className="font-medium cursor-pointer hover:underline" onClick={() => handleSelectRequirement(requirement)}>
                        {requirement.title}
                      </div>
                      <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                        {requirement.description}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">
                        {requirement.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge 
                        className={
                          requirement.priority === "high" ? "bg-red-500" :
                          requirement.priority === "medium" ? "bg-amber-500" :
                          "bg-blue-500"
                        }
                      >
                        {requirement.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge 
                        variant={
                          requirement.status === "verified" ? "default" : "outline"
                        }
                      >
                        {requirement.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleSelectRequirement(requirement)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedRequirement && (
        <RequirementItem 
          requirement={selectedRequirement} 
          onClose={() => setSelectedRequirement(null)} 
        />
      )}
    </div>
  );
};
