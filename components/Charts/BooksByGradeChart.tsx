// components/Charts/BooksByGradeChart.tsx

'use client';

import * as React from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import Loading from '@/app/loading';

export default function BooksByGradeChart() {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/analytics/user-analysis?collection=books&limit=0');
        const json = await res.json();
        const data = json.data || [];

        const counts: Record<string, number> = {};
        data.forEach((item: any) => {
          const grade = item.grade || 'Unknown';
          counts[grade] = (counts[grade] || 0) + 1;
        });

        const formattedData = Object.entries(counts).map(([grade, count]) => ({
          grade,
          count,
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error('Chart fetch error:', error);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Books by Grade</CardTitle>
        <CardDescription>Distribution of books across grades</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[250px]">
            <Loading />
            <div className="text-sm text-muted-foreground text-center">
              Please wait while loading chart data...
            </div>
          </div>
        ) : (
          <ChartContainer
            config={{ count: { label: 'Books', color: '#4589ff' } }}
            className="h-[250px] w-full"
          >
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="grade" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
              <Bar dataKey="count" fill="#4589ff" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Showing total books available by grade level
      </CardFooter>
    </Card>
  );
}
