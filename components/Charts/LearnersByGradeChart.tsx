// components/Charts/LearnersByGradeChart.tsx

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

const GRADE_ORDER = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const COLORS = {
  boy: '#4589ff',
  girl: '#d12771',
};

export default function LearnersByGradeChart() {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/analytics/user-analysis?collection=learners&limit=0');
        const json = await res.json();
        const items = json.data || [];

        const grouped = GRADE_ORDER.map((grade) => {
          const boys = items.filter((i: any) => i.grade === grade && i.gender === 'boy').length;
          const girls = items.filter((i: any) => i.grade === grade && i.gender === 'girl').length;
          return {
            grade,
            boy: boys,
            girl: girls,
          };
        });

        setChartData(grouped);
      } catch (err) {
        console.error(err);
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
        <CardTitle>Learners by Grade</CardTitle>
        <CardDescription>Distribution of learners by gender across grades</CardDescription>
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
            className="aspect-auto h-[250px] w-full"
            config={{
              Boys: { label: 'Boys', color: COLORS.boy },
              Girls: { label: 'Girls', color: COLORS.girl },
            }}
          >
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="grade"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8} 
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="boy" fill={COLORS.boy} radius={4} />
              <Bar dataKey="girl" fill={COLORS.girl} radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="font-medium leading-none text-muted-foreground">
          Showing number of boys and girls per grade
        </div>
      </CardFooter>
    </Card>
  );
}

