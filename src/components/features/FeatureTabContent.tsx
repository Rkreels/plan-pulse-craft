
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { FeatureCard } from "./FeatureCard";
import { Feature, Epic } from "@/types";
import { useAppContext } from "@/contexts/AppContext";

interface FeatureTabContentProps {
  activeTab: string;
  features: Feature[];
  epics: Epic[];
}

const FeatureTabContent: React.FC<FeatureTabContentProps> = ({
  activeTab,
  features,
  epics
}) => {
  const { updateFeature, deleteFeature } = useAppContext();

  const handleStatusChange = (feature: Feature, newStatus: Feature["status"]) => {
    updateFeature({
      ...feature,
      status: newStatus,
      updatedAt: new Date()
    });
  };

  const renderListView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map(feature => (
        <FeatureCard
          key={feature.id}
          feature={feature}
          onEdit={() => {}} // Will be connected to dialog
          onDelete={deleteFeature}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );

  const renderBoardView = () => {
    const columns = {
      backlog: features.filter(f => f.status === "backlog"),
      planned: features.filter(f => f.status === "planned"),
      in_progress: features.filter(f => f.status === "in_progress"),
      review: features.filter(f => f.status === "review"),
      completed: features.filter(f => f.status === "completed")
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(columns).map(([status, columnFeatures]) => (
          <div key={status} className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold capitalize">{status.replace('_', ' ')}</h3>
              <span className="text-sm text-muted-foreground bg-background px-2 py-1 rounded">
                {columnFeatures.length}
              </span>
            </div>
            <div className="space-y-3">
              {columnFeatures.map(feature => (
                <div key={feature.id} className="bg-background rounded border p-3">
                  <h4 className="font-medium text-sm mb-2 line-clamp-2">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {feature.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {feature.priority}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {feature.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDependenciesView = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">Feature Dependencies</h3>
        <p className="text-muted-foreground">
          Visual dependency mapping will be implemented here
        </p>
      </div>
      
      {features.filter(f => f.dependencies && f.dependencies.length > 0).map(feature => (
        <div key={feature.id} className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">{feature.title}</h4>
          <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
          <div>
            <strong className="text-sm">Dependencies:</strong>
            <div className="mt-2 flex flex-wrap gap-2">
              {feature.dependencies?.map(depId => {
                const depFeature = features.find(f => f.id === depId);
                return depFeature ? (
                  <span key={depId} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    {depFeature.title}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <TabsContent value="list" className="mt-6">
        {renderListView()}
      </TabsContent>
      
      <TabsContent value="board" className="mt-6">
        {renderBoardView()}
      </TabsContent>
      
      <TabsContent value="dependencies" className="mt-6">
        {renderDependenciesView()}
      </TabsContent>
    </>
  );
};

export default FeatureTabContent;
