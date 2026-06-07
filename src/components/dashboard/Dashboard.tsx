'use client';

import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { useDashboardStore } from '@/store/useDashboardStore';
import { PanelContainer } from './PanelContainer';

const ResponsiveGridLayout = WidthProvider(Responsive);

export function Dashboard() {
  const { layouts, updateLayouts, panels } = useDashboardStore();

  const onLayoutChange = (currentLayout: any, allLayouts: any) => {
    // We only care about the 'lg' layout for simplicity in this MVP
    if (allLayouts.lg) {
      updateLayouts(allLayouts.lg);
    }
  };

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
