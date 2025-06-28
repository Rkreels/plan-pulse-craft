
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Settings, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  status: "connected" | "disconnected" | "error";
  lastSync: Date | null;
  config: Record<string, any>;
  isEnabled: boolean;
}

export const IntegrationManager = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "slack",
      name: "Slack",
      description: "Get notifications and updates in your Slack channels",
      status: "connected",
      lastSync: new Date(Date.now() - 300000),
      config: { webhook: "https://hooks.slack.com/...", channel: "#product" },
      isEnabled: true
    },
    {
      id: "github",
      name: "GitHub",
      description: "Sync issues and pull requests with your features",
      status: "connected",
      lastSync: new Date(Date.now() - 900000),
      config: { repo: "company/product", token: "ghp_xxxx" },
      isEnabled: true
    },
    {
      id: "jira",
      name: "Jira",
      description: "Import tickets and sync development status",
      status: "error",
      lastSync: new Date(Date.now() - 3600000),
      config: { url: "company.atlassian.net", email: "user@company.com" },
      isEnabled: false
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, isEnabled: !integration.isEnabled }
        : integration
    ));
    
    const integration = integrations.find(i => i.id === id);
    toast({
      title: "Integration updated",
      description: `${integration?.name} has been ${integration?.isEnabled ? 'disabled' : 'enabled'}`
    });
  };

  const handleSync = async (id: string) => {
    setIsSyncing(id);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIntegrations(prev => prev.map(integration => 
        integration.id === id 
          ? { 
              ...integration, 
              lastSync: new Date(),
              status: "connected" as const
            }
          : integration
      ));
      
      const integration = integrations.find(i => i.id === id);
      toast({
        title: "Sync completed",
        description: `${integration?.name} data synchronized successfully`
      });
    } catch (error) {
      setIntegrations(prev => prev.map(integration => 
        integration.id === id 
          ? { ...integration, status: "error" as const }
          : integration
      ));
      
      toast({
        title: "Sync failed",
        description: "There was an error syncing the integration",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(null);
    }
  };

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsConfiguring(true);
  };

  const handleSaveConfig = () => {
    if (!selectedIntegration) return;
    
    setIntegrations(prev => prev.map(integration => 
      integration.id === selectedIntegration.id 
        ? { ...selectedIntegration, status: "connected" as const }
        : integration
    ));
    
    setIsConfiguring(false);
    setSelectedIntegration(null);
    
    toast({
      title: "Configuration saved",
      description: "Integration settings have been updated"
    });
  };

  const getStatusIcon = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return "Never";
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  if (isConfiguring && selectedIntegration) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configure {selectedIntegration.name}</CardTitle>
          <CardDescription>
            Set up your {selectedIntegration.name} integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(selectedIntegration.config).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
              <Input
                id={key}
                value={value}
                onChange={(e) => {
                  setSelectedIntegration(prev => prev ? {
                    ...prev,
                    config: { ...prev.config, [key]: e.target.value }
                  } : null);
                }}
                placeholder={`Enter ${key}`}
              />
            </div>
          ))}
          
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSaveConfig}>
              Save Configuration
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsConfiguring(false);
                setSelectedIntegration(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {integrations.map(integration => (
        <Card key={integration.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {integration.name}
                  {getStatusIcon(integration.status)}
                </CardTitle>
                <CardDescription>{integration.description}</CardDescription>
              </div>
              <Switch
                checked={integration.isEnabled}
                onCheckedChange={() => handleToggleIntegration(integration.id)}
              />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <Badge className={getStatusColor(integration.status)}>
                {integration.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Last sync: {formatLastSync(integration.lastSync)}
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConfigure(integration)}
                disabled={!integration.isEnabled}
              >
                <Settings className="h-4 w-4 mr-1" />
                Configure
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSync(integration.id)}
                disabled={!integration.isEnabled || isSyncing === integration.id}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isSyncing === integration.id ? 'animate-spin' : ''}`} />
                {isSyncing === integration.id ? 'Syncing...' : 'Sync'}
              </Button>
            </div>
            
            {integration.status === "error" && (
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700">
                  Connection failed. Please check your configuration and try again.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
