
import React, { useState, useMemo } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { EmptyState } from "@/components/common/EmptyState";
import { AccessDenied } from "@/components/common/AccessDenied";
import { useAppContext } from "@/contexts/AppContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Zap,
  Grid3X3,
  List,
  GitBranch
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AddEditFeatureDialog } from "@/components/dialogs/AddEditFeatureDialog";
import FeatureTabContent from "@/components/features/FeatureTabContent";
import { Feature } from "@/types";

const Features = () => {
  const { features, epics, addFeature, currentUser } = useAppContext();
  const { hasRole } = useRoleAccess();
  const [activeTab, setActiveTab] = useState("list");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("priority");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Role-based access control
  if (!hasRole("developer")) {
    return <AccessDenied requiredRole="developer" />;
  }

  // Apply filters and sorting
  const filteredFeatures = useMemo(() => {
    return features.filter(feature => {
      // Search filter
      if (search && !feature.title.toLowerCase().includes(search.toLowerCase()) && 
         !feature.description.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (statusFilter !== "all" && feature.status !== statusFilter) {
        return false;
      }
      
      // Priority filter
      if (priorityFilter !== "all" && feature.priority !== priorityFilter) {
        return false;
      }
      
      // Assignee filter
      if (assigneeFilter !== "all" && !feature.assignedTo?.includes(assigneeFilter)) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      // Sort based on selected field
      if (sortField === "priority") {
        const priorityValues = { critical: 4, high: 3, medium: 2, low: 1 };
        const aValue = priorityValues[a.priority] || 0;
        const bValue = priorityValues[b.priority] || 0;
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else if (sortField === "title") {
        return sortDirection === "asc" 
          ? a.title.localeCompare(b.title) 
          : b.title.localeCompare(a.title);
      } else if (sortField === "score") {
        const aScore = a.score || 0;
        const bScore = b.score || 0;
        return sortDirection === "asc" ? aScore - bScore : bScore - aScore;
      }
      
      return 0;
    });
  }, [features, search, statusFilter, priorityFilter, assigneeFilter, sortField, sortDirection]);

  const handleCreateFeature = (featureData: Partial<Feature>) => {
    const newFeature: Feature = {
      id: `feature-${Date.now()}`,
      title: featureData.title || "",
      description: featureData.description || "",
      status: featureData.status || "idea",
      userStory: featureData.userStory,
      acceptanceCriteria: featureData.acceptanceCriteria || [],
      priority: featureData.priority || "medium",
      effort: featureData.effort || 1,
      value: featureData.value || 1,
      score: ((featureData.value || 1) / (featureData.effort || 1)) * 10,
      tags: featureData.tags || [],
      assignedTo: featureData.assignedTo || [],
      dependencies: featureData.dependencies || [],
      epicId: featureData.epicId,
      releaseId: featureData.releaseId,
      feedback: [],
      votes: 0,
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      workspaceId: "workspace-1"
    };
    
    addFeature(newFeature);
    setShowAddDialog(false);
  };

  // Feature statistics
  const featureStats = {
    total: filteredFeatures.length,
    completed: filteredFeatures.filter(f => f.status === "completed").length,
    inProgress: filteredFeatures.filter(f => f.status === "in_progress").length,
    planned: filteredFeatures.filter(f => f.status === "planned").length,
    backlog: filteredFeatures.filter(f => f.status === "backlog").length,
    ideas: filteredFeatures.filter(f => f.status === "idea").length
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start">
          <PageTitle 
            title="Features" 
            description="Manage and track product features and capabilities"
          />
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
        </div>

        {/* Feature Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{featureStats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{featureStats.completed}</div>
            <div className="text-sm text-green-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{featureStats.inProgress}</div>
            <div className="text-sm text-blue-600">In Progress</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{featureStats.planned}</div>
            <div className="text-sm text-yellow-600">Planned</div>
          </div>
          <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{featureStats.backlog}</div>
            <div className="text-sm text-gray-600">Backlog</div>
          </div>
          <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{featureStats.ideas}</div>
            <div className="text-sm text-purple-600">Ideas</div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start">
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search features..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Status</h4>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="idea">Idea</SelectItem>
                        <SelectItem value="backlog">Backlog</SelectItem>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Priority</h4>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All priorities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All priorities</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Sort by</h4>
                    <Select value={sortField} onValueChange={setSortField}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="score">Score</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Direction</h4>
                    <Select value={sortDirection} onValueChange={(val: "asc" | "desc") => setSortDirection(val)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Descending</SelectItem>
                        <SelectItem value="asc">Ascending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {filteredFeatures.length === 0 ? (
          <EmptyState 
            title={search || statusFilter !== "all" || priorityFilter !== "all" ? "No Matching Features" : "No Features"} 
            description={search || statusFilter !== "all" || priorityFilter !== "all" 
              ? "Try adjusting your search or filters."
              : "Create your first feature to get started."
            }
            icon={<Zap className="h-10 w-10 text-muted-foreground" />}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List View
              </TabsTrigger>
              <TabsTrigger value="board" className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                Board View
              </TabsTrigger>
              <TabsTrigger value="dependencies" className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                Dependencies
              </TabsTrigger>
            </TabsList>
            
            <FeatureTabContent 
              activeTab={activeTab}
              features={filteredFeatures}
              epics={epics}
            />
          </Tabs>
        )}
      </div>

      <AddEditFeatureDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={handleCreateFeature}
      />
    </>
  );
};

export default Features;
