
import React from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntegrationsGallery } from "@/components/integrations/IntegrationsGallery";
import { IntegrationManager } from "@/components/integrations/IntegrationManager";
import { IntegrationHistory } from "@/components/integrations/IntegrationHistory";

const Integrations = () => {
  return (
    <div className="space-y-6">
      <PageTitle 
        title="Integrations" 
        description="Connect your favorite tools and automate workflows"
      />
      
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Integrations</TabsTrigger>
          <TabsTrigger value="gallery">Available Integrations</TabsTrigger>
          <TabsTrigger value="history">Sync History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <IntegrationManager />
        </TabsContent>
        
        <TabsContent value="gallery">
          <IntegrationsGallery />
        </TabsContent>
        
        <TabsContent value="history">
          <IntegrationHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Integrations;
