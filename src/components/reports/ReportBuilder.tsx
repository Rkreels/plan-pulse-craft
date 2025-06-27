
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2 } from "lucide-react";

interface ReportBuilderProps {
  reportId: string | null;
  onReportSaved: () => void;
}

export const ReportBuilder = ({ reportId, onReportSaved }: ReportBuilderProps) => {
  const { toast } = useToast();
  const [reportData, setReportData] = useState({
    name: "",
    description: "",
    type: "features",
    dataSource: "features",
    filters: [] as string[],
    metrics: [] as string[],
    schedule: "manual"
  });

  const availableMetrics = {
    features: ["Total Features", "Completed Features", "In Progress", "Feature Velocity"],
    feedback: ["Total Feedback", "Positive Feedback", "Negative Feedback", "Response Rate"],
    goals: ["Goals Achieved", "Goals In Progress", "Goal Success Rate", "Time to Achievement"],
    analytics: ["Page Views", "User Engagement", "Conversion Rate", "Retention Rate"]
  };

  const availableFilters = {
    features: ["Status", "Priority", "Assigned Team", "Due Date"],
    feedback: ["Source", "Category", "Rating", "Date Range"],
    goals: ["Status", "Owner", "Timeline", "Category"],
    analytics: ["Date Range", "User Segment", "Platform", "Geography"]
  };

  const handleSave = () => {
    if (!reportData.name || !reportData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Report saved",
      description: "Your report has been saved successfully"
    });
    onReportSaved();
  };

  const addMetric = (metric: string) => {
    if (!reportData.metrics.includes(metric)) {
      setReportData(prev => ({
        ...prev,
        metrics: [...prev.metrics, metric]
      }));
    }
  };

  const removeMetric = (metric: string) => {
    setReportData(prev => ({
      ...prev,
      metrics: prev.metrics.filter(m => m !== metric)
    }));
  };

  const addFilter = (filter: string) => {
    if (!reportData.filters.includes(filter)) {
      setReportData(prev => ({
        ...prev,
        filters: [...prev.filters, filter]
      }));
    }
  };

  const removeFilter = (filter: string) => {
    setReportData(prev => ({
      ...prev,
      filters: prev.filters.filter(f => f !== filter)
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Builder</CardTitle>
          <CardDescription>Create custom reports with specific metrics and filters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Report Name</Label>
              <Input
                id="name"
                value={reportData.name}
                onChange={(e) => setReportData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter report name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Report Type</Label>
              <Select value={reportData.type} onValueChange={(value) => setReportData(prev => ({ ...prev, type: value, dataSource: value, metrics: [], filters: [] }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="features">Features Report</SelectItem>
                  <SelectItem value="feedback">Feedback Report</SelectItem>
                  <SelectItem value="goals">Goals Report</SelectItem>
                  <SelectItem value="analytics">Analytics Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={reportData.description}
              onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this report will show"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label>Metrics to Include</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {reportData.metrics.map(metric => (
                  <Badge key={metric} variant="secondary" className="gap-1">
                    {metric}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeMetric(metric)}
                      className="h-4 w-4 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableMetrics[reportData.type as keyof typeof availableMetrics]?.map(metric => (
                  <Button
                    key={metric}
                    variant="outline"
                    size="sm"
                    onClick={() => addMetric(metric)}
                    disabled={reportData.metrics.includes(metric)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {metric}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Filters</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {reportData.filters.map(filter => (
                  <Badge key={filter} variant="outline" className="gap-1">
                    {filter}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeFilter(filter)}
                      className="h-4 w-4 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableFilters[reportData.type as keyof typeof availableFilters]?.map(filter => (
                  <Button
                    key={filter}
                    variant="outline"
                    size="sm"
                    onClick={() => addFilter(filter)}
                    disabled={reportData.filters.includes(filter)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {filter}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Select value={reportData.schedule} onValueChange={(value) => setReportData(prev => ({ ...prev, schedule: value }))}>
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

          <div className="flex gap-2">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Report
            </Button>
            <Button variant="outline">Preview</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
