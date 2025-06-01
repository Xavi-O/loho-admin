// app/user-analysis/partners/page.tsx

'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTableTab from '@/components/analytics/DataTableTab';
import PartnersChart from '@/components/Charts/PartnersChart';

export default function PartnersAnalyticsPage() {
  return (
      <Tabs defaultValue="overview" className="space-y-6 pt-10">
        <TabsList className="w-full flex justify-start mb-4">
          <TabsTrigger value="overview">Visualization</TabsTrigger>
          <TabsTrigger value="table">Data Table</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <PartnersChart />
        </TabsContent>

        <TabsContent value="table">
          <DataTableTab
            collectionName="partners"
            defaultHiddenColumns={["__v"]}
          />
        </TabsContent>
      </Tabs>
  );
}
