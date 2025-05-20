
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, LightbulbIcon, Plus, ThumbsUp } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { AddEditFeatureDialog } from "@/components/dialogs/AddEditFeatureDialog";
import { v4 as uuidv4 } from "uuid";
import { Feature } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Ideas = () => {
  const { features, addFeature, updateFeature } = useAppContext();
  const [newIdeaDialogOpen, setNewIdeaDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  // Filter features to only show ideas
  const ideaFeatures = features.filter(feature => feature.status === "idea");
  
  const handleAddIdea = (feature: Feature) => {
    const newIdea = {
      ...feature,
      id: feature.id || uuidv4(),
      status: "idea",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    addFeature(newIdea);
    toast.success("New idea added successfully");
  };
  
  const handlePromoteToFeature = (idea: Feature) => {
    const updatedFeature = {
      ...idea,
      status: "backlog",
      updatedAt: new Date()
    };
    
    updateFeature(updatedFeature);
    toast.success(`"${idea.title}" promoted to feature backlog`);
    navigate("/features");
  };
  
  const handleVoteForIdea = (idea: Feature) => {
    const updatedIdea = {
      ...idea,
      votes: (idea.votes || 0) + 1,
      updatedAt: new Date()
    };
    
    updateFeature(updatedIdea);
    toast.success(`Voted for "${idea.title}"`);
  };
  
  return (
    <>
      <PageTitle
        title="Feature Ideas"
        description="Collect and organize new product ideas"
      />
      
      <div className="flex justify-between items-center my-4">
        <Button onClick={() => navigate("/features")} variant="outline">
          View All Features
        </Button>
        
        <Button onClick={() => setNewIdeaDialogOpen(true)}>
          <Plus size={16} className="mr-2" />
          New Idea
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideaFeatures.length > 0 ? (
          ideaFeatures.map(idea => (
            <Card key={idea.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{idea.title}</CardTitle>
                  <Badge variant="secondary">
                    <LightbulbIcon size={12} className="mr-1" /> Idea
                  </Badge>
                </div>
                <CardDescription>{idea.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="mt-2 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Votes</span>
                    <Badge variant="outline" className="flex gap-1">
                      <ThumbsUp size={12} />
                      {idea.votes || 0}
                    </Badge>
                  </div>
                  
                  {idea.progress !== undefined && (
                    <>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Progress</span>
                        <span>{idea.progress || 0}%</span>
                      </div>
                      <Progress value={idea.progress} className="h-2" />
                    </>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-1 flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleVoteForIdea(idea)}
                >
                  <ThumbsUp size={14} className="mr-1" />
                  Vote
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  className="gap-1"
                  onClick={() => handlePromoteToFeature(idea)}
                >
                  <Check size={14} />
                  Promote
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <LightbulbIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No ideas yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first feature idea to get started
            </p>
            <Button onClick={() => setNewIdeaDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              Add New Idea
            </Button>
          </div>
        )}
      </div>
      
      <AddEditFeatureDialog
        open={newIdeaDialogOpen}
        onOpenChange={setNewIdeaDialogOpen}
        onSave={handleAddIdea}
      />
    </>
  );
};

export default Ideas;
