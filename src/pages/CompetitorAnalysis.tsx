
import { PageTitle } from "@/components/common/PageTitle";
import { CompetitorList } from "@/components/competitors/CompetitorList";
import { CompetitorComparison } from "@/components/competitors/CompetitorComparison";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CompetitorAnalysis = () => {
  return (
    <>
      <PageTitle
        title="Competitor Analysis"
        description="Track and analyze competitors' products and features"
      />
      
      <Tabs defaultValue="competitors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="comparison">Feature Comparison</TabsTrigger>
        </TabsList>
        <TabsContent value="competitors" className="space-y-4">
          <CompetitorList />
        </TabsContent>
        <TabsContent value="comparison" className="space-y-4">
          <CompetitorComparison />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default CompetitorAnalysis;
