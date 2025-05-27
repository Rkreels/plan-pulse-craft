import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar, Target } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "sonner";

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
  const { goals, epics, releases } = useAppContext();
  const [newItemTitle, setNewItemTitle] = useState("");
  const [selectedType, setSelectedType] = useState<"goal" | "epic" | "release">("goal");

  // Combine all roadmap items
  const roadmapItems: RoadmapItem[] = [
    ...goals.map(goal => ({
      id: goal.id,
      title: goal.title,
      description: goal.description,
      status: goal.status as "planned" | "in_progress" | "completed",
      type: "goal" as const,
      targetDate: goal.targetDate ? (goal.targetDate instanceof Date ? goal.targetDate.toISOString() : goal.targetDate.toString()) : "",
      progress: goal.progress
    })),
    ...epics.map(epic => ({
      id: epic.id,
      title: epic.title,
      description: epic.description,
      status: epic.status === "backlog" ? "planned" : epic.status as "planned" | "in_progress" | "completed",
      type: "epic" as const,
      targetDate: epic.targetDate ? (epic.targetDate instanceof Date ? epic.targetDate.toISOString() : epic.targetDate.toString()) : "",
      progress: epic.progress
    })),
    ...releases.map(release => ({
      id: release.id,
      title: release.name,
      description: release.description,
      status: release.status === "delayed" ? "in_progress" : release.status as "planned" | "in_progress" | "completed",
      type: "release" as const,
      targetDate: release.releaseDate instanceof Date ? release.releaseDate.toISOString() : release.releaseDate.toString(),
      progress: 0
    }))
  ];

  const handleAddRoadmapItem = () => {
    if (!newItemTitle.trim()) return;
    
    toast.success(`New ${selectedType} added to roadmap`);
    setNewItemTitle("");
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
            onKeyDown={(e) => e.key === "Enter" && handleAddRoadmapItem()}
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value as "goal" | "epic" | "release")}
            className="px-3 py-2 border rounded-md"
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
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {item.description}
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
