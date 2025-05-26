// components/ui/pagination.tsx

'use client';

import * as React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';

interface PaginationProps {
  total: number;
  pageSize: number;
  page: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

export default function Pagination({ total, pageSize, page, setPage, setPageSize }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const canGoBack = page > 1;
  const canGoForward = page < totalPages;

  const handleChangePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
      <div className="text-sm text-muted-foreground mb-2 sm:mb-0">
        Page {page} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="rowsPerPage" className="text-sm text-muted-foreground">
          Rows per page
        </label>
        <select
          id="rowsPerPage"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="text-sm border rounded px-2 py-1 bg-background"
        >
          {[10, 20, 30, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleChangePage(1)}
            disabled={!canGoBack}
          >
            <ChevronsLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleChangePage(page - 1)}
            disabled={!canGoBack}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleChangePage(page + 1)}
            disabled={!canGoForward}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleChangePage(totalPages)}
            disabled={!canGoForward}
          >
            <ChevronsRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
