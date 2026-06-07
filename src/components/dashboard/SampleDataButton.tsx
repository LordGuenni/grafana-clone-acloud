'use client';

import React from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { PanelConfig, PanelLayout } from '@/types/dashboard';

export function SampleDataButton() {
  const { addDataset, addPanel, datasets, panels } = useDashboardStore();

  const loadSampleData = () => {
    // If panels already exist, we might not want to overwrite them or add more
    // but the user specifically requested "Load Infrastructure Demo", so we'll append.
    // We check by dataset name to avoid duplicate datasets.
    
    let datasetId = datasets.find(d => d.name === 'Cloud Infrastructure Stats')?.id;
    
    if (!datasetId) {
      datasetId = uuidv4();
      const data = [
        { month: 'Jan', revenue: 4200, users: 1200, latency: 45, region: 'Europe' },
        { month: 'Feb', revenue: 4800, users: 1450, latency: 42, region: 'Americas' },
        { month: 'Mar', revenue: 5100, users: 1600, latency: 48, region: 'Asia' },
        { month: 'Apr', revenue: 5900, users: 1900, latency: 38, region: 'Europe' },
        { month: 'May', revenue: 6800, users: 2400, latency: 35, region: 'Americas' },
        { month: 'Jun', revenue: 7500, users: 2800, latency: 32, region: 'Asia' },
        { month: 'Jul', revenue: 8200, users: 3200, latency: 30, region: 'Europe' },
        { month: 'Aug', revenue: 8900, users: 3600, latency: 28, region: 'Americas' },
        { month: 'Sep', revenue: 9400, users: 3900, latency: 29, region: 'Asia' },
        { month: 'Oct', revenue: 10500, users: 4500, latency: 27, region: 'Europe' },
        { month: 'Nov', revenue: 11800, users: 5200, latency: 26, region: 'Americas' },
        { month: 'Dec', revenue: 13500, users: 6100, latency: 25, region: 'Asia' },
      ];

      addDataset({
        id: datasetId,
        name: 'Cloud Infrastructure Stats',
        data,
        headers: ['month', 'revenue', 'users', 'latency', 'region'],
      });
    }

    // Only add panels if they don't exist yet to avoid cluttering on multiple clicks
    if (panels.length > 0) return;

    // 1. Line Chart: Revenue Trend
    const revenueId = uuidv4();
    addPanel({
      id: revenueId,
      title: 'Annual Revenue Growth ($)',
      type: 'line',
      dataSourceId: datasetId,
      xKey: 'month',
      yKey: 'revenue',
      aggregation: 'sum',
    }, {
      i: revenueId, x: 0, y: 0, w: 8, h: 4,
    });

    // 2. Bar Chart: User Growth
    const userId = uuidv4();
    addPanel({
      id: userId,
      title: 'Active Users by Month',
      type: 'bar',
      dataSourceId: datasetId,
      xKey: 'month',
      yKey: 'users',
      aggregation: 'sum',
    }, {
      i: userId, x: 8, y: 0, w: 4, h: 4,
    });

    // 3. Area Chart: Latency Reduction
    const latencyId = uuidv4();
    addPanel({
      id: latencyId,
      title: 'Global Avg Latency (ms)',
      type: 'area',
      dataSourceId: datasetId,
      xKey: 'month',
      yKey: 'latency',
      aggregation: 'avg',
    }, {
      i: latencyId, x: 0, y: 4, w: 6, h: 4,
    });

    // 4. Pie Chart: Region Distribution (Revenue)
    const pieId = uuidv4();
    addPanel({
      id: pieId,
      title: 'Revenue Share by Region',
      type: 'pie',
      dataSourceId: datasetId,
      xKey: 'region',
      yKey: 'revenue',
      aggregation: 'sum',
    }, {
      i: pieId, x: 6, y: 4, w: 6, h: 4,
    });
  };

  return (
    <Button variant="outline" size="sm" onClick={loadSampleData} className="border-primary/50 hover:border-primary">
      <Database className="mr-2 h-4 w-4 text-primary" /> Load Infrastructure Demo
    </Button>
  );
}
