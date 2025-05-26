
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Copy, 
  Download, 
  Trash2, 
  Share2,
  Search,
  Filter,
  Star,
  StarOff,
  Eye,
  Calendar,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

interface ReportsListProps {
  onSelectReport: (id: string) => void;
  refreshTrigger?: number;
}

export const ReportsList = ({ onSelectReport, refreshTrigger }: ReportsListProps) => {
  const [reports, setReports] = useState([
    {
      id: "rep1",
      name: "Feature Completion Analysis",
      description: "Comprehensive analysis of feature completion rates across all releases and time periods",
      type: "bar",
      lastModified: "2 days ago",
      shared: true,
      favorite: false,
      category: "Features",
      views: 24,
      status: "active"
    },
    {
      id: "rep2",
      name: "Roadmap Progress Dashboard",
      description: "Real-time overview of roadmap item status, progress tracking, and milestone achievement",
      type: "line",
      lastModified: "1 week ago",
      shared: false,
      favorite: true,
      category: "Roadmap",
      views: 45,
      status: "active"
    },
    {
      id: "rep3",
      name: "Feature Categorization Breakdown",
      description: "Detailed distribution analysis of features by category, priority, and development stage",
      type: "pie",
      lastModified: "3 days ago",
      shared: true,
      favorite: false,
      category: "Analytics",
      views: 18,
      status: "active"
    },
    {
      id: "rep4",
      name: "Team Velocity Trends",
      description: "Sprint velocity tracking and team performance analysis over time",
      type: "line",
      lastModified: "5 days ago",
      shared: false,
      favorite: true,
      category: "Performance",
      views: 32,
      status: "active"
    },
    {
      id: "rep5",
      name: "Release Planning Report",
      description: "Comprehensive release planning with feature allocation and timeline analysis",
      type: "bar",
      lastModified: "1 day ago",
      shared: true,
      favorite: false,
      category: "Releases",
      views: 67,
      status: "draft"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("lastModified");

  const categories = ["all", "Features", "Roadmap", "Analytics", "Performance", "Releases"];

  const getReportIcon = (type: string) => {
    switch (type) {
      case "bar":
        return <BarChart3 className="h-10 w-10 text-primary" />;
      case "line":
        return <LineChart className="h-10 w-10 text-primary" />;
      case "pie":
        return <PieChart className="h-10 w-10 text-primary" />;
      default:
        return <BarChart3 className="h-10 w-10 text-primary" />;
    }
  };

  const toggleFavorite = (reportId: string) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, favorite: !report.favorite }
        : report
    ));
    const report = reports.find(r => r.id === reportId);
    toast.success(`Report ${report?.favorite ? 'removed from' : 'added to'} favorites`);
  };

  const duplicateReport = (reportId: string) => {
    const reportToDuplicate = reports.find(r => r.id === reportId);
    if (!reportToDuplicate) return;

    const newReport = {
      ...reportToDuplicate,
      id: `rep_${Date.now()}`,
      name: `${reportToDuplicate.name} (Copy)`,
      lastModified: "Just now",
      shared: false,
      views: 0
    };

    setReports([newReport, ...reports]);
    toast.success("Report duplicated successfully");
  };

  const deleteReport = (reportId: string) => {
    setReports(reports.filter(r => r.id !== reportId));
    toast.success("Report deleted successfully");
  };

  const exportReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    toast.success(`Exporting "${report?.name}"...`);
  };

  const shareReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    toast.success(`Share link for "${report?.name}" copied to clipboard`);
  };

  // Filter and sort reports
  const filteredReports = reports
    .filter(report => {
      const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "all" || report.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "views":
          return b.views - a.views;
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0; // lastModified - would need proper date comparison
      }
    });

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">My Reports</h2>
          <p className="text-sm text-muted-foreground">
            {filteredReports.length} of {reports.length} reports
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> New Report
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Category: {filterCategory === "all" ? "All" : filterCategory}
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
                Sort by: {sortBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("lastModified")}>
                Last Modified
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name")}>
                Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("views")}>
                Views
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("category")}>
                Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Reports grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map(report => (
          <Card 
            key={report.id} 
            className="cursor-pointer hover:border-primary transition-colors group" 
            onClick={() => onSelectReport(report.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    {report.favorite && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {report.category}
                    </Badge>
                    <Badge 
                      variant={report.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {report.status}
                    </Badge>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelectReport(report.id); }}>
                      <Eye className="h-4 w-4 mr-2" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); }}>
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); duplicateReport(report.id); }}>
                      <Copy className="h-4 w-4 mr-2" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleFavorite(report.id); }}>
                      {report.favorite ? (
                        <><StarOff className="h-4 w-4 mr-2" /> Remove from Favorites</>
                      ) : (
                        <><Star className="h-4 w-4 mr-2" /> Add to Favorites</>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); exportReport(report.id); }}>
                      <Download className="h-4 w-4 mr-2" /> Export
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); shareReport(report.id); }}>
                      <Share2 className="h-4 w-4 mr-2" /> Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive" 
                      onClick={(e) => { e.stopPropagation(); deleteReport(report.id); }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription className="text-sm">{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getReportIcon(report.type)}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {report.lastModified}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      {report.views} views
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {report.shared && <Badge variant="outline" className="text-xs">Shared</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No reports found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterCategory !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Create your first report to get started"
            }
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Create New Report
          </Button>
        </div>
      )}
    </div>
  );
};
