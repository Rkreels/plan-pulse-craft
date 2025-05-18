
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  ExternalLink,
  MessageSquare,
  Share2
} from "lucide-react";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function FeedbackPortal() {
  const [copied, setCopied] = useState(false);
  const [portalEnabled, setPortalEnabled] = useState(false);
  const [embedCode, setEmbedCode] = useState(`<script src="https://example.com/feedback-widget.js" data-portal-id="abc123"></script>`);
  const [welcomeMessage, setWelcomeMessage] = useState("We value your feedback! Let us know what you think about our product and help us improve.");
  const [portalName, setPortalName] = useState("Product Feedback");
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success("Embed code copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleSaveSettings = () => {
    toast.success("Portal settings saved");
  };
  
  const handleGenerateLink = () => {
    toast.success("New portal link generated");
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Feedback Portal
        </CardTitle>
        <CardDescription>
          Configure your customer feedback portal to collect insights directly from users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Feedback Portal Status</h4>
            <p className="text-sm text-muted-foreground">
              {portalEnabled ? "Portal is currently enabled and accepting feedback" : "Portal is currently disabled"}
            </p>
          </div>
          <Switch 
            checked={portalEnabled} 
            onCheckedChange={setPortalEnabled} 
            id="portal-status"
          />
        </div>
        
        <Tabs defaultValue="settings">
          <TabsList>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="embed">Embed</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="portal-name">Portal Name</Label>
              <Input 
                id="portal-name" 
                value={portalName}
                onChange={(e) => setPortalName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="welcome-message">Welcome Message</Label>
              <Textarea 
                id="welcome-message" 
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="flex items-center space-x-2">
                <Switch id="collect-emails" />
                <Label htmlFor="collect-emails">Collect user emails</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="auto-approve" defaultChecked />
                <Label htmlFor="auto-approve">Auto-approve submissions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="allow-comments" defaultChecked />
                <Label htmlFor="allow-comments">Allow comments</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="allow-upvotes" defaultChecked />
                <Label htmlFor="allow-upvotes">Allow upvotes</Label>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categories">Feedback Categories (comma separated)</Label>
              <Input 
                id="categories" 
                placeholder="Feature Request, Bug Report, Question, Suggestion"
                defaultValue="Feature Request, Bug Report, Question, Suggestion"
              />
            </div>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </TabsContent>
          
          <TabsContent value="embed" className="space-y-4 pt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Embed in your website</h4>
              <div className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto">
                {embedCode}
              </div>
              <div className="flex justify-end mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center"
                  onClick={handleCopyCode}
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copied ? "Copied!" : "Copy Code"}
                </Button>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium">Direct Link</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Share this link with your customers to collect feedback
              </p>
              <div className="flex gap-2">
                <Input 
                  readOnly 
                  value="https://feedback.example.com/acme-product" 
                  className="font-mono text-sm"
                />
                <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-end mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleGenerateLink}
                >
                  Generate New Link
                </Button>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium">Email Collection</h4>
              <div className="flex mt-2 gap-2">
                <Input placeholder="Webhook URL for email notifications" />
                <Button variant="outline">Set Webhook</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="theme-color">Primary Color</Label>
              <div className="flex gap-2">
                <Input 
                  id="theme-color" 
                  type="color"
                  defaultValue="#8B5CF6" 
                  className="w-16 h-10"
                />
                <Input defaultValue="#8B5CF6" className="flex-1" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logo-url">Logo URL</Label>
              <Input id="logo-url" placeholder="https://example.com/logo.png" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="button-text">Feedback Button Text</Label>
              <Input id="button-text" defaultValue="Share Feedback" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="custom-css">Custom CSS</Label>
              <Textarea 
                id="custom-css" 
                placeholder=".feedback-widget { /* your custom styles */ }"
                rows={4}
              />
            </div>
            <Button onClick={handleSaveSettings}>Save Appearance</Button>
          </TabsContent>
        </Tabs>
        
        <div className="border-t pt-4">
          <h4 className="font-medium">Portal Analytics</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="bg-muted/50 p-3 rounded-md">
              <div className="text-2xl font-bold">137</div>
              <p className="text-sm text-muted-foreground">Total submissions</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-md">
              <div className="text-2xl font-bold">48</div>
              <p className="text-sm text-muted-foreground">New this month</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-md">
              <div className="text-2xl font-bold">62%</div>
              <p className="text-sm text-muted-foreground">Conversion rate</p>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <Button variant="outline" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              Export Analytics
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
