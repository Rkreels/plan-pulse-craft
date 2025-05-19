
import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { PageTitle } from "@/components/common/PageTitle";
import { IntegrationsGallery } from "@/components/integrations/IntegrationsGallery";
import { IntegrationConfig } from "@/components/integrations/IntegrationConfig";
import { IntegrationHistory } from "@/components/integrations/IntegrationHistory";

const Integrations = () => {
  const [activeIntegration, setActiveIntegration] = useState<string | null>(null);
  
  return (
    <>
      <PageTitle
        title="Integrations"
        description="Connect and manage third-party tools and services"
      />
      
      <Tabs defaultValue="gallery" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gallery">Integration Gallery</TabsTrigger>
          <TabsTrigger value="active">Active Integrations</TabsTrigger>
          <TabsTrigger value="history">Activity History</TabsTrigger>
        </TabsList>
        <TabsContent value="gallery" className="space-y-4">
          <IntegrationsGallery onSelectIntegration={setActiveIntegration} />
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          {activeIntegration ? (
            <IntegrationConfig integrationId={activeIntegration} />
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No integration selected</h3>
              <p className="text-muted-foreground">Select an integration from the gallery to configure</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <IntegrationHistory />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Integrations;
