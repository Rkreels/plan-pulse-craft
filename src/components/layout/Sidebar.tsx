
import { Button } from "@/components/ui/button";
import {
  SidebarContent,
  Sidebar as UISidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useAppContext } from "@/contexts/AppContext";
import { SidebarItems, getNavigationItems, getWorkspaceItems } from "./SidebarItems";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPermission } = useRoleAccess();
  const { currentUser } = useAppContext();

  const menuItems = getNavigationItems();
  const workspaceItems = getWorkspaceItems();

  const isActive = (path: string) => {
    // Check if the current path starts with the given path
    // This handles active state for nested routes like /features/123
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );

  const filteredWorkspaceItems = workspaceItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );

  return (
    <UISidebar>
      <SidebarContent>
        <div className="flex items-center justify-center py-4">
          <h1 className="text-xl font-bold text-primary">PlanPulseCraft</h1>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarItems items={filteredMenuItems} isActive={isActive} />
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarItems items={filteredWorkspaceItems} isActive={isActive} />
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-auto">
          <SidebarItems 
            items={[{
              title: "Settings",
              path: "/settings",
              icon: Settings,
              roles: ["admin", "product_manager", "executive", "developer", "customer"]
            }]} 
            isActive={isActive} 
          />
        </SidebarGroup>
      </SidebarContent>
    </UISidebar>
  );
}
