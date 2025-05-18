
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Github, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCcw, 
  ExternalLink,
  Link as LinkIcon,
  Lock,
  Trello,
} from "lucide-react";

// Example integration
interface Integration {
  id: string;
  name: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  config: Record<string, any>;
}

// Sample integrations
const initialIntegrations: Integration[] = [
  {
    id: "jira-1",
    name: "Jira Cloud",
    provider: "jira",
    status: "connected",
    lastSync: new Date(2025, 4, 15),
    config: {
      domain: "yourcompany.atlassian.net",
      projects: ["PROD", "DEV"],
      syncFeatures: true,
      syncIssues: true,
      mapStatuses: true
    }
  }
];

const Integrations = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [jiraConfig, setJiraConfig] = useState({
    domain: "",
    apiKey: "",
    syncFeatures: true,
    syncIssues: true,
    mapStatuses: true
  });
  const [trelloConfig, setTrelloConfig] = useState({
    apiKey: "",
    token: "",
    boards: "",
    syncCards: true
  });
  const [githubConfig, setGithubConfig] = useState({
    owner: "",
    repo: "",
    token: "",
    syncIssues: true,
    syncPRs: true
  });

  const handleConnectJira = () => {
    if (!jiraConfig.domain || !jiraConfig.apiKey) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const newIntegration: Integration = {
      id: `jira-${Date.now()}`,
      name: "Jira Cloud",
      provider: "jira",
      status: "connected",
      lastSync: new Date(),
      config: {
        domain: jiraConfig.domain,
        apiKey: jiraConfig.apiKey,
        syncFeatures: jiraConfig.syncFeatures,
        syncIssues: jiraConfig.syncIssues,
        mapStatuses: jiraConfig.mapStatuses
      }
    };
    
    setIntegrations([...integrations, newIntegration]);
    toast.success("Jira integration connected successfully");
    setJiraConfig({
      domain: "",
      apiKey: "",
      syncFeatures: true,
      syncIssues: true,
      mapStatuses: true
    });
  };

  const handleConnectTrello = () => {
    if (!trelloConfig.apiKey || !trelloConfig.token || !trelloConfig.boards) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const newIntegration: Integration = {
      id: `trello-${Date.now()}`,
      name: "Trello",
      provider: "trello",
      status: "connected",
      lastSync: new Date(),
      config: {
        apiKey: trelloConfig.apiKey,
        token: trelloConfig.token,
        boards: trelloConfig.boards,
        syncCards: trelloConfig.syncCards
      }
    };
    
    setIntegrations([...integrations, newIntegration]);
    toast.success("Trello integration connected successfully");
    setTrelloConfig({
      apiKey: "",
      token: "",
      boards: "",
      syncCards: true
    });
  };

  const handleConnectGithub = () => {
    if (!githubConfig.owner || !githubConfig.repo || !githubConfig.token) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const newIntegration: Integration = {
      id: `github-${Date.now()}`,
      name: "GitHub",
      provider: "github",
      status: "connected",
      lastSync: new Date(),
      config: {
        owner: githubConfig.owner,
        repo: githubConfig.repo,
        token: githubConfig.token,
        syncIssues: githubConfig.syncIssues,
        syncPRs: githubConfig.syncPRs
      }
    };
    
    setIntegrations([...integrations, newIntegration]);
    toast.success("GitHub integration connected successfully");
    setGithubConfig({
      owner: "",
      repo: "",
      token: "",
      syncIssues: true,
      syncPRs: true
    });
  };

  const handleRemoveIntegration = (id: string) => {
    if (window.confirm("Are you sure you want to remove this integration?")) {
      setIntegrations(integrations.filter(i => i.id !== id));
      toast.success("Integration removed successfully");
    }
  };

  const handleSync = (id: string) => {
    setIntegrations(integrations.map(i => 
      i.id === id ? { ...i, lastSync: new Date() } : i
    ));
    toast.success("Synchronization started");
  };

  // Filter active integrations
  const activeIntegrations = integrations.filter(i => i.status === 'connected');
  
  return (
    <>
      <PageTitle
        title="Integrations"
        description="Connect your product with development tools"
      />

      <div className="space-y-6">
        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="active">Active Integrations</TabsTrigger>
              <TabsTrigger value="jira">Jira</TabsTrigger>
              <TabsTrigger value="trello">Trello</TabsTrigger>
              <TabsTrigger value="github">GitHub</TabsTrigger>
            </TabsList>
          </div>

          {/* Active Integrations Tab */}
          <TabsContent value="active" className="space-y-4">
            {activeIntegrations.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <LinkIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Active Integrations</h3>
                    <p className="text-muted-foreground mt-2 mb-4">
                      Connect with development tools to sync your product data.
                    </p>
                    <Button onClick={() => setActiveTab("jira")}>Configure Integration</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              activeIntegrations.map(integration => (
                <Card key={integration.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {integration.name}
                          {integration.status === 'connected' && (
                            <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />
                          )}
                        </CardTitle>
                        <CardDescription>
                          {integration.provider === 'jira' && integration.config.domain}
                          {integration.provider === 'github' && `${integration.config.owner}/${integration.config.repo}`}
                          {integration.provider === 'trello' && `${integration.config.boards}`}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSync(integration.id)}
                        >
                          <RefreshCcw className="h-4 w-4 mr-2" />
                          Sync
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRemoveIntegration(integration.id)}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      {integration.lastSync && (
                        <p>Last synced: {integration.lastSync.toLocaleString()}</p>
                      )}
                      <div className="mt-2 space-y-1">
                        {integration.provider === 'jira' && (
                          <>
                            <p className="flex items-center gap-1">
                              <span className="font-medium">Projects:</span> 
                              {integration.config.projects.join(', ')}
                            </p>
                            <p>Syncing features and issues with bi-directional updates</p>
                          </>
                        )}
                        {integration.provider === 'github' && (
                          <>
                            <p>Syncing GitHub issues and pull requests</p>
                            <p>Auto-linking features to pull requests</p>
                          </>
                        )}
                        {integration.provider === 'trello' && (
                          <>
                            <p>Syncing Trello cards with features</p>
                            <p>Status mapping between boards and features</p>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Jira Integration Tab */}
          <TabsContent value="jira" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg viewBox="0 0 24 24" width="24" height="24" className="mr-2">
                    <path d="M11.571 11.513H0a5.998 5.998 0 0 0 5.997 6h5.574v-6.001zm5.997-7.056H6.003v6h11.565a6.001 6.001 0 0 0-6-6.001zm0-5.997a11.998 11.998 0 0 1 11.999 11.998c0 6.626-5.372 11.998-11.999 11.998S5.568 17.085 5.568 10.458c0-6.625 5.373-11.998 12-11.998z" fill="#2684FF" fillRule="evenodd" />
                  </svg>
                  Jira Integration
                </CardTitle>
                <CardDescription>
                  Connect to Jira to sync issues, features, and track development work
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="jira-domain">Jira Domain</Label>
                    <Input 
                      id="jira-domain" 
                      placeholder="yourcompany.atlassian.net"
                      value={jiraConfig.domain}
                      onChange={(e) => setJiraConfig({...jiraConfig, domain: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="jira-api-key">API Key</Label>
                    <Input 
                      id="jira-api-key" 
                      type="password" 
                      placeholder="Your Jira API key"
                      value={jiraConfig.apiKey}
                      onChange={(e) => setJiraConfig({...jiraConfig, apiKey: e.target.value})}
                    />
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Sync Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-features" className="flex-1">Sync features to Jira issues</Label>
                      <Switch 
                        id="sync-features" 
                        checked={jiraConfig.syncFeatures}
                        onCheckedChange={(checked) => setJiraConfig({...jiraConfig, syncFeatures: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-issues" className="flex-1">Pull Jira issues as features</Label>
                      <Switch 
                        id="sync-issues" 
                        checked={jiraConfig.syncIssues}
                        onCheckedChange={(checked) => setJiraConfig({...jiraConfig, syncIssues: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="map-statuses" className="flex-1">Map Jira statuses to feature statuses</Label>
                      <Switch 
                        id="map-statuses" 
                        checked={jiraConfig.mapStatuses}
                        onCheckedChange={(checked) => setJiraConfig({...jiraConfig, mapStatuses: checked})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("active")}>
                  Cancel
                </Button>
                <Button onClick={handleConnectJira}>
                  Connect to Jira
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Trello Integration Tab */}
          <TabsContent value="trello" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trello className="h-5 w-5 mr-2 text-blue-400" />
                  Trello Integration
                </CardTitle>
                <CardDescription>
                  Sync Trello boards and cards with your product features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="trello-api-key">API Key</Label>
                    <Input 
                      id="trello-api-key" 
                      placeholder="Your Trello API key"
                      value={trelloConfig.apiKey}
                      onChange={(e) => setTrelloConfig({...trelloConfig, apiKey: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="trello-token">Token</Label>
                    <Input 
                      id="trello-token" 
                      type="password" 
                      placeholder="Your Trello token"
                      value={trelloConfig.token}
                      onChange={(e) => setTrelloConfig({...trelloConfig, token: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="trello-boards">Boards to Sync (comma separated)</Label>
                    <Input 
                      id="trello-boards" 
                      placeholder="roadmap,development,backlog"
                      value={trelloConfig.boards}
                      onChange={(e) => setTrelloConfig({...trelloConfig, boards: e.target.value})}
                    />
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Sync Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-cards" className="flex-1">Sync cards to features</Label>
                      <Switch 
                        id="sync-cards" 
                        checked={trelloConfig.syncCards}
                        onCheckedChange={(checked) => setTrelloConfig({...trelloConfig, syncCards: checked})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("active")}>
                  Cancel
                </Button>
                <Button onClick={handleConnectTrello}>
                  Connect to Trello
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* GitHub Integration Tab */}
          <TabsContent value="github" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Github className="h-5 w-5 mr-2" />
                  GitHub Integration
                </CardTitle>
                <CardDescription>
                  Connect to GitHub repositories to sync issues and pull requests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="github-owner">Repository Owner</Label>
                    <Input 
                      id="github-owner" 
                      placeholder="organization or username"
                      value={githubConfig.owner}
                      onChange={(e) => setGithubConfig({...githubConfig, owner: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="github-repo">Repository Name</Label>
                    <Input 
                      id="github-repo" 
                      placeholder="repository-name"
                      value={githubConfig.repo}
                      onChange={(e) => setGithubConfig({...githubConfig, repo: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="github-token">Access Token</Label>
                    <Input 
                      id="github-token" 
                      type="password" 
                      placeholder="GitHub personal access token"
                      value={githubConfig.token}
                      onChange={(e) => setGithubConfig({...githubConfig, token: e.target.value})}
                    />
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Sync Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-github-issues" className="flex-1">Sync GitHub issues</Label>
                      <Switch 
                        id="sync-github-issues" 
                        checked={githubConfig.syncIssues}
                        onCheckedChange={(checked) => setGithubConfig({...githubConfig, syncIssues: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-prs" className="flex-1">Track pull requests</Label>
                      <Switch 
                        id="sync-prs" 
                        checked={githubConfig.syncPRs}
                        onCheckedChange={(checked) => setGithubConfig({...githubConfig, syncPRs: checked})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("active")}>
                  Cancel
                </Button>
                <Button onClick={handleConnectGithub}>
                  Connect to GitHub
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Integrations;
