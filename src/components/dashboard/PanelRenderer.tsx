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

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#2563eb',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6'
];

interface PanelRendererProps {
  panel: PanelConfig;
}

export function PanelRenderer({ panel }: PanelRendererProps) {
  const datasets = useDashboardStore((state) => state.datasets);
  const globalFilter = useDashboardStore((state) => state.globalFilter);

  const dataset = useMemo(
    () => datasets.find((d) => d.id === panel.dataSourceId),
    [datasets, panel.dataSourceId]
  );

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
      <div className="flex h-full items-center justify-center text-muted-foreground text-sm italic">
        No data source selected
      </div>
    );
  }

  if (processedData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground text-sm italic">
        No data matches filters
      </div>
    );
  }

  const chartConfig = {
    [panel.yKey]: {
      label: panel.title || panel.yKey,
      color: COLORS[0],
    },
  };

  const renderChart = () => {
    switch (panel.type) {
      case 'line':
        return (
          <LineChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey={panel.xKey} 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            <Line
              type="monotone"
              dataKey={panel.yKey}
              stroke={COLORS[0]}
              strokeWidth={2.5}
              dot={{ r: 4, fill: COLORS[0], strokeWidth: 2, stroke: 'hsl(var(--background))' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1000}
            />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey={panel.xKey} 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend verticalAlign="top" height={36} iconType="rect" wrapperStyle={{ fontSize: '12px' }} />
            <Bar 
              dataKey={panel.yKey} 
              fill={COLORS[1]} 
              radius={[4, 4, 0, 0]} 
              animationDuration={1000}
            >
               {processedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${panel.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[2]} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={COLORS[2]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey={panel.xKey} 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            <Area
              type="monotone"
              dataKey={panel.yKey}
              fill={`url(#gradient-${panel.id})`}
              stroke={COLORS[2]}
              strokeWidth={2}
              animationDuration={1000}
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
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              animationDuration={1000}
            >
              {processedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <ChartContainer config={chartConfig} className="h-full w-full p-4">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart() as React.ReactElement}
      </ResponsiveContainer>
    </ChartContainer>
  );
}
