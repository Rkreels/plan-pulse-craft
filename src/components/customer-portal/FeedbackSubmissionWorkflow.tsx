
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { Upload, FileText, Image, Video, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface FeedbackSubmission {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "submitted" | "under_review" | "in_progress" | "completed" | "rejected";
  attachments: File[];
  customerEmail: string;
  submittedAt: Date;
  votes: number;
}

export function FeedbackSubmissionWorkflow() {
  const { toast } = useToast();
  const { addFeedback } = useAppContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>([
    {
      id: "sub-1",
      title: "Mobile app crashes on startup",
      description: "The app crashes immediately when I try to open it on iOS 17",
      category: "Bug Report",
      priority: "high",
      status: "in_progress",
      attachments: [],
      customerEmail: "user@example.com",
      submittedAt: new Date(2024, 11, 15),
      votes: 23
    },
    {
      id: "sub-2",
      title: "Add dark mode support",
      description: "Would love to have a dark theme option for better night time usage",
      category: "Feature Request",
      priority: "medium",
      status: "under_review",
      attachments: [],
      customerEmail: "user2@example.com",
      submittedAt: new Date(2024, 11, 10),
      votes: 156
    }
  ]);

  const [newSubmission, setNewSubmission] = useState({
    title: "",
    description: "",
    category: "Feature Request",
    priority: "medium" as const,
    customerEmail: "",
    attachments: [] as File[]
  });

  const steps = [
    { number: 1, title: "Basic Information", description: "Tell us about your feedback" },
    { number: 2, title: "Details & Attachments", description: "Provide additional context" },
    { number: 3, title: "Review & Submit", description: "Confirm your submission" }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target?.files || []);
    setNewSubmission(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setNewSubmission(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    const submission: FeedbackSubmission = {
      id: `sub-${Date.now()}`,
      ...newSubmission,
      status: "submitted",
      submittedAt: new Date(),
      votes: 0
    };

    setSubmissions(prev => [submission, ...prev]);
    
    // Add to global context
    addFeedback({
      id: submission.id,
      title: submission.title,
      description: submission.description,
      source: "customer",
      status: "new",
      votes: 0,
      features: [],
      submittedBy: submission.customerEmail,
      createdAt: new Date(),
      workspaceId: "workspace-1"
    });

    toast({
      title: "Feedback submitted successfully!",
      description: "We'll review your feedback and get back to you soon."
    });

    // Reset form
    setNewSubmission({
      title: "",
      description: "",
      category: "Feature Request",
      priority: "medium",
      customerEmail: "",
      attachments: []
    });
    setCurrentStep(1);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "under_review":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "bg-yellow-500";
      case "under_review": return "bg-blue-500";
      case "in_progress": return "bg-orange-500";
      case "completed": return "bg-green-500";
      case "rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Submission Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit New Feedback</CardTitle>
          <CardDescription>Help us improve by sharing your thoughts and suggestions</CardDescription>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-4">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step.number}
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
                {step.number < steps.length && (
                  <div className={`w-8 h-px mx-4 ${
                    currentStep > step.number ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of your feedback"
                  value={newSubmission.title}
                  onChange={(e) => setNewSubmission(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={newSubmission.category} onValueChange={(value) => setNewSubmission(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Feature Request">Feature Request</SelectItem>
                      <SelectItem value="Bug Report">Bug Report</SelectItem>
                      <SelectItem value="Improvement">Improvement</SelectItem>
                      <SelectItem value="Question">Question</SelectItem>
                      <SelectItem value="Complaint">Complaint</SelectItem>
                      <SelectItem value="Compliment">Compliment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newSubmission.priority} onValueChange={(value: any) => setNewSubmission(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
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
              
              <div className="space-y-2">
                <Label htmlFor="email">Your Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={newSubmission.customerEmail}
                  onChange={(e) => setNewSubmission(prev => ({ ...prev, customerEmail: e.target.value }))}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => setCurrentStep(2)}
                  disabled={!newSubmission.title || !newSubmission.customerEmail}
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  rows={5}
                  placeholder="Please provide detailed information about your feedback..."
                  value={newSubmission.description}
                  onChange={(e) => setNewSubmission(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Attachments (optional)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <div className="text-sm text-muted-foreground mb-2">
                      Drop files here or click to upload
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Choose Files
                      </label>
                    </Button>
                  </div>
                </div>
                
                {newSubmission.attachments.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Files:</Label>
                    {newSubmission.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          {file.type.startsWith('image/') ? <Image className="h-4 w-4" /> : 
                           file.type.startsWith('video/') ? <Video className="h-4 w-4" /> : 
                           <FileText className="h-4 w-4" />}
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Previous
                </Button>
                <Button 
                  onClick={() => setCurrentStep(3)}
                  disabled={!newSubmission.description}
                >
                  Review
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Review Your Submission</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Title:</strong> {newSubmission.title}</div>
                  <div><strong>Category:</strong> {newSubmission.category}</div>
                  <div><strong>Priority:</strong> {newSubmission.priority}</div>
                  <div><strong>Email:</strong> {newSubmission.customerEmail}</div>
                  <div><strong>Description:</strong> {newSubmission.description}</div>
                  {newSubmission.attachments.length > 0 && (
                    <div><strong>Attachments:</strong> {newSubmission.attachments.length} file(s)</div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Previous
                </Button>
                <Button onClick={handleSubmit}>
                  Submit Feedback
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission History */}
      <Card>
        <CardHeader>
          <CardTitle>Your Feedback History</CardTitle>
          <CardDescription>Track the status of your submitted feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium">{submission.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{submission.category}</Badge>
                      <Badge className={getStatusColor(submission.status)}>
                        {getStatusIcon(submission.status)}
                        <span className="ml-1">{submission.status.replace('_', ' ')}</span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {submission.submittedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{submission.votes} votes</div>
                    <div className="text-xs text-muted-foreground">Priority: {submission.priority}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{submission.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
