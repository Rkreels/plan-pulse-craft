
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTitle } from "@/components/common/PageTitle";
import { EmptyState } from "@/components/common/EmptyState";
import { AccessDenied } from "@/components/common/AccessDenied";
import { AddEditReleaseDialog } from "@/components/dialogs/AddEditReleaseDialog";
import { useAppContext } from "@/contexts/AppContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Release as ReleaseType, Feature } from "@/types";
import { PlusCircle, CalendarDays, Edit, Trash2, Eye, CheckCircle, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";

const Releases = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { releases, features, epics, addRelease, updateRelease, deleteRelease } = useAppContext();
  const { hasPermission, hasRole } = useRoleAccess();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<ReleaseType | undefined>(undefined);

  // Check permissions
  const canCreate = hasPermission("create_release");
  const canEdit = hasPermission("edit_release");
  const canDelete = hasPermission("delete_release");

  // Role-based access control
  if (!hasRole("developer")) {
    return <MainLayout><AccessDenied requiredRole="developer" /></MainLayout>;
  }

  // Calculate release status info
  const getReleaseStats = (release: ReleaseType) => {
    const releaseFeatures = features.filter(f => f.releaseId === release.id);
    const totalFeatures = releaseFeatures.length;
    const completedFeatures = releaseFeatures.filter(f => f.status === "completed").length;
    const completionPercentage = totalFeatures > 0 ? Math.round((completedFeatures / totalFeatures) * 100) : 0;
    
    const now = new Date();
    const releaseDate = new Date(release.releaseDate);
    const daysLeft = Math.ceil((releaseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return { totalFeatures, completedFeatures, completionPercentage, daysLeft };
  };

  // If we have an ID parameter, show a single release view
  if (id) {
    const release = releases.find(r => r.id === id);
    
    if (!release) {
      return (
        <MainLayout>
          <EmptyState 
            title="Release Not Found" 
            description="The release you are looking for doesn't exist or has been removed."
            icon={<CalendarDays className="h-10 w-10 text-muted-foreground" />}
            action={{
              label: "Back to Releases",
              onClick: () => navigate("/releases")
            }}
          />
        </MainLayout>
      );
    }

    const stats = getReleaseStats(release);
    const releaseFeatures = features.filter(f => f.releaseId === release.id);
    const releaseEpics = epics.filter(e => e.releaseId === release.id);
    
    return (
      <MainLayout>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {release.name} <span className="text-xl text-muted-foreground ml-2">v{release.version}</span>
            </h1>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">ID: {release.id}</Badge>
              <Badge className={
                release.status === "completed" ? "bg-green-500" :
                release.status === "in_progress" ? "bg-blue-500" :
                release.status === "delayed" ? "bg-red-500" :
                "bg-slate-500"
              }>
                {release.status.replace('_', ' ')}
              </Badge>
              <div className="text-sm">
                Release date: <span className="font-medium">{new Date(release.releaseDate).toLocaleDateString()}</span>
                {stats.daysLeft > 0 && release.status !== "completed" && (
                  <span className="ml-2">
                    ({stats.daysLeft} day{stats.daysLeft !== 1 ? 's' : ''} left)
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {canEdit && (
            <Button 
              variant="outline" 
              className="flex gap-2"
              onClick={() => {
                setSelectedRelease(release);
                setIsDialogOpen(true);
              }}
            >
              <Edit className="h-4 w-4" /> Edit Release
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{release.description}</p>
              </CardContent>
              {release.notes && (
                <CardFooter className="border-t flex-col items-start pt-4">
                  <h4 className="font-semibold mb-2">Release Notes</h4>
                  <p className="text-sm">{release.notes}</p>
                </CardFooter>
              )}
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Features ({releaseFeatures.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {releaseFeatures.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No features are planned for this release yet.</p>
                ) : (
                  <div className="space-y-3">
                    {releaseFeatures.map(feature => (
                      <div key={feature.id} className="flex items-start justify-between p-3 border rounded-md">
                        <div>
                          <div className="font-medium cursor-pointer hover:underline" onClick={() => navigate(`/features/${feature.id}`)}>
                            {feature.title}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {feature.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">{feature.priority}</Badge>
                          <Badge className={
                            feature.status === "completed" ? "bg-green-500" :
                            feature.status === "in_progress" ? "bg-blue-500" :
                            feature.status === "review" ? "bg-amber-500" :
                            "bg-slate-500"
                          }>
                            {feature.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Release Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-md text-center">
                    <div className="text-3xl font-bold">{stats.totalFeatures}</div>
                    <div className="text-sm text-muted-foreground">Total Features</div>
                  </div>
                  <div className="p-3 bg-muted rounded-md text-center">
                    <div className="text-3xl font-bold">{stats.completedFeatures}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="p-3 bg-muted rounded-md text-center col-span-2">
                    <div className="text-3xl font-bold">{stats.completionPercentage}%</div>
                    <div className="text-sm text-muted-foreground">Completion</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <div className="font-medium">{releaseEpics.length}</div>
                    <div className="text-sm text-muted-foreground">Epics</div>
                  </div>
                  <div className="border-l pl-4">
                    <div className="font-medium">{stats.daysLeft > 0 ? stats.daysLeft : '0'}</div>
                    <div className="text-sm text-muted-foreground">Days Remaining</div>
                  </div>
                  <div className="border-l pl-4">
                    <div className="font-medium">
                      {release.status === "delayed" ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : release.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <CalendarDays className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Status</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Epics ({releaseEpics.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {releaseEpics.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No epics are associated with this release.</p>
                ) : (
                  <div className="space-y-2">
                    {releaseEpics.map(epic => (
                      <div key={epic.id} className="p-2 border rounded-md">
                        <div className="font-medium">{epic.title}</div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span className="capitalize">{epic.status.replace('_', ' ')}</span>
                          <span>{epic.progress}% complete</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {canDelete && (
                <CardFooter className="border-t pt-4">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this release?")) {
                        deleteRelease(release.id);
                        navigate("/releases");
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Release
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
        
        <AddEditReleaseDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          release={selectedRelease}
          onSave={(release) => {
            if (selectedRelease) {
              updateRelease(release);
            } else {
              addRelease(release);
            }
          }}
        />
      </MainLayout>
    );
  }
  
  // Releases list view
  return (
    <MainLayout>
      <PageTitle
        title="Product Releases"
        description="Plan and manage your product releases"
        action={canCreate ? {
          label: "Add Release",
          icon: <PlusCircle className="h-4 w-4" />,
          onClick: () => {
            setSelectedRelease(undefined);
            setIsDialogOpen(true);
          }
        } : undefined}
      />
      
      {releases.length === 0 ? (
        <EmptyState 
          title="No Releases Yet" 
          description="No product releases have been scheduled yet. Plan your first release to start organizing your features."
          icon={<CalendarDays className="h-10 w-10 text-muted-foreground" />}
          action={canCreate ? {
            label: "Add Release",
            onClick: () => {
              setSelectedRelease(undefined);
              setIsDialogOpen(true);
            }
          } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {releases.map(release => {
            const stats = getReleaseStats(release);
            return (
              <Card key={release.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Badge className={
                      release.status === "completed" ? "bg-green-500" :
                      release.status === "in_progress" ? "bg-blue-500" :
                      release.status === "delayed" ? "bg-red-500" :
                      "bg-slate-500"
                    }>
                      {release.status.replace('_', ' ')}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => navigate(`/releases/${release.id}`)}>
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        {canEdit && (
                          <DropdownMenuItem onClick={() => {
                            setSelectedRelease(release);
                            setIsDialogOpen(true);
                          }}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this release?")) {
                                deleteRelease(release.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="mt-2 text-lg cursor-pointer hover:underline" onClick={() => navigate(`/releases/${release.id}`)}>
                    {release.name}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">v{release.version}</div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {release.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="px-3 py-2 bg-muted rounded-md flex flex-col items-center">
                      <div className="text-lg font-bold">{stats.totalFeatures}</div>
                      <div className="text-xs text-muted-foreground">Features</div>
                    </div>
                    <div className="px-3 py-2 bg-muted rounded-md flex flex-col items-center">
                      <div className="text-lg font-bold">{stats.completionPercentage}%</div>
                      <div className="text-xs text-muted-foreground">Complete</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3 text-sm text-muted-foreground">
                  Release date: {new Date(release.releaseDate).toLocaleDateString()}
                  {stats.daysLeft > 0 && release.status !== "completed" && (
                    <span className="ml-1 text-xs font-medium">
                      ({stats.daysLeft} day{stats.daysLeft !== 1 ? 's' : ''} left)
                    </span>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      
      <AddEditReleaseDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        release={selectedRelease}
        onSave={(release) => {
          if (selectedRelease) {
            updateRelease(release);
          } else {
            addRelease(release);
          }
        }}
      />
    </MainLayout>
  );
};

export default Releases;
