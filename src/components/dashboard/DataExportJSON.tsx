'use client';

import React from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { Button, buttonVariants } from '@/components/ui/button';
import { Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function DataExporter() {
  const { datasets } = useDashboardStore();

  const exportDataset = (datasetId: string) => {
    const dataset = datasets.find((d) => d.id === datasetId);
    if (!dataset) return;

    const dataStr = JSON.stringify(dataset.data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${dataset.name.replace(/\.[^/.]+$/, "")}_export.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (datasets.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-2 cursor-pointer')}>
        <Download className="h-4 w-4" />
        Export JSON
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {datasets.map((dataset) => (
          <DropdownMenuItem key={dataset.id} onClick={() => exportDataset(dataset.id)}>
            {dataset.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
