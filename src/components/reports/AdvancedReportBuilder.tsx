import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { 
  Save, 
  Plus, 
  Trash2, 
  Eye, 
  Calendar as CalendarIcon, 
  Filter,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  Database
} from "lucide-react";
import { format } from "date-fns";

interface AdvancedReportBuilderProps {
  reportId?: string | null;
  onReportSaved: () => void;
  onPreview?: (reportConfig: any) => void;
}

export const AdvancedReportBuilder = ({ reportId, onReportSaved, onPreview }: AdvancedReportBuilderProps) => {
  const [reportConfig, setReportConfig] = useState({
    name: "",
    description: "",
    type: "features",
    dataSource: "features",
    dateRange: {
      start: undefined as Date | undefined,
      end: undefined as Date | undefined
    },
    filters: {
      status: [] as string[],
      priority: [] as string[],
      assignee: [] as string[],
      tags: [] as string[],
      customFilters: [] as Array<{
        field: string;
        operator: string;
        value: string;
      }>
    },
    metrics: [] as string[],
    groupBy: "status",
    sortBy: "createdAt",
    sortOrder: "desc",
    visualizations: [] as string[],
    schedule: {
      enabled: false,
      frequency: "weekly",
      recipients: [] as string[]
    },
    advanced: {
      includeSubItems: false,
      includeDependencies: false,
      calculateTrends: false,
      enableDrillDown: false
    }
  });

  const [newCustomFilter, setNewCustomFilter] = useState({
    field: "",
    operator: "equals",
    value: ""
  });
  const [newRecipient, setNewRecipient] = useState("");

  const availableMetrics = {
    features: [
      "Total Count", "Completed Count", "In Progress Count", "Backlog Count",
      "Completion Rate", "Average Progress", "Velocity", "Cycle Time",
      "Lead Time", "Effort Points", "Value Score", "Priority Distribution"
    ],
    feedback: [
      "Total Feedback", "Positive Feedback", "Negative Feedback", "Neutral Feedback",
      "Response Rate", "Average Rating", "Sentiment Score", "Source Distribution",
      "Resolution Time", "Customer Satisfaction", "Feature Requests", "Bug Reports"
    ],
    goals: [
      "Goals Achieved", "Goals In Progress", "Goals At Risk", "Goal Success Rate",
      "Time to Achievement", "Average Progress", "Milestone Completion", "ROI Metrics",
      "Budget Utilization", "Resource Allocation", "Dependency Impact", "Risk Assessment"
    ],
    tasks: [
      "Task Completion", "Task Velocity", "Burndown Rate", "Sprint Performance",
      "Team Productivity", "Effort Estimation", "Time Tracking", "Blocker Resolution",
      "Story Points", "Defect Rate", "Code Quality", "Test Coverage"
    ]
  };

  const availableFields = {
    features: ["status", "priority", "assignee", "epic", "release", "effort", "value", "tags"],
    feedback: ["status", "source", "rating", "category", "assignee", "resolution_time"],
    goals: ["status", "priority", "owner", "category", "budget", "timeline"],
    tasks: ["status", "priority", "assignee", "sprint", "story_points", "time_spent"]
  };

  const visualizationTypes = [
    { id: "bar", name: "Bar Chart", icon: BarChart3 },
    { id: "pie", name: "Pie Chart", icon: PieChart },
    { id: "line", name: "Line Chart", icon: LineChart },
    { id: "trend", name: "Trend Analysis", icon: TrendingUp },
    { id: "table", name: "Data Table", icon: Database }
  ];

  const handleSave = () => {
    if (!reportConfig.name || !reportConfig.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (reportConfig.metrics.length === 0) {
      toast.error("Please select at least one metric");
      return;
    }

    // Simulate saving
    setTimeout(() => {
      toast.success("Report configuration saved successfully");
      onReportSaved();
    }, 500);
  };

  const handlePreview = () => {
    if (reportConfig.metrics.length === 0) {
      toast.error("Please select at least one metric to preview");
      return;
    }

    onPreview?.(reportConfig);
  };

  const addMetric = (metric: string) => {
    if (!reportConfig.metrics.includes(metric)) {
      setReportConfig(prev => ({
        ...prev,
        metrics: [...prev.metrics, metric]
      }));
    }
  };

  const removeMetric = (metric: string) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev.metrics.filter(m => m !== metric)
    }));
  };

  const addCustomFilter = () => {
    if (newCustomFilter.field && newCustomFilter.value) {
      setReportConfig(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          customFilters: [...prev.filters.customFilters, newCustomFilter]
        }
      }));
      setNewCustomFilter({ field: "", operator: "equals", value: "" });
    }
  };

  const removeCustomFilter = (index: number) => {
    setReportConfig(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        customFilters: prev.filters.customFilters.filter((_, i) => i !== index)
      }
    }));
  };

  const addRecipient = () => {
    if (newRecipient && !reportConfig.schedule.recipients.includes(newRecipient)) {
      setReportConfig(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          recipients: [...prev.schedule.recipients, newRecipient]
        }
      }));
      setNewRecipient("");
    }
  };

  const removeRecipient = (email: string) => {
    setReportConfig(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        recipients: prev.schedule.recipients.filter(r => r !== email)
      }
    }));
  };

  const toggleVisualization = (vizId: string) => {
    setReportConfig(prev => ({
      ...prev,
      visualizations: prev.visualizations.includes(vizId)
        ? prev.visualizations.filter(v => v !== vizId)
        : [...prev.visualizations, vizId]
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Report Builder</CardTitle>
          <CardDescription>Create comprehensive reports with advanced filtering and visualizations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="visualizations">Charts</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Report Name *</Label>
                  <Input
                    id="name"
                    value={reportConfig.name}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter report name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Data Source *</Label>
                  <Select 
                    value={reportConfig.type} 
                    onValueChange={(value) => setReportConfig(prev => ({ 
                      ...prev, 
                      type: value, 
                      dataSource: value,
                      metrics: [],
                      filters: { ...prev.filters, status: [], priority: [], assignee: [], tags: [] }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="features">Features</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="goals">Goals</SelectItem>
                      <SelectItem value="tasks">Tasks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={reportConfig.description}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this report will show"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Group By</Label>
                  <Select 
                    value={reportConfig.groupBy} 
                    onValueChange={(value) => setReportConfig(prev => ({ ...prev, groupBy: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="assignee">Assignee</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select 
                    value={reportConfig.sortBy} 
                    onValueChange={(value) => setReportConfig(prev => ({ ...prev, sortBy: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Created Date</SelectItem>
                      <SelectItem value="updatedAt">Updated Date</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="progress">Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Select 
                    value={reportConfig.sortOrder} 
                    onValueChange={(value) => setReportConfig(prev => ({ ...prev, sortOrder: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {reportConfig.dateRange.start ? format(reportConfig.dateRange.start, 'PPP') : 'Pick start date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={reportConfig.dateRange.start}
                        onSelect={(date) => setReportConfig(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, start: date }
                        }))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {reportConfig.dateRange.end ? format(reportConfig.dateRange.end, 'PPP') : 'Pick end date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={reportConfig.dateRange.end}
                        onSelect={(date) => setReportConfig(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, end: date }
                        }))}
                        fromDate={reportConfig.dateRange.start}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <div>
                <Label>Selected Metrics</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  {reportConfig.metrics.map(metric => (
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
              </div>

              <div>
                <Label>Available Metrics</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {availableMetrics[reportConfig.type as keyof typeof availableMetrics]?.map(metric => (
                    <Button
                      key={metric}
                      variant="outline"
                      size="sm"
                      onClick={() => addMetric(metric)}
                      disabled={reportConfig.metrics.includes(metric)}
                      className="justify-start"
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      {metric}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="filters" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Quick Filters</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label className="text-sm">Status</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {["completed", "in_progress", "backlog", "blocked"].map(status => (
                          <Button
                            key={status}
                            variant={reportConfig.filters.status.includes(status) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              const statuses = reportConfig.filters.status.includes(status)
                                ? reportConfig.filters.status.filter(s => s !== status)
                                : [...reportConfig.filters.status, status];
                              setReportConfig(prev => ({
                                ...prev,
                                filters: { ...prev.filters, status: statuses }
                              }));
                            }}
                          >
                            {status.replace('_', ' ')}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">Priority</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {["low", "medium", "high", "critical"].map(priority => (
                          <Button
                            key={priority}
                            variant={reportConfig.filters.priority.includes(priority) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              const priorities = reportConfig.filters.priority.includes(priority)
                                ? reportConfig.filters.priority.filter(p => p !== priority)
                                : [...reportConfig.filters.priority, priority];
                              setReportConfig(prev => ({
                                ...prev,
                                filters: { ...prev.filters, priority: priorities }
                              }));
                            }}
                          >
                            {priority}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Custom Filters</Label>
                  <div className="flex gap-2 mt-2">
                    <Select 
                      value={newCustomFilter.field} 
                      onValueChange={(value) => setNewCustomFilter(prev => ({ ...prev, field: value }))}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Field" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFields[reportConfig.type as keyof typeof availableFields]?.map(field => (
                          <SelectItem key={field} value={field}>{field}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={newCustomFilter.operator} 
                      onValueChange={(value) => setNewCustomFilter(prev => ({ ...prev, operator: value }))}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="greater_than">Greater than</SelectItem>
                        <SelectItem value="less_than">Less than</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input
                      placeholder="Value"
                      value={newCustomFilter.value}
                      onChange={(e) => setNewCustomFilter(prev => ({ ...prev, value: e.target.value }))}
                      className="flex-1"
                    />
                    
                    <Button onClick={addCustomFilter}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 mt-3">
                    {reportConfig.filters.customFilters.map((filter, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                        <span className="text-sm">
                          {filter.field} {filter.operator} "{filter.value}"
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeCustomFilter(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="visualizations" className="space-y-4">
              <div>
                <Label>Chart Types</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {visualizationTypes.map(viz => {
                    const Icon = viz.icon;
                    return (
                      <Card 
                        key={viz.id} 
                        className={`cursor-pointer transition-colors ${
                          reportConfig.visualizations.includes(viz.id) ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                        }`}
                        onClick={() => toggleVisualization(viz.id)}
                      >
                        <CardContent className="flex flex-col items-center p-4">
                          <Icon className={`h-8 w-8 mb-2 ${reportConfig.visualizations.includes(viz.id) ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="text-sm font-medium">{viz.name}</span>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Advanced Options</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="subItems"
                      checked={reportConfig.advanced.includeSubItems}
                      onCheckedChange={(checked) => setReportConfig(prev => ({
                        ...prev,
                        advanced: { ...prev.advanced, includeSubItems: !!checked }
                      }))}
                    />
                    <Label htmlFor="subItems">Include sub-items in analysis</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="dependencies"
                      checked={reportConfig.advanced.includeDependencies}
                      onCheckedChange={(checked) => setReportConfig(prev => ({
                        ...prev,
                        advanced: { ...prev.advanced, includeDependencies: !!checked }
                      }))}
                    />
                    <Label htmlFor="dependencies">Show dependency relationships</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="trends"
                      checked={reportConfig.advanced.calculateTrends}
                      onCheckedChange={(checked) => setReportConfig(prev => ({
                        ...prev,
                        advanced: { ...prev.advanced, calculateTrends: !!checked }
                      }))}
                    />
                    <Label htmlFor="trends">Calculate trend analysis</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="drillDown"
                      checked={reportConfig.advanced.enableDrillDown}
                      onCheckedChange={(checked) => setReportConfig(prev => ({
                        ...prev,
                        advanced: { ...prev.advanced, enableDrillDown: !!checked }
                      }))}
                    />
                    <Label htmlFor="drillDown">Enable interactive drill-down</Label>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="enableSchedule"
                  checked={reportConfig.schedule.enabled}
                  onCheckedChange={(checked) => setReportConfig(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule, enabled: !!checked }
                  }))}
                />
                <Label htmlFor="enableSchedule">Enable automatic report generation</Label>
              </div>

              {reportConfig.schedule.enabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select 
                      value={reportConfig.schedule.frequency} 
                      onValueChange={(value) => setReportConfig(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, frequency: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Recipients</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Email address"
                        value={newRecipient}
                        onChange={(e) => setNewRecipient(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={addRecipient}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {reportConfig.schedule.recipients.map(email => (
                        <div key={email} className="flex items-center justify-between bg-muted p-2 rounded">
                          <span className="text-sm">{email}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeRecipient(email)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Report
            </Button>
            <Button variant="outline" onClick={handlePreview} className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};