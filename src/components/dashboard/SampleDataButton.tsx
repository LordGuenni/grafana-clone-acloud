'use client';

import React from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { PanelConfig, PanelLayout } from '@/types/dashboard';

export function SampleDataButton() {
  const { addDataset, addPanel, datasets } = useDashboardStore();

  const loadSampleData = () => {
    // Check if sample data is already loaded to avoid duplicates
    if (datasets.some(d => d.name === 'Sample Sales Data')) return;

    const datasetId = uuidv4();
    const data = [
      { month: 'Jan', sales: 4000, profit: 2400 },
      { month: 'Feb', sales: 3000, profit: 1398 },
      { month: 'Mar', sales: 2000, profit: 9800 },
      { month: 'Apr', sales: 2780, profit: 3908 },
      { month: 'May', sales: 1890, profit: 4800 },
      { month: 'Jun', sales: 2390, profit: 3800 },
      { month: 'Jul', sales: 3490, profit: 4300 },
    ];

    addDataset({
      id: datasetId,
      name: 'Sample Sales Data',
      data,
      headers: ['month', 'sales', 'profit'],
    });

    // Add a default Line Chart for Sales
    const linePanelId = uuidv4();
    const linePanel: PanelConfig = {
      id: linePanelId,
      title: 'Monthly Sales (Line)',
      type: 'line',
      dataSourceId: datasetId,
      xKey: 'month',
      yKey: 'sales',
      aggregation: 'sum',
    };
    const lineLayout: PanelLayout = {
      i: linePanelId,
      x: 0,
      y: 0,
      w: 6,
      h: 4,
    };

    // Add a default Bar Chart for Profit
    const barPanelId = uuidv4();
    const barPanel: PanelConfig = {
      id: barPanelId,
      title: 'Monthly Profit (Bar)',
      type: 'bar',
      dataSourceId: datasetId,
      xKey: 'month',
      yKey: 'profit',
      aggregation: 'sum',
    };
    const barLayout: PanelLayout = {
      i: barPanelId,
      x: 6,
      y: 0,
      w: 6,
      h: 4,
    };

    addPanel(linePanel, lineLayout);
    addPanel(barPanel, barLayout);
  };

  return (
    <Button variant="outline" size="sm" onClick={loadSampleData}>
      <Database className="mr-2 h-4 w-4" /> Load Sample Data
    </Button>
  );
}
