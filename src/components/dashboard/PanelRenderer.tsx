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
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6'
];

interface PanelRendererProps {
  panel: PanelConfig;
  previewData?: any[]; // Optional prop for live preview in dialog
}

export function PanelRenderer({ panel, previewData }: PanelRendererProps) {
  const datasets = useDashboardStore((state) => state.datasets);
  const globalFilter = useDashboardStore((state) => state.globalFilter);

  const dataset = useMemo(
    () => datasets.find((d) => d.id === panel.dataSourceId),
    [datasets, panel.dataSourceId]
  );

  const processedData = useMemo(() => {
    const rawData = previewData || dataset?.data;
    if (!rawData) return [];
    
    let filteredData = rawData;
    
    if (globalFilter && !previewData) {
      filteredData = rawData.filter((row: any) => 
        Object.values(row).some(val => 
          String(val).toLowerCase().includes(globalFilter.toLowerCase())
        )
      );
    }
    
    return aggregateData(filteredData, panel);
  }, [dataset, panel, globalFilter, previewData]);

  if (!dataset && !previewData) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground text-xs italic">
        No data source selected
      </div>
    );
  }

  if (processedData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground text-xs italic">
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

  // Visibility and contrast settings for Dark Mode
  const gridStroke = "hsl(var(--border) / 0.3)";
  const labelColor = "hsl(var(--muted-foreground))";
  const dotStroke = "var(--background)";

  const renderChart = () => {
    switch (panel.type) {
      case 'line':
        return (
          <LineChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
            <XAxis 
              dataKey={panel.xKey} 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: labelColor }}
            />
            <YAxis 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: labelColor }}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', color: labelColor }} />
            <Line
              type="monotone"
              dataKey={panel.yKey}
              stroke={COLORS[0]}
              strokeWidth={2}
              dot={{ r: 3, fill: COLORS[0], strokeWidth: 1.5, stroke: dotStroke }}
              activeDot={{ r: 5, strokeWidth: 0 }}
              animationDuration={1000}
            />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
            <XAxis 
              dataKey={panel.xKey} 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: labelColor }}
            />
            <YAxis 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: labelColor }}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend verticalAlign="top" height={36} iconType="rect" wrapperStyle={{ fontSize: '10px', color: labelColor }} />
            <Bar 
              dataKey={panel.yKey} 
              fill={COLORS[1]} 
              radius={[4, 4, 0, 0]} 
              animationDuration={1000}
            >
               {processedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.9} />
              ))}
            </Bar>
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${panel.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[2]} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={COLORS[2]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
            <XAxis 
              dataKey={panel.xKey} 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: labelColor }}
            />
            <YAxis 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: labelColor }}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', color: labelColor }} />
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
              paddingAngle={4}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              animationDuration={1000}
              stroke={dotStroke}
              strokeWidth={2}
            >
              {processedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', color: labelColor }} />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <ChartContainer config={chartConfig} className="h-full w-full p-2">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart() as React.ReactElement}
      </ResponsiveContainer>
    </ChartContainer>
  );
}
