
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
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Copy, 
  LineChart, 
  BarChart, 
  PieChart, 
  ArrowRight,
  Star,
  StarOff,
  Eye,
  Share2,
  Download,
  Edit,
  Trash2,
  Filter,
  Grid,
  List,
  Calendar,
  Users,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

interface Dashboard {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  created: string;
  widgetCount: number;
  type: 'custom' | 'template';
  category: string;
  favorite: boolean;
  shared: boolean;
  views: number;
  lastAccessed: string;
  status: 'active' | 'draft';
}

export const DashboardsList = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([
    {
      id: "d1",
      title: "Executive Overview",
      description: "High-level metrics and KPIs for executive decision making and strategic planning",
      thumbnail: "https://placehold.co/400x200/e2e8f0/64748b?text=Executive+Dashboard",
      created: "2025-04-12",
      widgetCount: 8,
      type: 'custom',
      category: 'Executive',
      favorite: true,
      shared: true,
      views: 156,
      lastAccessed: "2 hours ago",
      status: 'active'
    },
    {
      id: "d2",
      title: "Product Health Monitor",
      description: "Real-time product performance indicators, user engagement, and feature adoption metrics",
      thumbnail: "https://placehold.co/400x200/e2e8f0/64748b?text=Product+Health",
      created: "2025-04-15",
      widgetCount: 6,
      type: 'custom',
      category: 'Product',
      favorite: false,
      shared: false,
      views: 89,
      lastAccessed: "1 day ago",
      status: 'active'
    },
    {
      id: "d3",
      title: "Customer Feedback Analytics",
      description: "Comprehensive customer feedback analysis with sentiment tracking and trend identification",
      thumbnail: "https://placehold.co/400x200/e2e8f0/64748b?text=Feedback+Dashboard",
      created: "2025-05-01",
      widgetCount: 5,
      type: 'custom',
      category: 'Customer',
      favorite: true,
      shared: true,
      views: 234,
      lastAccessed: "3 hours ago",
      status: 'active'
    },
    {
      id: "d4",
      title: "Development Progress Tracker",
      description: "Sprint progress, feature development status, and team velocity tracking dashboard",
      thumbnail: "https://placehold.co/400x200/e2e8f0/64748b?text=Dev+Progress",
      created: "2025-05-10",
      widgetCount: 7,
      type: 'custom',
      category: 'Development',
      favorite: false,
      shared: false,
      views: 67,
      lastAccessed: "5 hours ago",
      status: 'draft'
    },
    {
      id: "d5",
      title: "Release Planning Board",
      description: "Release timeline, feature allocation, and milestone tracking for upcoming releases",
      thumbnail: "https://placehold.co/400x200/e2e8f0/64748b?text=Release+Planning",
      created: "2025-05-15",
      widgetCount: 9,
      type: 'custom',
      category: 'Planning',
      favorite: false,
      shared: true,
      views: 123,
      lastAccessed: "1 hour ago",
      status: 'active'
    }
  ]);

  const [templates, setTemplates] = useState<Dashboard[]>([
    {
      id: "t1",
      title: "Product Roadmap Overview",
      description: "Standard roadmap visualization with timeline, milestones, and feature tracking",
      thumbnail: "https://placehold.co/400x200/e2e8f0/64748b?text=Roadmap+Template",
      created: "2025-03-20",
      widgetCount: 5,
      type: 'template',
      category: 'Roadmap',
      favorite: false,
      shared: false,
      views: 0,
      lastAccessed: "",
      status: 'active'
    },
    {
      id: "t2",
      title: "Feature Prioritization Matrix",
      description: "Feature scoring, prioritization framework, and impact vs effort analysis dashboard",
      thumbnail: "https://placehold.co/400x200/e2e8f0/64748b?text=Prioritization",
      created: "2025-03-25",
      widgetCount: 4,
      type: 'template',
      category: 'Planning',
      favorite: false,
      shared: false,
      views: 0,
      lastAccessed: "",
      status: 'active'
    },
    {
      id: "t3",
      title: "Team Performance Analytics",
      description: "Team velocity, sprint completion rates, and productivity metrics dashboard",
      thumbnail: "https://placehold.co/400x200/e2e8f0/64748b?text=Team+Analytics",
      created: "2025-04-01",
      widgetCount: 6,
      type: 'template',
      category: 'Performance',
      favorite: false,
      shared: false,
      views: 0,
      lastAccessed: "",
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState("lastAccessed");

  const categories = ["all", "Executive", "Product", "Customer", "Development", "Planning", "Roadmap", "Performance"];

  const handleCreateDashboard = () => {
    toast.success("Create dashboard dialog would open here");
  };

  const toggleFavorite = (id: string) => {
    setDashboards(dashboards.map(d => 
      d.id === id ? { ...d, favorite: !d.favorite } : d
    ));
    const dashboard = dashboards.find(d => d.id === id);
    toast.success(`Dashboard ${dashboard?.favorite ? 'removed from' : 'added to'} favorites`);
  };

  const handleDuplicateDashboard = (id: string) => {
    const dashboardToCopy = dashboards.find(d => d.id === id);
    if (!dashboardToCopy) return;
    
    const newDashboard = {
      ...dashboardToCopy,
      id: `d${Date.now()}`,
      title: `${dashboardToCopy.title} (Copy)`,
      created: new Date().toISOString().split('T')[0],
      favorite: false,
      shared: false,
      views: 0,
      lastAccessed: "Just now"
    };
    
    setDashboards([newDashboard, ...dashboards]);
    toast.success(`Dashboard "${dashboardToCopy.title}" duplicated`);
  };

  const handleDeleteDashboard = (id: string) => {
    const dashboard = dashboards.find(d => d.id === id);
    setDashboards(dashboards.filter(d => d.id !== id));
    toast.success(`Dashboard "${dashboard?.title}" deleted`);
  };

  const handleUseTemplate = (id: string) => {
    const template = templates.find(t => t.id === id);
    if (!template) return;
    
    const newDashboard = {
      ...template,
      id: `d${Date.now()}`,
      title: `${template.title} (New)`,
      created: new Date().toISOString().split('T')[0],
      type: 'custom' as const,
      favorite: false,
      shared: false,
      views: 0,
      lastAccessed: "Just now"
    };
    
    setDashboards([newDashboard, ...dashboards]);
    toast.success(`Dashboard created from template "${template.title}"`);
  };

  const exportDashboard = (id: string) => {
    const dashboard = dashboards.find(d => d.id === id);
    toast.success(`Exporting "${dashboard?.title}"...`);
  };

  const shareDashboard = (id: string) => {
    const dashboard = dashboards.find(d => d.id === id);
    toast.success(`Share link for "${dashboard?.title}" copied to clipboard`);
  };

  // Filter and sort dashboards
  const filteredDashboards = dashboards
    .filter(dashboard => {
      const matchesSearch = dashboard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dashboard.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "all" || dashboard.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "views":
          return b.views - a.views;
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0; // lastAccessed - would need proper date comparison
      }
    });

  const renderDashboardCard = (dashboard: Dashboard) => (
    <Card key={dashboard.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="aspect-[16/9] relative">
        <img 
          src={dashboard.thumbnail} 
          alt={dashboard.title} 
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); toggleFavorite(dashboard.id); }}
          >
            {dashboard.favorite ? (
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            ) : (
              <StarOff className="h-4 w-4" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" /> View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDuplicateDashboard(dashboard.id)}>
                <Copy className="h-4 w-4 mr-2" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => exportDashboard(dashboard.id)}>
                <Download className="h-4 w-4 mr-2" /> Export
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => shareDashboard(dashboard.id)}>
                <Share2 className="h-4 w-4 mr-2" /> Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteDashboard(dashboard.id)}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute bottom-2 left-2 flex gap-1">
          <Badge variant={dashboard.status === 'active' ? 'default' : 'secondary'} className="text-xs">
            {dashboard.status}
          </Badge>
          {dashboard.shared && (
            <Badge variant="outline" className="text-xs">Shared</Badge>
          )}
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{dashboard.title}</CardTitle>
            <Badge variant="outline" className="mt-1 text-xs">{dashboard.category}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground pb-2">
        <p className="line-clamp-2">{dashboard.description}</p>
        <div className="flex items-center justify-between mt-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {dashboard.widgetCount === 1 ? (
                <LineChart className="h-3 w-3" />
              ) : dashboard.widgetCount <= 3 ? (
                <>
                  <LineChart className="h-3 w-3" />
                  <BarChart className="h-3 w-3" />
                </>
              ) : (
                <>
                  <LineChart className="h-3 w-3" />
                  <BarChart className="h-3 w-3" />
                  <PieChart className="h-3 w-3" />
                </>
              )}
              <span>{dashboard.widgetCount} widgets</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>{dashboard.views} views</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{dashboard.lastAccessed}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full" variant="outline">
          View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">My Dashboards</h2>
            <p className="text-sm text-muted-foreground">
              {filteredDashboards.length} of {dashboards.length} dashboards
            </p>
          </div>
          <Button onClick={handleCreateDashboard}>
            <Plus className="h-4 w-4 mr-2" /> Create Dashboard
          </Button>
        </div>
        
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search dashboards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {filterCategory === "all" ? "All Categories" : filterCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map(category => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setFilterCategory(category)}
                  >
                    {category === "all" ? "All Categories" : category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort: {sortBy}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("lastAccessed")}>
                  Last Accessed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("title")}>
                  Title
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("views")}>
                  Views
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("category")}>
                  Category
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Dashboards grid */}
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredDashboards.map(renderDashboardCard)}
        </div>

        {filteredDashboards.length === 0 && (
          <div className="text-center py-12">
            <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No dashboards found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterCategory !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Create your first dashboard to get started"
              }
            </p>
            <Button onClick={handleCreateDashboard}>
              <Plus className="h-4 w-4 mr-2" /> Create Dashboard
            </Button>
          </div>
        )}
      </div>
      
      {/* Templates section */}
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
                <Badge variant="secondary" className="absolute top-2 left-2 text-xs">
                  Template
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{template.title}</span>
                  <Badge variant="outline" className="text-xs">{template.category}</Badge>
                </CardTitle>
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
