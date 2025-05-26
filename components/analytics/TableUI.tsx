// components/analytics/TableUI.tsx

'use client';

import {
  flexRender,
  Table as ReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Skeleton } from '@/components/ui/skeleton';
import ColumnToggleDropdown from './ColumnToggleDropdown';

interface Props {
  table: ReactTable<any>;
  loading: boolean;
  defaultHiddenColumns: string[];
}

export default function TableUI({ table, loading, defaultHiddenColumns }: Props) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <span className="text-muted-foreground text-sm">
          Showing {table.getRowModel().rows.length} rows
        </span>
        <ColumnToggleDropdown table={table} defaultHiddenColumns={defaultHiddenColumns} />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={table.getAllColumns().length}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
