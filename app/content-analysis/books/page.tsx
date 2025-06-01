// app/content-analysis/books/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTableTab from '@/components/analytics/DataTableTab';
import MetricCards from '@/components/analytics/MetricCards';
import ChartRenderer from '@/components/Charts/ChartRenderer';

export default function BooksAnalysisPage() {
  const collection = 'books';
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

        // Count subjects
        const subjectCounts: Record<string, number> = {};
        const gradeCounts: Record<string, number> = {};
        data.forEach((item: any) => {
          const subject = item.subject || 'Unknown';
          subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;

          const grade = item.grade || 'Unknown';
          gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
        });

        const topSubjects = Object.entries(subjectCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2);

        const filteredCounts: Record<string, number> = {};
        topSubjects.forEach(([subject, count]) => {
          filteredCounts[subject] = count;
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
      <Tabs defaultValue="overview" className="space-y-6 pt-10">
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
              title="Books by Grade"
              description="Distribution of books by grade"
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
                "__v",
                "folder_name",
                "cover_url",
                "resource_link",
                "publisher_id",
                "rates",
                "favourites",
                "likes",
                "opf_file",
              ]}
            />
        </TabsContent>
      </Tabs>
  );
}