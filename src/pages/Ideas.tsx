
import { useState, useMemo } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, LightbulbIcon, Plus, ThumbsUp, Search, Download, Upload } from "lucide-react";
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
  
  // Enhanced filtering and search
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("votes");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Filter features to only show ideas
  const ideaFeatures = features.filter(feature => feature.status === "idea");
  
  // Enhanced filtering and sorting
  const filteredAndSortedIdeas = useMemo(() => {
    let filtered = ideaFeatures.filter(idea => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return idea.title.toLowerCase().includes(query) ||
               idea.description.toLowerCase().includes(query);
      }
      return true;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "votes":
          aValue = a.votes || 0;
          bValue = b.votes || 0;
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "priority":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = a.votes || 0;
          bValue = b.votes || 0;
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [ideaFeatures, searchQuery, sortBy, sortOrder]);
  
  const handleAddIdea = (feature: Feature) => {
    const newIdea: Feature = {
      ...feature,
      id: feature.id || uuidv4(),
      status: "idea" as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    addFeature(newIdea);
    toast.success("New idea added successfully");
  };
  
  const handlePromoteToFeature = (idea: Feature) => {
    const updatedFeature: Feature = {
      ...idea,
      status: "backlog" as const,
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

  const handleExport = () => {
    const dataToExport = filteredAndSortedIdeas.map(idea => ({
      title: idea.title,
      description: idea.description,
      priority: idea.priority,
      votes: idea.votes || 0,
      createdAt: idea.createdAt
    }));

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ideas-export.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Ideas exported successfully");
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedIdeas = JSON.parse(e.target?.result as string);
            importedIdeas.forEach((idea: any) => {
              addFeature({
                ...idea,
                id: uuidv4(),
                status: "idea" as const,
                createdAt: new Date(),
                updatedAt: new Date()
              });
            });
            toast.success(`${importedIdeas.length} ideas imported successfully`);
          } catch (error) {
            toast.error("Failed to import ideas. Please check the file format.");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };
  
  return (
    <>
      <PageTitle
        title="Feature Ideas"
        description="Collect and organize new product ideas"
      />
      
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start mb-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select 
            value={`${sortBy}-${sortOrder}`} 
            onValueChange={(value) => {
              const [field, order] = value.split('-') as [string, "asc" | "desc"];
              setSortBy(field);
              setSortOrder(order);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="votes-desc">Most Voted</SelectItem>
              <SelectItem value="votes-asc">Least Voted</SelectItem>
              <SelectItem value="title-asc">Title A-Z</SelectItem>
              <SelectItem value="title-desc">Title Z-A</SelectItem>
              <SelectItem value="priority-desc">Priority High-Low</SelectItem>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={handleImport} className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => navigate("/features")} variant="outline">
            View All Features
          </Button>
          <Button onClick={() => setNewIdeaDialogOpen(true)}>
            <Plus size={16} className="mr-2" />
            New Idea
          </Button>
        </div>
      </div>
      
      {searchQuery && (
        <div className="mb-4">
          <Badge variant="secondary" className="gap-1">
            Search: {searchQuery}
            <button onClick={() => setSearchQuery("")} className="ml-1 hover:bg-muted rounded">×</button>
          </Badge>
          <span className="ml-2 text-sm text-muted-foreground">
            {filteredAndSortedIdeas.length} of {ideaFeatures.length} ideas
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedIdeas.length > 0 ? (
          filteredAndSortedIdeas.map(idea => (
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
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Priority</span>
                    <Badge className={
                      idea.priority === "critical" ? "bg-red-500" :
                      idea.priority === "high" ? "bg-orange-500" :
                      idea.priority === "medium" ? "bg-blue-500" :
                      "bg-green-500"
                    }>
                      {idea.priority}
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
            <h3 className="text-lg font-medium mb-2">
              {searchQuery ? "No ideas found" : "No ideas yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? "Try adjusting your search terms"
                : "Create your first feature idea to get started"
              }
            </p>
            {searchQuery ? (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            ) : (
              <Button onClick={() => setNewIdeaDialogOpen(true)}>
                <Plus size={16} className="mr-2" />
                Add New Idea
              </Button>
            )}
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
