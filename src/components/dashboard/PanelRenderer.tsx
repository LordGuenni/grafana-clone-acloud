'use client';

import React, { useMemo } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { PanelConfig } from '@/types/dashboard';
import { aggregateData } from '@/lib/data-utils';
import { useTheme } from 'next-themes';
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

// Premium High-Luminosity Colors specifically for Dark Mode
const DARK_COLORS = [
  '#38bdf8', // Neon Blue
  '#34d399', // Emerald
  '#fbbf24', // Amber
  '#818cf8', // Indigo
  '#f472b6', // Pink
  '#fb7185', // Rose
];

// Softer Professional Colors for Light Mode
const LIGHT_COLORS = [
  '#0284c7', // Sky 700
  '#059669', // Emerald 600
  '#d97706', // Amber 600
  '#4f46e5', // Indigo 600
  '#db2777', // Pink 600
  '#e11d48', // Rose 600
];

interface PanelRendererProps {
  panel: PanelConfig;
  previewData?: any[]; 
}

export function PanelRenderer({ panel, previewData }: PanelRendererProps) {
  const datasets = useDashboardStore((state) => state.datasets);
  const globalFilter = useDashboardStore((state) => state.globalFilter);
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const COLORS = isDark ? DARK_COLORS : LIGHT_COLORS;

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

  const gridStroke = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const labelColor = isDark ? "#f3f4f6" : "#4b5563"; // Gray 100 vs Gray 600
  const dotStroke = isDark ? "#0f172a" : "#ffffff"; // Deep slate vs white

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
              strokeWidth={3}
              dot={{ r: 4, fill: COLORS[0], strokeWidth: 2, stroke: dotStroke }}
              activeDot={{ r: 6, strokeWidth: 0 }}
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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${panel.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[2]} stopOpacity={0.5}/>
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
              strokeWidth={3}
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
