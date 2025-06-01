// app/user-analysis/schools/page.tsx

'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MetricsOverview from '@/components/analytics/MetricsOverview';
import DataTableTab from '@/components/analytics/DataTableTab';

export default function SchoolsAnalyticsPage() {
  return (
      <Tabs defaultValue="overview" className="space-y-6 pt-10">
        <TabsList className="w-full flex justify-start mb-4">
          <TabsTrigger value="overview">Visualization</TabsTrigger>
          <TabsTrigger value="table">Data Table</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <MetricsOverview
            collectionName="schools"
            countField="_id"
            countValues={[]} // no additional counts needed
          />
        </TabsContent>

        <TabsContent value="table">
          <DataTableTab
            collectionName="schools"
            defaultHiddenColumns={["password", "__v"]}
          />
        </TabsContent>
      </Tabs>
  );
}
