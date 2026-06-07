'use client';

import React from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function SampleDataButton() {
  const addDataset = useDashboardStore((state) => state.addDataset);

  const loadSampleData = () => {
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
      id: uuidv4(),
      name: 'Sample Sales Data',
      data,
      headers: ['month', 'sales', 'profit'],
    });
  };

  return (
    <Button variant="outline" size="sm" onClick={loadSampleData}>
      <Database className="mr-2 h-4 w-4" /> Load Sample Data
    </Button>
  );
}
