
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { CustomerFeedbackPortal } from "@/components/customer-portal/CustomerFeedbackPortal";
import { CustomerInsights } from "@/components/customer-portal/CustomerInsights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorPicker } from "react-colorful";
import { useToast } from "@/hooks/use-toast";

const CustomerPortal = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("portal");
  const [portalSettings, setPortalSettings] = useState({
    portalEnabled: true,
    allowAnonymousFeedback: true,
    requireApproval: true,
    notifyOnNewFeedback: true,
    customBranding: false,
    primaryColor: "#7c3aed",
    portalTitle: "Customer Feedback Portal",
    emailDomain: "company.com",
  });
  
  const handleSettingChange = (setting: string, value: any) => {
    setPortalSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your portal settings have been updated successfully."
    });
  };
  
  return (
    <>
      <PageTitle
        title="Customer Portal"
        description="Manage customer feedback and engagement"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="portal">Feedback Portal</TabsTrigger>
          <TabsTrigger value="insights">Customer Insights</TabsTrigger>
          <TabsTrigger value="settings">Portal Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="portal" className="space-y-4">
          <CustomerFeedbackPortal />
        </TabsContent>
        <TabsContent value="insights" className="space-y-4">
          <CustomerInsights />
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Portal Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="portal-enabled" className="font-medium">Enable Portal</Label>
                    <p className="text-sm text-muted-foreground">Make the feedback portal available to customers</p>
                  </div>
                  <Switch 
                    id="portal-enabled" 
                    checked={portalSettings.portalEnabled} 
                    onCheckedChange={(value) => handleSettingChange('portalEnabled', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="anonymous-feedback" className="font-medium">Allow Anonymous Feedback</Label>
                    <p className="text-sm text-muted-foreground">Let users submit feedback without logging in</p>
                  </div>
                  <Switch 
                    id="anonymous-feedback" 
                    checked={portalSettings.allowAnonymousFeedback} 
                    onCheckedChange={(value) => handleSettingChange('allowAnonymousFeedback', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="require-approval" className="font-medium">Require Approval</Label>
                    <p className="text-sm text-muted-foreground">Review feedback before it's publicly visible</p>
                  </div>
                  <Switch 
                    id="require-approval" 
                    checked={portalSettings.requireApproval} 
                    onCheckedChange={(value) => handleSettingChange('requireApproval', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-feedback" className="font-medium">Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email when new feedback is submitted</p>
                  </div>
                  <Switch 
                    id="notify-feedback" 
                    checked={portalSettings.notifyOnNewFeedback} 
                    onCheckedChange={(value) => handleSettingChange('notifyOnNewFeedback', value)}
                  />
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Portal Appearance</h3>
                <div className="grid gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="custom-branding" className="font-medium">Custom Branding</Label>
                      <p className="text-sm text-muted-foreground">Apply your company branding to the portal</p>
                    </div>
                    <Switch 
                      id="custom-branding" 
                      checked={portalSettings.customBranding} 
                      onCheckedChange={(value) => handleSettingChange('customBranding', value)}
                    />
                  </div>
                  
                  {portalSettings.customBranding && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="portal-title">Portal Title</Label>
                        <Input 
                          id="portal-title" 
                          value={portalSettings.portalTitle}
                          onChange={(e) => handleSettingChange('portalTitle', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email-domain">Allowed Email Domain</Label>
                        <Input 
                          id="email-domain" 
                          value={portalSettings.emailDomain}
                          onChange={(e) => handleSettingChange('emailDomain', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="w-full md:w-[240px] h-[160px]">
                          <ColorPicker 
                            color={portalSettings.primaryColor}
                            onChange={(color) => handleSettingChange('primaryColor', color)}
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div 
                            className="w-8 h-8 rounded-md border" 
                            style={{ backgroundColor: portalSettings.primaryColor }} 
                          />
                          <Input 
                            value={portalSettings.primaryColor}
                            onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                            className="w-32"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="portal-language">Portal Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger id="portal-language">
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
                    </div>
                  )}
                </div>
              </div>
              
              <Button onClick={saveSettings} className="mt-6">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default CustomerPortal;
