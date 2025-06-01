// app/user-analytics/learners/page.tsx

'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MetricsOverview from '@/components/analytics/MetricsOverview';
import DataTableTab from '@/components/analytics/DataTableTab';

export default function LearnersAnalyticsPage() {
  return (
      <Tabs defaultValue="overview" className="space-y-6 pt-10">
        <TabsList className="w-full flex justify-start mb-4">
          <TabsTrigger value="overview">Visualization</TabsTrigger>
          <TabsTrigger value="table">Data Table</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <MetricsOverview
          collectionName="learners"
          countField="education_type"
          countValues={["CBC", "8-4-4"]}
        />

        </TabsContent>

        <TabsContent value="table">
          <DataTableTab
            collectionName="learners"
            defaultHiddenColumns={["profile_image", "guardian_id", "__v"]}
          />
        </TabsContent>
      </Tabs>
  );
}
