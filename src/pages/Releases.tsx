
import { useState, useMemo } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Calendar, Package, Target, AlertCircle } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { AddEditReleaseDialog } from "@/components/dialogs/AddEditReleaseDialog";
import { Release } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const Releases = () => {
  const { releases, features, addRelease, updateRelease, deleteRelease } = useAppContext();
  const [newReleaseDialogOpen, setNewReleaseDialogOpen] = useState(false);
  const [editingRelease, setEditingRelease] = useState<Release | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredReleases = useMemo(() => {
    return releases.filter(release => {
      const matchesSearch = !searchQuery || 
        release.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || release.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [releases, searchQuery, statusFilter]);

  const handleAddRelease = (release: Release) => {
    const newRelease: Release = {
      ...release,
      id: release.id || uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    addRelease(newRelease);
    toast.success("Release added successfully");
  };

  const handleEditRelease = (release: Release) => {
    setEditingRelease(release);
  };

  const handleUpdateRelease = (updatedRelease: Release) => {
    updateRelease(updatedRelease);
    setEditingRelease(undefined);
    toast.success("Release updated successfully");
  };

  const handleDeleteRelease = (releaseId: string) => {
    if (window.confirm("Are you sure you want to delete this release?")) {
      deleteRelease(releaseId);
      toast.success("Release deleted successfully");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "planned": return "bg-yellow-100 text-yellow-800";
      case "delayed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <Target className="h-4 w-4" />;
      case "in_progress": return <Package className="h-4 w-4" />;
      case "planned": return <Calendar className="h-4 w-4" />;
      case "delayed": return <AlertCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <>
      <PageTitle
        title="Releases"
        description="Plan and track your product releases"
      />
      
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start mb-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search releases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={() => setNewReleaseDialogOpen(true)}>
          <Plus size={16} className="mr-2" />
          New Release
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReleases.map(release => {
          const releaseFeatures = features.filter(f => f.releaseId === release.id);
          const completedFeatures = releaseFeatures.filter(f => f.status === "completed");
          const progress = releaseFeatures.length > 0 ? (completedFeatures.length / releaseFeatures.length) * 100 : 0;

          return (
            <Card key={release.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(release.status)}
                    <CardTitle className="text-lg">{release.name}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(release.status)}>
                    {release.status.replace('_', ' ')}
                  </Badge>
                </div>
                <CardDescription>{release.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Features: {releaseFeatures.length}</span>
                    <span>Due: {new Date(release.targetDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditRelease(release)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteRelease(release.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredReleases.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No releases found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || statusFilter !== "all" 
              ? "Try adjusting your filters"
              : "Create your first release to get started"
            }
          </p>
          <Button onClick={() => setNewReleaseDialogOpen(true)}>
            <Plus size={16} className="mr-2" />
            Create Release
          </Button>
        </div>
      )}
      
      <AddEditReleaseDialog
        open={newReleaseDialogOpen}
        onOpenChange={setNewReleaseDialogOpen}
        onSave={handleAddRelease}
      />

      {editingRelease && (
        <AddEditReleaseDialog
          open={!!editingRelease}
          onOpenChange={(open) => !open && setEditingRelease(undefined)}
          release={editingRelease}
          onSave={handleUpdateRelease}
        />
      )}
    </>
  );
};

export default Releases;
