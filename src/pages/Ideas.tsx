
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { EmptyState } from "@/components/common/EmptyState";
import { AddEditFeatureDialog } from "@/components/dialogs/AddEditFeatureDialog";
import { useAppContext } from "@/contexts/AppContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Feature } from "@/types";
import { PlusCircle, LightbulbIcon, ThumbsUp, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IdeasList from "@/components/ideas/IdeasList";

const Ideas = () => {
  const { features, addFeature, updateFeature, deleteFeature } = useAppContext();
  const { hasPermission } = useRoleAccess();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"votes" | "value" | "newest">("votes");

  // Filter only ideas and backlog items
  const ideas = features.filter(f => f.status === "idea");
  const backlogItems = features.filter(f => f.status === "backlog");
  
  // Sort features based on the selected criteria
  const sortedIdeas = [...ideas].sort((a, b) => {
    if (sortBy === "votes") return b.votes - a.votes;
    if (sortBy === "value") return b.value - a.value;
    // newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  const sortedBacklog = [...backlogItems].sort((a, b) => {
    if (sortBy === "votes") return b.votes - a.votes;
    if (sortBy === "value") return b.value - a.value;
    // newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Creates a new idea (feature with status "idea")
  const handleAddIdea = () => {
    setSelectedFeature(undefined);
    setIsDialogOpen(true);
  };

  const handleEditFeature = (feature: Feature) => {
    setSelectedFeature(feature);
    setIsDialogOpen(true);
  };

  const handleSaveFeature = (feature: Feature) => {
    if (selectedFeature) {
      updateFeature(feature);
    } else {
      addFeature({ ...feature, status: "idea" });
    }
  };

  return (
    <>
      <PageTitle
        title="Ideas & Backlog"
        description="Collect and prioritize product ideas"
        action={{
          label: "Add Idea",
          icon: <PlusCircle className="h-4 w-4" />,
          onClick: handleAddIdea
        }}
      />
      
      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="ideas" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="ideas">Ideas ({ideas.length})</TabsTrigger>
              <TabsTrigger value="backlog">Backlog ({backlogItems.length})</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <Button
                variant={sortBy === "votes" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSortBy("votes")}
              >
                <ThumbsUp className="h-4 w-4 mr-1" /> Votes
              </Button>
              <Button
                variant={sortBy === "value" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSortBy("value")}
              >
                <ArrowUp className="h-4 w-4 mr-1" /> Value
              </Button>
              <Button
                variant={sortBy === "newest" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSortBy("newest")}
              >
                <ArrowDown className="h-4 w-4 mr-1" /> Newest
              </Button>
            </div>
          </div>
          
          <TabsContent value="ideas">
            {sortedIdeas.length === 0 ? (
              <EmptyState 
                title="No Ideas Yet" 
                description="Start adding product ideas that can be evaluated and prioritized."
                icon={<LightbulbIcon className="h-10 w-10 text-muted-foreground" />}
                action={{
                  label: "Add Idea",
                  onClick: handleAddIdea
                }}
              />
            ) : (
              <IdeasList
                items={sortedIdeas}
                onEditItem={handleEditFeature}
                onDeleteItem={deleteFeature}
                hasEditPermission={hasPermission("edit_feature")}
                hasDeletePermission={hasPermission("delete_feature")}
                type="idea"
              />
            )}
          </TabsContent>
          
          <TabsContent value="backlog">
            {sortedBacklog.length === 0 ? (
              <EmptyState 
                title="Backlog is Empty" 
                description="No features have been moved to the backlog yet."
                icon={<LightbulbIcon className="h-10 w-10 text-muted-foreground" />}
              />
            ) : (
              <IdeasList
                items={sortedBacklog}
                onEditItem={handleEditFeature}
                onDeleteItem={deleteFeature}
                hasEditPermission={hasPermission("edit_feature")}
                hasDeletePermission={hasPermission("delete_feature")}
                type="backlog"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <AddEditFeatureDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        feature={selectedFeature}
        onSave={handleSaveFeature}
      />
    </>
  );
};

export default Ideas;
