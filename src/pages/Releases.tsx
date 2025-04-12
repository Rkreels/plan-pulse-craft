
import { useState } from "react";
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
    return <AccessDenied requiredRole="developer" />;
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
