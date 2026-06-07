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
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Database, Code } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';

export function AddPanelDialog() {
  const { datasets, addPanel, addDataset } = useDashboardStore();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('existing');

  // Form State
  const [title, setTitle] = useState('New Panel');
  const [type, setType] = useState<ChartType>('line');
  const [dataSourceId, setDataSourceId] = useState('');
  const [xKey, setXKey] = useState('');
  const [yKey, setYKey] = useState('');
  const [aggregation, setAggregation] = useState<PanelConfig['aggregation']>('sum');

  // Manual JSON State
  const [manualJson, setManualJson] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const selectedDataset = datasets.find((d) => d.id === dataSourceId);

  const handleAdd = () => {
    let finalDataSourceId = dataSourceId;

    if (activeTab === 'manual') {
      try {
        const parsed = JSON.parse(manualJson);
        const data = Array.isArray(parsed) ? parsed : [parsed];
        if (data.length === 0) throw new Error('Empty data');
        
        const headers = Object.keys(data[0]);
        const newId = uuidv4();
        
        addDataset({
          id: newId,
          name: `Manual Entry: ${title}`,
          data,
          headers,
        });
        
        finalDataSourceId = newId;
      } catch (e) {
        setJsonError('Invalid JSON format. Please provide an array of objects.');
        return;
      }
    }

    if (!finalDataSourceId || !xKey || !yKey) return;

    const id = uuidv4();
    const newPanel: PanelConfig = {
      id,
      title,
      type,
      dataSourceId: finalDataSourceId,
      xKey,
      yKey,
      aggregation,
    };

    const newLayout: PanelLayout = {
      i: id,
      x: 0,
      y: Infinity,
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
    setManualJson('');
    setJsonError(null);
    setActiveTab('existing');
  };

  const validateJson = (val: string) => {
    setManualJson(val);
    if (!val) {
      setJsonError(null);
      return;
    }
    try {
      const parsed = JSON.parse(val);
      if (!Array.isArray(parsed)) throw new Error('Must be an array');
      setJsonError(null);
      // Auto-populate keys if valid
      if (parsed.length > 0) {
        const keys = Object.keys(parsed[0]);
        if (!xKey) setXKey(keys[0]);
        if (!yKey) setYKey(keys[1] || keys[0]);
      }
    } catch (e) {
      setJsonError('Invalid JSON format (Array of Objects required)');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(buttonVariants({ variant: 'default' }), 'cursor-pointer gap-2')}>
        <Plus className="h-4 w-4" /> Add Panel
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure Panel</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right text-xs font-bold uppercase text-muted-foreground">
              Title
            </Label>
            <Input
              id="title"
              placeholder="e.g. Sales Distribution"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 h-9"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs font-bold uppercase text-muted-foreground">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as ChartType || 'line')}>
              <SelectTrigger className="col-span-3 h-9">
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="existing" className="gap-2 text-xs">
                <Database className="h-3 w-3" /> Existing Data
              </TabsTrigger>
              <TabsTrigger value="manual" className="gap-2 text-xs">
                <Code className="h-3 w-3" /> Manual JSON
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="existing" className="space-y-4 min-h-[120px]">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-xs font-bold uppercase text-muted-foreground">Source</Label>
                <Select value={dataSourceId} onValueChange={(v) => setDataSourceId(v || '')}>
                  <SelectTrigger className="col-span-3 h-9">
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
            </TabsContent>

            <TabsContent value="manual" className="space-y-2">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">JSON Data (Array of Objects)</Label>
                <Textarea 
                  placeholder='[{"category": "A", "value": 10}, {"category": "B", "value": 20}]'
                  className={cn("font-mono text-[11px] h-24 resize-none", jsonError && "border-destructive focus-visible:ring-destructive")}
                  value={manualJson}
                  onChange={(e) => validateJson(e.target.value)}
                />
                {jsonError && <p className="text-[10px] text-destructive font-medium">{jsonError}</p>}
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">X-Axis (Legend)</Label>
                <Select value={xKey} onValueChange={(v) => setXKey(v || '')}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select key" />
                  </SelectTrigger>
                  <SelectContent>
                    {(selectedDataset?.headers || (manualJson && !jsonError ? Object.keys(JSON.parse(manualJson)[0]) : [])).map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Y-Axis (Value)</Label>
                <Select value={yKey} onValueChange={(v) => setYKey(v || '')}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select key" />
                  </SelectTrigger>
                  <SelectContent>
                    {(selectedDataset?.headers || (manualJson && !jsonError ? Object.keys(JSON.parse(manualJson)[0]) : [])).map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Aggregation Method</Label>
            <Select value={aggregation} onValueChange={(v) => setAggregation(v as any || 'sum')}>
              <SelectTrigger className="h-9">
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
        </div>

        <DialogFooter>
          <Button onClick={handleAdd} className="w-full shadow-lg shadow-primary/20" disabled={jsonError !== null || (!dataSourceId && !manualJson) || !xKey || !yKey}>
            Generate Visualization
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
