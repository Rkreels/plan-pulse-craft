
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { EmptyState } from "@/components/common/EmptyState";
import { AccessDenied } from "@/components/common/AccessDenied";
import { AddEditFeatureDialog } from "@/components/dialogs/AddEditFeatureDialog";
import { useAppContext } from "@/contexts/AppContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Feature as FeatureType } from "@/types";
import { PlusCircle, Tags, Edit, Trash2, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
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

const Features = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { features, epics, releases, addFeature, updateFeature, deleteFeature } = useAppContext();
  const { hasPermission } = useRoleAccess();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<FeatureType | undefined>(undefined);

  const canCreate = hasPermission("create_feature");
  const canEdit = hasPermission("edit_feature");
  const canDelete = hasPermission("delete_feature");
  
  // If we have an ID parameter, show a single feature view
  if (id) {
    const feature = features.find(f => f.id === id);
    
    if (!feature) {
      return (
        <EmptyState 
          title="Feature Not Found" 
          description="The feature you are looking for doesn't exist or has been removed."
          icon={<Tags className="h-10 w-10 text-muted-foreground" />}
          action={{
            label: "Back to Features",
            onClick: () => navigate("/features")
          }}
        />
      );
    }

    // Get related epic and release
    const epic = feature.epicId ? epics.find(e => e.id === feature.epicId) : undefined;
    const release = feature.releaseId ? releases.find(r => r.id === feature.releaseId) : undefined;
    
    return (
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{feature.title}</h1>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">ID: {feature.id}</Badge>
            <Badge className={
              feature.status === "completed" ? "bg-green-500" :
              feature.status === "in_progress" ? "bg-blue-500" :
              feature.status === "review" ? "bg-amber-500" :
              "bg-slate-500"
            }>
              {feature.status.replace('_', ' ')}
            </Badge>
            <Badge variant="secondary">{feature.priority}</Badge>
          </div>
        </div>
        
        {canEdit && (
          <Button 
            variant="outline" 
            className="flex gap-2"
            onClick={() => {
              setSelectedFeature(feature);
              setIsDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4" /> Edit Feature
          </Button>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{feature.description}</p>
              </CardContent>
            </Card>
            
            {feature.userStory && (
              <Card>
                <CardHeader>
                  <CardTitle>User Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.userStory}</p>
                </CardContent>
              </Card>
            )}
            
            {feature.acceptanceCriteria && feature.acceptanceCriteria.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Acceptance Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {feature.acceptanceCriteria.map((criterion, index) => (
                      <li key={index}>{criterion}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Priority Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Effort</p>
                    <p className="font-medium">{feature.effort}/10</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Value</p>
                    <p className="font-medium">{feature.value}/10</p>
                  </div>
                  {feature.score && (
                    <div>
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="font-medium">{feature.score.toFixed(1)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Votes</p>
                    <p className="font-medium">{feature.votes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Relationships</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {epic && (
                  <div>
                    <p className="text-sm text-muted-foreground">Epic</p>
                    <p className="font-medium cursor-pointer hover:underline" onClick={() => navigate(`/epics/${epic.id}`)}>
                      {epic.title}
                    </p>
                  </div>
                )}
                
                {release && (
                  <div>
                    <p className="text-sm text-muted-foreground">Release</p>
                    <p className="font-medium cursor-pointer hover:underline" onClick={() => navigate(`/releases/${release.id}`)}>
                      {release.name} (v{release.version})
                    </p>
                  </div>
                )}
                
                {feature.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {feature.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(feature.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {new Date(feature.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
              {canDelete && (
                <CardFooter className="border-t pt-4">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this feature?")) {
                        deleteFeature(feature.id);
                        navigate("/features");
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Feature
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
        
        <AddEditFeatureDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          feature={selectedFeature}
          onSave={(feature) => {
            if (selectedFeature) {
              updateFeature(feature);
            } else {
              addFeature(feature);
            }
          }}
        />
      </div>
    );
  }
  
  // Features list view
  return (
    <>
      <PageTitle
        title="Features"
        description="Manage and track product features"
        action={canCreate ? {
          label: "Add Feature",
          icon: <PlusCircle className="h-4 w-4" />,
          onClick: () => {
            setSelectedFeature(undefined);
            setIsDialogOpen(true);
          }
        } : undefined}
      />
      
      {features.length === 0 ? (
        <EmptyState 
          title="No Features Yet" 
          description="No features have been created yet. Add your first feature to get started."
          icon={<Tags className="h-10 w-10 text-muted-foreground" />}
          action={canCreate ? {
            label: "Add Feature",
            onClick: () => {
              setSelectedFeature(undefined);
              setIsDialogOpen(true);
            }
          } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(feature => (
            <Card key={feature.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge className={
                    feature.status === "completed" ? "bg-green-500" :
                    feature.status === "in_progress" ? "bg-blue-500" :
                    feature.status === "review" ? "bg-amber-500" :
                    "bg-slate-500"
                  }>
                    {feature.status.replace('_', ' ')}
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
                      <DropdownMenuItem onClick={() => navigate(`/features/${feature.id}`)}>
                        <Eye className="h-4 w-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      {canEdit && (
                        <DropdownMenuItem onClick={() => {
                          setSelectedFeature(feature);
                          setIsDialogOpen(true);
                        }}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                      )}
                      {canDelete && (
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this feature?")) {
                              deleteFeature(feature.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="mt-2 text-lg cursor-pointer hover:underline" onClick={() => navigate(`/features/${feature.id}`)}>
                  {feature.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Priority:</span>
                    <Badge variant="outline" className="ml-1 capitalize">{feature.priority}</Badge>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Score:</span>
                    <span className="ml-1 text-sm font-medium">{feature.score?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3 flex justify-between text-xs text-muted-foreground">
                <div>Effort: {feature.effort}/10</div>
                <div>Value: {feature.value}/10</div>
                <div>Votes: {feature.votes}</div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <AddEditFeatureDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        feature={selectedFeature}
        onSave={(feature) => {
          if (selectedFeature) {
            updateFeature(feature);
          } else {
            addFeature(feature);
          }
        }}
      />
    </>
  );
};

export default Features;
