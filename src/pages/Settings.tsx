
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTitle } from "@/components/common/PageTitle";
import { useAppContext } from "@/contexts/AppContext";
import { User } from "@/types";
import { Settings as SettingsIcon, Users, User as UserIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const { currentUser, switchRole } = useAppContext();
  
  // For demonstration purposes, allow switching user roles
  const handleRoleChange = (role: User["role"]) => {
    switchRole(role);
  };

  return (
    <MainLayout>
      <PageTitle
        title="Settings"
        description="Manage your account and application settings"
        action={{
          label: "Save Changes",
          icon: <SettingsIcon className="h-4 w-4" />,
          onClick: () => {
            // In a real app, this would save settings
            alert("Settings saved!");
          }
        }}
      />
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Email</h4>
                    <p>{currentUser?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Name</h4>
                    <p>{currentUser?.name}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Role</h4>
                  <p>Current role: <strong>{currentUser?.role.replace('_', ' ')}</strong></p>
                  <Select value={currentUser?.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product_manager">Product Manager</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2">
                    Note: Role switching is enabled in this demo to showcase role-based access control.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Avatar</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={currentUser?.avatar} alt={currentUser?.name || "User"} />
                    <AvatarFallback>
                      {currentUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Workspace</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">PlanPulseCraft</p>
                  <p className="text-sm text-muted-foreground">
                    Product Planning Demo
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage team members and their roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="https://ui-avatars.com/api/?name=Alex+Kim&background=6E59A5&color=fff" />
                      <AvatarFallback>AK</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Alex Kim</p>
                      <p className="text-sm text-muted-foreground">alex@example.com</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-500">Product Manager</Badge>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="https://ui-avatars.com/api/?name=Jamie+Singh&background=0EA5E9&color=fff" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Jamie Singh</p>
                      <p className="text-sm text-muted-foreground">jamie@example.com</p>
                    </div>
                  </div>
                  <Badge>Executive</Badge>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="https://ui-avatars.com/api/?name=Taylor+Wong&background=22C55E&color=fff" />
                      <AvatarFallback>TW</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Taylor Wong</p>
                      <p className="text-sm text-muted-foreground">taylor@example.com</p>
                    </div>
                  </div>
                  <Badge>Developer</Badge>
                </div>
                
                <div className="flex justify-between items-center pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="https://ui-avatars.com/api/?name=Morgan+Lee&background=F59E0B&color=fff" />
                      <AvatarFallback>ML</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Morgan Lee</p>
                      <p className="text-sm text-muted-foreground">morgan@example.com</p>
                    </div>
                  </div>
                  <Badge>Customer</Badge>
                </div>
              </div>
              
              <Button className="mt-6 w-full" variant="outline">
                <Users className="h-4 w-4 mr-2" /> Invite Team Member
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;

// This component is missing its Badge import, but I'll add it here
import { Badge } from "@/components/ui/badge";
