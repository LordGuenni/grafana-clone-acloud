'use client';

import React from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { Button } from '@/components/ui/button';
import { Download, FileJson, Layout } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';

export function DataExporter() {
  const { datasets, panels, layouts } = useDashboardStore();

  const triggerDownload = (filename: string, data: any) => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Append to document to ensure visibility/validity in all browsers
      document.body.appendChild(link);
      
      // Trigger click immediately to preserve User Gesture context in production environments
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      
      // Revoke after a longer delay to ensure the browser has initiated the download
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 5000);
      
    } catch (error) {
      console.error('NexusInsight Export Error:', error);
      alert('Failed to generate export file. Please check console for details.');
    }
  };

  const exportFullDashboard = () => {
    const exportData = {
      type: 'nexus-insight-dashboard-config',
      version: '1.0',
      timestamp: new Date().toISOString(),
      datasets,
      panels,
      layouts,
    };
    triggerDownload(`nexus_full_backup_${new Date().toISOString().split('T')[0]}.json`, exportData);
  };

  const exportDatasetOnly = (datasetId: string) => {
    const dataset = datasets.find((d) => d.id === datasetId);
    if (!dataset) return;

    const exportData = {
      type: 'nexus-insight-dataset-export',
      dataset,
      relatedPanels: panels.filter(p => p.dataSourceId === datasetId),
      relatedLayouts: layouts.filter(l => panels.some(p => p.id === l.i && p.dataSourceId === datasetId))
    };

    const safeName = dataset.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    triggerDownload(`${safeName}_dataset.json`, exportData);
  };

  if (datasets.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        render={
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 cursor-pointer border-primary/20 hover:border-primary/50"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">System Backup</DropdownMenuLabel>
          <DropdownMenuItem 
            onSelect={exportFullDashboard} 
            className="gap-2 font-medium cursor-pointer"
          >
            <Layout className="h-3.5 w-3.5 text-primary" />
            Full Configuration JSON
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Dataset Exports</DropdownMenuLabel>
          {datasets.map((dataset) => (
            <DropdownMenuItem 
              key={dataset.id} 
              onSelect={() => exportDatasetOnly(dataset.id)} 
              className="gap-2 cursor-pointer"
            >
              <FileJson className="h-3.5 w-3.5" />
              <span className="truncate">{dataset.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
