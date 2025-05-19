
import { useState } from "react";
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
import {
  BarChart3,
  LineChart,
  PieChart,
  Filter,
  Save
} from "lucide-react";
import { BarChart, LineChart as RechartsLineChart, PieChart as RechartsPieChart, ComposedChart } from 'recharts';
import { Bar, Line, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportBuilderProps {
  reportId: string | null;
}

const MOCK_DATA = [
  { name: 'Q1', features: 12, bugs: 18, completionRate: 75 },
  { name: 'Q2', features: 19, bugs: 13, completionRate: 80 },
  { name: 'Q3', features: 15, bugs: 15, completionRate: 65 },
  { name: 'Q4', features: 21, bugs: 7, completionRate: 90 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const ReportBuilder = ({ reportId }: ReportBuilderProps) => {
  const [reportName, setReportName] = useState("New Report");
  const [reportDescription, setReportDescription] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [dataSource, setDataSource] = useState("features");
  const [timeFrame, setTimeFrame] = useState("quarterly");

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={MOCK_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="features" fill="#8884d8" />
              <Bar dataKey="bugs" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart data={MOCK_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completionRate" stroke="#8884d8" activeDot={{ r: 8 }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <Pie
                data={MOCK_DATA}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={130}
                fill="#8884d8"
                dataKey="features"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {MOCK_DATA.map((entry, index) => (
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
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
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
                />
              </div>
            </div>
            <div className="space-y-4">
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
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-source">Data Source</Label>
                <Select value={dataSource} onValueChange={setDataSource}>
                  <SelectTrigger id="data-source">
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="features">Features</SelectItem>
                    <SelectItem value="releases">Releases</SelectItem>
                    <SelectItem value="goals">Goals</SelectItem>
                    <SelectItem value="feedback">Customer Feedback</SelectItem>
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
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Add Filter
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6">
            {renderChart()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
