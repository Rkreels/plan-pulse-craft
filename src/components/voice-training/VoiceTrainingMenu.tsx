import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Play, Clock, Lightbulb, Target, Keyboard } from 'lucide-react';
import { useVoiceTraining, VOICE_GUIDES } from './EnhancedVoiceTrainingProvider';

export const VoiceTrainingMenu: React.FC = () => {
  const { startTraining, isActive } = useVoiceTraining();
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  const guideCategories = {
    'Core Features': ['dashboard', 'features', 'roadmap', 'goals', 'tasks'],
    'Customer & Business': ['feedback', 'releases', 'analytics', 'reports'],
    'Planning & Admin': ['capacity', 'settings']
  };

  const handleStartGuide = (moduleKey: string) => {
    const guide = VOICE_GUIDES[moduleKey];
    if (guide) {
      startTraining(moduleKey, guide);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BookOpen className="h-4 w-4" />
          Voice Training Center
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Voice Training Center
          </DialogTitle>
          <DialogDescription>
            Learn how to use all features with comprehensive voice-guided tutorials
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="guides">Training Guides</TabsTrigger>
            <TabsTrigger value="features">Missing Features Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Play className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold">Interactive Training</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Step-by-step voice guidance for every feature and workflow
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">Context-Aware</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Training automatically adapts to your current page and actions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold">Use Case Focused</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Learn practical applications and real-world scenarios
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How Voice Training Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-medium">Select a Module</h4>
                    <p className="text-sm text-muted-foreground">Choose the feature or workflow you want to learn</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-medium">Listen and Follow</h4>
                    <p className="text-sm text-muted-foreground">Voice guide explains each step with visual highlights</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-medium">Practice & Apply</h4>
                    <p className="text-sm text-muted-foreground">Use tips and shortcuts to master the feature</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides" className="space-y-4">
            <ScrollArea className="h-96 pr-4">
              {Object.entries(guideCategories).map(([category, modules]) => (
                <div key={category} className="mb-6">
                  <h3 className="font-semibold text-lg mb-3 text-primary">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {modules.map((moduleKey) => {
                      const guide = VOICE_GUIDES[moduleKey];
                      if (!guide) return null;

                      return (
                        <Card key={moduleKey} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{guide.module}</h4>
                              <Badge variant="secondary">{guide.steps.length} steps</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                              {guide.overview}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleStartGuide(moduleKey)}
                                disabled={isActive}
                                className="flex-1"
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Start Guide
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedGuide(moduleKey)}
                              >
                                Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Features Comparison with Aha!
                </CardTitle>
                <CardDescription>
                  Analysis of what's available vs. Aha! capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">✅ Available Features</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Strategic roadmap planning</li>
                      <li>• Feature prioritization & management</li>
                      <li>• Goal setting & tracking (OKRs)</li>
                      <li>• Release planning & management</li>
                      <li>• Task management & time tracking</li>
                      <li>• Customer feedback collection</li>
                      <li>• Analytics & reporting</li>
                      <li>• Team capacity planning</li>
                      <li>• Multiple roadmap views</li>
                      <li>• Custom dashboards</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-600 mb-2">🔄 Enhanced Features</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Advanced portfolio management</li>
                      <li>• Idea scoring & prioritization</li>
                      <li>• Competitive analysis tools</li>
                      <li>• Advanced integration hub</li>
                      <li>• Custom field configuration</li>
                      <li>• Workflow automation</li>
                      <li>• Advanced permissions</li>
                      <li>• White-label customization</li>
                      <li>• API documentation & tools</li>
                      <li>• Enterprise SSO integration</li>
                    </ul>
                  </div>
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">🎯 Voice Training Benefits</h4>
                    <p className="text-sm text-blue-700">
                      Our comprehensive voice training system goes beyond what Aha! offers by providing:
                    </p>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• Interactive, step-by-step voice guidance for every feature</li>
                      <li>• Context-aware training that adapts to user actions</li>
                      <li>• Comprehensive use case scenarios and tips</li>
                      <li>• Accessibility-first design for all user types</li>
                      <li>• Immediate interruption and context switching</li>
                    </ul>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedGuide && (
          <Dialog open={!!selectedGuide} onOpenChange={() => setSelectedGuide(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{VOICE_GUIDES[selectedGuide]?.title}</DialogTitle>
                <DialogDescription>
                  {VOICE_GUIDES[selectedGuide]?.overview}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-96 pr-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Training Steps</h4>
                    <div className="space-y-2">
                      {VOICE_GUIDES[selectedGuide]?.steps.map((step, index) => (
                        <div key={step.id} className="flex gap-3 p-2 border rounded">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h5 className="font-medium text-sm">{step.action}</h5>
                            <p className="text-xs text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Tips & Best Practices
                    </h4>
                    <ul className="text-sm space-y-1">
                      {VOICE_GUIDES[selectedGuide]?.tips.map((tip, index) => (
                        <li key={index}>• {tip}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Common Use Cases
                    </h4>
                    <ul className="text-sm space-y-1">
                      {VOICE_GUIDES[selectedGuide]?.useCases.map((useCase, index) => (
                        <li key={index}>• {useCase}</li>
                      ))}
                    </ul>
                  </div>

                  {VOICE_GUIDES[selectedGuide]?.shortcuts && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Keyboard className="h-4 w-4" />
                        Keyboard Shortcuts
                      </h4>
                      <ul className="text-sm space-y-1">
                        {VOICE_GUIDES[selectedGuide].shortcuts!.map((shortcut, index) => (
                          <li key={index} className="font-mono bg-muted px-2 py-1 rounded text-xs">
                            {shortcut}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleStartGuide(selectedGuide)} disabled={isActive} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Start Training
                </Button>
                <Button variant="outline" onClick={() => setSelectedGuide(null)}>
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};