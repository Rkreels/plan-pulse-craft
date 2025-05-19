
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
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  GitBranch, 
  GitMerge, 
  Search, 
  Plus, 
  ArrowRight, 
  AlertCircle, 
  MoreHorizontal, 
  Trash2, 
  ExternalLink
} from "lucide-react";

export const FeatureDependencyManager = () => {
  const [dependencies, setDependencies] = useState([
    {
      id: 1,
      source: {
        id: "F-123",
        name: "API Authentication Framework",
        status: "in_progress"
      },
      target: {
        id: "F-145",
        name: "Mobile App Login Screen",
        status: "blocked"
      },
      type: "blocking",
      impact: "high"
    },
    {
      id: 2,
      source: {
        id: "F-123",
        name: "API Authentication Framework",
        status: "in_progress"
      },
      target: {
        id: "F-156",
        name: "Account Management UI",
        status: "blocked"
      },
      type: "blocking",
      impact: "medium"
    },
    {
      id: 3,
      source: {
        id: "F-189",
        name: "Data Export Service",
        status: "planned"
      },
      target: {
        id: "F-201",
        name: "Analytics Dashboard",
        status: "planned"
      },
      type: "related",
      impact: "low"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "blocked":
        return <Badge className="bg-red-500">Blocked</Badge>;
      case "planned":
        return <Badge variant="outline">Planned</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return <Badge className="bg-red-500">High Impact</Badge>;
      case "medium":
        return <Badge className="bg-amber-500">Medium Impact</Badge>;
      case "low":
        return <Badge variant="outline">Low Impact</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Feature Dependencies</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search features..."
              className="pl-8 w-[200px]"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Add Dependency
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Dependency Overview</CardTitle>
            <CardDescription>
              A visual overview of feature dependencies and their impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 border rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Dependency Graph Visualization would be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-lg font-semibold mt-6">Dependencies List</h3>
      
      <div className="space-y-4">
        {dependencies.map(dependency => (
          <Card key={dependency.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1 w-[150px]">
                    <Badge variant="outline" className="w-full flex justify-center">{dependency.source.id}</Badge>
                    <span className="text-sm font-medium truncate w-full text-center">{dependency.source.name}</span>
                    <div>{getStatusBadge(dependency.source.status)}</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    {dependency.type === "blocking" ? (
                      <GitMerge className="h-6 w-6 text-red-500 mx-2" />
                    ) : (
                      <GitBranch className="h-6 w-6 text-blue-500 mx-2" />
                    )}
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {dependency.type === "blocking" ? "Blocks" : "Related to"}
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1 w-[150px]">
                    <Badge variant="outline" className="w-full flex justify-center">{dependency.target.id}</Badge>
                    <span className="text-sm font-medium truncate w-full text-center">{dependency.target.name}</span>
                    <div>{getStatusBadge(dependency.target.status)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getImpactBadge(dependency.impact)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <ExternalLink className="h-4 w-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <AlertCircle className="h-4 w-4 mr-2" /> Change Impact
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" /> Remove Dependency
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
