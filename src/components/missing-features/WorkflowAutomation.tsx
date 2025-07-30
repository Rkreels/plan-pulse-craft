import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, Plus, Settings, Play, Pause, RotateCcw, Clock, 
  ArrowRight, CheckCircle, AlertCircle, Users, Bell, Mail, 
  Calendar, GitBranch, Filter, Edit, Trash2, Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  enabled: boolean;
  lastRun?: string;
  runCount: number;
  createdAt: string;
  createdBy: string;
}

interface WorkflowTrigger {
  type: 'status_change' | 'field_update' | 'time_based' | 'manual' | 'comment_added';
  entity: 'feature' | 'task' | 'goal' | 'release' | 'feedback';
  config: Record<string, any>;
}

interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value: string;
}

interface WorkflowAction {
  type: 'update_field' | 'send_notification' | 'create_task' | 'assign_user' | 'send_email' | 'webhook' | 'add_comment';
  config: Record<string, any>;
}

export const WorkflowAutomation: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([
    {
      id: '1',
      name: 'Auto-assign high priority features',
      description: 'Automatically assign high priority features to the product manager',
      trigger: {
        type: 'field_update',
        entity: 'feature',
        config: { field: 'priority' }
      },
      conditions: [
        { field: 'priority', operator: 'equals', value: 'high' }
      ],
      actions: [
        { 
          type: 'assign_user', 
          config: { userId: 'pm-001', role: 'product_manager' } 
        },
        {
          type: 'send_notification',
          config: { message: 'High priority feature requires attention', users: ['pm-001'] }
        }
      ],
      enabled: true,
      runCount: 15,
      createdAt: '2024-01-15',
      createdBy: 'John Doe'
    },
    {
      id: '2',
      name: 'Notify stakeholders on release',
      description: 'Send email notifications when features are moved to released status',
      trigger: {
        type: 'status_change',
        entity: 'feature',
        config: { field: 'status', to: 'released' }
      },
      conditions: [],
      actions: [
        {
          type: 'send_email',
          config: { 
            template: 'feature_released',
            to: 'stakeholders',
            subject: 'Feature Released: {{feature.title}}'
          }
        },
        {
          type: 'add_comment',
          config: { message: 'Feature has been released to production' }
        }
      ],
      enabled: true,
      runCount: 8,
      createdAt: '2024-01-12',
      createdBy: 'Jane Smith'
    },
    {
      id: '3',
      name: 'Overdue task escalation',
      description: 'Escalate tasks that are overdue by more than 2 days',
      trigger: {
        type: 'time_based',
        entity: 'task',
        config: { schedule: 'daily', time: '09:00' }
      },
      conditions: [
        { field: 'dueDate', operator: 'less_than', value: 'now-2d' },
        { field: 'status', operator: 'not_equals', value: 'completed' }
      ],
      actions: [
        {
          type: 'update_field',
          config: { field: 'priority', value: 'high' }
        },
        {
          type: 'send_notification',
          config: { 
            message: 'Task {{task.title}} is overdue and has been escalated',
            users: ['assignee', 'manager']
          }
        }
      ],
      enabled: false,
      runCount: 0,
      createdAt: '2024-01-10',
      createdBy: 'Mike Johnson'
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowRule | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleToggleWorkflow = (workflowId: string) => {
    setWorkflows(workflows.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, enabled: !workflow.enabled }
        : workflow
    ));
    
    const workflow = workflows.find(w => w.id === workflowId);
    toast({
      title: `Workflow ${workflow?.enabled ? 'Disabled' : 'Enabled'}`,
      description: `"${workflow?.name}" has been ${workflow?.enabled ? 'disabled' : 'enabled'}.`
    });
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    setWorkflows(workflows.filter(w => w.id !== workflowId));
    toast({
      title: "Workflow Deleted",
      description: "The workflow has been permanently removed."
    });
  };

  const handleDuplicateWorkflow = (workflow: WorkflowRule) => {
    const duplicatedWorkflow: WorkflowRule = {
      ...workflow,
      id: Date.now().toString(),
      name: `${workflow.name} (Copy)`,
      enabled: false,
      runCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Current User'
    };
    
    setWorkflows([...workflows, duplicatedWorkflow]);
    toast({
      title: "Workflow Duplicated",
      description: `"${duplicatedWorkflow.name}" has been created.`
    });
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'status_change': return <GitBranch className="h-4 w-4" />;
      case 'field_update': return <Edit className="h-4 w-4" />;
      case 'time_based': return <Clock className="h-4 w-4" />;
      case 'manual': return <Play className="h-4 w-4" />;
      case 'comment_added': return <Bell className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'send_notification': return <Bell className="h-4 w-4" />;
      case 'send_email': return <Mail className="h-4 w-4" />;
      case 'assign_user': return <Users className="h-4 w-4" />;
      case 'create_task': return <Plus className="h-4 w-4" />;
      case 'update_field': return <Edit className="h-4 w-4" />;
      case 'add_comment': return <Bell className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflow Automation</h1>
          <p className="text-muted-foreground">
            Automate repetitive tasks and streamline your product management workflows
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Workflow</DialogTitle>
              <DialogDescription>
                Set up automated rules to streamline your product management processes
              </DialogDescription>
            </DialogHeader>
            <WorkflowBuilder onSave={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Workflows</p>
                <p className="text-2xl font-bold">{workflows.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-2xl font-bold">{workflows.filter(w => w.enabled).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Inactive</p>
                <p className="text-2xl font-bold">{workflows.filter(w => !w.enabled).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Total Runs</p>
                <p className="text-2xl font-bold">{workflows.reduce((acc, w) => acc + w.runCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getTriggerIcon(workflow.trigger.type)}
                    <h3 className="font-semibold text-lg">{workflow.name}</h3>
                  </div>
                  <Badge variant={workflow.enabled ? "default" : "secondary"}>
                    {workflow.enabled ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={workflow.enabled}
                    onCheckedChange={() => handleToggleWorkflow(workflow.id)}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedWorkflow(workflow)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDuplicateWorkflow(workflow)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteWorkflow(workflow.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">{workflow.description}</p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    {getTriggerIcon(workflow.trigger.type)}
                    Trigger
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {workflow.trigger.type.replace('_', ' ')} on {workflow.trigger.entity}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Conditions
                  </h4>
                  <div className="space-y-1">
                    {workflow.conditions.length > 0 ? (
                      workflow.conditions.slice(0, 2).map((condition, index) => (
                        <Badge key={index} variant="outline" className="text-xs block w-fit">
                          {condition.field} {condition.operator} {condition.value}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="text-xs">No conditions</Badge>
                    )}
                    {workflow.conditions.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{workflow.conditions.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Actions
                  </h4>
                  <div className="space-y-1">
                    {workflow.actions.slice(0, 2).map((action, index) => (
                      <Badge key={index} variant="outline" className="text-xs flex items-center gap-1 w-fit">
                        {getActionIcon(action.type)}
                        {action.type.replace('_', ' ')}
                      </Badge>
                    ))}
                    {workflow.actions.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{workflow.actions.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  Created by {workflow.createdBy} on {workflow.createdAt}
                </div>
                <div>
                  Executed {workflow.runCount} times
                  {workflow.lastRun && ` • Last run: ${workflow.lastRun}`}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Detail Dialog */}
      {selectedWorkflow && (
        <Dialog open={!!selectedWorkflow} onOpenChange={() => setSelectedWorkflow(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getTriggerIcon(selectedWorkflow.trigger.type)}
                {selectedWorkflow.name}
              </DialogTitle>
              <DialogDescription>
                Detailed workflow configuration and execution history
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Trigger Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      {getTriggerIcon(selectedWorkflow.trigger.type)}
                      <span className="font-medium">{selectedWorkflow.trigger.type.replace('_', ' ')}</span>
                      <Badge variant="outline">{selectedWorkflow.trigger.entity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedWorkflow.description}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Execution Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Runs:</span>
                        <span className="font-medium">{selectedWorkflow.runCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge variant={selectedWorkflow.enabled ? "default" : "secondary"}>
                          {selectedWorkflow.enabled ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span className="font-medium">{selectedWorkflow.createdAt}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Conditions:</span>
                        <span className="font-medium">{selectedWorkflow.conditions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Actions:</span>
                        <span className="font-medium">{selectedWorkflow.actions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Created by:</span>
                        <span className="font-medium">{selectedWorkflow.createdBy}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="conditions">
                <Card>
                  <CardHeader>
                    <CardTitle>Workflow Conditions</CardTitle>
                    <CardDescription>
                      All conditions must be met for the workflow to execute
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedWorkflow.conditions.length > 0 ? (
                      <div className="space-y-3">
                        {selectedWorkflow.conditions.map((condition, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <span className="font-medium">{condition.field}</span>
                                <Badge variant="outline">{condition.operator}</Badge>
                                <span className="text-muted-foreground">{condition.value}</span>
                              </div>
                              {index < selectedWorkflow.conditions.length - 1 && (
                                <Badge variant="secondary">AND</Badge>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No conditions configured. This workflow will execute for all trigger events.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="actions">
                <Card>
                  <CardHeader>
                    <CardTitle>Workflow Actions</CardTitle>
                    <CardDescription>
                      Actions that will be executed when conditions are met
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedWorkflow.actions.map((action, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {getActionIcon(action.type)}
                                <span className="font-medium">{action.type.replace('_', ' ')}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {Object.entries(action.config).map(([key, value]) => (
                                  <div key={key}>
                                    <strong>{key}:</strong> {String(value)}
                                  </div>
                                ))}
                              </div>
                            </div>
                            {index < selectedWorkflow.actions.length - 1 && (
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Execution History</CardTitle>
                    <CardDescription>
                      Recent workflow executions and their results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No execution history available</p>
                      <p className="text-sm">Workflow execution logs will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const WorkflowBuilder: React.FC<{ onSave: () => void }> = ({ onSave }) => {
  return (
    <div className="space-y-6">
      <div className="text-center py-8 text-muted-foreground">
        <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Workflow Builder Coming Soon</p>
        <p className="text-sm">Advanced workflow creation interface will be available here</p>
      </div>
      <div className="flex justify-end">
        <Button onClick={onSave}>Close</Button>
      </div>
    </div>
  );
};