
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { 
  Plus, 
  Filter, 
  Search, 
  ClipboardList, 
  SlidersHorizontal,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RequirementItem } from "@/components/requirements/RequirementItem";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "sonner";
import { Requirement } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const mockRequirements: Requirement[] = [
  {
    id: "req-1",
    title: "User Authentication System",
    description: "Implement secure user authentication with OAuth 2.0 and JWT tokens",
    priority: "high",
    status: "in_progress",
    type: "functional",
    featureId: null,
    createdBy: "John Smith",
    createdAt: new Date(2023, 3, 15).toISOString(),
    updatedAt: new Date(2023, 3, 20).toISOString(),
    version: 2,
    acceptanceCriteria: [
      { text: "Users can log in with email/password", met: true },
      { text: "OAuth providers include Google and GitHub", met: false },
      { text: "JWT tokens expire after 24 hours", met: true }
    ]
  },
  {
    id: "req-2",
    title: "Export to PDF",
    description: "Allow users to export roadmaps and reports to PDF format",
    priority: "medium",
    status: "verified",
    type: "functional",
    featureId: "f1",
    createdBy: "Emma Watson",
    createdAt: new Date(2023, 4, 10).toISOString(),
    updatedAt: new Date(2023, 4, 12).toISOString(),
    version: 1,
    acceptanceCriteria: [
      { text: "PDF includes all visible content from the current view", met: true },
      { text: "Company branding should be included in the header", met: true },
      { text: "Support for A4 and US Letter formats", met: true }
    ]
  }
];

const Requirements = () => {
  const [requirements, setRequirements] = useState<Requirement[]>(mockRequirements);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRequirement, setCurrentRequirement] = useState<Requirement | null>(null);
  const [newRequirement, setNewRequirement] = useState<Partial<Requirement>>({
    title: "",
    description: "",
    priority: "medium",
    status: "draft",
    type: "functional",
    acceptanceCriteria: []
  });
  const [newCriterion, setNewCriterion] = useState("");

  // Filter requirements
  const filteredRequirements = requirements.filter(req => {
    // Search filter
    if (searchQuery && !req.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
       !req.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Priority filter
    if (priorityFilter && req.priority !== priorityFilter) {
      return false;
    }
    
    // Status filter
    if (statusFilter && req.status !== statusFilter) {
      return false;
    }
    
    return true;
  });

  const handleEdit = (id: string) => {
    const requirement = requirements.find(r => r.id === id);
    if (requirement) {
      setCurrentRequirement(requirement);
      setNewRequirement({
        ...requirement
      });
      setIsDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this requirement?")) {
      setRequirements(prev => prev.filter(r => r.id !== id));
      toast.success("Requirement deleted successfully");
    }
  };

  const handleCreateNew = () => {
    setCurrentRequirement(null);
    setNewRequirement({
      title: "",
      description: "",
      priority: "medium",
      status: "draft",
      type: "functional",
      acceptanceCriteria: []
    });
    setIsDialogOpen(true);
  };

  const handleSaveRequirement = () => {
    if (!newRequirement.title) {
      toast.error("Title is required");
      return;
    }

    const now = new Date().toISOString();

    if (currentRequirement) {
      // Update existing requirement
      const updatedRequirement = {
        ...currentRequirement,
        ...newRequirement,
        updatedAt: now,
        version: (currentRequirement.version || 1) + 1
      } as Requirement;

      setRequirements(prev => prev.map(r => 
        r.id === currentRequirement.id ? updatedRequirement : r
      ));
      toast.success("Requirement updated successfully");
    } else {
      // Create new requirement
      const requirement = {
        ...newRequirement,
        id: `req-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        createdBy: "Current User",
        version: 1
      } as Requirement;

      setRequirements(prev => [...prev, requirement]);
      toast.success("Requirement created successfully");
    }

    setIsDialogOpen(false);
  };

  const addAcceptanceCriterion = () => {
    if (!newCriterion.trim()) return;

    setNewRequirement(prev => ({
      ...prev,
      acceptanceCriteria: [
        ...(prev.acceptanceCriteria || []),
        { text: newCriterion, met: false }
      ]
    }));
    
    setNewCriterion("");
  };

  const removeAcceptanceCriterion = (index: number) => {
    setNewRequirement(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria?.filter((_, i) => i !== index)
    }));
  };

  const toggleCriterionStatus = (index: number) => {
    setNewRequirement(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria?.map((criterion, i) => 
        i === index ? { ...criterion, met: !criterion.met } : criterion
      )
    }));
  };

  return (
    <>
      <PageTitle
        title="Requirements"
        description="Manage and track product requirements"
        action={{
          label: "New Requirement",
          icon: <Plus className="h-4 w-4" />,
          onClick: handleCreateNew
        }}
      />
      
      <div className="space-y-6">
        {/* Search and filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requirements..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <Select
              value={priorityFilter || ""}
              onValueChange={(val) => setPriorityFilter(val === "" ? null : val)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={statusFilter || ""}
              onValueChange={(val) => setStatusFilter(val === "" ? null : val)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Tabs for viewing requirements */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Requirements</TabsTrigger>
            <TabsTrigger value="unlinked">Unlinked</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {filteredRequirements.length === 0 ? (
              <EmptyState 
                title="No Requirements Found"
                description="Create your first requirement to start tracking product specifications."
                icon={<ClipboardList className="h-10 w-10 text-muted-foreground" />}
                action={{
                  label: "Create Requirement",
                  onClick: handleCreateNew
                }}
              />
            ) : (
              <div className="space-y-2">
                {filteredRequirements.map((req) => (
                  <RequirementItem 
                    key={req.id}
                    requirement={req}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="unlinked">
            {filteredRequirements.filter(r => !r.featureId).length === 0 ? (
              <EmptyState 
                title="No Unlinked Requirements"
                description="All requirements are linked to features."
                icon={<FileText className="h-10 w-10 text-muted-foreground" />}
              />
            ) : (
              <div className="space-y-2">
                {filteredRequirements
                  .filter(r => !r.featureId)
                  .map((req) => (
                    <RequirementItem 
                      key={req.id}
                      requirement={req}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="verified">
            {filteredRequirements.filter(r => r.status === 'verified').length === 0 ? (
              <EmptyState 
                title="No Verified Requirements"
                description="No requirements have been verified yet."
                icon={<FileText className="h-10 w-10 text-muted-foreground" />}
              />
            ) : (
              <div className="space-y-2">
                {filteredRequirements
                  .filter(r => r.status === 'verified')
                  .map((req) => (
                    <RequirementItem 
                      key={req.id}
                      requirement={req}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create/Edit Requirement Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentRequirement ? "Edit Requirement" : "Create New Requirement"}
            </DialogTitle>
            <DialogDescription>
              {currentRequirement 
                ? "Update the details of this requirement" 
                : "Add a new requirement to track product specifications"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newRequirement.title || ""}
                onChange={(e) => setNewRequirement({...newRequirement, title: e.target.value})}
                placeholder="Enter requirement title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newRequirement.description || ""}
                onChange={(e) => setNewRequirement({...newRequirement, description: e.target.value})}
                placeholder="Describe the requirement..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newRequirement.priority || "medium"}
                  onValueChange={(val) => setNewRequirement({...newRequirement, priority: val as any})}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newRequirement.status || "draft"}
                  onValueChange={(val) => setNewRequirement({...newRequirement, status: val as any})}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={newRequirement.type || "functional"}
                onValueChange={(val) => setNewRequirement({...newRequirement, type: val as any})}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="functional">Functional</SelectItem>
                  <SelectItem value="non_functional">Non-Functional</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2 mt-2">
              <Label>Acceptance Criteria</Label>
              <div className="space-y-2">
                {newRequirement.acceptanceCriteria?.map((criterion, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={criterion.met ? "default" : "outline"}
                      className="h-7 px-2"
                      onClick={() => toggleCriterionStatus(index)}
                    >
                      {criterion.met ? "Met" : "Not Met"}
                    </Button>
                    <div className="flex-1">{criterion.text}</div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAcceptanceCriterion(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="flex items-center gap-2">
                  <Input
                    value={newCriterion}
                    onChange={(e) => setNewCriterion(e.target.value)}
                    placeholder="Add acceptance criterion..."
                    className="flex-1"
                  />
                  <Button 
                    type="button"
                    onClick={addAcceptanceCriterion}
                    disabled={!newCriterion.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRequirement}>
              {currentRequirement ? "Update" : "Create"} Requirement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Requirements;
