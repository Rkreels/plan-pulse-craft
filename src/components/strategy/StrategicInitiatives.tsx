
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Pencil, Plus, MoreHorizontal, Trash2 } from "lucide-react";

export const StrategicInitiatives = () => {
  const [initiatives, setInitiatives] = useState([
    {
      id: 1,
      name: "Market Expansion",
      description: "Expand to new global markets in Europe and Asia",
      status: "In Progress",
      progress: 45,
      category: "Growth"
    },
    {
      id: 2,
      name: "Customer Experience Transformation",
      description: "Redesign customer journey touchpoints",
      status: "Planning",
      progress: 20,
      category: "Experience"
    },
    {
      id: 3,
      name: "Platform Modernization",
      description: "Upgrade core technology platform",
      status: "In Progress",
      progress: 60,
      category: "Technology"
    }
  ]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Strategic Initiatives</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> New Initiative
        </Button>
      </div>

      {initiatives.map(initiative => (
        <Card key={initiative.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div>
                <CardTitle>{initiative.name}</CardTitle>
                <CardDescription>{initiative.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={initiative.status === "In Progress" ? "default" : "outline"}>
                  {initiative.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{initiative.progress}%</span>
              </div>
              <Progress value={initiative.progress} className="h-2" />
              <div className="flex justify-between items-center mt-4">
                <Badge variant="outline">{initiative.category}</Badge>
                <Button variant="outline" size="sm">Link to Goals</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
