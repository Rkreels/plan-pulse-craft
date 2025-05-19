
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { GitBranch, Github, MessageSquare, Trello } from "lucide-react";

interface IntegrationConfigProps {
  integrationId: string;
}

export const IntegrationConfig = ({ integrationId }: IntegrationConfigProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [syncFrequency, setSyncFrequency] = useState("hourly");
  const [autoSync, setAutoSync] = useState(true);

  const getIntegrationDetails = () => {
    switch (integrationId) {
      case "jira":
        return {
          name: "Jira",
          icon: <GitBranch className="h-10 w-10" />,
          fields: [
            { label: "Jira URL", type: "input", placeholder: "https://your-domain.atlassian.net" },
            { label: "API Token", type: "password", placeholder: "Enter your Jira API token" },
            { label: "Project Key", type: "input", placeholder: "Enter your Jira project key" }
          ]
        };
      case "github":
        return {
          name: "GitHub",
          icon: <Github className="h-10 w-10" />,
          fields: [
            { label: "Repository", type: "input", placeholder: "username/repository" },
            { label: "Personal Access Token", type: "password", placeholder: "Enter your GitHub PAT" }
          ]
        };
      case "trello":
        return {
          name: "Trello",
          icon: <Trello className="h-10 w-10" />,
          fields: [
            { label: "API Key", type: "password", placeholder: "Enter your Trello API key" },
            { label: "Token", type: "password", placeholder: "Enter your Trello token" },
            { label: "Board ID", type: "input", placeholder: "Enter your Trello board ID" }
          ]
        };
      case "slack":
        return {
          name: "Slack",
          icon: <MessageSquare className="h-10 w-10" />,
          fields: [
            { label: "Webhook URL", type: "input", placeholder: "https://hooks.slack.com/services/..." },
            { label: "Channel", type: "input", placeholder: "#general" }
          ]
        };
      default:
        return {
          name: "Unknown Integration",
          icon: <GitBranch className="h-10 w-10" />,
          fields: []
        };
    }
  };

  const details = getIntegrationDetails();

  const handleConnect = () => {
    // In a real app, this would make an API call to connect to the service
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    // In a real app, this would make an API call to disconnect from the service
    setIsConnected(false);
  };

  const handleTestConnection = () => {
    // In a real app, this would make an API call to test the connection
    alert("Connection test successful!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-muted p-3 rounded-md">
              {details.icon}
            </div>
            <div>
              <CardTitle>{details.name} Integration</CardTitle>
              <CardDescription>Configure your {details.name} connection settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {!isConnected ? (
              <div className="space-y-4">
                {details.fields.map((field, i) => (
                  <div className="space-y-2" key={i}>
                    <Label htmlFor={`field-${i}`}>{field.label}</Label>
                    <Input 
                      id={`field-${i}`} 
                      type={field.type === "password" ? "password" : "text"}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
                <Button className="w-full" onClick={handleConnect}>
                  Connect to {details.name}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-md p-4">
                  <p>✅ Connected to {details.name} successfully!</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workspace">Workspace/Project</Label>
                    <Input 
                      id="workspace" 
                      value={workspace}
                      onChange={(e) => setWorkspace(e.target.value)}
                      placeholder="Enter workspace or project name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sync-frequency">Sync Frequency</Label>
                    <Select value={syncFrequency} onValueChange={setSyncFrequency}>
                      <SelectTrigger id="sync-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-4 justify-between">
                    <Label htmlFor="auto-sync" className="cursor-pointer">Enable automatic synchronization</Label>
                    <Switch 
                      id="auto-sync" 
                      checked={autoSync} 
                      onCheckedChange={setAutoSync} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mapping-rules">Field Mapping Rules</Label>
                    <Textarea 
                      id="mapping-rules" 
                      placeholder="Define custom field mappings in JSON format (optional)"
                      rows={5}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={handleTestConnection}>
                    Test Connection
                  </Button>
                  <Button variant="destructive" onClick={handleDisconnect}>
                    Disconnect
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
