import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users, Target, Plus, Search, Filter, BarChart3, Eye, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Competitor {
  id: string;
  name: string;
  website: string;
  description: string;
  marketPosition: 'leader' | 'challenger' | 'niche' | 'follower';
  strengths: string[];
  weaknesses: string[];
  features: CompetitorFeature[];
  pricing: {
    tiers: PricingTier[];
  };
  marketShare: number;
  customerCount: number;
  lastUpdated: string;
}

interface CompetitorFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  availability: 'available' | 'planned' | 'not_available';
  quality: 1 | 2 | 3 | 4 | 5;
  differentiator: boolean;
}

interface PricingTier {
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export const CompetitorAnalysis: React.FC = () => {
  const [competitors, setCompetitors] = useState<Competitor[]>([
    {
      id: '1',
      name: 'Aha!',
      website: 'aha.io',
      description: 'Product roadmap and strategy software',
      marketPosition: 'leader',
      strengths: ['Comprehensive feature set', 'Strong roadmapping', 'Enterprise focus'],
      weaknesses: ['High price point', 'Complex interface', 'Steep learning curve'],
      features: [
        {
          id: '1',
          name: 'Strategic Roadmaps',
          description: 'Visual roadmap planning with multiple views',
          category: 'Planning',
          availability: 'available',
          quality: 5,
          differentiator: true
        },
        {
          id: '2',
          name: 'Goal Setting (OKRs)',
          description: 'Objectives and key results tracking',
          category: 'Strategy',
          availability: 'available',
          quality: 4,
          differentiator: false
        },
        {
          id: '3',
          name: 'Customer Feedback Portal',
          description: 'Branded feedback collection',
          category: 'Feedback',
          availability: 'available',
          quality: 4,
          differentiator: true
        }
      ],
      pricing: {
        tiers: [
          { name: 'Starter', price: 59, features: ['Basic roadmaps', 'Up to 5 users'] },
          { name: 'Premium', price: 99, features: ['Advanced roadmaps', 'Up to 10 users', 'Analytics'], popular: true },
          { name: 'Enterprise', price: 149, features: ['Full features', 'Unlimited users', 'SSO'] }
        ]
      },
      marketShare: 35,
      customerCount: 5000,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      name: 'ProductPlan',
      website: 'productplan.com',
      description: 'Visual product roadmap software',
      marketPosition: 'challenger',
      strengths: ['Beautiful UI', 'Easy to use', 'Good integrations'],
      weaknesses: ['Limited strategy features', 'Basic reporting', 'No custom fields'],
      features: [
        {
          id: '4',
          name: 'Visual Roadmaps',
          description: 'Drag-and-drop roadmap builder',
          category: 'Planning',
          availability: 'available',
          quality: 4,
          differentiator: true
        },
        {
          id: '5',
          name: 'Portfolio Management',
          description: 'Multiple product portfolio view',
          category: 'Portfolio',
          availability: 'available',
          quality: 3,
          differentiator: false
        }
      ],
      pricing: {
        tiers: [
          { name: 'Basic', price: 39, features: ['Basic roadmaps', 'Up to 5 users'] },
          { name: 'Professional', price: 79, features: ['Advanced features', 'Up to 20 users'], popular: true },
          { name: 'Enterprise', price: 119, features: ['Full features', 'Unlimited users'] }
        ]
      },
      marketShare: 20,
      customerCount: 3000,
      lastUpdated: '2024-01-10'
    }
  ]);

  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const { toast } = useToast();

  const handleAddCompetitor = (competitorData: Partial<Competitor>) => {
    const newCompetitor: Competitor = {
      id: Date.now().toString(),
      name: competitorData.name || '',
      website: competitorData.website || '',
      description: competitorData.description || '',
      marketPosition: competitorData.marketPosition || 'follower',
      strengths: competitorData.strengths || [],
      weaknesses: competitorData.weaknesses || [],
      features: [],
      pricing: { tiers: [] },
      marketShare: 0,
      customerCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setCompetitors([...competitors, newCompetitor]);
    setIsAddDialogOpen(false);
    toast({
      title: "Competitor Added",
      description: `${newCompetitor.name} has been added to your analysis.`
    });
  };

  const filteredCompetitors = competitors.filter(competitor => {
    const matchesSearch = competitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         competitor.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || competitor.marketPosition === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'leader': return 'bg-green-500';
      case 'challenger': return 'bg-blue-500';
      case 'niche': return 'bg-yellow-500';
      case 'follower': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getQualityStars = (quality: number) => {
    return '★'.repeat(quality) + '☆'.repeat(5 - quality);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competitor Analysis</h1>
          <p className="text-muted-foreground">
            Analyze competitors and benchmark your product features
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Competitor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Competitor</DialogTitle>
              <DialogDescription>
                Add a new competitor to track and analyze
              </DialogDescription>
            </DialogHeader>
            <CompetitorForm onSubmit={handleAddCompetitor} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search competitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            <SelectItem value="leader">Leaders</SelectItem>
            <SelectItem value="challenger">Challengers</SelectItem>
            <SelectItem value="niche">Niche Players</SelectItem>
            <SelectItem value="follower">Followers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Competitors</p>
                <p className="text-2xl font-bold">{competitors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Market Leaders</p>
                <p className="text-2xl font-bold">
                  {competitors.filter(c => c.marketPosition === 'leader').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Avg Market Share</p>
                <p className="text-2xl font-bold">
                  {Math.round(competitors.reduce((acc, c) => acc + c.marketShare, 0) / competitors.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Features Tracked</p>
                <p className="text-2xl font-bold">
                  {competitors.reduce((acc, c) => acc + c.features.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCompetitors.map((competitor) => (
          <Card key={competitor.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{competitor.name}</CardTitle>
                <Badge 
                  variant="secondary" 
                  className={`${getPositionColor(competitor.marketPosition)} text-white`}
                >
                  {competitor.marketPosition}
                </Badge>
              </div>
              <CardDescription>{competitor.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Market Share</span>
                <span className="font-semibold">{competitor.marketShare}%</span>
              </div>
              <Progress value={competitor.marketShare} className="h-2" />
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-green-600">Strengths</p>
                  <div className="flex flex-wrap gap-1">
                    {competitor.strengths.slice(0, 2).map((strength, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {strength}
                      </Badge>
                    ))}
                    {competitor.strengths.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{competitor.strengths.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-red-600">Weaknesses</p>
                  <div className="flex flex-wrap gap-1">
                    {competitor.weaknesses.slice(0, 2).map((weakness, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {weakness}
                      </Badge>
                    ))}
                    {competitor.weaknesses.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{competitor.weaknesses.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  {competitor.features.length} features tracked
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedCompetitor(competitor)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View Dialog */}
      {selectedCompetitor && (
        <Dialog open={!!selectedCompetitor} onOpenChange={() => setSelectedCompetitor(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedCompetitor.name}
                <Badge className={`${getPositionColor(selectedCompetitor.marketPosition)} text-white`}>
                  {selectedCompetitor.marketPosition}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Detailed competitor analysis and feature comparison
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Company Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Website</p>
                        <p className="text-sm text-muted-foreground">{selectedCompetitor.website}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Market Share</p>
                        <p className="text-sm text-muted-foreground">{selectedCompetitor.marketShare}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Customer Count</p>
                        <p className="text-sm text-muted-foreground">{selectedCompetitor.customerCount.toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Last Updated</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{selectedCompetitor.lastUpdated}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-green-600">Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {selectedCompetitor.strengths.map((strength, index) => (
                          <li key={index} className="text-sm">• {strength}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-red-600">Weaknesses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {selectedCompetitor.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm">• {weakness}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="features">
                <div className="space-y-4">
                  {selectedCompetitor.features.map((feature) => (
                    <Card key={feature.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{feature.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant={feature.availability === 'available' ? 'default' : 'secondary'}>
                              {feature.availability.replace('_', ' ')}
                            </Badge>
                            {feature.differentiator && (
                              <Badge variant="outline" className="text-xs">Differentiator</Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{feature.category}</Badge>
                          <div className="flex items-center gap-1">
                            <span className="text-sm">Quality:</span>
                            <span className="text-sm">{getQualityStars(feature.quality)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pricing">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedCompetitor.pricing.tiers.map((tier, index) => (
                    <Card key={index} className={tier.popular ? 'border-primary' : ''}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {tier.name}
                          {tier.popular && <Badge>Popular</Badge>}
                        </CardTitle>
                        <div className="text-2xl font-bold">${tier.price}<span className="text-sm font-normal">/month</span></div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {tier.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="text-sm">• {feature}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analysis">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Competitive Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Market Position</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedCompetitor.name} is positioned as a {selectedCompetitor.marketPosition} in the product management space 
                          with {selectedCompetitor.marketShare}% market share and {selectedCompetitor.customerCount.toLocaleString()} customers.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Feature Gap Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          They have {selectedCompetitor.features.length} key features tracked, with{' '}
                          {selectedCompetitor.features.filter(f => f.differentiator).length} identified as differentiators.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Recommendation</h4>
                        <p className="text-sm text-muted-foreground">
                          Focus on leveraging their weaknesses while building competitive alternatives to their key differentiators.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const CompetitorForm: React.FC<{ onSubmit: (data: Partial<Competitor>) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    description: '',
    marketPosition: 'follower' as const,
    strengths: '',
    weaknesses: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      strengths: formData.strengths.split(',').map(s => s.trim()).filter(Boolean),
      weaknesses: formData.weaknesses.split(',').map(s => s.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Company Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => setFormData({...formData, website: e.target.value})}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="position">Market Position</Label>
        <Select value={formData.marketPosition} onValueChange={(value: any) => setFormData({...formData, marketPosition: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="leader">Leader</SelectItem>
            <SelectItem value="challenger">Challenger</SelectItem>
            <SelectItem value="niche">Niche Player</SelectItem>
            <SelectItem value="follower">Follower</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="strengths">Strengths (comma-separated)</Label>
          <Textarea
            id="strengths"
            value={formData.strengths}
            onChange={(e) => setFormData({...formData, strengths: e.target.value})}
            placeholder="Strong product, Good UX, Market leader"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="weaknesses">Weaknesses (comma-separated)</Label>
          <Textarea
            id="weaknesses"
            value={formData.weaknesses}
            onChange={(e) => setFormData({...formData, weaknesses: e.target.value})}
            placeholder="High price, Complex setup, Limited integrations"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Add Competitor</Button>
      </div>
    </form>
  );
};