// components/analytics/DataTable.tsx

'use client';

import React, { useEffect, useState } from 'react';
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import TableUI from './TableUI';
import { Input } from '@/components/ui/input';
import Loading from '@/app/loading';
import Pagination from '@/components/ui/pagination';
import { XIcon } from 'lucide-react';

interface Props {
  collectionName: string; // e.g. "guardians"
  defaultHiddenColumns: string[]; // e.g. ["password", "__v"]
}

export default function DataTable({ collectionName, defaultHiddenColumns }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<ColumnDef<any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(''); // search box UI state
  const [globalFilter, setGlobalFilter] = useState(''); // debounced search state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGlobalFilter(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const filterQuery = globalFilter ? `&search=${encodeURIComponent(globalFilter)}` : '';
        const res = await fetch(
          `/api/analytics/user-analysis?collection=${collectionName}&limit=${pageSize}&page=${page}${filterQuery}`
        );
        const json = await res.json();
        const items = json.data || [];
        setData(items);
        setTotalCount(json.totalCount || 0);

        if (items.length && columns.length === 0) {
          const sample = items[0];
          const generated: ColumnDef<any>[] = Object.keys(sample).map((key) => ({
            accessorKey: key,
            header: key,
          }));
          setColumns(generated);

          const hiddenCols = Object.fromEntries(
            Object.keys(sample).map((k) => [k, defaultHiddenColumns.includes(k) ? false : true])
          );
          setColumnVisibility(hiddenCols);
        }
      } catch (err) {
        console.error(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [collectionName, page, pageSize, globalFilter]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
  });

  if (loading && !data.length) return <Loading />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search all columns..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pr-10"
          />
          {searchInput && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchInput('')}
              aria-label="Clear search"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <TableUI
        table={table}
        loading={loading}
        defaultHiddenColumns={defaultHiddenColumns}
      />

      <div className="flex justify-end">
        <Pagination
          total={totalCount}
          pageSize={pageSize}
          page={page}
          setPage={setPage}
          setPageSize={setPageSize}
        />
      </div>
    </div>
  );
}
