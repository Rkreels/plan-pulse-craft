
import { Button } from "@/components/ui/button";
import { 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem
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
  PieChart,
  GitMerge,
  Flag,
  TrendingUp,
  Activity,
  BarChart,
  Target
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export type MenuItem = {
  title: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
};

interface SidebarItemsProps {
  items: MenuItem[];
  isActive: (path: string) => boolean;
}

export const SidebarItems = ({ items, isActive }: SidebarItemsProps) => {
  const navigate = useNavigate();
  
  return (
    <SidebarMenu>
      {items.map((item) => (
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
  );
};

export const getNavigationItems = (): MenuItem[] => {
  return [
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
};

export const getWorkspaceItems = (): MenuItem[] => {
  return [
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
};
