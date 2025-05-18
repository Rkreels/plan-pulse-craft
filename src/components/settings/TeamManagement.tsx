
import { useState } from "react";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { TeamMemberInviteDialog } from "./TeamMemberInviteDialog";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const TeamManagement = () => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  
  // Handle team member invite
  const handleInvite = (email: string, role: string) => {
    // In a real app, this would send an invitation via API
    toast.success(`Invitation sent to ${email}`);
    setIsInviteDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage team members and their roles
          </CardDescription>
        </div>
        <Button variant="secondary" onClick={() => setIsInviteDialogOpen(true)}>
          <Users className="h-4 w-4 mr-2" /> 
          Invite Team Member
        </Button>
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
      <TeamMemberInviteDialog 
        isOpen={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onInvite={handleInvite}
      />
    </Card>
  );
};
