
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTitle } from "@/components/common/PageTitle";
import { useAppContext } from "@/contexts/AppContext";
import { User } from "@/types";
import { Settings as SettingsIcon, Users, User as UserIcon, Upload, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Settings = () => {
  const { currentUser, switchRole, setCurrentUser } = useAppContext();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("developer");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  
  // For demonstration purposes, allow switching user roles
  const handleRoleChange = (role: User["role"]) => {
    switchRole(role);
  };
  
  // Handle avatar change
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentUser) {
      // In a real app, we would upload the file to a server
      // For this demo, we'll use a blob URL
      const imageUrl = URL.createObjectURL(file);
      setCurrentUser({
        ...currentUser,
        avatar: imageUrl
      });
      toast.success("Avatar updated successfully");
    }
  };
  
  // Handle team member invite
  const handleInvite = () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }
    
    // In a real app, this would send an invitation via API
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail("");
    setInviteRole("developer");
    setIsInviteDialogOpen(false);
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
            toast.success("Settings saved!");
          }
        }}
      />
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
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
                  <div className="flex flex-col w-full items-center gap-2">
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 border rounded-md px-3 py-2 hover:bg-accent">
                        <Upload className="h-4 w-4" />
                        <span>Change Avatar</span>
                      </div>
                    </Label>
                    <Input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarChange}
                    />
                  </div>
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Manage team members and their roles
                </CardDescription>
              </div>
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary">
                    <Users className="h-4 w-4 mr-2" /> 
                    Invite Team Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Send an invitation to collaborate on this workspace.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input 
                        id="email" 
                        placeholder="colleague@example.com" 
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product_manager">Product Manager</SelectItem>
                          <SelectItem value="executive">Executive</SelectItem>
                          <SelectItem value="developer">Developer</SelectItem>
                          <SelectItem value="customer">Customer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleInvite}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Invite
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;
