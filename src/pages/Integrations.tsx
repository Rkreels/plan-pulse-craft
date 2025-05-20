
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "active" | "inactive" | "configured";
  category: "development" | "communication" | "analytics" | "design";
}

const Integrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "int-jira",
      name: "Jira",
      description: "Two-way sync with Jira issues and epics",
      icon: "https://cdn.iconscout.com/icon/free/png-256/free-jira-2296054-1912097.png",
      status: "active",
      category: "development"
    },
    {
      id: "int-slack",
      name: "Slack",
      description: "Post updates and notifications to Slack channels",
      icon: "https://cdn.iconscout.com/icon/free/png-256/free-slack-4053972-3353968.png",
      status: "active",
      category: "communication"
    },
    {
      id: "int-github",
      name: "GitHub",
      description: "Connect features to GitHub issues and PRs",
      icon: "https://cdn.iconscout.com/icon/free/png-256/free-github-2296067-1912026.png",
      status: "configured",
      category: "development"
    },
    {
      id: "int-ga",
      name: "Google Analytics",
      description: "Import analytics data for feature insights",
      icon: "https://cdn.iconscout.com/icon/free/png-256/free-google-analytics-2038788-1721678.png",
      status: "inactive",
      category: "analytics"
    },
    {
      id: "int-figma",
      name: "Figma",
      description: "Link designs to features and requirements",
      icon: "https://cdn.iconscout.com/icon/free/png-256/free-figma-3521426-2944870.png",
      status: "inactive",
      category: "design"
    }
  ]);

  const handleActivate = (id: string) => {
    setIntegrations(integrations.map(int => 
      int.id === id ? {...int, status: "configured" as const} : int
    ));
  };

  const handleDeactivate = (id: string) => {
    setIntegrations(integrations.map(int => 
      int.id === id ? {...int, status: "inactive" as const} : int
    ));
  };

  const filteredIntegrations = (category: string) => {
    return integrations.filter(int => int.category === category);
  };

  return (
    <>
      <PageTitle
        title="Integrations"
        description="Connect with third-party tools and services"
      />
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Integrations</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
        </TabsList>
        
        {/* All Integrations Tab */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map(integration => (
              <IntegrationCard 
                key={integration.id}
                integration={integration}
                onActivate={handleActivate}
                onDeactivate={handleDeactivate}
              />
            ))}
          </div>
        </TabsContent>
        
        {/* Development Integrations Tab */}
        <TabsContent value="development" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations("development").map(integration => (
              <IntegrationCard 
                key={integration.id}
                integration={integration}
                onActivate={handleActivate}
                onDeactivate={handleDeactivate}
              />
            ))}
          </div>
        </TabsContent>
        
        {/* Communication Integrations Tab */}
        <TabsContent value="communication" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations("communication").map(integration => (
              <IntegrationCard 
                key={integration.id}
                integration={integration}
                onActivate={handleActivate}
                onDeactivate={handleDeactivate}
              />
            ))}
          </div>
        </TabsContent>
        
        {/* Analytics Integrations Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations("analytics").map(integration => (
              <IntegrationCard 
                key={integration.id}
                integration={integration}
                onActivate={handleActivate}
                onDeactivate={handleDeactivate}
              />
            ))}
          </div>
        </TabsContent>
        
        {/* Design Integrations Tab */}
        <TabsContent value="design" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations("design").map(integration => (
              <IntegrationCard 
                key={integration.id}
                integration={integration}
                onActivate={handleActivate}
                onDeactivate={handleDeactivate}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

interface IntegrationCardProps {
  integration: Integration;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
}

const IntegrationCard = ({ integration, onActivate, onDeactivate }: IntegrationCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <img 
          src={integration.icon} 
          alt={integration.name} 
          className="h-12 w-12"
        />
        <div>
          <CardTitle className="flex items-center gap-2">
            {integration.name}
            <Badge 
              className={
                integration.status === "active" ? "bg-green-500" :
                integration.status === "configured" ? "bg-blue-500" :
                "bg-gray-500"
              }
            >
              {integration.status}
            </Badge>
          </CardTitle>
          <CardDescription>{integration.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {integration.status === "active" ? (
            <p>This integration is active and syncing data.</p>
          ) : integration.status === "configured" ? (
            <p>This integration is configured but not actively syncing.</p>
          ) : (
            <p>This integration needs to be set up.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {integration.status === "inactive" ? (
          <Button onClick={() => onActivate(integration.id)}>Configure</Button>
        ) : (
          <>
            <Button variant="outline">Settings</Button>
            <Button variant="destructive" onClick={() => onDeactivate(integration.id)}>
              Deactivate
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default Integrations;
