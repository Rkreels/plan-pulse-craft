
import { useState, useEffect } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { EmptyState } from "@/components/common/EmptyState";
import { AccessDenied } from "@/components/common/AccessDenied";
import { AddEditReleaseDialog } from "@/components/dialogs/AddEditReleaseDialog";
import { useAppContext } from "@/contexts/AppContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Release as ReleaseType, Feature } from "@/types";
import { PlusCircle, CalendarDays, Edit, Trash2, Eye, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
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
    return <AccessDenied requiredRole="developer" />;
  }

  // Find the current release if we're on a detail page
  const currentRelease = id ? releases.find(r => r.id === id) : undefined;

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
        <EmptyState 
          title="Release Not Found" 
          description="The release you are looking for doesn't exist or has been removed."
          icon={<CalendarDays className="h-10 w-10 text-muted-foreground" />}
          action={{
            label: "Back to Releases",
            onClick: () => navigate("/releases")
          }}
        />
      );
    }

    const stats = getReleaseStats(release);
    const releaseFeatures = features.filter(f => f.releaseId === release.id);
    const releaseEpics = epics.filter(e => e.releaseId === release.id);
    
    return (
      <>
        <div className="flex items-center mb-4">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => navigate("/releases")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Releases
          </Button>
        </div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Release {release.version}</h1>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">ID: {release.id}</Badge>
              <Badge className={
                release.status === "completed" ? "bg-green-500" :
                release.status === "in_progress" ? "bg-blue-500" :
                release.status === "planned" ? "bg-amber-500" :
                "bg-slate-500"
              }>
                {release.status.replace('_', ' ')}
              </Badge>
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completionPercentage}%</div>
              <p className="text-sm text-muted-foreground">
                {stats.completedFeatures} of {stats.totalFeatures} features completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.daysLeft > 0 ? `${stats.daysLeft} days left` : 'Overdue'}
              </div>
              <p className="text-sm text-muted-foreground">
                Release date: {new Date(release.releaseDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              {stats.completionPercentage === 100 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : stats.daysLeft < 0 ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : stats.daysLeft < 7 && stats.completionPercentage < 90 ? (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-blue-500" />
              )}
              <span>
                {stats.completionPercentage === 100 
                  ? 'Ready for release' 
                  : stats.daysLeft < 0 
                    ? 'Overdue' 
                    : stats.daysLeft < 7 && stats.completionPercentage < 90 
                      ? 'At risk' 
                      : 'On track'}
              </span>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Features ({releaseFeatures.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {releaseFeatures.length === 0 ? (
                  <p className="text-muted-foreground">No features are assigned to this release.</p>
                ) : (
                  <div className="space-y-4">
                    {releaseFeatures.map(feature => (
                      <div key={feature.id} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                        <div>
                          <h4 className="font-medium">{feature.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
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
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Release Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {release.notes ? (
                  <p>{release.notes}</p>
                ) : (
                  <p className="text-muted-foreground">No release notes available.</p>
                )}
              </CardContent>
              {canDelete && (
                <CardFooter className="border-t flex justify-end pt-4">
                  <Button 
                    variant="destructive" 
                    size="sm"
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
      </>
    );
  }
  
  // Releases list view
  return (
    <>
      <PageTitle
        title="Releases"
        description="Manage your product release schedule"
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
          description="No releases have been scheduled yet. Start by creating your first release."
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
              <Card key={release.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Badge 
                      className={
                        release.status === "completed" ? "bg-green-500" :
                        release.status === "in_progress" ? "bg-blue-500" :
                        "bg-amber-500"
                      }
                    >
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
                  <CardTitle 
                    className="mt-2 text-lg cursor-pointer hover:underline" 
                    onClick={() => navigate(`/releases/${release.id}`)}
                  >
                    Release {release.version}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress:</span>
                    <span>{stats.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500" 
                      style={{ width: `${stats.completionPercentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      Release date: {new Date(release.releaseDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {stats.daysLeft > 0 
                        ? `${stats.daysLeft} days left` 
                        : 'Overdue'}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3">
                  <div className="flex items-center text-sm">
                    <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {stats.totalFeatures} feature{stats.totalFeatures !== 1 && 's'}
                    </span>
                  </div>
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
    </>
  );
};

export default Releases;
