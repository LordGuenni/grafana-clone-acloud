'use client';

import React, { useState } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { ChartType, PanelConfig, PanelLayout } from '@/types/dashboard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';

export function AddPanelDialog() {
  const { datasets, addPanel } = useDashboardStore();
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState('New Panel');
  const [type, setType] = useState<ChartType>('line');
  const [dataSourceId, setDataSourceId] = useState('');
  const [xKey, setXKey] = useState('');
  const [yKey, setYKey] = useState('');
  const [aggregation, setAggregation] = useState<PanelConfig['aggregation']>('sum');

  const selectedDataset = datasets.find((d) => d.id === dataSourceId);

  const handleAdd = () => {
    if (!dataSourceId || !xKey || !yKey) return;

    const id = uuidv4();
    const newPanel: PanelConfig = {
      id,
      title,
      type,
      dataSourceId,
      xKey,
      yKey,
      aggregation,
    };

    const newLayout: PanelLayout = {
      i: id,
      x: 0,
      y: Infinity, // put it at the bottom
      w: 6,
      h: 4,
    };

    addPanel(newPanel, newLayout);
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('New Panel');
    setType('line');
    setDataSourceId('');
    setXKey('');
    setYKey('');
    setAggregation('sum');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(buttonVariants({ variant: 'default' }), 'cursor-pointer gap-2')}>
        <Plus className="h-4 w-4" /> Add Panel
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Panel</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as ChartType || 'line')}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="area">Area Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Data Source</Label>
            <Select value={dataSourceId} onValueChange={(v) => setDataSourceId(v || '')}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select dataset" />
              </SelectTrigger>
              <SelectContent>
                {datasets.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedDataset && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">X Axis (Category)</Label>
                <Select value={xKey} onValueChange={(v) => setXKey(v || '')}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select header" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedDataset.headers.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Y Axis (Value)</Label>
                <Select value={yKey} onValueChange={(v) => setYKey(v || '')}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select header" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedDataset.headers.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Aggregation</Label>
                <Select
                  value={aggregation}
                  onValueChange={(v) => setAggregation(v as PanelConfig['aggregation'] || 'sum')}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select aggregation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sum">Sum</SelectItem>
                    <SelectItem value="avg">Average</SelectItem>
                    <SelectItem value="count">Count</SelectItem>
                    <SelectItem value="min">Minimum</SelectItem>
                    <SelectItem value="max">Maximum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleAdd} disabled={!dataSourceId || !xKey || !yKey}>
            Add to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
