// components/Charts/PartnersChart.tsx

'use client';

import * as React from 'react';
import { RadialBarChart, RadialBar, PolarRadiusAxis, Label } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer
} from '@/components/ui/chart';
import Loading from '@/app/loading';

export default function PartnersChart() {
  const [total, setTotal] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  const chartData = [
    {
      name: 'Partners',
      filled: total,
      empty: total * 2,
    },
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/analytics/user-analysis?collection=partners&limit=0');
        const json = await res.json();
        setTotal(json.data?.length || 0);
      } catch (error) {
        console.error('Partners chart fetch error:', error);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Partners Overview</CardTitle>
        <CardDescription>Visual representation of registered partners</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[250px]">
            <Loading />
            <div className="text-sm text-muted-foreground text-center">
              Please wait while loading chart data...
            </div>
          </div>
        ) : (
          <ChartContainer
            config={{ filled: { label: 'Partners', color: '#6fdc8c' } }}
            className="aspect-auto h-[250px] w-full"
          >
            <RadialBarChart
              data={chartData}
              startAngle={180}
              endAngle={0}
              innerRadius={100}
              outerRadius={200}
            >
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {total.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-muted-foreground"
                          >
                            Total Partners
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="filled"
                stackId="a"
                cornerRadius={5}
                fill="#6fdc8c"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="empty"
                stackId="a"
                fill="#4589ff"
                cornerRadius={5}
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Visual breakdown of total partner registrations
      </CardFooter>
    </Card>
  );
}
