
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { EmptyState } from "@/components/common/EmptyState";
import { AccessDenied } from "@/components/common/AccessDenied";
import { AddEditGoalDialog } from "@/components/dialogs/AddEditGoalDialog";
import { useAppContext } from "@/contexts/AppContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Goal as GoalType } from "@/types";
import { PlusCircle, Goal as GoalIcon, Edit, Trash2, Eye, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";

const Goals = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { goals, initiatives, currentUser, addGoal, updateGoal, deleteGoal } = useAppContext();
  const { hasPermission, hasRole } = useRoleAccess();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalType | undefined>(undefined);

  // Check permissions
  const canCreate = hasPermission("create_goal");
  const canEdit = hasPermission("edit_goal");
  const canDelete = hasPermission("delete_goal");

  // Role-based access control
  if (!hasRole("executive")) {
    return <AccessDenied requiredRole="executive" />;
  }

  // If we have an ID parameter, show a single goal view
  if (id) {
    const goal = goals.find(g => g.id === id);
    
    if (!goal) {
      return (
        <EmptyState 
          title="Goal Not Found" 
          description="The goal you are looking for doesn't exist or has been removed."
          icon={<GoalIcon className="h-10 w-10 text-muted-foreground" />}
          action={{
            label: "Back to Goals",
            onClick: () => navigate("/goals")
          }}
        />
      );
    }

    // Find related initiatives
    const relatedInitiatives = initiatives.filter(initiative => 
      initiative.goals?.includes(goal.id)
    );
    
    return (
      <>
        <div className="flex justify-between items-start mb-6">
          <div>
            <Button 
              variant="ghost" 
              className="mb-4" 
              onClick={() => navigate("/goals")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Goals
            </Button>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{goal.title}</h1>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">ID: {goal.id}</Badge>
              <Badge className={
                goal.status === "completed" ? "bg-green-500" :
                goal.status === "in_progress" ? "bg-blue-500" :
                goal.status === "at_risk" ? "bg-red-500" :
                "bg-slate-500"
              }>
                {goal.status.replace('_', ' ')}
              </Badge>
              <div className="flex items-center gap-2">
                <span className="text-sm">Progress:</span>
                <Progress value={goal.progress} className="w-24 h-2" />
                <span className="text-sm font-medium">{goal.progress}%</span>
              </div>
            </div>
          </div>
          
          {canEdit && (
            <Button 
              variant="outline" 
              className="flex gap-2"
              onClick={() => {
                setSelectedGoal(goal);
                setIsDialogOpen(true);
              }}
            >
              <Edit className="h-4 w-4" /> Edit Goal
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{goal.description}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Goal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">
                    {goal.startDate ? new Date(goal.startDate).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Date</p>
                  <p className="font-medium">
                    {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Owner</p>
                  <p className="font-medium">
                    {goal.ownerId === currentUser?.id ? 'You' : 'Another Team Member'}
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
                      if (window.confirm("Are you sure you want to delete this goal?")) {
                        deleteGoal(goal.id);
                        navigate("/goals");
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Goal
                  </Button>
                </CardFooter>
              )}
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Related Initiatives ({relatedInitiatives.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {relatedInitiatives.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No initiatives are linked to this goal yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {relatedInitiatives.map(initiative => (
                      <li key={initiative.id} className="text-sm">
                        <div className="font-medium">{initiative.title}</div>
                        <div className="text-xs text-muted-foreground flex items-center justify-between">
                          <span>{initiative.status.replace('_', ' ')}</span>
                          <span>{initiative.progress}% complete</span>
                        </div>
                        <Progress value={initiative.progress} className="h-1 mt-1" />
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <AddEditGoalDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          goal={selectedGoal}
          onSave={(goal) => {
            if (selectedGoal) {
              updateGoal(goal);
            } else {
              addGoal(goal);
            }
          }}
        />
      </>
    );
  }
  
  // Goals list view
  return (
    <>
      <PageTitle
        title="Strategic Goals"
        description="Define and track your organization's key objectives"
        action={canCreate ? {
          label: "Add Goal",
          icon: <PlusCircle className="h-4 w-4" />,
          onClick: () => {
            setSelectedGoal(undefined);
            setIsDialogOpen(true);
          }
        } : undefined}
      />
      
      {goals.length === 0 ? (
        <EmptyState 
          title="No Goals Yet" 
          description="No strategic goals have been defined yet. Add your first goal to start building your product strategy."
          icon={<GoalIcon className="h-10 w-10 text-muted-foreground" />}
          action={canCreate ? {
            label: "Add Goal",
            onClick: () => {
              setSelectedGoal(undefined);
              setIsDialogOpen(true);
            }
          } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map(goal => (
            <Card key={goal.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge className={
                    goal.status === "completed" ? "bg-green-500" :
                    goal.status === "in_progress" ? "bg-blue-500" :
                    goal.status === "at_risk" ? "bg-red-500" :
                    "bg-slate-500"
                  }>
                    {goal.status.replace('_', ' ')}
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
                      <DropdownMenuItem onClick={() => navigate(`/goals/${goal.id}`)}>
                        <Eye className="h-4 w-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      {canEdit && (
                        <DropdownMenuItem onClick={() => {
                          setSelectedGoal(goal);
                          setIsDialogOpen(true);
                        }}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                      )}
                      {canDelete && (
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this goal?")) {
                              deleteGoal(goal.id);
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
                  onClick={() => navigate(`/goals/${goal.id}`)}
                >
                  {goal.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {goal.description}
                </p>
                <div className="flex items-center justify-between mt-4 mb-1">
                  <span className="text-sm">{goal.progress}% complete</span>
                  {goal.targetDate && (
                    <span className="text-xs text-muted-foreground">
                      Due: {new Date(goal.targetDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <Progress value={goal.progress} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <AddEditGoalDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        goal={selectedGoal}
        onSave={(goal) => {
          if (selectedGoal) {
            updateGoal(goal);
          } else {
            addGoal(goal);
          }
        }}
      />
    </>
  );
};

export default Goals;
