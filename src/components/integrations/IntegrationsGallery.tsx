
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Settings, Zap, Github, Slack, Trello, Figma, Jira, Discord } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: "development" | "communication" | "design" | "project-management";
  isConnected: boolean;
  isConfigured: boolean;
  lastSync?: string;
}

export const IntegrationsGallery = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "github",
      name: "GitHub",
      description: "Sync repositories, issues, and pull requests",
      icon: Github,
      category: "development",
      isConnected: true,
      isConfigured: true,
      lastSync: "2 minutes ago"
    },
    {
      id: "slack",
      name: "Slack",
      description: "Send notifications and updates to Slack channels",
      icon: Slack,
      category: "communication",
      isConnected: true,
      isConfigured: false
    },
    {
      id: "jira",
      name: "Jira",
      description: "Sync tickets and project management data",
      icon: Jira,
      category: "project-management",
      isConnected: false,
      isConfigured: false
    },
    {
      id: "figma",
      name: "Figma",
      description: "Import design files and prototypes",
      icon: Figma,
      category: "design",
      isConnected: false,
      isConfigured: false
    },
    {
      id: "trello",
      name: "Trello",
      description: "Sync boards and cards for project tracking",
      icon: Trello,
      category: "project-management",
      isConnected: true,
      isConfigured: true,
      lastSync: "1 hour ago"
    },
    {
      id: "discord",
      name: "Discord",
      description: "Team communication and notifications",
      icon: Discord,
      category: "communication",
      isConnected: false,
      isConfigured: false
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleConnect = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(int => 
        int.id === integrationId 
          ? { ...int, isConnected: !int.isConnected }
          : int
      )
    );
    
    const integration = integrations.find(i => i.id === integrationId);
    toast({
      title: integration?.isConnected ? "Disconnected" : "Connected",
      description: `${integration?.name} has been ${integration?.isConnected ? "disconnected" : "connected"} successfully`
    });
  };

  const handleConfigure = (integrationId: string) => {
    toast({
      title: "Configuration opened",
      description: "Integration settings panel opened"
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "development": return "bg-blue-100 text-blue-800";
      case "communication": return "bg-green-100 text-green-800";
      case "design": return "bg-purple-100 text-purple-800";
      case "project-management": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredIntegrations = selectedCategory === "all" 
    ? integrations 
    : integrations.filter(int => int.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={selectedCategory === "all" ? "default" : "outline"} 
          size="sm"
          onClick={() => setSelectedCategory("all")}
        >
          All
        </Button>
        <Button 
          variant={selectedCategory === "development" ? "default" : "outline"} 
          size="sm"
          onClick={() => setSelectedCategory("development")}
        >
          Development
        </Button>
        <Button 
          variant={selectedCategory === "communication" ? "default" : "outline"} 
          size="sm"
          onClick={() => setSelectedCategory("communication")}
        >
          Communication
        </Button>
        <Button 
          variant={selectedCategory === "design" ? "default" : "outline"} 
          size="sm"
          onClick={() => setSelectedCategory("design")}
        >
          Design
        </Button>
        <Button 
          variant={selectedCategory === "project-management" ? "default" : "outline"} 
          size="sm"
          onClick={() => setSelectedCategory("project-management")}
        >
          Project Management
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map(integration => {
          const Icon = integration.icon;
          return (
            <Card key={integration.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-8 w-8" />
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge className={getCategoryColor(integration.category)} variant="secondary">
                        {integration.category.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={integration.isConnected}
                      onCheckedChange={() => handleConnect(integration.id)}
                    />
                    {integration.isConnected && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="mb-4">
                  {integration.description}
                </CardDescription>
                
                {integration.isConnected && integration.lastSync && (
                  <p className="text-xs text-muted-foreground mb-3">
                    Last sync: {integration.lastSync}
                  </p>
                )}
                
                <div className="flex gap-2">
                  {integration.isConnected && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConfigure(integration.id)}
                      className="gap-2"
                    >
                      <Settings className="h-3 w-3" />
                      Configure
                    </Button>
                  )}
                  <Button 
                    variant={integration.isConnected ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleConnect(integration.id)}
                    className="gap-2"
                  >
                    <Zap className="h-3 w-3" />
                    {integration.isConnected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
