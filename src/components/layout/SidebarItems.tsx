
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
    path: "/project-roadmap",
    icon: Home,
    roles: ["admin", "product_manager", "executive", "developer", "customer"]
  },
  {
    title: "Ideas",
    path: "/project-roadmap/ideas",
    icon: Lightbulb,
    roles: ["admin", "product_manager", "executive", "developer", "customer"]
  },
  {
    title: "Features",
    path: "/project-roadmap/features",
    icon: Zap,
    roles: ["admin", "product_manager", "executive", "developer"]
  },
  {
    title: "Roadmap",
    path: "/project-roadmap/roadmap",
    icon: GitBranch,
    roles: ["admin", "product_manager", "executive"]
  },
  {
    title: "Releases",
    path: "/project-roadmap/releases",
    icon: Calendar,
    roles: ["admin", "product_manager", "executive", "developer"]
  },
  {
    title: "Goals",
    path: "/project-roadmap/goals",
    icon: Target,
    roles: ["admin", "product_manager", "executive"]
  },
  {
    title: "Strategy",
    path: "/project-roadmap/strategy",
    icon: Briefcase,
    roles: ["admin", "product_manager", "executive"]
  },
  {
    title: "Requirements",
    path: "/project-roadmap/requirements",
    icon: CheckSquare,
    roles: ["admin", "product_manager", "developer"]
  },
  {
    title: "Tasks",
    path: "/project-roadmap/tasks",
    icon: CheckSquare,
    roles: ["admin", "product_manager", "developer"]
  }
];

export const getWorkspaceItems = (): NavigationItem[] => [
  {
    title: "Analytics",
    path: "/project-roadmap/analytics",
    icon: TrendingUp,
    roles: ["admin", "product_manager", "executive"]
  },
  {
    title: "Reports",
    path: "/project-roadmap/reports", 
    icon: FileText,
    roles: ["admin", "product_manager", "executive"]
  },
  {
    title: "Dashboards",
    path: "/project-roadmap/dashboards",
    icon: PieChart,
    roles: ["admin", "product_manager", "executive"]
  },
  {
    title: "Capacity Planning",
    path: "/project-roadmap/capacity-planning",
    icon: Activity,
    roles: ["admin", "product_manager", "executive"]
  },
  {
    title: "Team",
    path: "/project-roadmap/team",
    icon: Users,
    roles: ["admin", "product_manager"]
  },
  {
    title: "Feedback",
    path: "/project-roadmap/feedback",
    icon: MessageSquare,
    roles: ["admin", "product_manager", "executive", "customer"]
  },
  {
    title: "Customer Portal",
    path: "/project-roadmap/customer-portal",
    icon: Globe,
    roles: ["admin", "product_manager", "customer"]
  },
  {
    title: "Competitor Analysis",
    path: "/project-roadmap/competitor-analysis",
    icon: Building,
    roles: ["admin", "product_manager", "executive"]
  },
  {
    title: "Integrations",
    path: "/project-roadmap/integrations",
    icon: Database,
    roles: ["admin", "product_manager"]
  },
  {
    title: "Permissions",
    path: "/project-roadmap/permissions",
    icon: Shield,
    roles: ["admin"]
  },
  {
    title: "Documentation",
    path: "/project-roadmap/documentation",
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
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
              isActive(item.path) 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                : 'text-sidebar-foreground'
            }`}
          >
            <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
            <span>{item.title}</span>
          </button>
        );
      })}
    </nav>
  );
};
