
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Copy, LineChart, BarChart, PieChart, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface Dashboard {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  created: string;
  widgetCount: number;
  type: 'custom' | 'template';
}

export const DashboardsList = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([
    {
      id: "d1",
      title: "Executive Overview",
      description: "High-level metrics for executives",
      thumbnail: "https://placehold.co/400x200/e2e8f0/64748b?text=Executive+Dashboard",
      created: "2025-04-12",
      widgetCount: 8,
      type: 'custom'
    },
    {
      id: "d2",
      title: "Product Health",
      description: "Key product performance indicators",
      thumbnail: "https://placehold.co/400x200/e2e8f0/64748b?text=Product+Health",
      created: "2025-04-15",
      widgetCount: 6,
      type: 'custom'
    },
    {
      id: "d3",
      title: "Customer Feedback",
      description: "Aggregated customer feedback analysis",
      thumbnail: "https://placehold.co/400x200/e2e8f0/64748b?text=Feedback+Dashboard",
      created: "2025-05-01",
      widgetCount: 5,
      type: 'custom'
    },
    {
      id: "d4",
      title: "Development Progress",
      description: "Feature development and sprint tracking",
      thumbnail: "https://placehold.co/400x200/e2e8f0/64748b?text=Dev+Progress",
      created: "2025-05-10",
      widgetCount: 7,
      type: 'custom'
    }
  ]);

  const [templates, setTemplates] = useState<Dashboard[]>([
    {
      id: "t1",
      title: "Product Roadmap Overview",
      description: "Standard roadmap visualization with timelines",
      thumbnail: "https://placehold.co/400x200/e2e8f0/64748b?text=Roadmap+Template",
      created: "2025-03-20",
      widgetCount: 5,
      type: 'template'
    },
    {
      id: "t2",
      title: "Feature Prioritization",
      description: "Feature scoring and prioritization dashboard",
      thumbnail: "https://placehold.co/400x200/e2e8f0/64748b?text=Prioritization",
      created: "2025-03-25",
      widgetCount: 4,
      type: 'template'
    }
  ]);

  const handleCreateDashboard = () => {
    toast.success("Create dashboard dialog would open here");
  };

  const handleDuplicateDashboard = (id: string) => {
    const dashboardToCopy = dashboards.find(d => d.id === id);
    if (!dashboardToCopy) return;
    
    const newDashboard = {
      ...dashboardToCopy,
      id: `d${dashboards.length + 1}`,
      title: `${dashboardToCopy.title} (Copy)`,
      created: new Date().toISOString().split('T')[0]
    };
    
    setDashboards([...dashboards, newDashboard]);
    toast.success(`Dashboard "${dashboardToCopy.title}" duplicated`);
  };

  const handleDeleteDashboard = (id: string) => {
    setDashboards(dashboards.filter(d => d.id !== id));
    toast.success("Dashboard deleted");
  };

  const handleUseTemplate = (id: string) => {
    const template = templates.find(t => t.id === id);
    if (!template) return;
    
    const newDashboard = {
      ...template,
      id: `d${dashboards.length + 1}`,
      title: `${template.title} (New)`,
      created: new Date().toISOString().split('T')[0],
      type: 'custom' as const
    };
    
    setDashboards([...dashboards, newDashboard]);
    toast.success(`Dashboard created from template "${template.title}"`);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">My Dashboards</h2>
          <Button onClick={handleCreateDashboard}>
            <Plus className="h-4 w-4 mr-2" /> Create Dashboard
          </Button>
        </div>
        
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search dashboards..."
            className="pl-8 w-full"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboards.map(dashboard => (
            <Card key={dashboard.id} className="overflow-hidden">
              <div className="aspect-[16/9] relative">
                <img 
                  src={dashboard.thumbnail} 
                  alt={dashboard.title} 
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDuplicateDashboard(dashboard.id)}>
                        <Copy className="h-4 w-4 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteDashboard(dashboard.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardHeader>
                <CardTitle>{dashboard.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{dashboard.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  {dashboard.widgetCount === 1 ? (
                    <LineChart className="h-4 w-4" />
                  ) : dashboard.widgetCount <= 3 ? (
                    <>
                      <LineChart className="h-4 w-4" />
                      <BarChart className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <LineChart className="h-4 w-4" />
                      <BarChart className="h-4 w-4" />
                      <PieChart className="h-4 w-4" />
                    </>
                  )}
                  <span>{dashboard.widgetCount} widgets</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Dashboard Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => (
            <Card key={template.id} className="overflow-hidden">
              <div className="aspect-[16/9] relative">
                <img 
                  src={template.thumbnail} 
                  alt={template.title} 
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle>{template.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{template.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span>{template.widgetCount} widgets included</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleUseTemplate(template.id)}
                >
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
