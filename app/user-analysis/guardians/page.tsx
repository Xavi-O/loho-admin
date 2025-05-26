// app/user-analysis/guardians/page.tsx

'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MetricsOverview from '@/components/analytics/MetricsOverview';
import DataTableTab from '@/components/analytics/DataTableTab';
import AnalyticsSidebarLayout from '@/components/analytics/AnalyticsSidebarLayout';

export default function UserAnalyticsPage() {
  return (
    <AnalyticsSidebarLayout active="guardians">
      <Tabs defaultValue="overview" className="mx-10 space-y-6">
        <TabsList className="w-full flex justify-start mb-4">
          <TabsTrigger value="overview">Visualization</TabsTrigger>
          <TabsTrigger value="table">Data Table</TabsTrigger>
        </TabsList>
    
        <TabsContent value="overview">
          <MetricsOverview
            collectionName="guardians"
            countField="type"
            countValues={['Guardian', 'Teacher']}
          />
        </TabsContent>
    
        <TabsContent value="table">
          <DataTableTab
            collectionName="guardians"
            defaultHiddenColumns={[
              "profile_image",
              "password",
              "basic_package",
              "government_package",
              "premium_package",
              "gold_package",
              "__v",
            ]}
          />
        </TabsContent>
      </Tabs>
    </AnalyticsSidebarLayout>
  );
}
