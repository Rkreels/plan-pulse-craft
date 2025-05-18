
import { Upload } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const AvatarCard = () => {
  const { currentUser, setCurrentUser } = useAppContext();
  
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

  return (
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
  );
};
