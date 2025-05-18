
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { useAppContext } from "@/contexts/AppContext";
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
  BarChart as BarChartIcon, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon,
  Plus,
  Settings,
  Share2,
  Copy,
  Grid,
  Pencil,
  Save,
  Trash2,
  MoveHorizontal
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { EmptyState } from "@/components/common/EmptyState";

// Example dashboard definition
interface Dashboard {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  layout: DashboardWidget[];
  createdAt: Date;
  updatedAt: Date;
}

interface DashboardWidget {
  id: string;
  type: 'card' | 'chart' | 'table' | 'list';
  title: string;
  dataSource: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  config: Record<string, any>;
}

// Sample dashboards
const sampleDashboards: Dashboard[] = [
  {
    id: 'dash-1',
    name: 'Product Overview',
    description: 'General product metrics and status',
    isDefault: true,
    layout: [
      {
        id: 'widget-1',
        type: 'card',
        title: 'Feature Count',
        dataSource: 'features',
        size: 'small',
        position: { x: 0, y: 0 },
        config: { displayType: 'number' }
      },
      {
        id: 'widget-2',
        type: 'chart',
        title: 'Features by Status',
        dataSource: 'features',
        size: 'medium',
        position: { x: 1, y: 0 },
        config: { chartType: 'pie' }
      },
      {
        id: 'widget-3',
        type: 'table',
        title: 'Recent Features',
        dataSource: 'features',
        size: 'large',
        position: { x: 0, y: 1 },
        config: { limit: 5 }
      }
    ],
    createdAt: new Date(2025, 3, 15),
    updatedAt: new Date(2025, 4, 10)
  },
  {
    id: 'dash-2',
    name: 'Release Planning',
    description: 'Upcoming releases and feature status',
    isDefault: false,
    layout: [
      {
        id: 'widget-4',
        type: 'card',
        title: 'Upcoming Releases',
        dataSource: 'releases',
        size: 'small',
        position: { x: 0, y: 0 },
        config: { displayType: 'number' }
      },
      {
        id: 'widget-5',
        type: 'chart',
        title: 'Release Timeline',
        dataSource: 'releases',
        size: 'large',
        position: { x: 0, y: 1 },
        config: { chartType: 'timeline' }
      }
    ],
    createdAt: new Date(2025, 3, 20),
    updatedAt: new Date(2025, 4, 12)
  }
];

const Dashboards = () => {
  const { features, releases } = useAppContext();
  const [dashboards, setDashboards] = useState<Dashboard[]>(sampleDashboards);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(dashboards.find(d => d.isDefault) || dashboards[0] || null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isWidgetDialogOpen, setIsWidgetDialogOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");
  const [newDashboardDescription, setNewDashboardDescription] = useState("");
  
  const handleCreateDashboard = () => {
    if (!newDashboardName.trim()) {
      toast.error("Dashboard name is required");
      return;
    }
    
    const newDashboard: Dashboard = {
      id: `dash-${Date.now()}`,
      name: newDashboardName,
      description: newDashboardDescription,
      isDefault: false,
      layout: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setDashboards([...dashboards, newDashboard]);
    setSelectedDashboard(newDashboard);
    setIsAddDialogOpen(false);
    setNewDashboardName("");
    setNewDashboardDescription("");
    toast.success("Dashboard created");
  };

  const handleAddWidget = () => {
    if (!selectedDashboard) return;
    
    toast.success("Widget added to dashboard");
    setIsWidgetDialogOpen(false);
  };

  const handleDeleteDashboard = (id: string) => {
    if (window.confirm("Are you sure you want to delete this dashboard?")) {
      const newDashboards = dashboards.filter(d => d.id !== id);
      setDashboards(newDashboards);
      
      if (selectedDashboard?.id === id) {
        setSelectedDashboard(newDashboards[0] || null);
      }
      
      toast.success("Dashboard deleted");
    }
  };

  const handleSetAsDefault = (id: string) => {
    setDashboards(dashboards.map(d => ({
      ...d,
      isDefault: d.id === id
    })));
    toast.success("Default dashboard updated");
  };

  const handleSaveLayout = () => {
    setIsEditMode(false);
    toast.success("Dashboard layout saved");
  };

  return (
    <>
      <PageTitle
        title="Custom Dashboards"
        description="Create and customize your product dashboards"
        action={{
          label: "New Dashboard",
          icon: <Plus className="h-4 w-4" />,
          onClick: () => setIsAddDialogOpen(true)
        }}
      />

      <div className="space-y-6">
        {/* Dashboard selection and actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Select 
            value={selectedDashboard?.id || ""} 
            onValueChange={(value) => setSelectedDashboard(dashboards.find(d => d.id === value) || null)}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select dashboard" />
            </SelectTrigger>
            <SelectContent>
              {dashboards.map(dashboard => (
                <SelectItem key={dashboard.id} value={dashboard.id}>
                  {dashboard.name} {dashboard.isDefault && "(Default)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedDashboard && (
            <div className="flex items-center gap-2">
              {isEditMode ? (
                <>
                  <Button variant="outline" onClick={() => setIsWidgetDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Widget
                  </Button>
                  <Button onClick={handleSaveLayout}>
                    <Save className="h-4 w-4 mr-2" /> Save Layout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditMode(true)}>
                    <Pencil className="h-4 w-4 mr-2" /> Edit Layout
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" /> Dashboard Settings
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" /> Share
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      {!selectedDashboard.isDefault && (
                        <DropdownMenuItem onClick={() => handleSetAsDefault(selectedDashboard.id)}>
                          <Save className="h-4 w-4 mr-2" /> Set as Default
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteDashboard(selectedDashboard.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          )}
        </div>

        {/* Dashboard content */}
        {selectedDashboard ? (
          <div className="space-y-4">
            {selectedDashboard.description && (
              <p className="text-sm text-muted-foreground">{selectedDashboard.description}</p>
            )}
            
            {isEditMode && (
              <div className="bg-muted/50 border border-dashed rounded-md p-3 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MoveHorizontal className="h-4 w-4 mr-2" />
                  <span>Edit mode: Drag widgets to rearrange. Resize widgets using the handles.</span>
                </div>
              </div>
            )}
            
            {selectedDashboard.layout.length === 0 ? (
              <EmptyState
                title="Empty Dashboard"
                description="Add widgets to this dashboard to start visualizing your data"
                icon={<Grid className="h-10 w-10 text-muted-foreground" />}
                action={{
                  label: "Add Widget",
                  onClick: () => setIsWidgetDialogOpen(true)
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedDashboard.layout.map(widget => (
                  <Card key={widget.id} className={`${
                    widget.size === 'large' ? 'col-span-full' : 
                    widget.size === 'medium' ? 'md:col-span-2' : ''
                  } ${isEditMode ? 'border-dashed cursor-move' : ''}`}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base">{widget.title}</CardTitle>
                      {isEditMode && (
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="px-6 py-4">
                      {widget.type === 'card' && (
                        <div className="text-center">
                          <div className="text-4xl font-bold">
                            {widget.dataSource === 'features' ? features.length : releases.length}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {widget.dataSource === 'features' ? 'Features' : 'Releases'}
                          </p>
                        </div>
                      )}
                      {widget.type === 'chart' && (
                        <div className="h-[200px] flex items-center justify-center">
                          {widget.config.chartType === 'pie' ? (
                            <PieChartIcon className="h-20 w-20 text-muted-foreground" />
                          ) : widget.config.chartType === 'bar' ? (
                            <BarChartIcon className="h-20 w-20 text-muted-foreground" />
                          ) : (
                            <LineChartIcon className="h-20 w-20 text-muted-foreground" />
                          )}
                        </div>
                      )}
                      {widget.type === 'table' && (
                        <div className="text-center text-muted-foreground">
                          Table widget - would display actual data in a real implementation
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            title="No Dashboards"
            description="Create your first dashboard to visualize your product data"
            icon={<BarChartIcon className="h-10 w-10 text-muted-foreground" />}
            action={{
              label: "Create Dashboard",
              onClick: () => setIsAddDialogOpen(true)
            }}
          />
        )}
      </div>

      {/* Create Dashboard Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle>Create New Dashboard</DialogTitle>
            <DialogDescription>
              Create a custom dashboard to visualize your product data.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Dashboard Name</Label>
              <Input
                id="name"
                value={newDashboardName}
                onChange={(e) => setNewDashboardName(e.target.value)}
                placeholder="Executive Summary"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={newDashboardDescription}
                onChange={(e) => setNewDashboardDescription(e.target.value)}
                placeholder="High-level metrics for executives"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="default" />
              <Label htmlFor="default">Set as default dashboard</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateDashboard}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Widget Dialog */}
      <Dialog open={isWidgetDialogOpen} onOpenChange={setIsWidgetDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Widget</DialogTitle>
            <DialogDescription>
              Add a new widget to your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="widget-title">Title</Label>
              <Input id="widget-title" placeholder="Feature Status" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="widget-type">Widget Type</Label>
              <Select defaultValue="chart">
                <SelectTrigger>
                  <SelectValue placeholder="Select widget type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Metric Card</SelectItem>
                  <SelectItem value="chart">Chart</SelectItem>
                  <SelectItem value="table">Table</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="data-source">Data Source</Label>
              <Select defaultValue="features">
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="features">Features</SelectItem>
                  <SelectItem value="releases">Releases</SelectItem>
                  <SelectItem value="epics">Epics</SelectItem>
                  <SelectItem value="goals">Goals</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="widget-size">Widget Size</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue placeholder="Select widget size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (1x1)</SelectItem>
                  <SelectItem value="medium">Medium (2x1)</SelectItem>
                  <SelectItem value="large">Large (3x1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWidgetDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddWidget}>Add Widget</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboards;
