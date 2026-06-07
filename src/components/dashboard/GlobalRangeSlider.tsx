'use client';

import React from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { CalendarRange } from 'lucide-react';

export function GlobalRangeSlider() {
  const { dataRange, setDataRange, datasets } = useDashboardStore();

  if (datasets.length === 0) return null;

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-muted/10 rounded-lg border border-border/50">
      <div className="flex items-center gap-2 text-muted-foreground">
        <CalendarRange className="h-4 w-4" />
        <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Scale Range</span>
      </div>
      <div className="w-48 flex items-center pt-1">
        <Slider
          defaultValue={[0, 100]}
          value={dataRange}
          onValueChange={(val) => setDataRange(val as [number, number])}
          max={100}
          step={1}
          minStepsBetweenThumbs={1}
          className="cursor-pointer"
        />
      </div>
      <div className="flex items-center gap-1 min-w-[60px] justify-end">
        <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
          {dataRange[0]}%
        </span>
        <span className="text-muted-foreground text-[10px]">-</span>
        <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
          {dataRange[1]}%
        </span>
      </div>
    </div>
  );
}
