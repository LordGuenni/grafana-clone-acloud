'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PanelConfig } from '@/types/dashboard';
import { useDashboardStore } from '@/store/useDashboardStore';
import { X, GripHorizontal, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PanelRenderer } from './PanelRenderer';
import { motion } from 'framer-motion';
import { PanelDialog } from './PanelDialog';

interface PanelContainerProps {
  panel: PanelConfig;
}

export function PanelContainer({ panel }: PanelContainerProps) {
  const { removePanel, datasets, layouts } = useDashboardStore();

  const handleExportPanel = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const dataset = datasets.find((d) => d.id === panel.dataSourceId);
      const layout = layouts.find((l) => l.i === panel.id);
      
      const exportData = {
        type: 'nexus-insight-panel-export',
        version: '1.0',
        timestamp: new Date().toISOString(),
        panel,
        layout,
        dataset: dataset || null,
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `nexus_panel_${panel.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Panel export failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-full"
    >
      <Card className="w-full h-full flex flex-col overflow-hidden group shadow-md hover:shadow-xl hover:ring-1 hover:ring-primary/20 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 border-b bg-muted/20">
          <div className="flex items-center gap-2 flex-1">
            <div className="panel-drag-handle cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded-md text-muted-foreground transition-colors">
              <GripHorizontal className="h-4 w-4" />
            </div>
            <CardTitle className="text-xs font-bold tracking-tight uppercase text-muted-foreground/80 truncate max-w-[120px]">
              {panel.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7 rounded-md"
              onClick={handleExportPanel}
              title="Export Panel"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
            <PanelDialog 
              mode="edit" 
              panelToEdit={panel} 
            />
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7 rounded-md text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => removePanel(panel.id)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden relative">
          <PanelRenderer panel={panel} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
