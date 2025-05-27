
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar, Target } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "sonner";
import { Goal, Epic, Release } from "@/types";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: "planned" | "in_progress" | "completed";
  type: "goal" | "epic" | "release";
  targetDate: string;
  progress: number;
}

export const RoadmapManagement = () => {
  const { 
    goals, 
    epics, 
    releases, 
    addGoal, 
    addEpic, 
    addRelease,
    updateGoal,
    updateEpic,
    updateRelease,
    deleteGoal,
    deleteEpic,
    deleteRelease,
    currentUser,
    workspace
  } = useAppContext();
  
  const [newItemTitle, setNewItemTitle] = useState("");
  const [selectedType, setSelectedType] = useState<"goal" | "epic" | "release">("goal");
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);

  // Helper function to safely convert dates to strings
  const dateToString = (date: Date | string | undefined): string => {
    if (!date) return "";
    if (date instanceof Date) return date.toISOString().split('T')[0];
    return String(date).split('T')[0];
  };

  // Combine all roadmap items
  const roadmapItems: RoadmapItem[] = [
    ...goals.map(goal => ({
      id: goal.id,
      title: goal.title,
      description: goal.description,
      status: goal.status === "not_started" ? "planned" as const : 
              goal.status === "at_risk" ? "in_progress" as const : 
              goal.status as "planned" | "in_progress" | "completed",
      type: "goal" as const,
      targetDate: dateToString(goal.targetDate),
      progress: goal.progress
    })),
    ...epics.map(epic => ({
      id: epic.id,
      title: epic.title,
      description: epic.description,
      status: epic.status === "backlog" ? "planned" as const : 
              epic.status === "review" ? "in_progress" as const :
              epic.status as "planned" | "in_progress" | "completed",
      type: "epic" as const,
      targetDate: dateToString(epic.targetDate),
      progress: epic.progress
    })),
    ...releases.map(release => ({
      id: release.id,
      title: release.name,
      description: release.description,
      status: release.status === "delayed" ? "in_progress" as const : 
              release.status as "planned" | "in_progress" | "completed",
      type: "release" as const,
      targetDate: dateToString(release.releaseDate),
      progress: 0
    }))
  ];

  const handleAddRoadmapItem = () => {
    if (!newItemTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    const baseItem = {
      id: `${selectedType}-${Date.now()}`,
      title: newItemTitle,
      description: `New ${selectedType}`,
      ownerId: currentUser?.id || "",
      workspaceId: workspace?.id || "",
      progress: 0,
      targetDate: new Date()
    };

    try {
      if (selectedType === "goal") {
        const newGoal: Goal = {
          ...baseItem,
          status: "not_started" as const
        };
        addGoal(newGoal);
      } else if (selectedType === "epic") {
        const newEpic: Epic = {
          ...baseItem,
          status: "backlog" as const,
          features: []
        };
        addEpic(newEpic);
      } else if (selectedType === "release") {
        const newRelease: Release = {
          ...baseItem,
          name: newItemTitle,
          status: "planned" as const,
          version: "1.0.0",
          releaseDate: new Date(),
          features: [],
          epics: []
        };
        addRelease(newRelease);
      }
      
      toast.success(`New ${selectedType} added successfully`);
      setNewItemTitle("");
    } catch (error) {
      toast.error(`Failed to add ${selectedType}`);
      console.error("Error adding item:", error);
    }
  };

  const handleEditItem = (item: RoadmapItem) => {
    setEditingItem(item);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    try {
      if (editingItem.type === "goal") {
        const goal = goals.find(g => g.id === editingItem.id);
        if (goal) {
          updateGoal({
            ...goal,
            title: editingItem.title,
            description: editingItem.description
          });
        }
      } else if (editingItem.type === "epic") {
        const epic = epics.find(e => e.id === editingItem.id);
        if (epic) {
          updateEpic({
            ...epic,
            title: editingItem.title,
            description: editingItem.description
          });
        }
      } else if (editingItem.type === "release") {
        const release = releases.find(r => r.id === editingItem.id);
        if (release) {
          updateRelease({
            ...release,
            name: editingItem.title,
            description: editingItem.description
          });
        }
      }

      setEditingItem(null);
      toast.success(`${editingItem.type} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${editingItem.type}`);
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteItem = (item: RoadmapItem) => {
    try {
      if (item.type === "goal") {
        deleteGoal(item.id);
      } else if (item.type === "epic") {
        deleteEpic(item.id);
      } else if (item.type === "release") {
        deleteRelease(item.id);
      }
      
      toast.success(`${item.type} deleted successfully`);
    } catch (error) {
      toast.error(`Failed to delete ${item.type}`);
      console.error("Error deleting item:", error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "goal": return "bg-blue-500";
      case "epic": return "bg-purple-500";
      case "release": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in_progress": return "bg-blue-500";
      case "planned": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Add new roadmap item..."
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddRoadmapItem();
              }
            }}
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value as "goal" | "epic" | "release")}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="goal">Goal</option>
            <option value="epic">Epic</option>
            <option value="release">Release</option>
          </select>
          <Button onClick={handleAddRoadmapItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roadmapItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(item.type)}>
                    {item.type}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(item.status)}>
                    {item.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete this ${item.type}?`)) {
                        handleDeleteItem(item);
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">
                {editingItem?.id === item.id ? (
                  <Input
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveEdit();
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  item.title
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {editingItem?.id === item.id ? (
                  <Input
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveEdit();
                      }
                    }}
                  />
                ) : (
                  item.description
                )}
              </p>
              
              {item.targetDate && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-3 w-3" />
                  {new Date(item.targetDate).toLocaleDateString()}
                </div>
              )}
              
              {item.type !== "release" && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Target className="h-3 w-3" />
                  Progress: {item.progress}%
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {roadmapItems.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No roadmap items yet</h3>
          <p className="text-muted-foreground mb-4">
            Start by adding goals, epics, or releases to your roadmap
          </p>
          <Button onClick={() => setNewItemTitle("My first roadmap item")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Item
          </Button>
        </div>
      )}
    </div>
  );
};
