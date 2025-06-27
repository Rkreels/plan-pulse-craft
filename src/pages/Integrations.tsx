
import React from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntegrationsGallery } from "@/components/integrations/IntegrationsGallery";
import { IntegrationConfig } from "@/components/integrations/IntegrationConfig";
import { IntegrationHistory } from "@/components/integrations/IntegrationHistory";

const Integrations = () => {
  return (
    <div className="space-y-6">
      <PageTitle 
        title="Integrations" 
        description="Connect your favorite tools and automate workflows"
      />
      
      <Tabs defaultValue="gallery" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gallery">Available Integrations</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="history">Sync History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gallery">
          <IntegrationsGallery />
        </TabsContent>
        
        <TabsContent value="config">
          <IntegrationConfig />
        </TabsContent>
        
        <TabsContent value="history">
          <IntegrationHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Integrations;
