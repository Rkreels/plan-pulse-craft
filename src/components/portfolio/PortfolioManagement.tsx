import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, PieChart, Pie } from 'recharts';
import { Plus, Filter, Download, RefreshCw, TrendingUp, TrendingDown, Target, Users, DollarSign, Calendar } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface Portfolio {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  value: number;
  effort: number;
  progress: number;
  startDate: Date;
  targetDate: Date;
  owner: string;
  projects: string[];
  budget: number;
  roi: number;
  riskLevel: 'low' | 'medium' | 'high';
}

const PortfolioManagement: React.FC = () => {
  const { goals, features, epics, currentUser } = useAppContext();
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('value');

  // Mock portfolio data (in real app, this would come from API)
  const portfolios: Portfolio[] = useMemo(() => [
    {
      id: '1',
      name: 'Customer Experience Platform',
      description: 'Comprehensive platform to improve customer touchpoints',
      status: 'active',
      priority: 'high',
      value: 95,
      effort: 80,
      progress: 65,
      startDate: new Date('2024-01-01'),
      targetDate: new Date('2024-12-31'),
      owner: 'Product Team',
      projects: ['proj1', 'proj2'],
      budget: 500000,
      roi: 145,
      riskLevel: 'medium'
    },
    {
      id: '2',
      name: 'Mobile Optimization Initiative',
      description: 'Mobile-first approach for all product features',
      status: 'active',
      priority: 'high',
      value: 85,
      effort: 60,
      progress: 80,
      startDate: new Date('2024-02-01'),
      targetDate: new Date('2024-08-31'),
      owner: 'Mobile Team',
      projects: ['proj3', 'proj4'],
      budget: 300000,
      roi: 120,
      riskLevel: 'low'
    },
    {
      id: '3',
      name: 'AI Integration Suite',
      description: 'Integrate AI capabilities across product features',
      status: 'active',
      priority: 'critical',
      value: 100,
      effort: 90,
      progress: 25,
      startDate: new Date('2024-03-01'),
      targetDate: new Date('2025-03-31'),
      owner: 'AI Team',
      projects: ['proj5'],
      budget: 750000,
      roi: 200,
      riskLevel: 'high'
    }
  ], []);

  const filteredPortfolios = useMemo(() => {
    return portfolios.filter(portfolio => {
      if (filterStatus !== 'all' && portfolio.status !== filterStatus) return false;
      if (selectedPortfolio !== 'all' && portfolio.id !== selectedPortfolio) return false;
      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'value': return b.value - a.value;
        case 'effort': return b.effort - a.effort;
        case 'progress': return b.progress - a.progress;
        case 'roi': return b.roi - a.roi;
        default: return 0;
      }
    });
  }, [portfolios, filterStatus, selectedPortfolio, sortBy]);

  const portfolioMetrics = useMemo(() => {
    const totalBudget = portfolios.reduce((sum, p) => sum + p.budget, 0);
    const avgROI = portfolios.reduce((sum, p) => sum + p.roi, 0) / portfolios.length;
    const avgProgress = portfolios.reduce((sum, p) => sum + p.progress, 0) / portfolios.length;
    const activePortfolios = portfolios.filter(p => p.status === 'active').length;
    
    return { totalBudget, avgROI, avgProgress, activePortfolios };
  }, [portfolios]);

  const valueEffortData = portfolios.map(p => ({
    name: p.name,
    value: p.value,
    effort: p.effort,
    progress: p.progress,
    priority: p.priority
  }));

  const statusDistribution = [
    { name: 'Active', value: portfolios.filter(p => p.status === 'active').length, color: '#10b981' },
    { name: 'On Hold', value: portfolios.filter(p => p.status === 'on_hold').length, color: '#f59e0b' },
    { name: 'Completed', value: portfolios.filter(p => p.status === 'completed').length, color: '#3b82f6' },
    { name: 'Cancelled', value: portfolios.filter(p => p.status === 'cancelled').length, color: '#ef4444' }
  ];

  const priorityColors = {
    low: '#6b7280',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#dc2626'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Management</h1>
          <p className="text-muted-foreground">Manage and track strategic initiatives across your organization</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Portfolio
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">${(portfolioMetrics.totalBudget / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average ROI</p>
                <p className="text-2xl font-bold">{portfolioMetrics.avgROI.toFixed(0)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">{portfolioMetrics.avgProgress.toFixed(0)}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <Progress value={portfolioMetrics.avgProgress} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Portfolios</p>
                <p className="text-2xl font-bold">{portfolioMetrics.activePortfolios}</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="value">Value</SelectItem>
                <SelectItem value="effort">Effort</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="roi">ROI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="value-effort">Value vs Effort</TabsTrigger>
          <TabsTrigger value="details">Portfolio Details</TabsTrigger>
          <TabsTrigger value="roadmap">Portfolio Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-4 mt-4">
                  {statusDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPortfolios.map((portfolio) => (
                    <div key={portfolio.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{portfolio.name}</span>
                        <span className="text-sm text-muted-foreground">{portfolio.progress}%</span>
                      </div>
                      <Progress value={portfolio.progress} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="value-effort" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Value vs Effort Analysis</CardTitle>
              <CardDescription>Identify high-value, low-effort opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={valueEffortData}>
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
                            <p>Progress: {data.progress}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="value">
                    {valueEffortData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={priorityColors[entry.priority as keyof typeof priorityColors]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {Object.entries(priorityColors).map(([priority, color]) => (
                  <div key={priority} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm capitalize">{priority}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4">
            {filteredPortfolios.map((portfolio) => (
              <Card key={portfolio.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={`${
                          portfolio.priority === 'critical' ? 'bg-red-500' :
                          portfolio.priority === 'high' ? 'bg-orange-500' :
                          portfolio.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}
                      >
                        {portfolio.priority}
                      </Badge>
                      <Badge variant="outline">{portfolio.status}</Badge>
                    </div>
                  </div>
                  <CardDescription>{portfolio.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <Progress value={portfolio.progress} className="mt-1" />
                      <p className="text-sm font-medium mt-1">{portfolio.progress}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="text-lg font-bold">${(portfolio.budget / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expected ROI</p>
                      <p className="text-lg font-bold text-green-600">{portfolio.roi}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Level</p>
                      <Badge 
                        className={
                          portfolio.riskLevel === 'high' ? 'bg-red-500' :
                          portfolio.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }
                      >
                        {portfolio.riskLevel}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">Edit Portfolio</Button>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Roadmap Timeline</CardTitle>
              <CardDescription>Strategic initiative timeline and dependencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPortfolios.map((portfolio) => (
                  <div key={portfolio.id} className="border rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{portfolio.name}</h4>
                      <Badge variant="outline">{portfolio.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {portfolio.startDate.toLocaleDateString()} - {portfolio.targetDate.toLocaleDateString()}
                      </div>
                      <div>Owner: {portfolio.owner}</div>
                    </div>
                    <Progress value={portfolio.progress} className="mt-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioManagement;