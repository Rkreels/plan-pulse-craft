
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AIInsights = () => {
  const { toast } = useToast();

  const insights = [
    {
      id: 1,
      type: "trend",
      title: "Feature Development Acceleration",
      description: "Your team's feature completion rate has increased by 23% over the last quarter, primarily due to improved sprint planning.",
      confidence: 95,
      impact: "high",
      recommendation: "Consider increasing sprint capacity by 15% to capitalize on this momentum.",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      id: 2,
      type: "risk",
      title: "Customer Feedback Response Delay",
      description: "Average response time to customer feedback has increased to 3.2 days, above the target of 2 days.",
      confidence: 88,
      impact: "medium",
      recommendation: "Implement automated feedback triage system to improve response times.",
      icon: AlertTriangle,
      color: "text-orange-600"
    },
    {
      id: 3,
      type: "opportunity",
      title: "High-Value Feature Gap",
      description: "Analysis shows 67% of customer requests align with features that have low development effort but high business value.",
      confidence: 92,
      impact: "high",
      recommendation: "Prioritize the 'Quick Wins' backlog category in next sprint planning.",
      icon: Lightbulb,
      color: "text-blue-600"
    },
    {
      id: 4,
      type: "goal",
      title: "Goal Achievement Pattern",
      description: "Teams with clearly defined acceptance criteria achieve goals 34% faster than those without.",
      confidence: 89,
      impact: "medium",
      recommendation: "Implement mandatory acceptance criteria templates for all new goals.",
      icon: Target,
      color: "text-purple-600"
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "trend": return "bg-green-100 text-green-800";
      case "risk": return "bg-red-100 text-red-800";
      case "opportunity": return "bg-blue-100 text-blue-800";
      case "goal": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleImplement = (insightId: number) => {
    toast({
      title: "Implementation tracked",
      description: "This insight has been added to your action items."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
          <p className="text-muted-foreground">Data-driven recommendations to optimize your product development</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {insights.map(insight => {
          const Icon = insight.icon;
          return (
            <Card key={insight.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${insight.color}`} />
                    <div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <div className="flex gap-2 mt-1">
                        <Badge className={getTypeColor(insight.type)}>{insight.type}</Badge>
                        <Badge className={getImpactColor(insight.impact)}>{insight.impact} impact</Badge>
                        <Badge variant="outline">{insight.confidence}% confidence</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4">{insight.description}</p>
                
                <div className="bg-muted/50 p-3 rounded-lg mb-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Recommendation</p>
                      <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleImplement(insight.id)}>
                    Implement
                  </Button>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                  <Button variant="ghost" size="sm">
                    Dismiss
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Insight Summary</CardTitle>
          <CardDescription>Key metrics from AI analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">23%</div>
              <div className="text-sm text-muted-foreground">Performance Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">4</div>
              <div className="text-sm text-muted-foreground">Active Insights</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">91%</div>
              <div className="text-sm text-muted-foreground">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-muted-foreground">High Impact Items</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
