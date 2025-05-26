// components/Charts/SchoolsByLocationChart.tsx

'use client';

import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, LabelList, CartesianGrid } from 'recharts';
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

const COLORS = ['#8a3ffc', '#08bdba', '#bae6ff', '#4589ff', '#ff7eb6'];

export default function SchoolsByLocationChart() {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const resSchools = await fetch('/api/analytics/user-analysis?collection=schools&limit=0');
        const resLocations = await fetch('/api/analytics/user-analysis?collection=locations&limit=0');

        const [schoolsJson, locationsJson] = await Promise.all([resSchools.json(), resLocations.json()]);

        const schools = schoolsJson.data || [];
        const locations = locationsJson.data || [];

        const locationMap = Object.fromEntries(
          locations.map((loc: any) => [loc.id, loc.locationName])
        );

        const counts: Record<string, number> = {};

        for (const school of schools) {
          const locationName = locationMap[school.location_id];
          if (locationName) {
            counts[locationName] = (counts[locationName] || 0) + 1;
          }
        }

        const sorted = Object.entries(counts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([location, count], idx) => ({
            location,
            schools: count,
            fill: COLORS[idx % COLORS.length],
          }));

        setChartData(sorted);
      } catch (err) {
        console.error('Chart fetch error:', err);
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
        <CardTitle>Top 5 Locations by Schools</CardTitle>
        <CardDescription>Visualizing where most schools are located</CardDescription>
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
          <ChartContainer className="aspect-auto h-[250px] w-full"
            config={chartData.reduce((acc, d) => {
              acc[d.location] = { label: d.location, color: d.fill };
              return acc;
            }, {} as Record<string, { label: string; color: string }>) }
          >
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 0 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="location"
                type="category"
                tickLine={false}
                tickMargin={2}
                axisLine={false}
              />
              <XAxis dataKey="schools" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="schools" layout="vertical" radius={5}>
                <LabelList dataKey="schools" position="right" className="fill-foreground" />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="font-medium leading-none text-muted-foreground">
          Showing top 5 locations with most schools
        </div>
      </CardFooter>
    </Card>
  );
}
