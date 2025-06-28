
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { Plus, Eye, Edit, Trash2, BarChart3, PieChart, LineChart, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart as RechartsLineChart, Line } from "recharts";

interface Dashboard {
  id: string;
  name: string;
  description: string;
  type: "overview" | "analytics" | "performance" | "custom";
  isPublic: boolean;
  widgets: Widget[];
  createdAt: string;
  updatedAt: string;
}

interface Widget {
  id: string;
  type: "chart" | "metric" | "table" | "text";
  title: string;
  data: any;
  config: any;
}

export const DashboardsList = () => {
  const { toast } = useToast();
  const { features, feedback, goals, tasks, currentUser } = useAppContext();
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");
  const [newDashboardType, setNewDashboardType] = useState<Dashboard["type"]>("overview");

  // Create sample dashboards with real data
  const [dashboards, setDashboards] = useState<Dashboard[]>([
    {
      id: "dash-1",
      name: "Product Overview",
      description: "High-level view of product metrics and progress",
      type: "overview",
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      widgets: [
        {
          id: "widget-1",
          type: "metric",
          title: "Total Features",
          data: { value: features.length, change: "+5%" },
          config: { color: "blue" }
        },
        {
          id: "widget-2",
          type: "chart",
          title: "Feature Status Distribution",
          data: [
            { name: 'Completed', value: features.filter(f => f.status === 'completed').length, color: '#10b981' },
            { name: 'In Progress', value: features.filter(f => f.status === 'in_progress').length, color: '#3b82f6' },
            { name: 'Planned', value: features.filter(f => f.status === 'planned').length, color: '#f59e0b' },
            { name: 'Backlog', value: features.filter(f => f.status === 'backlog').length, color: '#6b7280' }
          ],
          config: { type: "pie" }
        }
      ]
    },
    {
      id: "dash-2",
      name: "Team Performance",
      description: "Track team productivity and task completion",
      type: "performance",
      isPublic: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      widgets: [
        {
          id: "widget-3",
          type: "metric",
          title: "Tasks Completed",
          data: { value: tasks.filter(t => t.status === 'completed').length, change: "+12%" },
          config: { color: "green" }
        },
        {
          id: "widget-4",
          type: "chart",
          title: "Weekly Progress",
          data: [
            { name: 'Mon', tasks: 5, features: 2 },
            { name: 'Tue', tasks: 8, features: 3 },
            { name: 'Wed', tasks: 6, features: 1 },
            { name: 'Thu', tasks: 12, features: 4 },
            { name: 'Fri', tasks: 9, features: 2 }
          ],
          config: { type: "bar" }
        }
      ]
    }
  ]);

  const handleCreateDashboard = () => {
    if (!newDashboardName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a dashboard name",
        variant: "destructive"
      });
      return;
    }

    const newDashboard: Dashboard = {
      id: `dash-${Date.now()}`,
      name: newDashboardName,
      description: "New dashboard description",
      type: newDashboardType,
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      widgets: []
    };

    setDashboards(prev => [newDashboard, ...prev]);
    setNewDashboardName("");
    setShowCreateDialog(false);
    
    toast({
      title: "Dashboard created",
      description: `${newDashboardName} has been created successfully`
    });
  };

  const handleDeleteDashboard = (id: string) => {
    setDashboards(prev => prev.filter(d => d.id !== id));
    toast({
      title: "Dashboard deleted",
      description: "Dashboard has been deleted successfully"
    });
  };

  const handleTogglePublic = (id: string) => {
    setDashboards(prev => prev.map(d => 
      d.id === id 
        ? { ...d, isPublic: !d.isPublic, updatedAt: new Date().toISOString() }
        : d
    ));
    
    const dashboard = dashboards.find(d => d.id === id);
    toast({
      title: "Visibility updated",
      description: `Dashboard is now ${dashboard?.isPublic ? 'private' : 'public'}`
    });
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case "metric":
        return (
          <Card key={widget.id} className="p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{widget.data.value}</div>
                <Badge variant="outline" className="text-green-600">
                  {widget.data.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      
      case "chart":
        return (
          <Card key={widget.id} className="p-4">
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                {widget.config.type === "pie" ? (
                  <RechartsPieChart>
                    <Pie
                      data={widget.data}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {widget.data.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                ) : (
                  <BarChart data={widget.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tasks" fill="#3b82f6" />
                    <Bar dataKey="features" fill="#10b981" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  const getTypeIcon = (type: Dashboard["type"]) => {
    switch (type) {
      case "overview": return <BarChart3 className="h-4 w-4" />;
      case "analytics": return <TrendingUp className="h-4 w-4" />;
      case "performance": return <LineChart className="h-4 w-4" />;
      default: return <PieChart className="h-4 w-4" />;
    }
  };

  if (selectedDashboard) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Button 
              variant="outline" 
              onClick={() => setSelectedDashboard(null)}
              className="mb-4"
            >
              ← Back to Dashboards
            </Button>
            <h2 className="text-2xl font-bold">{selectedDashboard.name}</h2>
            <p className="text-muted-foreground">{selectedDashboard.description}</p>
          </div>
          <Badge variant={selectedDashboard.isPublic ? "default" : "secondary"}>
            {selectedDashboard.isPublic ? "Public" : "Private"}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedDashboard.widgets.map(renderWidget)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboards</h2>
          <p className="text-muted-foreground">Create and manage custom dashboards</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Dashboard
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Dashboard</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Dashboard Name</Label>
                <Input
                  id="name"
                  value={newDashboardName}
                  onChange={(e) => setNewDashboardName(e.target.value)}
                  placeholder="Enter dashboard name"
                />
              </div>
              <div>
                <Label htmlFor="type">Dashboard Type</Label>
                <Select value={newDashboardType} onValueChange={(value: Dashboard["type"]) => setNewDashboardType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateDashboard}>
                  Create Dashboard
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboards.map(dashboard => (
          <Card key={dashboard.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getTypeIcon(dashboard.type)}
                  <CardTitle className="text-lg">{dashboard.name}</CardTitle>
                </div>
                <Badge variant={dashboard.isPublic ? "default" : "secondary"}>
                  {dashboard.isPublic ? "Public" : "Private"}
                </Badge>
              </div>
              <CardDescription>{dashboard.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{dashboard.widgets.length} widgets</span>
                <span>Updated {new Date(dashboard.updatedAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedDashboard(dashboard)}
                  className="gap-1"
                >
                  <Eye className="h-3 w-3" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTogglePublic(dashboard.id)}
                  className="gap-1"
                >
                  {dashboard.isPublic ? "Make Private" : "Make Public"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteDashboard(dashboard.id)}
                  className="gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
