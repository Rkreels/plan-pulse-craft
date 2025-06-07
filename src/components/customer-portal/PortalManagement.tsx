
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Settings, 
  Globe, 
  Palette, 
  Mail, 
  Bell, 
  Shield, 
  Database,
  Code,
  Download,
  Upload,
  Copy,
  ExternalLink,
  Users,
  BarChart3,
  Webhook
} from "lucide-react";

export function PortalManagement() {
  const [portalSettings, setPortalSettings] = useState({
    // Basic Settings
    portalName: "Customer Feedback Portal",
    subdomain: "feedback",
    customDomain: "",
    description: "Share your ideas and help us improve our product",
    language: "en",
    timezone: "UTC",
    
    // Appearance
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    logoUrl: "",
    faviconUrl: "",
    customCSS: "",
    theme: "light",
    
    // Features
    allowAnonymous: true,
    requireApproval: false,
    enableVoting: true,
    enableComments: true,
    enableAttachments: true,
    enableNotifications: true,
    enableSSO: false,
    enableAPI: true,
    
    // Moderation
    autoModeration: true,
    profanityFilter: true,
    spamProtection: true,
    requireEmailVerification: false,
    
    // Notifications
    emailNotifications: true,
    slackIntegration: false,
    webhookUrl: "",
    discordWebhook: "",
    
    // Permissions
    adminEmails: ["admin@example.com"],
    moderatorEmails: ["mod@example.com"],
    blockedDomains: [],
    allowedDomains: [],
    
    // SEO & Analytics
    metaTitle: "",
    metaDescription: "",
    googleAnalytics: "",
    customAnalytics: "",
    
    // Data & Export
    autoBackup: true,
    dataRetention: "365",
    exportFormat: "json"
  });

  const [activeUsers, setActiveUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Customer", lastSeen: "2 hours ago", feedbackCount: 12 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Customer", lastSeen: "1 day ago", feedbackCount: 8 },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "Moderator", lastSeen: "30 minutes ago", feedbackCount: 25 }
  ]);

  const [integrations, setIntegrations] = useState([
    { name: "Slack", status: "Connected", icon: "💬", description: "Get notifications in Slack" },
    { name: "Discord", status: "Disconnected", icon: "🎮", description: "Discord webhook integration" },
    { name: "Zapier", status: "Available", icon: "⚡", description: "Automate workflows" },
    { name: "Google Analytics", status: "Connected", icon: "📊", description: "Track portal analytics" },
    { name: "Mailchimp", status: "Available", icon: "📧", description: "Email marketing integration" },
    { name: "Jira", status: "Available", icon: "🎯", description: "Create tickets from feedback" }
  ]);

  const handleSettingChange = (key: string, value: any) => {
    setPortalSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    toast.success("Portal settings saved successfully");
  };

  const exportData = () => {
    const data = {
      settings: portalSettings,
      users: activeUsers,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portal-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Data exported successfully");
  };

  const copyEmbedCode = () => {
    const embedCode = `<script src="https://${portalSettings.subdomain}.example.com/embed.js"></script>`;
    navigator.clipboard.writeText(embedCode);
    toast.success("Embed code copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="portal-name">Portal Name</Label>
                  <Input
                    id="portal-name"
                    value={portalSettings.portalName}
                    onChange={(e) => handleSettingChange("portalName", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subdomain">Subdomain</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="subdomain"
                      value={portalSettings.subdomain}
                      onChange={(e) => handleSettingChange("subdomain", e.target.value)}
                    />
                    <span className="text-sm text-muted-foreground">.example.com</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={portalSettings.description}
                  onChange={(e) => handleSettingChange("description", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={portalSettings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={portalSettings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={saveSettings}>Save General Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance & Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={portalSettings.primaryColor}
                      onChange={(e) => handleSettingChange("primaryColor", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={portalSettings.primaryColor}
                      onChange={(e) => handleSettingChange("primaryColor", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={portalSettings.secondaryColor}
                      onChange={(e) => handleSettingChange("secondaryColor", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={portalSettings.secondaryColor}
                      onChange={(e) => handleSettingChange("secondaryColor", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <Input
                    id="logo-url"
                    placeholder="https://example.com/logo.png"
                    value={portalSettings.logoUrl}
                    onChange={(e) => handleSettingChange("logoUrl", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favicon-url">Favicon URL</Label>
                  <Input
                    id="favicon-url"
                    placeholder="https://example.com/favicon.ico"
                    value={portalSettings.faviconUrl}
                    onChange={(e) => handleSettingChange("faviconUrl", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-css">Custom CSS</Label>
                <Textarea
                  id="custom-css"
                  placeholder=".portal-header { background: linear-gradient(45deg, #f0f0f0, #ffffff); }"
                  rows={6}
                  value={portalSettings.customCSS}
                  onChange={(e) => handleSettingChange("customCSS", e.target.value)}
                />
              </div>

              <Button onClick={saveSettings}>Save Appearance Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: "allowAnonymous", label: "Allow Anonymous Submissions", desc: "Users can submit without accounts" },
                  { key: "requireApproval", label: "Require Approval", desc: "Review submissions before publishing" },
                  { key: "enableVoting", label: "Enable Voting", desc: "Users can upvote feedback" },
                  { key: "enableComments", label: "Enable Comments", desc: "Users can comment on feedback" },
                  { key: "enableAttachments", label: "Enable Attachments", desc: "Allow file uploads" },
                  { key: "enableNotifications", label: "Enable Notifications", desc: "Send email notifications" },
                  { key: "enableSSO", label: "Single Sign-On", desc: "Enable SSO authentication" },
                  { key: "enableAPI", label: "API Access", desc: "Enable REST API access" }
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label className="font-medium">{label}</Label>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                    <Switch
                      checked={portalSettings[key as keyof typeof portalSettings] as boolean}
                      onCheckedChange={(checked) => handleSettingChange(key, checked)}
                    />
                  </div>
                ))}
              </div>
              <Button onClick={saveSettings} className="mt-4">Save Feature Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <h4 className="font-medium">{integration.name}</h4>
                          <p className="text-sm text-muted-foreground">{integration.description}</p>
                        </div>
                      </div>
                      <Badge variant={integration.status === "Connected" ? "default" : integration.status === "Available" ? "secondary" : "outline"}>
                        {integration.status}
                      </Badge>
                    </div>
                    <Button 
                      variant={integration.status === "Connected" ? "outline" : "default"} 
                      size="sm"
                      className="w-full"
                    >
                      {integration.status === "Connected" ? "Configure" : 
                       integration.status === "Available" ? "Connect" : "Reconnect"}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Webhook Configuration</h4>
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://your-api.com/webhook"
                    value={portalSettings.webhookUrl}
                    onChange={(e) => handleSettingChange("webhookUrl", e.target.value)}
                  />
                </div>
                <Button onClick={saveSettings}>Save Integration Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{user.role}</Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        {user.feedbackCount} feedback • Last seen {user.lastSeen}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">23</div>
                  <div className="text-sm text-muted-foreground">Active Today</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">89%</div>
                  <div className="text-sm text-muted-foreground">Engagement Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {[
                  { key: "autoModeration", label: "Auto Moderation", desc: "Automatically filter inappropriate content" },
                  { key: "profanityFilter", label: "Profanity Filter", desc: "Block profanity in submissions" },
                  { key: "spamProtection", label: "Spam Protection", desc: "Prevent spam submissions" },
                  { key: "requireEmailVerification", label: "Email Verification", desc: "Require email verification for new users" }
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label className="font-medium">{label}</Label>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                    <Switch
                      checked={portalSettings[key as keyof typeof portalSettings] as boolean}
                      onCheckedChange={(checked) => handleSettingChange(key, checked)}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-emails">Admin Emails (comma separated)</Label>
                <Textarea
                  id="admin-emails"
                  placeholder="admin1@example.com, admin2@example.com"
                  value={portalSettings.adminEmails.join(", ")}
                  onChange={(e) => handleSettingChange("adminEmails", e.target.value.split(",").map(email => email.trim()))}
                />
              </div>

              <Button onClick={saveSettings}>Save Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportData} className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" onClick={copyEmbedCode} className="gap-2">
              <Code className="h-4 w-4" />
              Copy Embed Code
            </Button>
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Preview Portal
            </Button>
            <Button variant="outline" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
