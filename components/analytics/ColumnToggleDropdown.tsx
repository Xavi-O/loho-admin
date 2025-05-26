// components/analytics/ColumnToggleDropdown.tsx

'use client';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { Columns } from 'lucide-react';
import { Table } from '@tanstack/react-table';

interface Props {
  table: Table<any>;
  defaultHiddenColumns: string[];
}

export default function ColumnToggleDropdown({ table, defaultHiddenColumns }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-1">
          <Columns className="w-4 h-4" /> Toggle Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table.getAllLeafColumns().map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={() => column.toggleVisibility()}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
