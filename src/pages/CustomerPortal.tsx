
import React, { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerFeedbackPortal } from "@/components/customer-portal/CustomerFeedbackPortal";
import { CustomerInsights } from "@/components/customer-portal/CustomerInsights";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HexColorPicker } from "react-colorful"; // Fixed to use HexColorPicker

const CustomerPortal = () => {
  const [activeTab, setActiveTab] = useState("feedback");
  const [portalColor, setPortalColor] = useState("#4f46e5");
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  return (
    <div className="space-y-6">
      <PageTitle 
        title="Customer Portal" 
        description="Collect and organize customer feedback"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Portal Configuration</CardTitle>
            <CardDescription>
              Customize how your feedback portal appears to customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="portal-name">Portal Name</Label>
                  <Input id="portal-name" defaultValue="Acme Product Feedback" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subdomain">Custom Subdomain</Label>
                  <div className="flex items-center gap-2">
                    <Input id="subdomain" defaultValue="feedback" />
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
                  <Select defaultValue="en">
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
                  <Select defaultValue="public">
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
                  defaultValue="We value your feedback! Let us know how we can improve our product to better meet your needs."
                />
              </div>
              
              <div>
                <Label className="mb-2 block">Portal Features</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="feature-vote" className="border rounded" defaultChecked />
                    <Label htmlFor="feature-vote">Allow voting</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="feature-comment" className="border rounded" defaultChecked />
                    <Label htmlFor="feature-comment">Allow comments</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="feature-attachments" className="border rounded" />
                    <Label htmlFor="feature-attachments">Allow attachments</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="feature-status-updates" className="border rounded" defaultChecked />
                    <Label htmlFor="feature-status-updates">Status updates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="feature-sso" className="border rounded" />
                    <Label htmlFor="feature-sso">Single sign-on</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline">Reset</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Portal Preview</CardTitle>
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
                className="mb-4 p-2 text-white rounded-md font-medium" 
                style={{ backgroundColor: portalColor }}
              >
                Acme Product Feedback
              </div>
              <div className="bg-slate-100 p-2 rounded-md mb-3 text-sm">
                We value your feedback! Let us know how we can improve our product to better meet your needs.
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Submit Feedback</span>
                <span className="text-xs text-muted-foreground">108 items</span>
              </div>
              
              <div className="space-y-2">
                {["Feature Request", "Bug Report", "Improvement"].map((item, i) => (
                  <div 
                    key={i}
                    className="border bg-white rounded-md p-2 cursor-pointer hover:border-primary transition-colors text-sm"
                  >
                    <div className="font-medium">{item}</div>
                    <div className="text-xs text-muted-foreground">12 votes</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button variant="outline" size="sm">
                Open Live Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="feedback">Customer Feedback</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="feedback" className="mt-6">
          <CustomerFeedbackPortal />
        </TabsContent>
        <TabsContent value="insights" className="mt-6">
          <CustomerInsights />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerPortal;
