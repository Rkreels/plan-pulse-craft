
import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamMemberInviteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (email: string, role: string) => void;
}

export const TeamMemberInviteDialog = ({
  isOpen,
  onOpenChange,
  onInvite,
}: TeamMemberInviteDialogProps) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("developer");

  const handleInviteClick = () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }
    
    onInvite(inviteEmail, inviteRole);
    setInviteEmail("");
    setInviteRole("developer");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInviteClick}>
            <Mail className="h-4 w-4 mr-2" />
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
