// app/content-analysis/dals/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTableTab from '@/components/analytics/DataTableTab';
import MetricCards from '@/components/analytics/MetricCards';
import AnalyticsSidebarLayout from '@/components/analytics/AnalyticsSidebarLayout';
import ChartRenderer from '@/components/Charts/ChartRenderer';

export default function DalsAnalysisPage() {
  const collection = 'dals';
  const [counts, setCounts] = useState<Record<string, number>>({});
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

        const languageCounts: Record<string, number> = {};
        const gradeCounts: Record<string, number> = {};

        data.forEach((item: any) => {
          const language = item.language || 'Unknown';
          languageCounts[language] = (languageCounts[language] || 0) + 1;

          const grade = item.grade || 'Unknown';
          gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
        });

        const topLanguages = Object.entries(languageCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2);

        const filteredCounts: Record<string, number> = {};
        topLanguages.forEach(([language, count]) => {
          filteredCounts[language] = count;
        });

        const chartReadyData = Object.entries(gradeCounts).map(([grade, count]) => ({
          grade,
          count,
        }));

        setCounts(filteredCounts);
        setTotal(data.length);
        setChartData(chartReadyData);
      } catch (error) {
        console.error('MetricCards fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AnalyticsSidebarLayout active="dals">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full flex justify-start mb-4">
          <TabsTrigger value="overview">Visualization</TabsTrigger>
          <TabsTrigger value="table">Data Table</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <MetricCards
            totalCount={total}
            counts={counts}
            countValues={Object.keys(counts)}
            loading={loading}
          />
          <div className="mt-6">
            <ChartRenderer
              type="bar"
              title="Dals by Grade"
              description="Distribution of Dals by grade"
              data={chartData}
              keys={["count"]}
              xKey="grade"
              loading={loading}
            />
          </div>
        </TabsContent>

        <TabsContent value="table">
          <DataTableTab 
          collectionName={collection} 
          defaultHiddenColumns={[
            "file_type",
            "PIDNO",
            "link",
            "description",
            "rates",
            "__v"
          ]} 
          />
        </TabsContent>
      </Tabs>
    </AnalyticsSidebarLayout>
  );
}
