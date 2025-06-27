
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, TestTube, Key } from "lucide-react";

export const IntegrationConfig = () => {
  const { toast } = useToast();
  const [configs, setConfigs] = useState({
    github: {
      apiKey: "",
      repository: "",
      syncInterval: "hourly",
      autoSync: true,
      syncIssues: true,
      syncPullRequests: true
    },
    slack: {
      webhookUrl: "",
      channel: "#general",
      notifyOnFeatures: true,
      notifyOnFeedback: true,
      customMessage: ""
    }
  });

  const handleSave = (integration: string) => {
    toast({
      title: "Configuration saved",
      description: `${integration} integration settings have been updated`
    });
  };

  const handleTest = (integration: string) => {
    toast({
      title: "Testing connection",
      description: `Testing ${integration} integration...`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            GitHub Configuration
          </CardTitle>
          <CardDescription>Configure GitHub repository synchronization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="github-token">Personal Access Token</Label>
              <Input
                id="github-token"
                type="password"
                placeholder="ghp_xxxxxxxxxxxx"
                value={configs.github.apiKey}
                onChange={(e) => setConfigs(prev => ({
                  ...prev,
                  github: { ...prev.github, apiKey: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github-repo">Repository</Label>
              <Input
                id="github-repo"
                placeholder="owner/repository"
                value={configs.github.repository}
                onChange={(e) => setConfigs(prev => ({
                  ...prev,
                  github: { ...prev.github, repository: e.target.value }
                }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sync-interval">Sync Interval</Label>
            <Select 
              value={configs.github.syncInterval}
              onValueChange={(value) => setConfigs(prev => ({
                ...prev,
                github: { ...prev.github, syncInterval: value }
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-sync">Auto Sync</Label>
              <Switch 
                id="auto-sync"
                checked={configs.github.autoSync}
                onCheckedChange={(checked) => setConfigs(prev => ({
                  ...prev,
                  github: { ...prev.github, autoSync: checked }
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sync-issues">Sync Issues</Label>
              <Switch 
                id="sync-issues"
                checked={configs.github.syncIssues}
                onCheckedChange={(checked) => setConfigs(prev => ({
                  ...prev,
                  github: { ...prev.github, syncIssues: checked }
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sync-prs">Sync Pull Requests</Label>
              <Switch 
                id="sync-prs"
                checked={configs.github.syncPullRequests}
                onCheckedChange={(checked) => setConfigs(prev => ({
                  ...prev,
                  github: { ...prev.github, syncPullRequests: checked }
                }))}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => handleSave("GitHub")} className="gap-2">
              <Save className="h-4 w-4" />
              Save Configuration
            </Button>
            <Button variant="outline" onClick={() => handleTest("GitHub")} className="gap-2">
              <TestTube className="h-4 w-4" />
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Slack Configuration</CardTitle>
          <CardDescription>Configure Slack notifications and messaging</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slack-webhook">Webhook URL</Label>
              <Input
                id="slack-webhook"
                placeholder="https://hooks.slack.com/services/..."
                value={configs.slack.webhookUrl}
                onChange={(e) => setConfigs(prev => ({
                  ...prev,
                  slack: { ...prev.slack, webhookUrl: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slack-channel">Default Channel</Label>
              <Input
                id="slack-channel"
                placeholder="#general"
                value={configs.slack.channel}
                onChange={(e) => setConfigs(prev => ({
                  ...prev,
                  slack: { ...prev.slack, channel: e.target.value }
                }))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-features">Notify on Feature Updates</Label>
              <Switch 
                id="notify-features"
                checked={configs.slack.notifyOnFeatures}
                onCheckedChange={(checked) => setConfigs(prev => ({
                  ...prev,
                  slack: { ...prev.slack, notifyOnFeatures: checked }
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-feedback">Notify on New Feedback</Label>
              <Switch 
                id="notify-feedback"
                checked={configs.slack.notifyOnFeedback}
                onCheckedChange={(checked) => setConfigs(prev => ({
                  ...prev,
                  slack: { ...prev.slack, notifyOnFeedback: checked }
                }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-message">Custom Message Template</Label>
            <Textarea
              id="custom-message"
              placeholder="New update: {title} - {description}"
              rows={3}
              value={configs.slack.customMessage}
              onChange={(e) => setConfigs(prev => ({
                ...prev,
                slack: { ...prev.slack, customMessage: e.target.value }
              }))}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => handleSave("Slack")} className="gap-2">
              <Save className="h-4 w-4" />
              Save Configuration
            </Button>
            <Button variant="outline" onClick={() => handleTest("Slack")} className="gap-2">
              <TestTube className="h-4 w-4" />
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
