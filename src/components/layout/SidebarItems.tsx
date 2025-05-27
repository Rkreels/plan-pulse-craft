
import {
  Home,
  Lightbulb,
  Target,
  Users,
  Calendar,
  Settings,
  BarChart3,
  FileText,
  Database,
  MessageSquare,
  GitBranch,
  Layers,
  Zap,
  CheckSquare,
  TrendingUp,
  Building,
  Globe,
  Shield,
  Briefcase,
  PieChart,
  LineChart,
  Activity
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export interface NavigationItem {
  title: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
}

export const getNavigationItems = (): NavigationItem[] => [
  {
    title: "Dashboard",
    path: "/",
    icon: Home,
    roles: ["admin", "product_manager", "executive", "developer", "customer"]
  },
  {
    title: "Ideas",
    path: "/ideas",
    icon: Lightbulb,
    roles: ["admin", "product_manager", "executive", "developer", "customer"]
  },
  {
    title: "Features",
    path: "/features",
    icon: Zap,
    roles: ["admin", "product_manager", "executive", "developer"]
  },
  {
    title: "Roadmap",
    path: "/roadmap",
    icon: GitBranch,
    roles: ["admin", "product_manager", "executive"]
  },
  {
    title: "Releases",
    path: "/releases",
    icon: Calendar,
    roles: ["admin", "product_manager", "executive", "developer"]
  },
  {
    title: "Goals",
    path: "/goals",
    icon: Target,
    roles: ["admin", "product_manager", "executive"]
  },
  {
    title: "Strategy",
    path: "/strategy",
    icon: Briefcase,
    roles: ["admin", "product_manager", "executive"]
  },
  {
    title: "Requirements",
    path: "/requirements",
    icon: CheckSquare,
    roles: ["admin", "product_manager", "developer"]
  },
  {
    title: "Tasks",
    path: "/tasks",
    icon: CheckSquare,
    roles: ["admin", "product_manager", "developer"]
  }
];

export const getWorkspaceItems = (): NavigationItem[] => [
  {
    title: "Analytics",
    path: "/analytics",
    icon: TrendingUp,
    roles: ["admin", "product_manager", "executive"]
  },
  {
    title: "Reports",
    path: "/reports", 
    icon: FileText,
    roles: ["admin", "product_manager", "executive"]
  },
  {
    title: "Dashboards",
    path: "/dashboards",
    icon: PieChart,
    roles: ["admin", "product_manager", "executive"]
  },
  {
    title: "Capacity Planning",
    path: "/capacity-planning",
    icon: Activity,
    roles: ["admin", "product_manager", "executive"]
  },
  {
    title: "Team",
    path: "/team",
    icon: Users,
    roles: ["admin", "product_manager"]
  },
  {
    title: "Feedback",
    path: "/feedback",
    icon: MessageSquare,
    roles: ["admin", "product_manager", "executive", "customer"]
  },
  {
    title: "Customer Portal",
    path: "/customer-portal",
    icon: Globe,
    roles: ["admin", "product_manager", "customer"]
  },
  {
    title: "Competitor Analysis",
    path: "/competitor-analysis",
    icon: Building,
    roles: ["admin", "product_manager", "executive"]
  },
  {
    title: "Integrations",
    path: "/integrations",
    icon: Database,
    roles: ["admin", "product_manager"]
  },
  {
    title: "Permissions",
    path: "/permissions",
    icon: Shield,
    roles: ["admin"]
  },
  {
    title: "Documentation",
    path: "/documentation",
    icon: FileText,
    roles: ["admin", "product_manager", "developer"]
  }
];

interface SidebarItemsProps {
  items: NavigationItem[];
  isActive: (path: string) => boolean;
}

export const SidebarItems = ({ items, isActive }: SidebarItemsProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center w-full p-2 rounded-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
              isActive(item.path) 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                : 'text-sidebar-foreground'
            }`}
          >
            <Icon className="mr-3 h-4 w-4" />
            <span className="text-sm">{item.title}</span>
          </button>
        );
      })}
    </div>
  );
};
