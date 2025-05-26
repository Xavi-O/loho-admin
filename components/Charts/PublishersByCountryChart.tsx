// components/Charts/PublishersByCountryChart.tsx

'use client';

import * as React from 'react';
import { PieChart, Pie, Label, Legend, Cell } from 'recharts';
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

const COLORS = ['#8a3ffc', '#33b1ff', '#007d79', '#ff7eb6', '#fa4d56', '#6fdc8c', '#d2a106', '#ba4e00'];

export default function PublishersByCountryChart() {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const total = React.useMemo(
    () => chartData.reduce((sum, d) => sum + d.count, 0),
    [chartData]
  );

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/analytics/user-analysis?collection=publishers&limit=0');
        const json = await res.json();
        const data = json.data || [];

        const counts: Record<string, number> = {};
        for (const item of data) {
          const key = item.country || 'Unknown';
          counts[key] = (counts[key] || 0) + 1;
        }

        const chart = Object.entries(counts).map(([country, count], idx) => ({
          country,
          count,
          fill: COLORS[idx % COLORS.length],
        }));

        setChartData(chart);
      } catch (err) {
        console.error('Donut chart fetch error:', err);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Publishers by Country</CardTitle>
        <CardDescription>Distribution of publishers by country</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center justify-between gap-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[250px]">
            <Loading />
            <div className="text-sm text-muted-foreground text-center">
              Please wait while loading chart data...
            </div>
          </div>
        ) : (
          <>
            <ChartContainer
              config={chartData.reduce((acc, d) => {
                acc[d.country] = { label: d.country, color: d.fill };
                return acc;
              }, {} as Record<string, { label: string; color: string }>) }
              className="aspect-auto h-[250px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel={false} />}
                />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="country"
                  innerRadius={60}
                  outerRadius={110}
                  strokeWidth={1}
                  labelLine={{ stroke: 'var(--foreground)', strokeWidth: 1.2 }}
                  label={({ cx, cy, midAngle, outerRadius, index }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = outerRadius + 25; // Move label outside
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="var(--foreground)"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        className="text-base"
                      >
                        {chartData[index].count}
                      </text>
                    );
                  }}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {total.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-foreground"
                            >
                              Publishers
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{ paddingLeft: 32, lineHeight: '2em', color: 'var(--foreground)' }}
                  formatter={(value) => <span style={{ color: 'var(--foreground)' }}>{value}</span>}
                />
              </PieChart>
            </ChartContainer>
          </>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Showing total publishers grouped by country
      </CardFooter>
    </Card>
  );
}
