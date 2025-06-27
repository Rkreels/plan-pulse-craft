
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Plus, Edit, Trash2, Share, BarChart3 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Dashboard {
  id: string;
  name: string;
  description: string;
  type: "overview" | "analytics" | "performance" | "custom";
  isPublic: boolean;
  lastModified: string;
  createdBy: string;
  widgets: number;
}

export const DashboardsList = () => {
  const { toast } = useToast();
  const [dashboards, setDashboards] = useState<Dashboard[]>([
    {
      id: "1",
      name: "Product Overview",
      description: "High-level view of product metrics and KPIs",
      type: "overview",
      isPublic: true,
      lastModified: "2 hours ago",
      createdBy: "John Doe",
      widgets: 8
    },
    {
      id: "2",
      name: "Feature Analytics",
      description: "Detailed analytics on feature adoption and usage",
      type: "analytics",
      isPublic: false,
      lastModified: "1 day ago",
      createdBy: "Sarah Smith",
      widgets: 12
    },
    {
      id: "3",
      name: "Team Performance",
      description: "Team productivity and performance metrics",
      type: "performance",
      isPublic: true,
      lastModified: "3 days ago",
      createdBy: "Mike Johnson",
      widgets: 6
    },
    {
      id: "4",
      name: "Customer Insights",
      description: "Customer behavior and satisfaction dashboard",
      type: "custom",
      isPublic: false,
      lastModified: "1 week ago",
      createdBy: "Emily Davis",
      widgets: 10
    }
  ]);

  const handleDelete = (id: string) => {
    setDashboards(prev => prev.filter(d => d.id !== id));
    toast({
      title: "Dashboard deleted",
      description: "The dashboard has been successfully deleted."
    });
  };

  const handleShare = (dashboard: Dashboard) => {
    toast({
      title: "Dashboard shared",
      description: `${dashboard.name} sharing link copied to clipboard`
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "overview": return "bg-blue-100 text-blue-800";
      case "analytics": return "bg-green-100 text-green-800";
      case "performance": return "bg-purple-100 text-purple-800";
      case "custom": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboards</h2>
          <p className="text-muted-foreground">Create and manage your custom dashboards</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboards.map(dashboard => (
          <Card key={dashboard.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <Badge className={getTypeColor(dashboard.type)}>{dashboard.type}</Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare(dashboard)}>
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(dashboard.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="mt-2">{dashboard.name}</CardTitle>
              <CardDescription>{dashboard.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                <span>{dashboard.widgets} widgets</span>
                <span>{dashboard.lastModified}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm">by {dashboard.createdBy}</span>
                  {dashboard.isPublic && (
                    <Badge variant="outline" className="text-xs">Public</Badge>
                  )}
                </div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
