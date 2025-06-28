
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { Plus, ThumbsUp, MessageSquare, Star, Filter, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CustomerFeedback {
  id: string;
  title: string;
  description: string;
  category: "bug" | "feature" | "improvement" | "question";
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_review" | "planned" | "in_progress" | "completed" | "closed";
  votes: number;
  author: string;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  responses: Response[];
}

interface Response {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  isStaff: boolean;
}

export const CustomerFeedbackPortal = () => {
  const { toast } = useToast();
  const { currentUser } = useAppContext();
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedFeedback, setSelectedFeedback] = useState<CustomerFeedback | null>(null);

  const [feedbackList, setFeedbackList] = useState<CustomerFeedback[]>([
    {
      id: "feedback-1",
      title: "Add dark mode support",
      description: "It would be great to have a dark mode option for better user experience during night time usage.",
      category: "feature",
      priority: "medium",
      status: "planned",
      votes: 24,
      author: "John Customer",
      authorEmail: "john@customer.com",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      tags: ["ui", "accessibility"],
      responses: [
        {
          id: "resp-1",
          author: "Product Team",
          message: "Thanks for the suggestion! We're considering this for our next major release.",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          isStaff: true
        }
      ]
    },
    {
      id: "feedback-2",
      title: "Export feature not working",
      description: "When trying to export data to CSV, I get an error message and the download doesn't start.",
      category: "bug",
      priority: "high",
      status: "in_progress",
      votes: 8,
      author: "Sarah Business",
      authorEmail: "sarah@business.com",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
      tags: ["export", "csv", "bug"],
      responses: [
        {
          id: "resp-2",
          author: "Support Team",
          message: "We've identified the issue and are working on a fix. Expected to be resolved by end of week.",
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          isStaff: true
        }
      ]
    },
    {
      id: "feedback-3",
      title: "Improve search functionality",
      description: "The current search is quite basic. Would love to see filters, advanced search options, and better result ranking.",
      category: "improvement",
      priority: "medium",
      status: "in_review",
      votes: 15,
      author: "Mike Power",
      authorEmail: "mike@power.com",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date(Date.now() - 259200000).toISOString(),
      tags: ["search", "ux"],
      responses: []
    }
  ]);

  const [newFeedback, setNewFeedback] = useState({
    title: "",
    description: "",
    category: "feature" as CustomerFeedback["category"],
    priority: "medium" as CustomerFeedback["priority"]
  });

  const handleSubmitFeedback = () => {
    if (!newFeedback.title.trim() || !newFeedback.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const feedback: CustomerFeedback = {
      id: `feedback-${Date.now()}`,
      title: newFeedback.title,
      description: newFeedback.description,
      category: newFeedback.category,
      priority: newFeedback.priority,
      status: "open",
      votes: 0,
      author: currentUser?.name || "Anonymous",
      authorEmail: currentUser?.email || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      responses: []
    };

    setFeedbackList(prev => [feedback, ...prev]);
    setNewFeedback({ title: "", description: "", category: "feature", priority: "medium" });
    setShowFeedbackDialog(false);
    
    toast({
      title: "Feedback submitted",
      description: "Thank you for your feedback! We'll review it soon."
    });
  };

  const handleVote = (feedbackId: string) => {
    setFeedbackList(prev => prev.map(feedback => 
      feedback.id === feedbackId 
        ? { ...feedback, votes: feedback.votes + 1, updatedAt: new Date().toISOString() }
        : feedback
    ));
    
    toast({
      title: "Vote recorded",
      description: "Thanks for voting on this feedback!"
    });
  };

  const handleAddResponse = (feedbackId: string, message: string) => {
    const newResponse: Response = {
      id: `resp-${Date.now()}`,
      author: currentUser?.name || "Anonymous",
      message: message,
      createdAt: new Date().toISOString(),
      isStaff: false
    };

    setFeedbackList(prev => prev.map(feedback => 
      feedback.id === feedbackId 
        ? { 
            ...feedback, 
            responses: [...feedback.responses, newResponse],
            updatedAt: new Date().toISOString()
          }
        : feedback
    ));
    
    toast({
      title: "Response added",
      description: "Your response has been added to the feedback."
    });
  };

  const filteredFeedback = feedbackList.filter(feedback => {
    const matchesSearch = searchQuery === "" || 
      feedback.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || feedback.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || feedback.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryColor = (category: CustomerFeedback["category"]) => {
    switch (category) {
      case "bug": return "bg-red-100 text-red-800";
      case "feature": return "bg-blue-100 text-blue-800";
      case "improvement": return "bg-green-100 text-green-800";
      case "question": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: CustomerFeedback["status"]) => {
    switch (status) {
      case "open": return "bg-yellow-100 text-yellow-800";
      case "in_review": return "bg-blue-100 text-blue-800";
      case "planned": return "bg-purple-100 text-purple-800";
      case "in_progress": return "bg-orange-100 text-orange-800";
      case "completed": return "bg-green-100 text-green-800";
      case "closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: CustomerFeedback["priority"]) => {
    switch (priority) {
      case "critical": return "bg-red-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  if (selectedFeedback) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedFeedback(null)}>
            ← Back to Feedback
          </Button>
          <div className="flex gap-2">
            <Badge className={getCategoryColor(selectedFeedback.category)}>
              {selectedFeedback.category}
            </Badge>
            <Badge className={getStatusColor(selectedFeedback.status)}>
              {selectedFeedback.status}
            </Badge>
            <Badge className={getPriorityColor(selectedFeedback.priority)}>
              {selectedFeedback.priority}
            </Badge>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{selectedFeedback.title}</CardTitle>
                <CardDescription>
                  By {selectedFeedback.author} • {new Date(selectedFeedback.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleVote(selectedFeedback.id)}
                className="gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                {selectedFeedback.votes}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{selectedFeedback.description}</p>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Responses ({selectedFeedback.responses.length})</h3>
              {selectedFeedback.responses.map(response => (
                <div key={response.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{response.author}</span>
                    {response.isStaff && (
                      <Badge variant="secondary" className="text-xs">Staff</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(response.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{response.message}</p>
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <Textarea 
                  placeholder="Add a response..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      const target = e.target as HTMLTextAreaElement;
                      if (target.value.trim()) {
                        handleAddResponse(selectedFeedback.id, target.value);
                        target.value = "";
                      }
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Press Ctrl+Enter to submit
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Customer Feedback</h2>
          <p className="text-muted-foreground">Share your ideas and report issues</p>
        </div>
        
        <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Submit Feedback
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Submit New Feedback</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newFeedback.title}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of your feedback"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newFeedback.description}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed information about your feedback"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newFeedback.category} onValueChange={(value: CustomerFeedback["category"]) => setNewFeedback(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="improvement">Improvement</SelectItem>
                      <SelectItem value="question">Question</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newFeedback.priority} onValueChange={(value: CustomerFeedback["priority"]) => setNewFeedback(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitFeedback}>
                  Submit Feedback
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="feature">Features</SelectItem>
            <SelectItem value="bug">Bugs</SelectItem>
            <SelectItem value="improvement">Improvements</SelectItem>
            <SelectItem value="question">Questions</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Feedback List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredFeedback.map(feedback => (
          <Card key={feedback.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3" onClick={() => setSelectedFeedback(feedback)}>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{feedback.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getCategoryColor(feedback.category)}>
                      {feedback.category}
                    </Badge>
                    <Badge className={getStatusColor(feedback.status)}>
                      {feedback.status}
                    </Badge>
                    <Badge className={getPriorityColor(feedback.priority)}>
                      {feedback.priority}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(feedback.id);
                  }}
                  className="gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  {feedback.votes}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0" onClick={() => setSelectedFeedback(feedback)}>
              <p className="text-muted-foreground mb-3 line-clamp-2">{feedback.description}</p>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>By {feedback.author}</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {feedback.responses.length}
                  </span>
                  <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
