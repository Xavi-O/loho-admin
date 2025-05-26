// app/user-analysis/publishers/page.tsx

'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTableTab from '@/components/analytics/DataTableTab';
import AnalyticsSidebarLayout from '@/components/analytics/AnalyticsSidebarLayout';
import PublishersByCountryChart from '@/components/Charts/PublishersByCountryChart';

export default function PublishersAnalyticsPage() {
  return (
    <AnalyticsSidebarLayout active="publishers">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full flex justify-start mb-4">
          <TabsTrigger value="overview">Visualization</TabsTrigger>
          <TabsTrigger value="table">Data Table</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <PublishersByCountryChart />
        </TabsContent>

        <TabsContent value="table">
          <DataTableTab
            collectionName="publishers"
            defaultHiddenColumns={["__v", "users"]}
          />
        </TabsContent>
      </Tabs>
    </AnalyticsSidebarLayout>
  );
}
