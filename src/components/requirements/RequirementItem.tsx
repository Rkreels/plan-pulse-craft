
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { 
  ChevronDown, 
  ChevronRight, 
  Edit, 
  Trash2, 
  LinkIcon,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Requirement } from "@/types";
import { useAppContext } from "@/contexts/AppContext";

interface RequirementItemProps {
  requirement: Requirement;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RequirementItem({ requirement, onEdit, onDelete }: RequirementItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { features } = useAppContext();

  // Find linked feature
  const linkedFeature = requirement.featureId ? 
    features.find(f => f.id === requirement.featureId) : undefined;

  return (
    <Card className={`mb-4 ${isExpanded ? 'border-primary' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-6 w-6" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>
            <CardTitle className="text-base">{requirement.title}</CardTitle>
            <Badge className={
              requirement.priority === 'high' ? 'bg-red-500' :
              requirement.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
            }>
              {requirement.priority}
            </Badge>
            <Badge variant={requirement.status === 'verified' ? 'default' : 'outline'}>
              {requirement.status}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={() => onEdit(requirement.id)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => onDelete(requirement.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <>
          <CardContent className="pt-0">
            <CardDescription className="text-sm text-muted-foreground mb-4">
              {requirement.description || "No description provided."}
            </CardDescription>

            <div className="space-y-4">
              {linkedFeature && (
                <div className="flex items-center gap-2 text-sm">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Linked to feature:</span> 
                  <span className="font-medium">{linkedFeature.title}</span>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p>{requirement.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created by</p>
                  <p>{requirement.createdBy}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p>{new Date(requirement.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last updated</p>
                  <p>{new Date(requirement.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Acceptance Criteria</h4>
                <ul className="space-y-1">
                  {requirement.acceptanceCriteria?.map((criteria, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      {criteria.met ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                      )}
                      <span>{criteria.text}</span>
                    </li>
                  ))}
                  {!requirement.acceptanceCriteria?.length && (
                    <li className="text-muted-foreground text-sm">No acceptance criteria defined</li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-3 text-xs text-muted-foreground">
            Version: {requirement.version || 1}
          </CardFooter>
        </>
      )}
    </Card>
  );
}
