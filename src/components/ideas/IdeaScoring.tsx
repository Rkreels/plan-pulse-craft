import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import { Lightbulb, Calculator, TrendingUp, Users, DollarSign, Target, Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { VoiceTrainingButton } from '@/components/voice-training/VoiceTrainingButton';

interface Idea {
  id: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedAt: Date;
  status: 'new' | 'reviewing' | 'approved' | 'rejected' | 'in_development';
  votes: number;
  comments: number;
  tags: string[];
  category: 'feature' | 'improvement' | 'bug_fix' | 'integration';
  // Scoring dimensions
  reach: number; // 1-10
  impact: number; // 1-10
  confidence: number; // 1-10
  effort: number; // 1-10
  // Calculated score
  riceScore?: number;
  valueScore?: number;
  feasibilityScore?: number;
}

interface ScoringCriteria {
  name: string;
  weight: number;
  description: string;
}

const IdeaScoring: React.FC = () => {
  const { feedback } = useAppContext();
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const [scoringModel, setScoringModel] = useState<'rice' | 'value_effort' | 'custom'>('rice');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('riceScore');

  // Mock ideas data (in real app, this would come from API)
  const ideas: Idea[] = useMemo(() => [
    {
      id: '1',
      title: 'Dark Mode Theme',
      description: 'Add dark mode support for better user experience in low-light conditions',
      submittedBy: 'User Community',
      submittedAt: new Date('2024-01-15'),
      status: 'reviewing',
      votes: 45,
      comments: 12,
      tags: ['UI', 'UX', 'Accessibility'],
      category: 'feature',
      reach: 8,
      impact: 6,
      confidence: 9,
      effort: 4,
      riceScore: 108, // (8*6*9)/4
      valueScore: 85,
      feasibilityScore: 75
    },
    {
      id: '2',
      title: 'API Rate Limiting',
      description: 'Implement rate limiting to prevent API abuse and ensure service stability',
      submittedBy: 'Engineering Team',
      submittedAt: new Date('2024-01-20'),
      status: 'approved',
      votes: 32,
      comments: 8,
      tags: ['API', 'Security', 'Performance'],
      category: 'improvement',
      reach: 6,
      impact: 8,
      confidence: 8,
      effort: 6,
      riceScore: 64, // (6*8*8)/6
      valueScore: 70,
      feasibilityScore: 85
    },
    {
      id: '3',
      title: 'Mobile App Push Notifications',
      description: 'Add push notification support for mobile app to improve user engagement',
      submittedBy: 'Product Team',
      submittedAt: new Date('2024-02-01'),
      status: 'new',
      votes: 67,
      comments: 23,
      tags: ['Mobile', 'Notifications', 'Engagement'],
      category: 'feature',
      reach: 9,
      impact: 7,
      confidence: 7,
      effort: 8,
      riceScore: 55.125, // (9*7*7)/8
      valueScore: 90,
      feasibilityScore: 60
    },
    {
      id: '4',
      title: 'Slack Integration',
      description: 'Integrate with Slack for real-time notifications and collaboration',
      submittedBy: 'Customer Request',
      submittedAt: new Date('2024-02-10'),
      status: 'reviewing',
      votes: 89,
      comments: 34,
      tags: ['Integration', 'Collaboration', 'Notifications'],
      category: 'integration',
      reach: 7,
      impact: 5,
      confidence: 8,
      effort: 5,
      riceScore: 56, // (7*5*8)/5
      valueScore: 75,
      feasibilityScore: 80
    }
  ], []);

  const customCriteria: ScoringCriteria[] = [
    { name: 'Strategic Alignment', weight: 0.3, description: 'How well does this align with company strategy?' },
    { name: 'Customer Value', weight: 0.25, description: 'Value delivered to customers' },
    { name: 'Technical Feasibility', weight: 0.2, description: 'How easy is it to implement?' },
    { name: 'Resource Availability', weight: 0.15, description: 'Do we have the resources?' },
    { name: 'Market Opportunity', weight: 0.1, description: 'Size of market opportunity' }
  ];

  const filteredIdeas = useMemo(() => {
    return ideas.filter(idea => {
      if (filterStatus !== 'all' && idea.status !== filterStatus) return false;
      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'riceScore': return (b.riceScore || 0) - (a.riceScore || 0);
        case 'valueScore': return (b.valueScore || 0) - (a.valueScore || 0);
        case 'votes': return b.votes - a.votes;
        case 'date': return b.submittedAt.getTime() - a.submittedAt.getTime();
        default: return 0;
      }
    });
  }, [ideas, filterStatus, sortBy]);

  const scoringData = ideas.map(idea => ({
    name: idea.title,
    rice: idea.riceScore || 0,
    value: idea.valueScore || 0,
    effort: idea.effort,
    votes: idea.votes,
    status: idea.status
  }));

  const statusColors = {
    new: '#6b7280',
    reviewing: '#f59e0b',
    approved: '#10b981',
    rejected: '#ef4444',
    in_development: '#3b82f6'
  };

  const calculateRICEScore = (reach: number, impact: number, confidence: number, effort: number) => {
    return (reach * impact * confidence) / effort;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Idea Scoring & Prioritization</h1>
          <p className="text-muted-foreground">Evaluate and prioritize ideas using data-driven scoring models</p>
        </div>
        <div className="flex gap-2">
          <VoiceTrainingButton module="ideas" />
          <Button variant="outline">
            <Calculator className="h-4 w-4 mr-2" />
            Configure Scoring
          </Button>
          <Button>
            <Lightbulb className="h-4 w-4 mr-2" />
            Submit Idea
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Ideas</p>
                <p className="text-2xl font-bold">{ideas.length}</p>
              </div>
              <Lightbulb className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved Ideas</p>
                <p className="text-2xl font-bold">{ideas.filter(i => i.status === 'approved').length}</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Votes</p>
                <p className="text-2xl font-bold">{ideas.reduce((sum, i) => sum + i.votes, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg RICE Score</p>
                <p className="text-2xl font-bold">
                  {(ideas.reduce((sum, i) => sum + (i.riceScore || 0), 0) / ideas.length).toFixed(1)}
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Label htmlFor="scoring-model">Scoring Model:</Label>
              <Select value={scoringModel} onValueChange={(value: any) => setScoringModel(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rice">RICE Score</SelectItem>
                  <SelectItem value="value_effort">Value vs Effort</SelectItem>
                  <SelectItem value="custom">Custom Model</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="filter-status">Status:</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="sort-by">Sort by:</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="riceScore">RICE Score</SelectItem>
                  <SelectItem value="valueScore">Value Score</SelectItem>
                  <SelectItem value="votes">Votes</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="scoreboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scoreboard">Idea Scoreboard</TabsTrigger>
          <TabsTrigger value="analysis">Scoring Analysis</TabsTrigger>
          <TabsTrigger value="details">Idea Details</TabsTrigger>
          <TabsTrigger value="models">Scoring Models</TabsTrigger>
        </TabsList>

        <TabsContent value="scoreboard" className="space-y-4">
          <div className="grid gap-4">
            {filteredIdeas.map((idea, index) => (
              <Card key={idea.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                          #{index + 1}
                        </div>
                        <CardTitle className="text-lg">{idea.title}</CardTitle>
                        <Badge 
                          style={{ backgroundColor: statusColors[idea.status] }}
                          className="text-white"
                        >
                          {idea.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <CardDescription className="mt-2">{idea.description}</CardDescription>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {scoringModel === 'rice' ? idea.riceScore?.toFixed(1) : idea.valueScore}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {scoringModel === 'rice' ? 'RICE Score' : 'Value Score'}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{idea.reach}</div>
                      <div className="text-xs text-muted-foreground">Reach</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{idea.impact}</div>
                      <div className="text-xs text-muted-foreground">Impact</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{idea.confidence}</div>
                      <div className="text-xs text-muted-foreground">Confidence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{idea.effort}</div>
                      <div className="text-xs text-muted-foreground">Effort</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {idea.votes} votes
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {idea.comments} comments
                      </div>
                      <div>by {idea.submittedBy}</div>
                    </div>
                    
                    <div className="flex gap-2">
                      {idea.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">Edit Score</Button>
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button size="sm">Update Status</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scoringData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rice" fill="#3b82f6" name="RICE Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Value vs Effort Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={scoringData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="effort" name="Effort" />
                    <YAxis dataKey="value" name="Value" />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded p-2 shadow">
                              <p className="font-medium">{data.name}</p>
                              <p>Value: {data.value}</p>
                              <p>Effort: {data.effort}</p>
                              <p>Votes: {data.votes}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter dataKey="value">
                      {scoringData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={statusColors[entry.status as keyof typeof statusColors]} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Idea Analysis</CardTitle>
              <CardDescription>Comprehensive view of idea metrics and evaluation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredIdeas.slice(0, 3).map((idea) => (
                  <div key={idea.id} className="border rounded p-4 space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg">{idea.title}</h4>
                      <p className="text-muted-foreground">{idea.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Reach (1-10)</Label>
                        <div className="mt-2">
                          <Slider value={[idea.reach]} max={10} min={1} disabled />
                          <div className="text-center text-sm mt-1">{idea.reach}</div>
                        </div>
                      </div>
                      <div>
                        <Label>Impact (1-10)</Label>
                        <div className="mt-2">
                          <Slider value={[idea.impact]} max={10} min={1} disabled />
                          <div className="text-center text-sm mt-1">{idea.impact}</div>
                        </div>
                      </div>
                      <div>
                        <Label>Confidence (1-10)</Label>
                        <div className="mt-2">
                          <Slider value={[idea.confidence]} max={10} min={1} disabled />
                          <div className="text-center text-sm mt-1">{idea.confidence}</div>
                        </div>
                      </div>
                      <div>
                        <Label>Effort (1-10)</Label>
                        <div className="mt-2">
                          <Slider value={[idea.effort]} max={10} min={1} disabled />
                          <div className="text-center text-sm mt-1">{idea.effort}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted p-3 rounded">
                      <div className="text-sm font-medium">RICE Score Calculation:</div>
                      <div className="text-sm text-muted-foreground">
                        ({idea.reach} × {idea.impact} × {idea.confidence}) ÷ {idea.effort} = {idea.riceScore?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>RICE Scoring Model</CardTitle>
                <CardDescription>Reach × Impact × Confidence ÷ Effort</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="font-medium">Reach</Label>
                    <p className="text-sm text-muted-foreground">How many people will this impact over a time period?</p>
                  </div>
                  <div>
                    <Label className="font-medium">Impact</Label>
                    <p className="text-sm text-muted-foreground">How much will this impact each person?</p>
                  </div>
                  <div>
                    <Label className="font-medium">Confidence</Label>
                    <p className="text-sm text-muted-foreground">How confident are you in your reach and impact estimates?</p>
                  </div>
                  <div>
                    <Label className="font-medium">Effort</Label>
                    <p className="text-sm text-muted-foreground">How much time will this take to implement?</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Scoring Model</CardTitle>
                <CardDescription>Define your own criteria and weights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {customCriteria.map((criteria, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">{criteria.name}</Label>
                      <span className="text-sm font-medium">{(criteria.weight * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{criteria.description}</p>
                    <Slider value={[criteria.weight * 100]} max={100} min={0} disabled />
                  </div>
                ))}
                <Button className="w-full mt-4">Configure Custom Model</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IdeaScoring;