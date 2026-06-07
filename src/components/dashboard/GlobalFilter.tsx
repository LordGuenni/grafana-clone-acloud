'use client';

import React from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function GlobalFilter() {
  const { globalFilter, setGlobalFilter } = useDashboardStore();

  return (
    <div className="relative w-64">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search data..."
        className="pl-9 h-9"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
    </div>
  );
}
