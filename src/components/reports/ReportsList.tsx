
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
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
  Share2 
} from "lucide-react";

interface ReportsListProps {
  onSelectReport: (id: string) => void;
}

export const ReportsList = ({ onSelectReport }: ReportsListProps) => {
  const [reports, setReports] = useState([
    {
      id: "rep1",
      name: "Feature Completion Analysis",
      description: "Tracks feature completion rates across releases",
      type: "bar",
      lastModified: "2 days ago",
      shared: true
    },
    {
      id: "rep2",
      name: "Roadmap Progress",
      description: "Overview of roadmap item status and progress",
      type: "line",
      lastModified: "1 week ago",
      shared: false
    },
    {
      id: "rep3",
      name: "Feature Categorization",
      description: "Distribution of features by category",
      type: "pie",
      lastModified: "3 days ago",
      shared: true
    }
  ]);

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Reports</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map(report => (
          <Card key={report.id} className="cursor-pointer hover:border-primary transition-colors" 
            onClick={() => onSelectReport(report.id)}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg">{report.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" /> Export
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="h-4 w-4 mr-2" /> Share
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getReportIcon(report.type)}
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Last modified: {report.lastModified}</p>
                    {report.shared && <Badge variant="outline">Shared</Badge>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
