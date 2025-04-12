
import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarContent,
  Sidebar as UISidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { 
  BarChart3, 
  CalendarDays, 
  CheckSquare, 
  Goal, 
  LayoutDashboard, 
  LightbulbIcon, 
  MessagesSquare, 
  Settings, 
  Tags 
} from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const [activePath, setActivePath] = useState("/");

  const menuItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Roadmap",
      path: "/roadmap",
      icon: BarChart3,
    },
    {
      title: "Goals",
      path: "/goals",
      icon: Goal,
    },
    {
      title: "Releases",
      path: "/releases",
      icon: CalendarDays,
    },
    {
      title: "Features",
      path: "/features",
      icon: Tags,
    },
    {
      title: "Ideas",
      path: "/ideas",
      icon: LightbulbIcon,
    },
    {
      title: "Feedback",
      path: "/feedback",
      icon: MessagesSquare,
    },
    {
      title: "Tasks",
      path: "/tasks",
      icon: CheckSquare,
    },
  ];

  const isActive = (path: string) => activePath === path;

  return (
    <UISidebar>
      <SidebarContent>
        <div className="flex items-center justify-center py-4">
          <h1 className="text-xl font-bold text-primary">PlanPulseCraft</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Button
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => setActivePath(item.path)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => setActivePath("/settings")}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </UISidebar>
  );
}
