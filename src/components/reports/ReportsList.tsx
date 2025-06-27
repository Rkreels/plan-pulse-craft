
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, FileText, Download, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: string;
  name: string;
  type: "features" | "feedback" | "goals" | "analytics";
  status: "active" | "draft" | "archived";
  lastModified: string;
  createdBy: string;
  description: string;
}

interface ReportsListProps {
  onSelectReport: (id: string) => void;
  refreshTrigger: number;
}

export const ReportsList = ({ onSelectReport, refreshTrigger }: ReportsListProps) => {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      name: "Monthly Feature Progress",
      type: "features",
      status: "active",
      lastModified: "2 hours ago",
      createdBy: "John Doe",
      description: "Comprehensive report on feature development progress"
    },
    {
      id: "2", 
      name: "Customer Feedback Analysis",
      type: "feedback",
      status: "active",
      lastModified: "1 day ago",
      createdBy: "Sarah Smith",
      description: "Analysis of customer feedback trends and patterns"
    },
    {
      id: "3",
      name: "Goal Achievement Report",
      type: "goals", 
      status: "draft",
      lastModified: "3 days ago",
      createdBy: "Mike Johnson",
      description: "Quarterly goal achievement and performance metrics"
    }
  ]);

  const handleDelete = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Report deleted",
      description: "The report has been successfully deleted."
    });
  };

  const handleDownload = (report: Report) => {
    toast({
      title: "Download started",
      description: `Downloading ${report.name}...`
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
        <CardTitle>My Reports</CardTitle>
        <CardDescription>Manage and view your custom reports</CardDescription>
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
                  <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                </TableCell>
                <TableCell>{report.lastModified}</TableCell>
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
