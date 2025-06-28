
import { useState, useMemo } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Search, Calendar, Package, 
  CheckCircle, Clock, AlertCircle, 
  Edit, Trash2, Eye 
} from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { AddEditReleaseDialog } from "@/components/dialogs/AddEditReleaseDialog";
import { Release, Feature } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const Releases = () => {
  const { 
    releases, 
    features, 
    addRelease, 
    updateRelease, 
    deleteRelease 
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState("upcoming");
  const [newReleaseDialogOpen, setNewReleaseDialogOpen] = useState(false);
  const [editingRelease, setEditingRelease] = useState<Release | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const filteredReleases = useMemo(() => {
    let filtered = releases.filter(release => {
      const matchesSearch = !searchQuery || 
        release.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || release.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    return filtered.sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
  }, [releases, searchQuery, statusFilter]);

  const upcomingReleases = filteredReleases.filter(r => 
    r.status === "planning" || r.status === "in_progress"
  );
  
  const completedReleases = filteredReleases.filter(r => 
    r.status === "completed"
  );

  const handleAddRelease = (release: Release) => {
    const newRelease: Release = {
      ...release,
      id: release.id || uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    addRelease(newRelease);
    toast.success("Release created successfully");
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
    }
  };

  const getReleaseFeatures = (releaseId: string): Feature[] => {
    return features.filter(feature => feature.releaseId === releaseId);
  };

  const calculateReleaseProgress = (releaseId: string): number => {
    const releaseFeatures = getReleaseFeatures(releaseId);
    if (releaseFeatures.length === 0) return 0;
    
    const totalProgress = releaseFeatures.reduce((sum, feature) => sum + (feature.progress || 0), 0);
    return Math.round(totalProgress / releaseFeatures.length);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "planning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "planning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (release: Release) => {
    return new Date(release.targetDate) < new Date() && release.status !== "completed";
  };

  const renderReleaseCard = (release: Release) => {
    const releaseFeatures = getReleaseFeatures(release.id);
    const progress = calculateReleaseProgress(release.id);
    const overdue = isOverdue(release);

    return (
      <Card key={release.id} className={`hover:shadow-lg transition-shadow ${overdue ? 'border-red-200' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {getStatusIcon(release.status)}
              <Badge className={getStatusColor(release.status)}>
                {release.status.replace('_', ' ')}
              </Badge>
              {overdue && (
                <Badge variant="destructive" className="text-xs">
                  Overdue
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => {
                  toast.info(`Viewing details for ${release.name}`);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => handleEditRelease(release)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-red-500 hover:text-red-700"
                onClick={() => handleDeleteRelease(release.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardTitle className="text-lg">{release.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{release.description}</p>
        </CardHeader>
        
        <CardContent className="pb-3">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Target Date</span>
                <div className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(release.targetDate)}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Features</span>
                <div className="font-medium">{releaseFeatures.length}</div>
              </div>
            </div>
            
            {release.version && (
              <div className="text-sm">
                <span className="text-muted-foreground">Version: </span>
                <span className="font-medium">{release.version}</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-3">
          <div className="flex flex-wrap gap-1 w-full">
            {releaseFeatures.slice(0, 3).map(feature => (
              <Badge key={feature.id} variant="outline" className="text-xs">
                {feature.title}
              </Badge>
            ))}
            {releaseFeatures.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{releaseFeatures.length - 3} more
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  };

  const renderReleaseList = (releaseList: Release[]) => {
    if (releaseList.length === 0) {
      return (
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
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {releaseList.map(renderReleaseCard)}
      </div>
    );
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
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={() => setNewReleaseDialogOpen(true)}>
          <Plus size={16} className="mr-2" />
          New Release
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingReleases.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedReleases.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Releases ({filteredReleases.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          {renderReleaseList(upcomingReleases)}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {renderReleaseList(completedReleases)}
        </TabsContent>
        
        <TabsContent value="all" className="mt-6">
          {renderReleaseList(filteredReleases)}
        </TabsContent>
      </Tabs>
      
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
