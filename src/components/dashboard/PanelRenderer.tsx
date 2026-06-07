'use client';

import React, { useMemo } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { PanelConfig } from '@/types/dashboard';
import { aggregateData, getSeriesKeys } from '@/lib/data-utils';
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

const DARK_COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#818cf8', '#f472b6', '#fb7185', '#22d3ee', '#a78bfa'];
const LIGHT_COLORS = ['#0284c7', '#059669', '#d97706', '#4f46e5', '#db2777', '#e11d48', '#0891b2', '#7c3aed'];

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
      const keywords = globalFilter.split('&').map(k => k.trim().toLowerCase()).filter(k => k !== '');
      filteredData = rawData.filter((row: any) => {
        const rowValues = Object.values(row).map(val => String(val).toLowerCase());
        return keywords.some(keyword => rowValues.some(val => val.includes(keyword)));
      });
    }
    
    return aggregateData(filteredData, panel);
  }, [dataset, panel, globalFilter, previewData]);

  const seriesKeys = useMemo(() => getSeriesKeys(processedData, panel.xKey), [processedData, panel.xKey]);

  if (!dataset && !previewData) {
    return <div className="flex h-full items-center justify-center text-muted-foreground text-xs italic">No data source selected</div>;
  }

  if (processedData.length === 0) {
    return <div className="flex h-full items-center justify-center text-muted-foreground text-xs italic">No data matches filters</div>;
  }

  const chartConfig = seriesKeys.reduce((acc: any, key, index) => {
    acc[key] = { label: key, color: COLORS[index % COLORS.length] };
    return acc;
  }, {});

  const gridStroke = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const labelColor = isDark ? "#f3f4f6" : "#4b5563"; 
  const dotStroke = isDark ? "#0f172a" : "#ffffff"; 

  const renderChart = () => {
    switch (panel.type) {
      case 'line':
        return (
          <LineChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
            <XAxis dataKey={panel.xKey} fontSize={10} tickLine={false} axisLine={false} tick={{ fill: labelColor }} />
            <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: labelColor }} />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', color: labelColor }} />
            {seriesKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={3}
                dot={{ r: 4, fill: COLORS[index % COLORS.length], strokeWidth: 2, stroke: dotStroke }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1000}
              />
            ))}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
            <XAxis dataKey={panel.xKey} fontSize={10} tickLine={false} axisLine={false} tick={{ fill: labelColor }} />
            <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: labelColor }} />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend verticalAlign="top" height={36} iconType="rect" wrapperStyle={{ fontSize: '10px', color: labelColor }} />
            {seriesKeys.map((key, index) => (
              <Bar 
                key={key}
                dataKey={key} 
                fill={COLORS[index % COLORS.length]} 
                radius={[4, 4, 0, 0]} 
                animationDuration={1000}
              />
            ))}
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {seriesKeys.map((key, index) => (
                <linearGradient key={`grad-${key}`} id={`gradient-${panel.id}-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.5}/>
                  <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
            <XAxis dataKey={panel.xKey} fontSize={10} tickLine={false} axisLine={false} tick={{ fill: labelColor }} />
            <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: labelColor }} />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', color: labelColor }} />
            {seriesKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                fill={`url(#gradient-${panel.id}-${index})`}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={3}
                stackId={panel.aggregation === 'sum' ? "1" : undefined}
                animationDuration={1000}
              />
            ))}
          </AreaChart>
        );
      case 'pie':
        // Pivot back to categorical format for Pie Chart
        const pieData = processedData.length > 0 ? seriesKeys.map((key, index) => ({
          name: key,
          value: processedData.reduce((sum, row) => sum + (Number(row[key]) || 0), 0)
        })) : [];

        return (
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
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
              {pieData.map((_, index) => (
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
