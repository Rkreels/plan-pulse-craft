
import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  LineChart,
  PieChart,
  Filter,
  Save,
  Plus,
  X,
  Download,
  Share2,
  Eye
} from "lucide-react";
import { BarChart, LineChart as RechartsLineChart, PieChart as RechartsPieChart, ComposedChart } from 'recharts';
import { Bar, Line, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";

interface ReportBuilderProps {
  reportId: string | null;
  onReportSaved?: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const ReportBuilder = ({ reportId, onReportSaved }: ReportBuilderProps) => {
  const { features, releases, epics } = useAppContext();
  
  const [reportName, setReportName] = useState("New Report");
  const [reportDescription, setReportDescription] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [dataSource, setDataSource] = useState("features");
  const [timeFrame, setTimeFrame] = useState("quarterly");
  const [filters, setFilters] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["count"]);
  const [groupBy, setGroupBy] = useState("status");
  const [showPreview, setShowPreview] = useState(true);

  // Dynamic data generation based on selected options
  const generateData = () => {
    if (dataSource === "features") {
      if (groupBy === "status") {
        return [
          { name: 'Idea', count: features.filter(f => f.status === 'idea').length, value: features.filter(f => f.status === 'idea').length },
          { name: 'Backlog', count: features.filter(f => f.status === 'backlog').length, value: features.filter(f => f.status === 'backlog').length },
          { name: 'Planned', count: features.filter(f => f.status === 'planned').length, value: features.filter(f => f.status === 'planned').length },
          { name: 'In Progress', count: features.filter(f => f.status === 'in_progress').length, value: features.filter(f => f.status === 'in_progress').length },
          { name: 'Review', count: features.filter(f => f.status === 'review').length, value: features.filter(f => f.status === 'review').length },
          { name: 'Completed', count: features.filter(f => f.status === 'completed').length, value: features.filter(f => f.status === 'completed').length },
        ];
      } else if (groupBy === "priority") {
        return [
          { name: 'Critical', count: features.filter(f => f.priority === 'critical').length, value: features.filter(f => f.priority === 'critical').length },
          { name: 'High', count: features.filter(f => f.priority === 'high').length, value: features.filter(f => f.priority === 'high').length },
          { name: 'Medium', count: features.filter(f => f.priority === 'medium').length, value: features.filter(f => f.priority === 'medium').length },
          { name: 'Low', count: features.filter(f => f.priority === 'low').length, value: features.filter(f => f.priority === 'low').length },
        ];
      }
    } else if (dataSource === "releases") {
      return releases.map(release => ({
        name: release.name,
        count: release.features.length,
        value: release.features.length,
        completed: release.features.filter(fId => {
          const feature = features.find(f => f.id === fId);
          return feature?.status === 'completed';
        }).length
      }));
    } else if (dataSource === "epics") {
      return epics.map(epic => ({
        name: epic.title.length > 15 ? `${epic.title.substring(0, 15)}...` : epic.title,
        count: epic.features.length,
        value: epic.features.length,
        progress: epic.progress
      }));
    }
    
    return [];
  };

  const addFilter = () => {
    setFilters([...filters, ""]);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, value: string) => {
    const newFilters = [...filters];
    newFilters[index] = value;
    setFilters(newFilters);
  };

  const toggleMetric = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  const saveReport = () => {
    // In a real app, this would save to backend
    toast.success(`Report "${reportName}" saved successfully!`);
    onReportSaved?.();
  };

  const exportReport = () => {
    toast.success("Report exported successfully!");
  };

  const shareReport = () => {
    toast.success("Report link copied to clipboard!");
  };

  const renderChart = () => {
    const data = generateData();
    
    if (!data.length) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No data available for selected configuration
        </div>
      );
    }

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedMetrics.includes("count") && <Bar dataKey="count" fill="#8884d8" name="Count" />}
              {selectedMetrics.includes("completed") && <Bar dataKey="completed" fill="#82ca9d" name="Completed" />}
              {selectedMetrics.includes("progress") && <Bar dataKey="progress" fill="#ffc658" name="Progress %" />}
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedMetrics.includes("count") && <Line type="monotone" dataKey="count" stroke="#8884d8" name="Count" />}
              {selectedMetrics.includes("progress") && <Line type="monotone" dataKey="progress" stroke="#82ca9d" name="Progress %" />}
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Report Configuration</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Basic Settings</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="report-name">Report Name</Label>
                  <Input
                    id="report-name"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-description">Description</Label>
                  <Textarea
                    id="report-description"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Data Configuration */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Data Configuration</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="data-source">Data Source</Label>
                  <Select value={dataSource} onValueChange={setDataSource}>
                    <SelectTrigger id="data-source">
                      <SelectValue placeholder="Select data source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="features">Features</SelectItem>
                      <SelectItem value="releases">Releases</SelectItem>
                      <SelectItem value="epics">Epics</SelectItem>
                      <SelectItem value="goals">Goals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group-by">Group By</Label>
                  <Select value={groupBy} onValueChange={setGroupBy}>
                    <SelectTrigger id="group-by">
                      <SelectValue placeholder="Group by field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="assignee">Assignee</SelectItem>
                      <SelectItem value="release">Release</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time-frame">Time Frame</Label>
                  <Select value={timeFrame} onValueChange={setTimeFrame}>
                    <SelectTrigger id="time-frame">
                      <SelectValue placeholder="Select time frame" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Visualization Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Visualization</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="chart-type">Chart Type</Label>
                  <Select value={chartType} onValueChange={setChartType}>
                    <SelectTrigger id="chart-type">
                      <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                      <SelectItem value="area">Area Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Metrics to Display</Label>
                  <div className="space-y-2">
                    {['count', 'completed', 'progress'].map((metric) => (
                      <div key={metric} className="flex items-center space-x-2">
                        <Checkbox
                          id={metric}
                          checked={selectedMetrics.includes(metric)}
                          onCheckedChange={() => toggleMetric(metric)}
                        />
                        <Label htmlFor={metric} className="text-sm capitalize">
                          {metric === 'count' ? 'Item Count' : metric}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <Label>Filters</Label>
              <Button variant="outline" size="sm" onClick={addFilter}>
                <Plus className="h-4 w-4 mr-2" />
                Add Filter
              </Button>
            </div>
            {filters.map((filter, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Filter condition..."
                  value={filter}
                  onChange={(e) => updateFilter(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFilter(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={shareReport}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button onClick={saveReport}>
              <Save className="h-4 w-4 mr-2" />
              Save Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Report Preview</span>
              <div className="flex gap-2">
                <Badge variant="outline">{chartType}</Badge>
                <Badge variant="outline">{dataSource}</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-6">
              {renderChart()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
