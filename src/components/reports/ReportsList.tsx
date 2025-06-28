
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, FileText, Download, Edit, Trash2, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";

interface Report {
  id: string;
  name: string;
  type: "features" | "feedback" | "goals" | "analytics";
  status: "active" | "draft" | "archived";
  lastModified: string;
  createdBy: string;
  description: string;
  data?: any;
}

interface ReportsListProps {
  onSelectReport: (id: string) => void;
  refreshTrigger: number;
}

export const ReportsList = ({ onSelectReport, refreshTrigger }: ReportsListProps) => {
  const { toast } = useToast();
  const { features, feedback, goals, currentUser } = useAppContext();
  
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      name: "Feature Progress Report",
      type: "features",
      status: "active",
      lastModified: new Date().toISOString(),
      createdBy: currentUser?.name || "Unknown",
      description: "Comprehensive report on feature development progress",
      data: features
    },
    {
      id: "2", 
      name: "Customer Feedback Analysis",
      type: "feedback",
      status: "active",
      lastModified: new Date(Date.now() - 86400000).toISOString(),
      createdBy: currentUser?.name || "Unknown",
      description: "Analysis of customer feedback trends and patterns",
      data: feedback
    },
    {
      id: "3",
      name: "Goal Achievement Report",
      type: "goals", 
      status: "draft",
      lastModified: new Date(Date.now() - 259200000).toISOString(),
      createdBy: currentUser?.name || "Unknown",
      description: "Quarterly goal achievement and performance metrics",
      data: goals
    }
  ]);

  const handleCreateReport = () => {
    const newReport: Report = {
      id: `report-${Date.now()}`,
      name: `New Report ${reports.length + 1}`,
      type: "features",
      status: "draft",
      lastModified: new Date().toISOString(),
      createdBy: currentUser?.name || "Unknown",
      description: "New report description",
      data: []
    };
    
    setReports(prev => [newReport, ...prev]);
    toast({
      title: "Report created",
      description: "New report has been created successfully."
    });
  };

  const handleDelete = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Report deleted",
      description: "The report has been successfully deleted."
    });
  };

  const handleDownload = (report: Report) => {
    const dataStr = JSON.stringify(report.data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${report.name.replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Download started",
      description: `Downloading ${report.name}...`
    });
  };

  const handleStatusChange = (reportId: string, newStatus: Report["status"]) => {
    setReports(prev => prev.map(r => 
      r.id === reportId 
        ? { ...r, status: newStatus, lastModified: new Date().toISOString() }
        : r
    ));
    
    toast({
      title: "Status updated",
      description: `Report status changed to ${newStatus}`
    });
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
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>My Reports</CardTitle>
            <CardDescription>Manage and view your custom reports</CardDescription>
          </div>
          <Button onClick={handleCreateReport} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map(report => (
              <TableRow key={report.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell onClick={() => onSelectReport(report.id)}>
                  <div>
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-muted-foreground">{report.description}</div>
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
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
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
      </CardContent>
    </Card>
  );
};
