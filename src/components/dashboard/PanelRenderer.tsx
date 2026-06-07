'use client';

import React, { useMemo } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { PanelConfig } from '@/types/dashboard';
import { aggregateData } from '@/lib/data-utils';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface PanelRendererProps {
  panel: PanelConfig;
}

export function PanelRenderer({ panel }: PanelRendererProps) {
  const datasets = useDashboardStore((state) => state.datasets);
  const dataset = useMemo(
    () => datasets.find((d) => d.id === panel.dataSourceId),
    [datasets, panel.dataSourceId]
  );

  const globalFilter = useDashboardStore((state) => state.globalFilter);

  const processedData = useMemo(() => {
    if (!dataset) return [];
    let filteredData = dataset.data;
    
    if (globalFilter) {
      filteredData = dataset.data.filter((row) => 
        Object.values(row).some(val => 
          String(val).toLowerCase().includes(globalFilter.toLowerCase())
        )
      );
    }
    
    return aggregateData(filteredData, panel);
  }, [dataset, panel, globalFilter]);

  if (!dataset) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
        No data source selected
      </div>
    );
  }

  if (processedData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
        No data to display
      </div>
    );
  }

  const chartConfig = {
    [panel.yKey]: {
      label: panel.yKey,
      color: 'hsl(var(--chart-1))',
    },
  };

  const renderChart = () => {
    switch (panel.type) {
      case 'line':
        return (
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={panel.xKey} hide />
            <YAxis hide />
            <Tooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey={panel.yKey}
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={panel.xKey} hide />
            <YAxis hide />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey={panel.yKey} fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={panel.xKey} hide />
            <YAxis hide />
            <Tooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey={panel.yKey}
              fill="hsl(var(--chart-3))"
              fillOpacity={0.3}
              stroke="hsl(var(--chart-3))"
            />
          </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={processedData}
              dataKey={panel.yKey}
              nameKey={panel.xKey}
              cx="50%"
              cy="50%"
              outerRadius="80%"
              label
            >
              {processedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart() as React.ReactElement}
      </ResponsiveContainer>
    </ChartContainer>
  );
}
