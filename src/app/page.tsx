'use client';

import React from 'react';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { DataImporter } from '@/components/dashboard/DataImporter';
import { AddPanelDialog } from '@/components/dashboard/AddPanelDialog';
import { SampleDataButton } from '@/components/dashboard/SampleDataButton';
import { GlobalFilter } from '@/components/dashboard/GlobalFilter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LayoutDashboard, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Grafana Clone</h1>
            <p className="text-xs text-muted-foreground">Interactive Data Visualization</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <GlobalFilter />
          <div className="w-px h-6 bg-border mx-1" />
          <SampleDataButton />
          <DataImporter />
          <AddPanelDialog />
          <ThemeToggle />
        </div>
      </header>
      
      <div className="flex-1 overflow-auto bg-muted/20">
        <Dashboard />
      </div>
    </main>
  );
}
