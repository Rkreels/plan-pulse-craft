
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageTitle } from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LightbulbIcon, Plus, Search, Download, Upload, Edit, Trash2, ThumbsUp } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { AddEditFeatureDialog } from "@/components/dialogs/AddEditFeatureDialog";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid";
import { Feature } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


// Form validation schema
const ideaSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  userStory: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  value: z.number().min(1).max(10),
  effort: z.number().min(1).max(10)
});

const Ideas = () => {
  const { features, addFeature, updateFeature } = useAppContext();
  const [newIdeaDialogOpen, setNewIdeaDialogOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Feature | undefined>(undefined);
  const navigate = useNavigate();
  
  // Enhanced filtering and search with validation
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("votes");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterErrors, setFilterErrors] = useState<string[]>([]);
  
  // Filter features to only show ideas
  const ideaFeatures = features.filter(feature => feature.status === "idea");
  
  // Enhanced filtering and sorting with error handling
  const filteredAndSortedIdeas = useMemo(() => {
    try {
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
          case "value":
            aValue = a.value || 0;
            bValue = b.value || 0;
            break;
          case "effort":
            aValue = a.effort || 0;
            bValue = b.effort || 0;
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

      setFilterErrors([]);
      return filtered;
    } catch (error) {
      setFilterErrors(['Error filtering ideas. Please try again.']);
      return ideaFeatures;
    }
  }, [ideaFeatures, searchQuery, sortBy, sortOrder]);
  
  const handleAddIdea = (feature: Feature) => {
    try {
      // Validate the feature data
      const validatedData = ideaSchema.parse({
        title: feature.title,
        description: feature.description,
        userStory: feature.userStory,
        priority: feature.priority,
        value: feature.value,
        effort: feature.effort
      });

      const newIdea: Feature = {
        ...feature,
        ...validatedData,
        id: feature.id || uuidv4(),
        status: "idea" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        votes: 0
      };
      
      addFeature(newIdea);
      toast.success("New idea added successfully", {
        description: `"${newIdea.title}" has been added to your ideas collection.`
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => err.message).join(', ');
        toast.error("Validation Error", {
          description: errorMessages
        });
      } else {
        toast.error("Failed to add idea", {
          description: "Please check your input and try again."
        });
      }
    }
  };
  
  const handleEditIdea = (idea: Feature) => {
    setEditingIdea(idea);
  };

  const handleUpdateIdea = (updatedIdea: Feature) => {
    try {
      // Validate the updated feature data
      const validatedData = ideaSchema.parse({
        title: updatedIdea.title,
        description: updatedIdea.description,
        userStory: updatedIdea.userStory,
        priority: updatedIdea.priority,
        value: updatedIdea.value,
        effort: updatedIdea.effort
      });

      const finalIdea = {
        ...updatedIdea,
        ...validatedData,
        updatedAt: new Date()
      };

      updateFeature(finalIdea);
      setEditingIdea(undefined);
      toast.success("Idea updated successfully", {
        description: `"${finalIdea.title}" has been updated.`
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => err.message).join(', ');
        toast.error("Validation Error", {
          description: errorMessages
        });
      } else {
        toast.error("Failed to update idea", {
          description: "Please check your input and try again."
        });
      }
    }
  };

  const handleDeleteIdea = (id: string) => {
    const ideaToDelete = features.find(f => f.id === id);
    if (ideaToDelete && window.confirm(`Are you sure you want to delete "${ideaToDelete.title}"?`)) {
      updateFeature({
        ...ideaToDelete,
        status: "not_started" as const,
        updatedAt: new Date()
      });
      toast.success("Idea deleted successfully", {
        description: `"${ideaToDelete.title}" has been removed from your ideas.`
      });
    }
  };
  
  const handleVoteForIdea = (idea: Feature) => {
    try {
      const updatedIdea = {
        ...idea,
        votes: (idea.votes || 0) + 1,
        updatedAt: new Date()
      };
      
      updateFeature(updatedIdea);
      toast.success(`Voted for "${idea.title}"`, {
        description: `Total votes: ${updatedIdea.votes}`
      });
    } catch (error) {
      toast.error("Failed to vote", {
        description: "Please try again."
      });
    }
  };

  const handlePromoteToFeature = (idea: Feature) => {
    try {
      const updatedFeature: Feature = {
        ...idea,
        status: "backlog" as const,
        updatedAt: new Date()
      };
      
      updateFeature(updatedFeature);
      toast.success(`"${idea.title}" promoted to feature backlog`, {
        description: "The idea is now available in the Features section."
      });
      navigate("/features");
    } catch (error) {
      toast.error("Failed to promote idea", {
        description: "Please try again."
      });
    }
  };

  const handleExport = () => {
    try {
      const dataToExport = filteredAndSortedIdeas.map(idea => ({
        title: idea.title,
        description: idea.description,
        priority: idea.priority,
        votes: idea.votes || 0,
        value: idea.value,
        effort: idea.effort,
        createdAt: idea.createdAt,
        userStory: idea.userStory
      }));

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ideas-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success("Ideas exported successfully", {
        description: `${dataToExport.length} ideas exported to JSON file.`
      });
    } catch (error) {
      toast.error("Export failed", {
        description: "Please try again."
      });
    }
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
            
            if (!Array.isArray(importedIdeas)) {
              throw new Error("Invalid file format");
            }

            let successCount = 0;
            let errorCount = 0;

            importedIdeas.forEach((idea: any) => {
              try {
                const validatedIdea = ideaSchema.parse(idea);
                const newFeature: Feature = {
                  id: uuidv4(),
                  title: validatedIdea.title,
                  description: validatedIdea.description,
                  userStory: validatedIdea.userStory,
                  priority: validatedIdea.priority,
                  value: validatedIdea.value,
                  effort: validatedIdea.effort,
                  status: "idea" as const,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  workspaceId: "workspace-1",
                  votes: idea.votes || 0,
                  tags: [],
                  feedback: [],
                  progress: 0,
                  acceptanceCriteria: [],
                  score: (validatedIdea.value * (validatedIdea.priority === "critical" ? 4 : validatedIdea.priority === "high" ? 3 : validatedIdea.priority === "medium" ? 2 : 1)) / (validatedIdea.effort || 1)
                };
                addFeature(newFeature);
                successCount++;
              } catch (error) {
                errorCount++;
              }
            });

            if (successCount > 0) {
              toast.success(`${successCount} ideas imported successfully`, {
                description: errorCount > 0 ? `${errorCount} ideas failed validation.` : undefined
              });
            } else {
              toast.error("Import failed", {
                description: "No valid ideas found in the file."
              });
            }
          } catch (error) {
            toast.error("Failed to import ideas", {
              description: "Please check the file format and try again."
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-blue-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const handleSearchChange = (value: string) => {
    if (value.length > 100) {
      toast.error("Search query too long", {
        description: "Please use a shorter search term."
      });
      return;
    }
    setSearchQuery(value);
  };
  
  return (
    <>
      <PageTitle
        title="Feature Ideas"
        description="Collect and organize new product ideas"
      />
      
      {filterErrors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-800">Filter Errors:</h4>
          <ul className="text-red-600 text-sm">
            {filterErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start mb-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
              maxLength={100}
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
              <SelectItem value="value-desc">Value High-Low</SelectItem>
              <SelectItem value="effort-asc">Effort Low-High</SelectItem>
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
      
      {/* Ideas Grid */}
      {filteredAndSortedIdeas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedIdeas.map(idea => (
            <Card key={idea.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline">Idea</Badge>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEditIdea(idea)}
                      title="Edit idea"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteIdea(idea.id)}
                      title="Delete idea"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-bold text-lg mt-2 line-clamp-2">{idea.title}</h3>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {idea.description}
                </p>
                {idea.userStory && (
                  <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded mb-2">
                    <strong>User Story:</strong> {idea.userStory}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-3 flex justify-between items-center">
                <div className="flex gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Priority:</span>
                    <Badge className={getPriorityColor(idea.priority)}>{idea.priority}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Value:</span>
                    <span>{idea.value}/10</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Effort:</span>
                    <span>{idea.effort}/10</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVoteForIdea(idea)}
                    className="flex items-center gap-1"
                    title="Vote for this idea"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span className="font-medium">{idea.votes || 0}</span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handlePromoteToFeature(idea)}
                    title="Promote to feature backlog"
                  >
                    Promote
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
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
      
      <AddEditFeatureDialog
        open={newIdeaDialogOpen}
        onOpenChange={setNewIdeaDialogOpen}
        onSave={handleAddIdea}
      />

      {editingIdea && (
        <AddEditFeatureDialog
          open={!!editingIdea}
          onOpenChange={(open) => !open && setEditingIdea(undefined)}
          feature={editingIdea}
          onSave={handleUpdateIdea}
        />
      )}
    </>
  );
};

export default Ideas;
