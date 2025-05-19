
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
import { Search, GitBranch } from "lucide-react";

// Import integration icons from Lucide
import { Trello, Github, Calendar, MessageSquare, FileText } from "lucide-react";

interface IntegrationsGalleryProps {
  onSelectIntegration: (id: string) => void;
}

export const IntegrationsGallery = ({ onSelectIntegration }: IntegrationsGalleryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const integrations = [
    {
      id: "jira",
      name: "Jira",
      description: "Sync features, tasks, and bugs with Jira issues",
      logo: <GitBranch className="h-8 w-8" />,
      category: "Project Management",
      status: "available"
    },
    {
      id: "github",
      name: "GitHub",
      description: "Link features to GitHub issues and pull requests",
      logo: <Github className="h-8 w-8" />,
      category: "Development",
      status: "available"
    },
    {
      id: "trello",
      name: "Trello",
      description: "Visualize your roadmap with Trello boards",
      logo: <Trello className="h-8 w-8" />,
      category: "Project Management",
      status: "available"
    },
    {
      id: "slack",
      name: "Slack",
      description: "Get notifications and updates in your Slack channels",
      logo: <MessageSquare className="h-8 w-8" />,
      category: "Communication",
      status: "available"
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      description: "Sync releases and milestones with your calendar",
      logo: <Calendar className="h-8 w-8" />,
      category: "Productivity",
      status: "available"
    },
    {
      id: "zendesk",
      name: "Zendesk",
      description: "Convert support tickets to feature requests",
      logo: <MessageSquare className="h-8 w-8" />,
      category: "Customer Support",
      status: "coming_soon"
    },
    {
      id: "confluence",
      name: "Confluence",
      description: "Publish roadmaps and documentation to Confluence",
      logo: <FileText className="h-8 w-8" />,
      category: "Documentation",
      status: "beta"
    }
  ];

  const filteredIntegrations = integrations.filter(
    integration => integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  integration.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  integration.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Available</Badge>;
      case "beta":
        return <Badge className="bg-blue-500">Beta</Badge>;
      case "coming_soon":
        return <Badge variant="outline">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Available Integrations</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search integrations..."
            className="pl-8 w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map(integration => (
          <Card key={integration.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-background p-2 rounded-md">
                    {integration.logo}
                  </div>
                  <div>
                    <CardTitle>{integration.name}</CardTitle>
                    <Badge variant="outline">{integration.category}</Badge>
                  </div>
                </div>
                {getStatusBadge(integration.status)}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <CardDescription className="mb-4">{integration.description}</CardDescription>
              <Button 
                onClick={() => onSelectIntegration(integration.id)} 
                disabled={integration.status !== "available"}
                className="w-full"
              >
                {integration.status === "available" ? "Connect" : "Coming Soon"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
