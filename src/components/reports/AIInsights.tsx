
import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb,
  Target,
  RefreshCw,
  Download,
  Share2,
  Zap
} from "lucide-react";
import { toast } from "sonner";

export const AIInsights = () => {
  const { features, releases, epics } = useAppContext();
  const [insightType, setInsightType] = useState("all");
  const [timeFrame, setTimeFrame] = useState("last_30_days");

  // Mock AI-generated insights
  const insights = [
    {
      id: "1",
      type: "trend",
      title: "Feature Completion Velocity Declining",
      description: "Your team's feature completion rate has decreased by 15% over the last 3 weeks. Consider reviewing current sprint capacity and blockers.",
      severity: "medium",
      confidence: 85,
      impact: "high",
      recommendation: "Reduce sprint scope by 20% or add 1 additional developer to maintain velocity",
      category: "Performance",
      timestamp: "2 hours ago"
    },
    {
      id: "2",
      type: "opportunity",
      title: "Backend Features Ready for Frontend",
      description: "5 backend features are completed and ready for frontend integration. This could accelerate 3 upcoming releases.",
      severity: "low",
      confidence: 92,
      impact: "medium",
      recommendation: "Prioritize frontend integration for these features in the next sprint",
      category: "Workflow",
      timestamp: "4 hours ago"
    },
    {
      id: "3",
      type: "risk",
      title: "Release Timeline at Risk",
      description: "Mobile App Redesign release is 23% behind schedule with 6 critical features still in development.",
      severity: "high",
      confidence: 78,
      impact: "critical",
      recommendation: "Consider moving 2 non-critical features to next release or extending timeline by 2 weeks",
      category: "Release Planning",
      timestamp: "6 hours ago"
    },
    {
      id: "4",
      type: "optimization",
      title: "Underutilized Team Capacity",
      description: "Design team has 30% available capacity while Frontend team is at 95% utilization. Workflow optimization opportunity identified.",
      severity: "low",
      confidence: 88,
      impact: "medium",
      recommendation: "Assign UI/UX tasks from Frontend backlog to Design team to balance workload",
      category: "Resource Planning",
      timestamp: "1 day ago"
    },
    {
      id: "5",
      type: "trend",
      title: "Customer Feedback Integration Improving",
      description: "Features with integrated customer feedback show 40% higher satisfaction scores. Continue this approach.",
      severity: "low",
      confidence: 94,
      impact: "high",
      recommendation: "Mandate customer feedback integration for all new feature development",
      category: "Customer Success",
      timestamp: "1 day ago"
    }
  ];

  // Generate AI metrics
  const totalInsights = insights.length;
  const criticalInsights = insights.filter(i => i.severity === "high").length;
  const avgConfidence = Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length);
  const actionableInsights = insights.filter(i => i.impact === "high" || i.impact === "critical").length;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "trend": return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case "risk": return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "opportunity": return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case "optimization": return <Target className="h-5 w-5 text-green-500" />;
      default: return <Brain className="h-5 w-5 text-purple-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "critical": return "text-red-600";
      case "high": return "text-orange-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const filteredInsights = insightType === "all" 
    ? insights 
    : insights.filter(insight => insight.type === insightType);

  const handleRefreshInsights = () => {
    toast.success("AI insights refreshed with latest data");
  };

  const handleExportInsights = () => {
    toast.success("AI insights exported to PDF");
  };

  const handleShareInsights = () => {
    toast.success("Insights sharing link copied to clipboard");
  };

  const handleApplyRecommendation = (insightId: string) => {
    const insight = insights.find(i => i.id === insightId);
    toast.success(`Applied recommendation: ${insight?.title}`);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          <Select value={insightType} onValueChange={setInsightType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Insight type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Insights</SelectItem>
              <SelectItem value="trend">Trends</SelectItem>
              <SelectItem value="risk">Risks</SelectItem>
              <SelectItem value="opportunity">Opportunities</SelectItem>
              <SelectItem value="optimization">Optimizations</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 days</SelectItem>
              <SelectItem value="last_30_days">Last 30 days</SelectItem>
              <SelectItem value="last_90_days">Last 90 days</SelectItem>
              <SelectItem value="last_year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefreshInsights}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportInsights}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleShareInsights}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* AI Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInsights}</div>
            <p className="text-xs text-muted-foreground">Generated today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalInsights}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConfidence}%</div>
            <Progress value={avgConfidence} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actionable</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actionableInsights}</div>
            <p className="text-xs text-muted-foreground">High impact items</p>
          </CardContent>
        </Card>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.map(insight => (
          <Card key={insight.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <Badge variant={getSeverityColor(insight.severity)}>
                        {insight.severity}
                      </Badge>
                      <Badge variant="outline">{insight.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {insight.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Confidence: {insight.confidence}%</span>
                      <span className={getImpactColor(insight.impact)}>
                        Impact: {insight.impact}
                      </span>
                      <span>{insight.timestamp}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleApplyRecommendation(insight.id)}
                >
                  Apply
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium mb-1">Recommendation</div>
                    <p className="text-sm text-muted-foreground">
                      {insight.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInsights.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No insights available</h3>
            <p className="text-muted-foreground mb-4">
              AI insights will appear here as data is analyzed
            </p>
            <Button onClick={handleRefreshInsights}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate Insights
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
