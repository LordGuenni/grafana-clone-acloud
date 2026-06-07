'use client';

import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { useDashboardStore } from '@/store/useDashboardStore';
import { PanelContainer } from './PanelContainer';
import { useHasHydrated } from '@/lib/useHasHydrated';

const ResponsiveGridLayout = WidthProvider(Responsive);

export function Dashboard() {
  const { layouts, updateLayouts, panels } = useDashboardStore();
  const hasHydrated = useHasHydrated();

  const onLayoutChange = (currentLayout: any, allLayouts: any) => {
    if (allLayouts.lg) {
      updateLayouts(allLayouts.lg);
    }
  };

  if (!hasHydrated) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground font-medium animate-pulse uppercase tracking-tighter">
            Restoring Session...
          </p>
        </div>
      </div>
    );
  }

  if (panels.length === 0) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 max-w-sm">
          <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-inner">
             <div className="w-8 h-8 text-muted-foreground opacity-20 border-4 border-current rounded-lg" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold">Dashboard is empty</h3>
            <p className="text-sm text-muted-foreground italic">
              Import a dataset or use the demo button above to start visualizing your data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4">
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layouts }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        draggableHandle=".panel-drag-handle"
        onLayoutChange={onLayoutChange}
      >
        {panels.map((panel) => (
          <div key={panel.id}>
            <PanelContainer panel={panel} />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
