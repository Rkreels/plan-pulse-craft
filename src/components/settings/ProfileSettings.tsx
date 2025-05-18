
import { useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { User } from "@/types";
import { useAppContext } from "@/contexts/AppContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ProfileSettings = () => {
  const { currentUser, switchRole } = useAppContext();
  
  // For demonstration purposes, allow switching user roles
  const handleRoleChange = (role: User["role"]) => {
    switchRole(role);
  };

  return (
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
  );
};
