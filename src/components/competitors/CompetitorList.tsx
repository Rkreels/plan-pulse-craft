
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
import { 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Globe, 
  Users, 
  LineChart 
} from "lucide-react";

export const CompetitorList = () => {
  const [competitors, setCompetitors] = useState([
    {
      id: 1,
      name: "CompeteX",
      description: "Leading product management platform with AI capabilities",
      website: "https://competex.example.com",
      marketShare: "32%",
      strength: "Enterprise scalability",
      weakness: "Limited integrations",
      threatLevel: "high"
    },
    {
      id: 2,
      name: "ProdRival",
      description: "Affordable PM tool focusing on startups and small teams",
      website: "https://prodrival.example.com",
      marketShare: "14%",
      strength: "User-friendly interface",
      weakness: "Limited reporting capabilities",
      threatLevel: "medium"
    },
    {
      id: 3,
      name: "RoadmapGuru",
      description: "Specialized in visual roadmapping and strategy planning",
      website: "https://roadmapguru.example.com",
      marketShare: "8%",
      strength: "Visual roadmapping features",
      weakness: "Lacks comprehensive PM features",
      threatLevel: "low"
    }
  ]);

  const getThreatBadge = (level: string) => {
    switch (level) {
      case "high":
        return <Badge className="bg-red-500">High Threat</Badge>;
      case "medium":
        return <Badge className="bg-orange-500">Medium Threat</Badge>;
      case "low":
        return <Badge className="bg-green-500">Low Threat</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Competitors</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Competitor
        </Button>
      </div>

      {competitors.map(competitor => (
        <Card key={competitor.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div>
                <CardTitle>{competitor.name}</CardTitle>
                <CardDescription>{competitor.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {getThreatBadge(competitor.threatLevel)}
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
                    <DropdownMenuItem>
                      <ExternalLink className="h-4 w-4 mr-2" /> Visit Website
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a href={competitor.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  Visit Website
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Market share: {competitor.marketShare}</span>
              </div>
              <div className="flex items-center gap-2">
                <LineChart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Tracked since 2023</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Key Strengths</h4>
                <p className="text-sm text-muted-foreground">{competitor.strength}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Key Weaknesses</h4>
                <p className="text-sm text-muted-foreground">{competitor.weakness}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
