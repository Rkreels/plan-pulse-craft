
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Plus, Edit, Trash2, Copy, Share, Download, BarChart3, PieChart, LineChart, TrendingUp } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Pie, Cell, LineChart as RechartsLineChart, Line } from "recharts";
import { toast } from "sonner";

interface Dashboard {
  id: string;
  name: string;
  description: string;
  type: "analytics" | "performance" | "custom";
  widgets: Widget[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  createdBy: string;
}

interface Widget {
  id: string;
  type: "chart" | "metric" | "table" | "text";
  title: string;
  data: any[];
  config: any;
  position: { x: number; y: number; w: number; h: number };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const DashboardsList = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([
    {
      id: "1",
      name: "Product Analytics",
      description: "Key metrics and performance indicators for product development",
      type: "analytics",
      widgets: [
        {
          id: "w1",
          type: "chart",
          title: "Feature Completion Rate",
          data: [
            { month: "Jan", completed: 12, planned: 15 },
            { month: "Feb", completed: 18, planned: 20 },
            { month: "Mar", completed: 22, planned: 25 },
            { month: "Apr", completed: 28, planned: 30 }
          ],
          config: { chartType: "bar" },
          position: { x: 0, y: 0, w: 6, h: 4 }
        },
        {
          id: "w2",
          type: "metric",
          title: "Active Features",
          data: [{ value: 127, change: "+15%" }],
          config: { color: "blue" },
          position: { x: 6, y: 0, w: 3, h: 2 }
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: true,
      createdBy: "Product Team"
    },
    {
      id: "2",
      name: "Team Performance",
      description: "Team productivity and capacity metrics",
      type: "performance",
      widgets: [
        {
          id: "w3",
          type: "chart",
          title: "Sprint Velocity",
          data: [
            { sprint: "Sprint 1", velocity: 45 },
            { sprint: "Sprint 2", velocity: 52 },
            { sprint: "Sprint 3", velocity: 48 },
            { sprint: "Sprint 4", velocity: 58 }
          ],
          config: { chartType: "line" },
          position: { x: 0, y: 0, w: 8, h: 4 }
        }
      ],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      isPublic: false,
      createdBy: "Team Lead"
    }
  ]);

  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingDashboard, setEditingDashboard] = useState<Dashboard | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Create Dashboard Form State
  const [newDashboard, setNewDashboard] = useState({
    name: "",
    description: "",
    type: "custom" as const,
    isPublic: false
  });

  const filteredDashboards = dashboards.filter(dashboard => {
    const matchesSearch = !searchQuery || 
      dashboard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dashboard.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || dashboard.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleCreateDashboard = () => {
    if (!newDashboard.name || !newDashboard.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const dashboard: Dashboard = {
      id: Date.now().toString(),
      ...newDashboard,
      widgets: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "Current User"
    };

    setDashboards(prev => [dashboard, ...prev]);
    setNewDashboard({ name: "", description: "", type: "custom", isPublic: false });
    setShowCreateDialog(false);
    toast.success("Dashboard created successfully");
  };

  const handleEditDashboard = (dashboard: Dashboard) => {
    setEditingDashboard(dashboard);
    setShowEditDialog(true);
  };

  const handleUpdateDashboard = () => {
    if (!editingDashboard) return;

    setDashboards(prev => prev.map(d => 
      d.id === editingDashboard.id 
        ? { ...editingDashboard, updatedAt: new Date().toISOString() }
        : d
    ));
    setShowEditDialog(false);
    setEditingDashboard(null);
    toast.success("Dashboard updated successfully");
  };

  const handleDeleteDashboard = (id: string) => {
    if (window.confirm("Are you sure you want to delete this dashboard?")) {
      setDashboards(prev => prev.filter(d => d.id !== id));
      toast.success("Dashboard deleted successfully");
    }
  };

  const handleDuplicateDashboard = (dashboard: Dashboard) => {
    const duplicated: Dashboard = {
      ...dashboard,
      id: Date.now().toString(),
      name: `${dashboard.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "Current User"
    };

    setDashboards(prev => [duplicated, ...prev]);
    toast.success("Dashboard duplicated successfully");
  };

  const handleExportDashboard = (dashboard: Dashboard) => {
    const dataStr = JSON.stringify(dashboard, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `dashboard_${dashboard.name.replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Dashboard exported successfully");
  };

  const handleShareDashboard = (dashboard: Dashboard) => {
    const shareUrl = `${window.location.origin}/dashboards/${dashboard.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Dashboard link copied to clipboard");
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case "chart":
        if (widget.config.chartType === "bar") {
          return (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={widget.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#8884d8" />
                <Bar dataKey="planned" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          );
        } else if (widget.config.chartType === "line") {
          return (
            <ResponsiveContainer width="100%" height={200}>
              <RechartsLineChart data={widget.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sprint" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="velocity" stroke="#8884d8" strokeWidth={2} />
              </RechartsLineChart>
            </ResponsiveContainer>
          );
        }
        break;
      case "metric":
        const metric = widget.data[0];
        return (
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{metric.value}</div>
            <div className="text-sm text-green-600">{metric.change}</div>
          </div>
        );
      default:
        return <div>Widget type not supported</div>;
    }
  };

  if (selectedDashboard) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Button variant="ghost" onClick={() => setSelectedDashboard(null)} className="mb-4">
              ← Back to Dashboards
            </Button>
            <h1 className="text-3xl font-bold">{selectedDashboard.name}</h1>
            <p className="text-muted-foreground">{selectedDashboard.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleEditDashboard(selectedDashboard)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={() => handleShareDashboard(selectedDashboard)}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedDashboard.widgets.map(widget => (
            <Card key={widget.id}>
              <CardHeader>
                <CardTitle className="text-lg">{widget.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {renderWidget(widget)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Input
              placeholder="Search dashboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus size={16} className="mr-2" />
          Create Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDashboards.map(dashboard => (
          <Card key={dashboard.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1" onClick={() => setSelectedDashboard(dashboard)}>
                  <CardTitle className="text-lg">{dashboard.name}</CardTitle>
                  <CardDescription className="mt-1">{dashboard.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditDashboard(dashboard)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicateDashboard(dashboard)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShareDashboard(dashboard)}>
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportDashboard(dashboard)}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteDashboard(dashboard.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent onClick={() => setSelectedDashboard(dashboard)}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Badge variant="outline">{dashboard.type}</Badge>
                  <Badge variant={dashboard.isPublic ? "default" : "secondary"}>
                    {dashboard.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {dashboard.widgets.length} widgets • Created by {dashboard.createdBy}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Updated {new Date(dashboard.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDashboards.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No dashboards found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || typeFilter !== "all" 
              ? "Try adjusting your filters"
              : "Create your first dashboard to get started"
            }
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus size={16} className="mr-2" />
            Create Dashboard
          </Button>
        </div>
      )}

      {/* Create Dashboard Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Dashboard</DialogTitle>
            <DialogDescription>
              Create a custom dashboard to track your key metrics and insights.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newDashboard.name}
                onChange={(e) => setNewDashboard(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter dashboard name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newDashboard.description}
                onChange={(e) => setNewDashboard(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this dashboard will show"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select 
                value={newDashboard.type} 
                onValueChange={(value: any) => setNewDashboard(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDashboard}>Create Dashboard</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dashboard Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Dashboard</DialogTitle>
            <DialogDescription>
              Update your dashboard settings and configuration.
            </DialogDescription>
          </DialogHeader>
          {editingDashboard && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editingDashboard.name}
                  onChange={(e) => setEditingDashboard(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                  placeholder="Enter dashboard name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingDashboard.description}
                  onChange={(e) => setEditingDashboard(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  placeholder="Describe what this dashboard will show"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDashboard}>Update Dashboard</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
