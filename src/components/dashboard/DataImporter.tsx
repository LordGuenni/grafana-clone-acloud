'use client';

import React, { useCallback } from 'react';
import Papa from 'papaparse';
import { useDashboardStore } from '@/store/useDashboardStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function DataImporter() {
  const addDataset = useDashboardStore((state) => state.addDataset);

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
            const headers = Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : [];
            addDataset({
              id: uuidv4(),
              name: fileName,
              data: Array.isArray(data) ? data : [data],
              headers,
            });
          } catch (err) {
            console.error('Failed to parse JSON', err);
          }
        }
      };

      reader.readAsText(file);
    },
    [addDataset]
  );

  return (
    <div className="flex items-center gap-4">
      <Input
        type="file"
        accept=".csv,.json"
        onChange={handleFileUpload}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button variant="outline" className="cursor-pointer gap-2">
            <Upload className="h-4 w-4" />
            Import Data
        </Button>
      </label>
    </div>
  );
}
