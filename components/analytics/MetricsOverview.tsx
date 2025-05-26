// components/analytics/MetricsOverview.tsx

'use client';

import { useEffect, useState } from 'react';
import MetricCards from './MetricCards';
import ChartWrapper from '@/components/Charts/ChartWrapper';

interface Props {
  collectionName: string;
  countField: string;
  countValues: string[];
}

export default function MetricsOverview({ collectionName, countField, countValues }: Props) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const filters = JSON.stringify({ [countField]: countValues });
        const res = await fetch(
          `/api/analytics/user-analysis?collection=${collectionName}&aggregate=true&filters=${encodeURIComponent(filters)}`
        );
        const json = await res.json();
        const aggregate = json.aggregateCounts?.[countField] || {};
        setTotalCount(json.totalCount || 0);
        setCounts(aggregate);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, [collectionName, countField, countValues]);

  return (
    <div className="space-y-6">
      <MetricCards
        totalCount={totalCount}
        counts={counts}
        countValues={countValues}
        loading={loading}
      />
      <div className="mt-6">
        <ChartWrapper
          type="area"
          collectionName={collectionName}
          xField="created_at"
          yField={countField}
          yValues={countValues}
        />
      </div>
    </div>
  );
}
