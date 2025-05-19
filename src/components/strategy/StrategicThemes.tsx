
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Pencil, Plus, MoreHorizontal, Trash2, Link } from "lucide-react";

export const StrategicThemes = () => {
  const [themes, setThemes] = useState([
    {
      id: 1,
      name: "Customer Delight",
      description: "Focus on creating exceptional customer experiences",
      linkedInitiatives: 3,
      linkedGoals: 2,
      color: "#8B5CF6"
    },
    {
      id: 2,
      name: "Operational Excellence",
      description: "Streamline operations and improve efficiency",
      linkedInitiatives: 2,
      linkedGoals: 4,
      color: "#10B981"
    },
    {
      id: 3,
      name: "Market Leadership",
      description: "Secure and maintain market leadership position",
      linkedInitiatives: 5,
      linkedGoals: 3,
      color: "#F97316"
    }
  ]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Strategic Themes</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> New Theme
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map(theme => (
          <Card key={theme.id}>
            <CardHeader className="pb-2" style={{ borderLeft: `4px solid ${theme.color}` }}>
              <div className="flex justify-between">
                <div>
                  <CardTitle>{theme.name}</CardTitle>
                  <CardDescription>{theme.description}</CardDescription>
                </div>
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
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <Link className="h-4 w-4 mr-1" />
                    Linked Initiatives
                  </span>
                  <Badge variant="outline">{theme.linkedInitiatives}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <Link className="h-4 w-4 mr-1" />
                    Linked Goals
                  </span>
                  <Badge variant="outline">{theme.linkedGoals}</Badge>
                </div>
                <Button variant="outline" size="sm">
                  Link to Initiatives
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
