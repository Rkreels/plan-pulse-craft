
import { useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { PageTitle } from "@/components/common/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { AvatarCard } from "@/components/settings/AvatarCard";
import { WorkspaceCard } from "@/components/settings/WorkspaceCard";
import { TeamManagement } from "@/components/settings/TeamManagement";

const Settings = () => {
  return (
    <div className="w-full">
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
            <ProfileSettings />
            
            <div className="space-y-6">
              <AvatarCard />
              <WorkspaceCard />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="team">
          <TeamManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
