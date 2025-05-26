// components/analytics/DataTableTab.tsx

'use client';

import React from 'react';
import DataTable from '@/components/analytics/DataTable';

interface Props {
  collectionName: string;
  defaultHiddenColumns: string[];
}

export default function DataTableTab({ collectionName, defaultHiddenColumns }: Props) {
  return (
    <DataTable
      collectionName={collectionName}
      defaultHiddenColumns={defaultHiddenColumns}
    />
  );
}
