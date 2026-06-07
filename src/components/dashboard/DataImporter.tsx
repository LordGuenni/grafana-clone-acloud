'use client';

import React, { useCallback, useRef } from 'react';
import Papa from 'papaparse';
import { useDashboardStore } from '@/store/useDashboardStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function DataImporter() {
  const { addDataset, setDashboardState, addPanel } = useDashboardStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const fileName = file.name;
      const extension = fileName.split('.').pop()?.toLowerCase();

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;

        if (extension === 'csv') {
          Papa.parse(content, {
            header: true,
            dynamicTyping: true,
            complete: (results) => {
              addDataset({
                id: uuidv4(),
                name: fileName,
                data: results.data,
                headers: results.meta.fields || [],
              });
            },
          });
        } else if (extension === 'json') {
          try {
            const data = JSON.parse(content);
            
            if (data.type === 'nexus-insight-dashboard-config') {
              setDashboardState(data.datasets, data.panels, data.layouts);
            } else if (data.type === 'nexus-insight-dataset-export') {
              addDataset(data.dataset);
            } else if (data.type === 'nexus-insight-panel-export') {
              // Import individual panel
              if (data.dataset) {
                // Ensure unique ID if dataset with same ID already exists? 
                // For now just add it.
                addDataset(data.dataset);
              }
              if (data.panel && data.layout) {
                addPanel(data.panel, data.layout);
              }
            } else {
              // Standard JSON array
              const headers = Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : [];
              addDataset({
                id: uuidv4(),
                name: fileName,
                data: Array.isArray(data) ? data : [data],
                headers,
              });
            }
          } catch (err) {
            console.error('Failed to parse JSON', err);
          }
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
      };

      reader.readAsText(file);
    },
    [addDataset, setDashboardState, addPanel]
  );

  return (
    <div className="flex items-center">
      <Input
        type="file"
        ref={fileInputRef}
        accept=".csv,.json"
        onChange={handleFileUpload}
        className="hidden"
        id="file-upload"
      />
      <Button 
        variant="outline" 
        size="sm"
        className="gap-2 cursor-pointer border-primary/20 hover:border-primary/50" 
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        Import Data
      </Button>
    </div>
  );
}
