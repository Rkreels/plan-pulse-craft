
import React, { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerFeedbackPortal } from "@/components/customer-portal/CustomerFeedbackPortal";
import { CustomerInsights } from "@/components/customer-portal/CustomerInsights";
import { AdvancedAnalytics } from "@/components/customer-portal/AdvancedAnalytics";
import { NotificationCenter } from "@/components/customer-portal/NotificationCenter";
import { UserManagement } from "@/components/customer-portal/UserManagement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { HexColorPicker } from "react-colorful";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, Settings, Eye, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const CustomerPortal = () => {
  const [activeTab, setActiveTab] = useState("feedback");
  const [portalColor, setPortalColor] = useState("#4f46e5");
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Portal configuration state
  const [portalConfig, setPortalConfig] = useState({
    portalName: "Acme Product Feedback",
    subdomain: "feedback",
    language: "en",
    visibility: "public",
    welcomeMessage: "We value your feedback! Let us know how we can improve our product to better meet your needs.",
    allowVoting: true,
    allowComments: true,
    allowAttachments: false,
    statusUpdates: true,
    sso: false,
    requireAuth: false,
    moderateComments: true,
    emailNotifications: true
  });

  const handleConfigChange = (key: string, value: any) => {
    setPortalConfig(prev => ({ ...prev, [key]: value }));
  };

  const saveConfiguration = () => {
    toast.success("Portal configuration saved successfully");
  };

  const exportData = () => {
    // Simulate data export
    const data = {
      feedback: [],
      users: [],
      analytics: {},
      configuration: portalConfig
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer-portal-data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Data exported successfully");
  };

  const importData = () => {
    // Simulate data import
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.success("Data imported successfully");
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Customer Portal" 
        description="Comprehensive customer feedback management platform"
      />
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feedback" className="mt-6">
          <CustomerFeedbackPortal />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <AdvancedAnalytics />
        </TabsContent>
        
        <TabsContent value="insights" className="mt-6">
          <CustomerInsights />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <NotificationCenter />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration Panel */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Portal Configuration
                </CardTitle>
                <CardDescription>
                  Customize your customer portal settings and appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium">Basic Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="portal-name">Portal Name</Label>
                      <Input 
                        id="portal-name" 
                        value={portalConfig.portalName}
                        onChange={(e) => handleConfigChange("portalName", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subdomain">Custom Subdomain</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          id="subdomain" 
                          value={portalConfig.subdomain}
                          onChange={(e) => handleConfigChange("subdomain", e.target.value)}
                        />
                        <span className="text-sm text-muted-foreground">.yourdomain.com</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="relative">
                        <div 
                          className="h-10 rounded-md border border-input flex items-center p-2 cursor-pointer"
                          style={{ backgroundColor: portalColor }}
                          onClick={() => setShowColorPicker(!showColorPicker)}
                        >
                          <span className="bg-white px-2 py-1 rounded text-xs font-mono">{portalColor}</span>
                        </div>
                        {showColorPicker && (
                          <div className="absolute z-10 mt-2 p-2 bg-background border rounded-md shadow-lg">
                            <HexColorPicker color={portalColor} onChange={setPortalColor} />
                            <div className="flex justify-end mt-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setShowColorPicker(false)}
                              >
                                Done
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">Default Language</Label>
                      <Select value={portalConfig.language} onValueChange={(value) => handleConfigChange("language", value)}>
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
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
                      <Label htmlFor="visibility">Portal Visibility</Label>
                      <Select value={portalConfig.visibility} onValueChange={(value) => handleConfigChange("visibility", value)}>
                        <SelectTrigger id="visibility">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private (Invite Only)</SelectItem>
                          <SelectItem value="hidden">Hidden</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="welcome-msg">Welcome Message</Label>
                    <Textarea 
                      id="welcome-msg" 
                      rows={3} 
                      value={portalConfig.welcomeMessage}
                      onChange={(e) => handleConfigChange("welcomeMessage", e.target.value)}
                    />
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Features & Permissions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: "allowVoting", label: "Allow voting on feedback" },
                      { key: "allowComments", label: "Allow comments" },
                      { key: "allowAttachments", label: "Allow file attachments" },
                      { key: "statusUpdates", label: "Send status updates" },
                      { key: "sso", label: "Single sign-on" },
                      { key: "requireAuth", label: "Require authentication" },
                      { key: "moderateComments", label: "Moderate comments" },
                      { key: "emailNotifications", label: "Email notifications" }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-md">
                        <Label htmlFor={key} className="flex-1">{label}</Label>
                        <Switch
                          id={key}
                          checked={portalConfig[key as keyof typeof portalConfig] as boolean}
                          onCheckedChange={(checked) => handleConfigChange(key, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button onClick={saveConfiguration} className="gap-2">
                    <Settings className="h-4 w-4" />
                    Save Configuration
                  </Button>
                  <Button variant="outline" onClick={exportData} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Data
                  </Button>
                  <Button variant="outline" onClick={importData} className="gap-2">
                    <Upload className="h-4 w-4" />
                    Import Data
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Live Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>
                  How your portal appears to customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="border rounded-md p-4 bg-white"
                  style={{ 
                    maxHeight: "500px", 
                    overflow: "hidden",
                  }}
                >
                  <div 
                    className="mb-4 p-3 text-white rounded-md font-medium" 
                    style={{ backgroundColor: portalColor }}
                  >
                    {portalConfig.portalName}
                  </div>
                  <div className="bg-slate-100 p-3 rounded-md mb-4 text-sm">
                    {portalConfig.welcomeMessage}
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium">Recent Feedback</span>
                    <Badge variant="outline">128 items</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {["Dark Mode Support", "Export Feature", "Mobile App"].map((item, i) => (
                      <div 
                        key={i}
                        className="border bg-white rounded-md p-3 cursor-pointer hover:border-primary transition-colors text-sm"
                      >
                        <div className="font-medium">{item}</div>
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span>{12 + i * 5} votes</span>
                          <span>Feature Request</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Open Live Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Total Feedback</span>
                </div>
                <div className="text-2xl font-bold mt-2">1,247</div>
                <div className="text-sm text-muted-foreground">+23% this month</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Active Users</span>
                </div>
                <div className="text-2xl font-bold mt-2">456</div>
                <div className="text-sm text-muted-foreground">+12% this month</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Avg Response Time</span>
                </div>
                <div className="text-2xl font-bold mt-2">2.3h</div>
                <div className="text-sm text-muted-foreground">-15% improvement</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">Satisfaction</span>
                </div>
                <div className="text-2xl font-bold mt-2">4.2/5</div>
                <div className="text-sm text-muted-foreground">+0.3 this month</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerPortal;
