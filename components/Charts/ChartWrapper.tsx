// components/Charts/ChartWrapper.tsx

'use client';

import GuardiansByMonthChart from './GuardiansByMonthChart';
import LearnersByGradeChart from './LearnersByGradeChart';
import SchoolsByLocationChart from './SchoolsByLocationChart';

interface Props {
  type: 'area' | 'bar' | 'line';
  collectionName: string;
  xField: string;
  yField: string;
  yValues: string[];
}

export default function ChartWrapper({
  type,
  collectionName,
  xField,
  yField,
  yValues,
}: Props) {
  if (collectionName === 'learners') {
    return <LearnersByGradeChart />;
  }

  if (collectionName === 'schools') {
    return <SchoolsByLocationChart />;
  }

  if (type === 'area') {
    return (
      <GuardiansByMonthChart
        collectionName={collectionName}
        xField={xField}
        yField={yField}
        yValues={yValues}
      />
    );
  }

  return <div>Chart type not implemented</div>;
}
