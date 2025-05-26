// components/analytics/MetricCards.tsx

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SkeletonCard } from '../layout/SkeletonCard';

interface MetricCardsProps {
  totalCount: number;
  counts: Record<string, number>;
  countValues: string[];
  loading: boolean;
}

export default function MetricCards({ totalCount, counts, countValues, loading }: MetricCardsProps) {
  const format = (n: number) => new Intl.NumberFormat('en-US').format(n);
  const percent = (val: number) => (totalCount > 0 ? `${((val / totalCount) * 100).toFixed(1)}%` : '0%');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex justify-between items-start">
          <CardTitle>Total Records</CardTitle>
          <span className="text-xs rounded-full border px-2 py-1 bg-background text-muted-foreground">100%</span>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {loading ? <SkeletonCard /> : format(totalCount)}
        </CardContent>
      </Card>
      {countValues.map((val) => {
        const value = counts[val] || 0;
        return (
          <Card key={val}>
            <CardHeader className="flex justify-between items-start">
              <CardTitle> Number of {val}</CardTitle>
              <span className="text-xs rounded-full border px-2 py-1 bg-background text-muted-foreground">{loading ? '...' : percent(value)}</span>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {loading ? <SkeletonCard /> : format(value)}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
