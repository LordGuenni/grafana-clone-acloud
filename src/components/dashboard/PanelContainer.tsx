'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PanelConfig } from '@/types/dashboard';
import { useDashboardStore } from '@/store/useDashboardStore';
import { X, Settings, GripHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PanelRenderer } from './PanelRenderer';

interface PanelContainerProps {
  panel: PanelConfig;
}

export function PanelContainer({ panel }: PanelContainerProps) {
  const removePanel = useDashboardStore((state) => state.removePanel);

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden group shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 border-b bg-muted/30">
        <div className="flex items-center gap-2 flex-1">
          <div className="panel-drag-handle cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded text-muted-foreground">
            <GripHorizontal className="h-4 w-4" />
          </div>
          <CardTitle className="text-sm font-semibold truncate">
            {panel.title}
          </CardTitle>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Settings className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
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
  );
}
