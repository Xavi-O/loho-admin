// app/content-analysis/games/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChartRenderer from '@/components/Charts/ChartRenderer';
import DataTableTab from '@/components/analytics/DataTableTab';

export default function GamesAnalysisPage() {
  const collection = 'games';
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics/user-analysis?collection=${collection}&limit=0`);
        const json = await res.json();
        const data = json.data || [];

        const totalCount = data.length;
        const chartMax = totalCount * 3;

        const radialData = [
          { name: 'Games', value: totalCount, fill: '#6fdc8c' },
          { name: 'Remaining', value: chartMax - totalCount, fill: '#4589ff' },
        ];

        setTotal(totalCount);
        setChartData(radialData);
      } catch (err) {
        console.error('Radial chart fetch error:', err);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
      <Tabs defaultValue="overview" className="space-y-6 pt-10">
        <TabsList className="w-full flex justify-start mb-4">
          <TabsTrigger value="overview">Visualization</TabsTrigger>
          <TabsTrigger value="table">Data Table</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ChartRenderer
            type="radial"
            title="Games Overview"
            description="Visual representation of games as a fraction of target"
            data={chartData}
            keys={["value"]}
            total={total}
            totalLabel="Games"
            loading={loading}
            stacked
          />
        </TabsContent>

        <TabsContent value="table">
          <DataTableTab 
          collectionName={collection} 
          defaultHiddenColumns={[
            "likes",
            "favourites",
            "description",
            "resource_link_id",
            "thumbnail_url",
            "consumer_key",
            "shared_secret",
            "launch_url",
            "__v"
          ]} 
          />
        </TabsContent>
      </Tabs>
  );
}
