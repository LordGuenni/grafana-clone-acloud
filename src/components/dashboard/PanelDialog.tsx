'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { ChartType, PanelConfig, PanelLayout, Dataset } from '@/types/dashboard';
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
import { Plus, Database, Code, Eye, Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';
import { PanelRenderer } from './PanelRenderer';

interface PanelDialogProps {
  mode?: 'add' | 'edit';
  panelToEdit?: PanelConfig;
  trigger?: React.ReactNode;
}

export function PanelDialog({ mode = 'add', panelToEdit, trigger }: PanelDialogProps) {
  const { datasets, addPanel, updatePanel, addDataset } = useDashboardStore();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('existing');

  // Form State
  const [title, setTitle] = useState(panelToEdit?.title || (mode === 'add' ? 'New Panel' : 'Edit Panel'));
  const [type, setType] = useState<ChartType>(panelToEdit?.type || 'line');
  const [dataSourceId, setDataSourceId] = useState(panelToEdit?.dataSourceId || '');
  const [xKey, setXKey] = useState(panelToEdit?.xKey || '');
  const [yKey, setYKey] = useState(panelToEdit?.yKey || '');
  const [aggregation, setAggregation] = useState<PanelConfig['aggregation']>(panelToEdit?.aggregation || 'sum');

  // Manual JSON State
  const [manualJson, setManualJson] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [tempManualDataset, setTempManualDataset] = useState<Dataset | null>(null);

  const selectedDataset = datasets.find((d) => d.id === dataSourceId);

  // Initialize fields if editing
  useEffect(() => {
    if (open && mode === 'edit' && panelToEdit) {
      setTitle(panelToEdit.title);
      setType(panelToEdit.type);
      setDataSourceId(panelToEdit.dataSourceId);
      setXKey(panelToEdit.xKey);
      setYKey(panelToEdit.yKey);
      setAggregation(panelToEdit.aggregation);
    }
  }, [open, mode, panelToEdit]);

  // Update temp dataset for manual JSON preview
  useEffect(() => {
    if (activeTab === 'manual' && manualJson && !jsonError) {
      try {
        const parsed = JSON.parse(manualJson);
        const data = Array.isArray(parsed) ? parsed : [parsed];
        const headers = data.length > 0 ? Object.keys(data[0]) : [];
        setTempManualDataset({
          id: 'temp-preview',
          name: 'Preview',
          data,
          headers,
        });
      } catch (e) {}
    } else {
      setTempManualDataset(null);
    }
  }, [manualJson, jsonError, activeTab]);

  const previewPanel: PanelConfig | null = useMemo(() => {
    const dsId = activeTab === 'manual' ? 'temp-preview' : dataSourceId;
    if (!dsId || !xKey || !yKey) return null;

    return {
      id: panelToEdit?.id || 'preview',
      title,
      type,
      dataSourceId: dsId,
      xKey,
      yKey,
      aggregation,
    };
  }, [title, type, dataSourceId, xKey, yKey, aggregation, activeTab, panelToEdit]);

  const handleSave = () => {
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

    if (mode === 'add') {
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
    } else if (mode === 'edit' && panelToEdit) {
      updatePanel(panelToEdit.id, {
        title,
        type,
        dataSourceId: finalDataSourceId,
        xKey,
        yKey,
        aggregation,
      });
    }

    setOpen(false);
    if (mode === 'add') resetForm();
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
    setTempManualDataset(null);
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
      if (parsed.length > 0) {
        const keys = Object.keys(parsed[0]);
        if (!xKey) setXKey(keys[0]);
        if (!yKey) setYKey(keys[1] || keys[0]);
      }
    } catch (e) {
      setJsonError('Invalid JSON format (Array of Objects required)');
    }
  };

  const defaultTrigger = mode === 'add' ? (
    <Button className={cn(buttonVariants({ variant: 'default' }), 'cursor-pointer gap-2')}>
      <Plus className="h-4 w-4" /> Add Panel
    </Button>
  ) : (
    <Button variant="ghost" size="icon-sm" className="h-7 w-7 rounded-md">
      <Settings className="h-3.5 w-3.5" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger || defaultTrigger} />
      <DialogContent className="sm:max-w-[800px] gap-0 p-0 overflow-hidden border-none shadow-2xl">
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* Configuration Side */}
          <div className="flex-1 p-6 space-y-4 border-r bg-background overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{mode === 'add' ? 'Configure New Panel' : 'Edit Panel'}</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Sales Distribution"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Visualization Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as ChartType || 'line')}>
                  <SelectTrigger className="h-9">
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
                <TabsList className="grid w-full grid-cols-2 h-8">
                  <TabsTrigger value="existing" className="text-[10px] uppercase font-bold tracking-tight">
                    Database
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="text-[10px] uppercase font-bold tracking-tight">
                    Custom JSON
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="existing" className="space-y-4 mt-2">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Data Source</Label>
                    <Select value={dataSourceId} onValueChange={(v) => setDataSourceId(v || '')}>
                      <SelectTrigger className="h-9">
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

                <TabsContent value="manual" className="space-y-2 mt-2">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Raw JSON Array</Label>
                    <Textarea 
                      placeholder='[{"category": "A", "value": 10}]'
                      className={cn("font-mono text-[10px] h-20 resize-none", jsonError && "border-destructive")}
                      value={manualJson}
                      onChange={(e) => validateJson(e.target.value)}
                    />
                    {jsonError && <p className="text-[10px] text-destructive italic">{jsonError}</p>}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">X-Axis</Label>
                    <Select value={xKey} onValueChange={(v) => setXKey(v || '')}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Key" />
                      </SelectTrigger>
                      <SelectContent>
                        {(selectedDataset?.headers || (tempManualDataset?.headers || [])).map((h) => (
                          <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Y-Axis</Label>
                    <Select value={yKey} onValueChange={(v) => setYKey(v || '')}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Key" />
                      </SelectTrigger>
                      <SelectContent>
                        {(selectedDataset?.headers || (tempManualDataset?.headers || [])).map((h) => (
                          <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                 </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Aggregation</Label>
                <Select value={aggregation} onValueChange={(v) => setAggregation(v as any || 'sum')}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Method" />
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

            <Button onClick={handleSave} className="w-full mt-4 h-10 shadow-lg shadow-primary/20" disabled={jsonError !== null || (!dataSourceId && !manualJson) || !xKey || !yKey}>
              {mode === 'add' ? 'Create Panel' : 'Save Changes'}
            </Button>
          </div>

          {/* Preview Side */}
          <div className="flex-1 bg-muted/30 p-6 flex flex-col min-h-[300px] md:min-h-0">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest">Live Preview</span>
            </div>
            
            <div className="flex-1 bg-card border rounded-xl overflow-hidden shadow-inner flex items-center justify-center relative">
              {previewPanel ? (
                <PanelRenderer previewData={activeTab === 'manual' ? tempManualDataset?.data : undefined} panel={previewPanel} />
              ) : (
                <div className="text-center p-8">
                  <div className="bg-muted rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Database className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium italic">
                    Complete configuration to see preview
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
