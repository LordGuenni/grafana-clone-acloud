'use client';

import React from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { Button, buttonVariants } from '@/components/ui/button';
import { Download, FileJson, Layout } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function DataExporter() {
  const { datasets, panels, layouts } = useDashboardStore();

  const exportFullDashboard = () => {
    const exportData = {
      type: 'nexus-insight-dashboard-config',
      version: '1.0',
      timestamp: new Date().toISOString(),
      datasets,
      panels,
      layouts,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `nexus_dashboard_config_${new Date().getTime()}.json`);
    linkElement.click();
  };

  const exportDatasetOnly = (datasetId: string) => {
    const dataset = datasets.find((d) => d.id === datasetId);
    if (!dataset) return;

    const exportData = {
      type: 'nexus-insight-dataset-export',
      dataset,
      // Include panels and layouts that use this dataset
      relatedPanels: panels.filter(p => p.dataSourceId === datasetId),
      relatedLayouts: layouts.filter(l => panels.some(p => p.id === l.i && p.dataSourceId === datasetId))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${dataset.name.replace(/\.[^/.]+$/, "")}_full_config.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (datasets.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-2 cursor-pointer border-primary/20 hover:border-primary/50')}>
        <Download className="h-4 w-4" />
        Export
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Full Backup</DropdownMenuLabel>
        <DropdownMenuItem onClick={exportFullDashboard} className="gap-2 font-medium">
          <Layout className="h-3.5 w-3.5 text-primary" />
          Complete Dashboard Config
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Individual Datasets</DropdownMenuLabel>
        {datasets.map((dataset) => (
          <DropdownMenuItem key={dataset.id} onClick={() => exportDatasetOnly(dataset.id)} className="gap-2">
            <FileJson className="h-3.5 w-3.5" />
            {dataset.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
