import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { FeedbackFilters } from "./FeedbackFilters";
import { Download, Filter } from "lucide-react";

interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  votes: number;
  date: Date;
}

export function CustomerFeedbackPortal() {
  const { toast } = useToast();
  const { addFeedback } = useAppContext();
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([
    {
      id: "f1",
      title: "Add dark mode support",
      description: "Would love to have dark mode for better night time viewing",
      category: "Feature Request",
      status: "Under Review",
      votes: 24,
      date: new Date(2025, 2, 10)
    },
    {
      id: "f2",
      title: "Dashboard is slow to load",
      description: "The main dashboard takes over 5 seconds to load on my browser",
      category: "Bug Report",
      status: "In Progress",
      votes: 16,
      date: new Date(2025, 3, 5)
    },
    {
      id: "f3",
      title: "Add export to PDF feature",
      description: "Need to be able to export reports to PDF format",
      category: "Feature Request",
      status: "Planned",
      votes: 42,
      date: new Date(2025, 2, 28)
    },
    {
      id: "f4",
      title: "Login sometimes fails on mobile",
      description: "Getting occasional login failures when using the app on my phone",
      category: "Bug Report",
      status: "Under Review",
      votes: 8,
      date: new Date(2025, 4, 2)
    }
  ]);

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all",
    dateRange: {},
    minVotes: "",
    sortBy: "votes",
    sortOrder: "desc" as "asc" | "desc"
  });

  const [portalConfig, setPortalConfig] = useState({
    allowAnonymous: true,
    requireApproval: true,
    enableVoting: true,
    allowComments: true,
    notifyOnNewFeedback: true,
    customBranding: false
  });

  const [newFeedback, setNewFeedback] = useState({
    title: "",
    description: "",
    category: "Feature Request"
  });

  const handleConfigChange = (key: keyof typeof portalConfig, value: boolean) => {
    setPortalConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmitFeedback = () => {
    if (!newFeedback.title || !newFeedback.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const feedbackItem: FeedbackItem = {
      id: `f${Date.now()}`,
      title: newFeedback.title,
      description: newFeedback.description,
      category: newFeedback.category,
      status: "New",
      votes: 0,
      date: new Date()
    };

    setFeedbackItems(prev => [feedbackItem, ...prev]);
    
    // Add to app context
    addFeedback({
      id: feedbackItem.id,
      title: feedbackItem.title,
      description: feedbackItem.description,
      source: "customer",
      status: "new",
      votes: 0,
      features: [],
      submittedBy: "customer@example.com",
      createdAt: new Date(),
      workspaceId: "workspace-1"
    });

    setNewFeedback({
      title: "",
      description: "",
      category: "Feature Request"
    });

    toast({
      title: "Feedback submitted",
      description: "Thank you for your feedback!"
    });
  };

  const handleVote = (id: string) => {
    setFeedbackItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, votes: item.votes + 1 } : item
      )
    );
  };

  // Enhanced filtering and sorting logic
  const getFilteredAndSortedFeedback = () => {
    let filtered = feedbackItems.filter(item => {
      const matchesSearch = !filters.search || 
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = filters.category === "all" || item.category === filters.category;
      const matchesStatus = filters.status === "all" || item.status === filters.status;
      const matchesMinVotes = !filters.minVotes || item.votes >= parseInt(filters.minVotes);

      return matchesSearch && matchesCategory && matchesStatus && matchesMinVotes;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case "votes":
          aValue = a.votes;
          bValue = b.votes;
          break;
        case "date":
          aValue = a.date.getTime();
          bValue = b.date.getTime();
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.votes;
          bValue = b.votes;
      }

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredFeedback = getFilteredAndSortedFeedback();

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      status: "all",
      dateRange: {},
      minVotes: "",
      sortBy: "votes",
      sortOrder: "desc"
    });
  };

  const exportFeedback = () => {
    const data = filteredFeedback.map(item => ({
      title: item.title,
      description: item.description,
      category: item.category,
      status: item.status,
      votes: item.votes,
      date: item.date.toISOString()
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feedback-export.json';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export completed",
      description: "Feedback data has been exported successfully"
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="submit">
        <TabsList className="mb-4">
          <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
          <TabsTrigger value="view">View Feedback</TabsTrigger>
          <TabsTrigger value="configure">Configure Portal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="submit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Feedback</CardTitle>
              <CardDescription>
                We value your input! Share your ideas, report issues, or suggest improvements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feedback-title">Title</Label>
                <Input 
                  id="feedback-title" 
                  placeholder="Briefly describe your feedback" 
                  value={newFeedback.title}
                  onChange={e => setNewFeedback(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="feedback-type">Category</Label>
                <Select 
                  value={newFeedback.category} 
                  onValueChange={value => setNewFeedback(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Feature Request">Feature Request</SelectItem>
                    <SelectItem value="Bug Report">Bug Report</SelectItem>
                    <SelectItem value="Improvement">Improvement</SelectItem>
                    <SelectItem value="Question">Question</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="feedback-description">Description</Label>
                <Textarea 
                  id="feedback-description" 
                  placeholder="Please provide details about your feedback" 
                  rows={5}
                  value={newFeedback.description}
                  onChange={e => setNewFeedback(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <Button onClick={handleSubmitFeedback} className="w-full">Submit Feedback</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="view" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Customer Feedback</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportFeedback} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <FeedbackFilters 
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
          />
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {filteredFeedback.length} of {feedbackItems.length} items
            </span>
          </div>
          
          <div className="space-y-4">
            {filteredFeedback.length > 0 ? (
              filteredFeedback.map(item => (
                <Card key={item.id}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{item.category}</Badge>
                          <Badge className={
                            item.status === "Completed" ? "bg-green-500" :
                            item.status === "In Progress" ? "bg-blue-500" :
                            item.status === "Planned" ? "bg-amber-500" :
                            "bg-slate-500"
                          }>{item.status}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {item.date.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center ml-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex flex-col px-4 py-2"
                          onClick={() => handleVote(item.id)}
                        >
                          <span className="text-xl font-bold">{item.votes}</span>
                          <span className="text-xs">votes</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center p-10">
                <Filter className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No feedback found</h3>
                <p className="text-muted-foreground">No feedback matching your current filters</p>
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="configure">
          <Card>
            <CardHeader>
              <CardTitle>Portal Configuration</CardTitle>
              <CardDescription>
                Customize how your customer feedback portal works
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow-anonymous">Allow Anonymous Feedback</Label>
                  <p className="text-sm text-muted-foreground">Let users submit feedback without an account</p>
                </div>
                <Switch 
                  id="allow-anonymous" 
                  checked={portalConfig.allowAnonymous} 
                  onCheckedChange={(checked) => handleConfigChange('allowAnonymous', checked)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require-approval">Require Approval</Label>
                  <p className="text-sm text-muted-foreground">Review feedback before it appears publicly</p>
                </div>
                <Switch 
                  id="require-approval" 
                  checked={portalConfig.requireApproval} 
                  onCheckedChange={(checked) => handleConfigChange('requireApproval', checked)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable-voting">Enable Voting</Label>
                  <p className="text-sm text-muted-foreground">Allow users to upvote feedback items</p>
                </div>
                <Switch 
                  id="enable-voting" 
                  checked={portalConfig.enableVoting}
                  onCheckedChange={(checked) => handleConfigChange('enableVoting', checked)}  
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow-comments">Allow Comments</Label>
                  <p className="text-sm text-muted-foreground">Enable users to comment on feedback</p>
                </div>
                <Switch 
                  id="allow-comments" 
                  checked={portalConfig.allowComments}
                  onCheckedChange={(checked) => handleConfigChange('allowComments', checked)}  
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notify-feedback">Notification on New Feedback</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications when new feedback is submitted</p>
                </div>
                <Switch 
                  id="notify-feedback" 
                  checked={portalConfig.notifyOnNewFeedback} 
                  onCheckedChange={(checked) => handleConfigChange('notifyOnNewFeedback', checked)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="custom-branding">Custom Branding</Label>
                  <p className="text-sm text-muted-foreground">Apply your company branding to the portal</p>
                </div>
                <Switch 
                  id="custom-branding" 
                  checked={portalConfig.customBranding} 
                  onCheckedChange={(checked) => handleConfigChange('customBranding', checked)} 
                />
              </div>
              
              <Button className="w-full mt-4" onClick={() => toast({ title: "Settings saved", description: "Your portal configuration has been updated." })}>
                Save Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
