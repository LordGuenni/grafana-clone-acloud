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
    console.log(`Attempting to download: ${filename}`);
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Required for Firefox
      document.body.appendChild(link);
      
      // Small timeout ensures the menu closes and browser handles the click
      setTimeout(() => {
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log('Download triggered successfully');
      }, 50);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const exportFullDashboard = (e: React.MouseEvent | Event) => {
    // Prevent dropdown from keeping focus or interfering
    e.stopPropagation();
    
    const exportData = {
      type: 'nexus-insight-dashboard-config',
      version: '1.0',
      timestamp: new Date().toISOString(),
      datasets,
      panels,
      layouts,
    };
    triggerDownload(`nexus_dashboard_config_${new Date().getTime()}.json`, exportData);
  };

  const exportDatasetOnly = (e: React.MouseEvent | Event, datasetId: string) => {
    e.stopPropagation();
    
    const dataset = datasets.find((d) => d.id === datasetId);
    if (!dataset) return;

    const exportData = {
      type: 'nexus-insight-dataset-export',
      dataset,
      relatedPanels: panels.filter(p => p.dataSourceId === datasetId),
      relatedLayouts: layouts.filter(l => panels.some(p => p.id === l.i && p.dataSourceId === datasetId))
    };

    const exportFileDefaultName = `${dataset.name.replace(/\.[^/.]+$/, "")}_full_config.json`;
    triggerDownload(exportFileDefaultName, exportData);
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
          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Full Backup</DropdownMenuLabel>
          <DropdownMenuItem 
            onSelect={(e) => exportFullDashboard(e)} 
            className="gap-2 font-medium cursor-pointer"
          >
            <Layout className="h-3.5 w-3.5 text-primary" />
            Complete Dashboard Config
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Individual Datasets</DropdownMenuLabel>
          {datasets.map((dataset) => (
            <DropdownMenuItem 
              key={dataset.id} 
              onSelect={(e) => exportDatasetOnly(e, dataset.id)} 
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
