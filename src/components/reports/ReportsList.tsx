
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, FileText, Download, Edit, Trash2, Plus, Search, Filter, Calendar, BarChart3 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/AppContext";

interface Report {
  id: string;
  name: string;
  type: "features" | "feedback" | "goals" | "analytics" | "custom";
  status: "active" | "draft" | "archived";
  lastModified: string;
  createdBy: string;
  description: string;
  schedule: "manual" | "daily" | "weekly" | "monthly";
  metrics: string[];
  filters: string[];
  data?: any;
}

interface ReportsListProps {
  onSelectReport: (id: string) => void;
  refreshTrigger: number;
}

export const ReportsList = ({ onSelectReport, refreshTrigger }: ReportsListProps) => {
  const { features, feedback, goals, currentUser } = useAppContext();
  
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      name: "Feature Progress Report",
      type: "features",
      status: "active",
      lastModified: new Date().toISOString(),
      createdBy: currentUser?.name || "Product Manager",
      description: "Comprehensive report on feature development progress",
      schedule: "weekly",
      metrics: ["Total Features", "Completed Features", "Feature Velocity"],
      filters: ["Status", "Priority"],
      data: features
    },
    {
      id: "2", 
      name: "Customer Feedback Analysis",
      type: "feedback",
      status: "active",
      lastModified: new Date(Date.now() - 86400000).toISOString(),
      createdBy: currentUser?.name || "Customer Success",
      description: "Analysis of customer feedback trends and patterns",
      schedule: "daily",
      metrics: ["Total Feedback", "Positive Feedback", "Response Rate"],
      filters: ["Source", "Category", "Rating"],
      data: feedback
    },
    {
      id: "3",
      name: "Goal Achievement Report",
      type: "goals", 
      status: "draft",
      lastModified: new Date(Date.now() - 259200000).toISOString(),
      createdBy: currentUser?.name || "Team Lead",
      description: "Quarterly goal achievement and performance metrics",
      schedule: "monthly",
      metrics: ["Goals Achieved", "Goal Success Rate"],
      filters: ["Status", "Owner", "Timeline"],
      data: goals
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);

  const [newReport, setNewReport] = useState({
    name: "",
    description: "",
    type: "features" as Report["type"],
    schedule: "manual" as Report["schedule"],
    metrics: [] as string[],
    filters: [] as string[]
  });

  const filteredReports = reports.filter(report => {
    const matchesSearch = !searchQuery || 
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateReport = () => {
    if (!newReport.name || !newReport.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const report: Report = {
      id: Date.now().toString(),
      ...newReport,
      status: "draft",
      lastModified: new Date().toISOString(),
      createdBy: currentUser?.name || "Current User",
      data: []
    };
    
    setReports(prev => [report, ...prev]);
    setNewReport({
      name: "",
      description: "",
      type: "features",
      schedule: "manual",
      metrics: [],
      filters: []
    });
    setShowCreateDialog(false);
    toast.success("Report created successfully");
  };

  const handleEditReport = (report: Report) => {
    setEditingReport(report);
    setShowEditDialog(true);
  };

  const handleUpdateReport = () => {
    if (!editingReport) return;

    setReports(prev => prev.map(r => 
      r.id === editingReport.id 
        ? { ...editingReport, lastModified: new Date().toISOString() }
        : r
    ));
    setShowEditDialog(false);
    setEditingReport(null);
    toast.success("Report updated successfully");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      setReports(prev => prev.filter(r => r.id !== id));
      toast.success("Report deleted successfully");
    }
  };

  const handleDuplicate = (report: Report) => {
    const duplicatedReport: Report = {
      ...report,
      id: Date.now().toString(),
      name: `${report.name} (Copy)`,
      status: "draft",
      lastModified: new Date().toISOString(),
      createdBy: currentUser?.name || "Current User"
    };
    
    setReports(prev => [duplicatedReport, ...prev]);
    toast.success("Report duplicated successfully");
  };

  const handleDownload = (report: Report) => {
    const reportData = {
      ...report,
      generatedAt: new Date().toISOString(),
      dataSnapshot: report.data || []
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${report.name.replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success(`Report "${report.name}" downloaded successfully`);
  };

  const handleStatusChange = (reportId: string, newStatus: Report["status"]) => {
    setReports(prev => prev.map(r => 
      r.id === reportId 
        ? { ...r, status: newStatus, lastModified: new Date().toISOString() }
        : r
    ));
    
    toast.success(`Report status changed to ${newStatus}`);
  };

  const handleRunReport = (report: Report) => {
    // Simulate running the report
    const updatedReport = {
      ...report,
      lastModified: new Date().toISOString(),
      status: "active" as const
    };
    
    setReports(prev => prev.map(r => r.id === report.id ? updatedReport : r));
    toast.success(`Report "${report.name}" has been generated`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "features": return "bg-blue-100 text-blue-800";
      case "feedback": return "bg-purple-100 text-purple-800";
      case "goals": return "bg-orange-100 text-orange-800";
      case "analytics": return "bg-teal-100 text-teal-800";
      case "custom": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "features": return <BarChart3 className="h-4 w-4" />;
      case "feedback": return <FileText className="h-4 w-4" />;
      case "goals": return <Calendar className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const availableMetrics = {
    features: ["Total Features", "Completed Features", "In Progress", "Feature Velocity", "Bug Count"],
    feedback: ["Total Feedback", "Positive Feedback", "Negative Feedback", "Response Rate", "Resolution Time"],
    goals: ["Goals Achieved", "Goals In Progress", "Goal Success Rate", "Time to Achievement", "Completion Rate"],
    analytics: ["Page Views", "User Engagement", "Conversion Rate", "Retention Rate", "Session Duration"],
    custom: ["Custom Metric 1", "Custom Metric 2", "Custom Metric 3"]
  };

  const availableFilters = {
    features: ["Status", "Priority", "Assigned Team", "Due Date", "Epic"],
    feedback: ["Source", "Category", "Rating", "Date Range", "Customer Segment"],
    goals: ["Status", "Owner", "Timeline", "Category", "Priority"],
    analytics: ["Date Range", "User Segment", "Platform", "Geography", "Device Type"],
    custom: ["Custom Filter 1", "Custom Filter 2", "Custom Filter 3"]
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Reports Management</CardTitle>
              <CardDescription>Create, manage, and analyze your custom reports</CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="features">Features</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="goals">Goals</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map(report => (
                <TableRow key={report.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell onClick={() => onSelectReport(report.id)}>
                    <div className="flex items-start gap-3">
                      {getTypeIcon(report.type)}
                      <div>
                        <div className="font-medium">{report.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">{report.description}</div>
                        <div className="flex gap-2 mt-1">
                          {report.metrics.slice(0, 2).map(metric => (
                            <Badge key={metric} variant="outline" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                          {report.metrics.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{report.metrics.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(report.type)}>{report.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Badge className={`${getStatusColor(report.status)} cursor-pointer`}>
                          {report.status}
                        </Badge>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleStatusChange(report.id, "active")}>
                          Active
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(report.id, "draft")}>
                          Draft
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(report.id, "archived")}>
                          Archived
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.schedule}</Badge>
                  </TableCell>
                  <TableCell>{new Date(report.lastModified).toLocaleString()}</TableCell>
                  <TableCell>{report.createdBy}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSelectReport(report.id)}>
                          <FileText className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditReport(report)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRunReport(report)}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Run Report
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(report)}>
                          <FileText className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(report)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(report.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredReports.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No reports found</h3>
              <p className="text-muted-foreground">
                {searchQuery || typeFilter !== "all" || statusFilter !== "all" 
                  ? "Try adjusting your filters"
                  : "Create your first report to get started"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Report Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
            <DialogDescription>
              Set up a new report to track your key metrics and insights.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Name</label>
                <Input
                  value={newReport.name}
                  onChange={(e) => setNewReport(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter report name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select 
                  value={newReport.type} 
                  onValueChange={(value: any) => setNewReport(prev => ({ ...prev, type: value, metrics: [], filters: [] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="features">Features Report</SelectItem>
                    <SelectItem value="feedback">Feedback Report</SelectItem>
                    <SelectItem value="goals">Goals Report</SelectItem>
                    <SelectItem value="analytics">Analytics Report</SelectItem>
                    <SelectItem value="custom">Custom Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newReport.description}
                onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this report will analyze"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Schedule</label>
              <Select 
                value={newReport.schedule} 
                onValueChange={(value: any) => setNewReport(prev => ({ ...prev, schedule: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Key Metrics</label>
              <div className="flex flex-wrap gap-2">
                {availableMetrics[newReport.type]?.map(metric => (
                  <Button
                    key={metric}
                    variant={newReport.metrics.includes(metric) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setNewReport(prev => ({
                        ...prev,
                        metrics: prev.metrics.includes(metric)
                          ? prev.metrics.filter(m => m !== metric)
                          : [...prev.metrics, metric]
                      }));
                    }}
                  >
                    {metric}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateReport}>Create Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Report Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Report</DialogTitle>
            <DialogDescription>
              Update your report configuration and settings.
            </DialogDescription>
          </DialogHeader>
          {editingReport && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Name</label>
                  <Input
                    value={editingReport.name}
                    onChange={(e) => setEditingReport(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                    placeholder="Enter report name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Schedule</label>
                  <Select 
                    value={editingReport.schedule} 
                    onValueChange={(value: any) => setEditingReport(prev => prev ? ({ ...prev, schedule: value }) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingReport.description}
                  onChange={(e) => setEditingReport(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  placeholder="Describe what this report will analyze"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Key Metrics</label>
                <div className="flex flex-wrap gap-2">
                  {availableMetrics[editingReport.type]?.map(metric => (
                    <Button
                      key={metric}
                      variant={editingReport.metrics.includes(metric) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setEditingReport(prev => prev ? ({
                          ...prev,
                          metrics: prev.metrics.includes(metric)
                            ? prev.metrics.filter(m => m !== metric)
                            : [...prev.metrics, metric]
                        }) : null);
                      }}
                    >
                      {metric}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateReport}>Update Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
