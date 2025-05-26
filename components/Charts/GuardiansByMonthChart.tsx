// components/Charts/GuardiansByMonthChart.tsx

'use client';

import * as React from 'react';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Loading from '@/app/loading';

interface GuardiansByMonthChartProps {
  collectionName: string;
  xField: string; // typically created_at
  yField: string; // typically type
  yValues: string[]; // like ['Guardian', 'Teacher']
}

export default function GuardiansByMonthChart({
  collectionName,
  xField,
  yField,
  yValues,
}: GuardiansByMonthChartProps) {
  const [year, setYear] = React.useState('thisYear');
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/analytics/user-analysis?collection=${collectionName}&limit=0`
        );
        const json = await res.json();
        const data = json?.data ?? [];
        if (!Array.isArray(data)) throw new Error('Invalid data format');

        const monthMap = new Map<string, Record<string, number>>();

        for (const item of data) {
          const rawDate = item[xField];
          const category = item[yField];
          if (!rawDate || !category) continue;

          const date = new Date(rawDate);
          if (isNaN(date.getTime())) continue;

          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (!monthMap.has(key)) {
            monthMap.set(key, {});
          }

          const current = monthMap.get(key)!;
          current[category] = (current[category] || 0) + 1;
        }

        const result: any[] = Array.from(monthMap.entries())
          .sort(([a], [b]) => new Date(`${a}-01`).getTime() - new Date(`${b}-01`).getTime())
          .map(([key, value]) => {
            const date = new Date(`${key}-01`);
            const base: {
              date: string;
              displayDate: string;
              [key: string]: string | number;
            } = {
              date: date.toISOString(),
              displayDate: date.toLocaleDateString('en-US', {
                month: 'short',
                year: '2-digit',
              }),
            };

            yValues.forEach((val) => {
              base[val] = value[val] || 0;
            });
            return base;
          });

        setChartData(result);
      } catch (err) {
        console.error('Chart fetch error:', err);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [collectionName, xField, yField, yValues]);

  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  const twoYearsAgo = currentYear - 2;

  const filteredData = chartData.filter((item) => {
    const yearValue = new Date(item.date).getFullYear();
    if (year === 'thisYear') return yearValue === currentYear;
    if (year === 'lastYear') return yearValue === lastYear;
    if (year === 'twoYearsAgo') return yearValue === twoYearsAgo;
    return true;
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Monthly Growth by Type</CardTitle>
          <CardDescription>
            Monthly totals based on {yField} from the {collectionName} collection.
          </CardDescription>
        </div>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="thisYear">This Year ({currentYear})</SelectItem>
            <SelectItem value="lastYear">Last Year ({lastYear})</SelectItem>
            <SelectItem value="twoYearsAgo">Year Before Last ({twoYearsAgo})</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[250px]">
            <Loading />
            <div className="text-sm text-muted-foreground text-center">           
              Please wait while loading chart data...
            </div>
          </div>

        ) : (
          <ChartContainer
            config={{
              ...Object.fromEntries(
                yValues.map((val, idx) => [
                  val,
                  {
                    label: val,
                    color: idx === 0 ? '#08bdba' : '#4589ff',
                  },
                ])
              ),
            }}
            className="aspect-auto h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData}>
                <defs>
                  {yValues.map((val, idx) => (
                    <linearGradient
                      key={val}
                      id={`fill${val}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={idx === 0 ? '#08bdba' : '#4589ff'}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={idx === 0 ? '#08bdba' : '#4589ff'}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="displayDate"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => value}
                      indicator="dot"
                    />
                  }
                />
                {yValues.map((val, idx) => (
                  <Area
                    key={val}
                    dataKey={val}
                    type="monotone"
                    fill={`url(#fill${val})`}
                    stroke={idx === 0 ? '#08bdba' : '#4589ff'}
                  />
                ))}
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}