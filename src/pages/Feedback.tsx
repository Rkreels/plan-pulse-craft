
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { EmptyState } from "@/components/common/EmptyState";
import { AddEditFeedbackDialog } from "@/components/dialogs/AddEditFeedbackDialog";
import { useAppContext } from "@/contexts/AppContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Feedback as FeedbackType } from "@/types";
import { PlusCircle, MessagesSquare, Edit, Trash2, ThumbsUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Feedback = () => {
  const { feedback, addFeedback, updateFeedback, deleteFeedback } = useAppContext();
  const { hasPermission } = useRoleAccess();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackType | undefined>(undefined);

  // Get feedback counts by status
  const feedbackCounts = {
    new: feedback.filter(f => f.status === "new").length,
    reviewed: feedback.filter(f => f.status === "reviewed").length,
    linked: feedback.filter(f => f.status === "linked").length,
    closed: feedback.filter(f => f.status === "closed").length
  };

  // Group feedback by source
  const feedbackBySource = {
    internal: feedback.filter(f => f.source === "internal"),
    customer: feedback.filter(f => f.source === "customer"),
    sales: feedback.filter(f => f.source === "sales"),
    support: feedback.filter(f => f.source === "support")
  };

  // For viewing convenience, let's concatenate them all
  const allFeedback = [
    ...feedbackBySource.customer,
    ...feedbackBySource.internal,
    ...feedbackBySource.sales,
    ...feedbackBySource.support
  ].sort((a, b) => b.votes - a.votes); // Sort by most votes
  
  return (
    <>
      <PageTitle
        title="Feedback"
        description="Collect and organize product feedback"
        action={{
          label: "Add Feedback",
          icon: <PlusCircle className="h-4 w-4" />,
          onClick: () => {
            setSelectedFeedback(undefined);
            setIsDialogOpen(true);
          }
        }}
      />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold">{feedbackCounts.new}</div>
            <div className="text-sm text-muted-foreground">New</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold">{feedbackCounts.reviewed}</div>
            <div className="text-sm text-muted-foreground">Reviewed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold">{feedbackCounts.linked}</div>
            <div className="text-sm text-muted-foreground">Linked</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold">{feedbackCounts.closed}</div>
            <div className="text-sm text-muted-foreground">Closed</div>
          </CardContent>
        </Card>
      </div>
      
      {feedback.length === 0 ? (
        <EmptyState 
          title="No Feedback Yet" 
          description="Start collecting feedback from customers and team members to improve your product."
          icon={<MessagesSquare className="h-10 w-10 text-muted-foreground" />}
          action={{
            label: "Add Feedback",
            onClick: () => {
              setSelectedFeedback(undefined);
              setIsDialogOpen(true);
            }
          }}
        />
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">All Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allFeedback.map(item => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="px-4 py-3 flex flex-row items-start justify-between space-y-0">
                  <div>
                    <Badge className={
                      item.source === "customer" ? "bg-blue-500" :
                      item.source === "internal" ? "bg-purple-500" :
                      item.source === "sales" ? "bg-green-500" :
                      "bg-orange-500"
                    }>
                      {item.source}
                    </Badge>
                    <Badge variant="outline" className="ml-2">{item.status}</Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => {
                        setSelectedFeedback(item);
                        setIsDialogOpen(true);
                      }}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      {hasPermission("delete_feature") && (
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this feedback?")) {
                              deleteFeedback(item.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="px-4 py-2">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                    {item.description}
                  </p>
                </CardContent>
                <CardFooter className="px-4 py-3 border-t flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                    <span>{item.votes}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <AddEditFeedbackDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        feedback={selectedFeedback}
        onSave={(feedback) => {
          if (selectedFeedback) {
            updateFeedback(feedback);
          } else {
            addFeedback(feedback);
          }
        }}
      />
    </>
  );
};

export default Feedback;
