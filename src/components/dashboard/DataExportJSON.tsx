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

  const handleExport = (type: 'full' | 'dataset', datasetId?: string) => {
    console.log(`Starting export: ${type} ${datasetId || ''}`);
    
    try {
      let exportData: any;
      let filename: string;

      if (type === 'full') {
        exportData = {
          type: 'nexus-insight-dashboard-config',
          version: '1.0',
          timestamp: new Date().toISOString(),
          datasets,
          panels,
          layouts,
        };
        filename = `nexus_full_backup_${new Date().toISOString().split('T')[0]}.json`;
      } else {
        const dataset = datasets.find((d) => d.id === datasetId);
        if (!dataset) return;

        exportData = {
          type: 'nexus-insight-dataset-export',
          dataset,
          relatedPanels: panels.filter(p => p.dataSourceId === datasetId),
          relatedLayouts: layouts.filter(l => panels.some(p => p.id === l.i && p.dataSourceId === datasetId))
        };
        const safeName = dataset.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        filename = `${safeName}_dataset.json`;
      }

      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Direct click within the same execution stack
      link.click();
      
      // Cleanup after a delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      console.log('Export download triggered');
    } catch (error) {
      console.error('Export Error:', error);
      alert('Could not generate the export file. Please check the console for details.');
    }
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
          {/* Using onClick directly on the item to ensure user gesture is preserved */}
          <DropdownMenuItem 
            onClick={() => handleExport('full')} 
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
              onClick={() => handleExport('dataset', dataset.id)} 
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
