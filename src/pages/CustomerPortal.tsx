
import { PageTitle } from "@/components/common/PageTitle";
import { CustomerFeedbackPortal } from "@/components/customer-portal/CustomerFeedbackPortal";
import { CustomerInsights } from "@/components/customer-portal/CustomerInsights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CustomerPortal = () => {
  return (
    <>
      <PageTitle
        title="Customer Portal"
        description="Manage customer feedback and engagement"
      />
      
      <Tabs defaultValue="portal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="portal">Feedback Portal</TabsTrigger>
          <TabsTrigger value="insights">Customer Insights</TabsTrigger>
          <TabsTrigger value="settings">Portal Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="portal" className="space-y-4">
          <CustomerFeedbackPortal />
        </TabsContent>
        <TabsContent value="insights" className="space-y-4">
          <CustomerInsights />
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <h2 className="text-lg font-medium">Portal Settings</h2>
          <p className="text-muted-foreground">Configure your customer feedback portal appearance and behavior.</p>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default CustomerPortal;
