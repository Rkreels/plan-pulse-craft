
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
  Tags,
  FileText,
  Users,
  LineChart,
  GitBranch,
  // Additional icons for new features
  PieChart,
  GitMerge,
  Flag,
  TrendingUp,
  Activity,
  BarChart,
  Target
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useAppContext } from "@/contexts/AppContext";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPermission } = useRoleAccess();
  const { currentUser } = useAppContext();

  const menuItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
      roles: ["admin", "product_manager", "executive", "developer", "customer"]
    },
    {
      title: "Strategic Planning",
      path: "/strategy",
      icon: Flag,
      roles: ["admin", "product_manager", "executive"]
    },
    {
      title: "Roadmap",
      path: "/roadmap",
      icon: BarChart3,
      roles: ["admin", "product_manager", "executive", "developer", "customer"]
    },
    {
      title: "Goals",
      path: "/goals",
      icon: Goal,
      roles: ["admin", "product_manager", "executive"]
    },
    {
      title: "Releases",
      path: "/releases",
      icon: CalendarDays,
      roles: ["admin", "product_manager", "executive", "developer"]
    },
    {
      title: "Features",
      path: "/features",
      icon: Tags,
      roles: ["admin", "product_manager", "executive", "developer", "customer"]
    },
    {
      title: "Ideas",
      path: "/ideas",
      icon: LightbulbIcon,
      roles: ["admin", "product_manager", "executive", "developer", "customer"]
    },
    {
      title: "Feedback",
      path: "/feedback",
      icon: MessagesSquare,
      roles: ["admin", "product_manager", "executive", "developer", "customer"]
    },
    {
      title: "Customer Portal",
      path: "/customer-portal",
      icon: Users,
      roles: ["admin", "product_manager", "executive"]
    },
    {
      title: "Competitor Analysis",
      path: "/competitor-analysis",
      icon: Target,
      roles: ["admin", "product_manager", "executive"]
    },
    {
      title: "Capacity Planning",
      path: "/capacity-planning",
      icon: Activity,
      roles: ["admin", "product_manager", "developer"]
    },
    {
      title: "Reports",
      path: "/reports",
      icon: BarChart,
      roles: ["admin", "product_manager", "executive"]
    },
    {
      title: "Analytics",
      path: "/analytics",
      icon: LineChart,
      roles: ["admin", "product_manager", "executive"]
    },
    {
      title: "Dashboards",
      path: "/dashboards",
      icon: PieChart,
      roles: ["admin", "product_manager", "executive"]
    },
    {
      title: "Documentation",
      path: "/documentation",
      icon: FileText,
      roles: ["admin", "product_manager", "executive", "developer"]
    },
  ];

  const workspaceItems = [
    {
      title: "Team",
      path: "/team",
      icon: Users,
      roles: ["admin", "product_manager", "executive", "developer"]
    },
    {
      title: "Integrations",
      path: "/integrations",
      icon: GitBranch,
      roles: ["admin", "product_manager", "developer"]
    },
    {
      title: "Permissions",
      path: "/permissions",
      icon: GitMerge,
      roles: ["admin", "product_manager"]
    },
  ];

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
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Button
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => navigate(item.path)}
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
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredWorkspaceItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Button
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => navigate(item.path)}
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
                  variant={isActive("/settings") ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => navigate("/settings")}
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
