
import { PageTitle } from "@/components/common/PageTitle";
import { StrategicInitiatives } from "@/components/strategy/StrategicInitiatives";
import { StrategicThemes } from "@/components/strategy/StrategicThemes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Strategy = () => {
  return (
    <>
      <PageTitle
        title="Strategic Planning"
        description="Define and track your product strategy and initiatives"
      />
      
      <Tabs defaultValue="initiatives" className="space-y-4">
        <TabsList>
          <TabsTrigger value="initiatives">Strategic Initiatives</TabsTrigger>
          <TabsTrigger value="themes">Strategic Themes</TabsTrigger>
        </TabsList>
        <TabsContent value="initiatives" className="space-y-4">
          <StrategicInitiatives />
        </TabsContent>
        <TabsContent value="themes" className="space-y-4">
          <StrategicThemes />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Strategy;
