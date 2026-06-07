'use client';

import React from 'react';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { DataImporter } from '@/components/dashboard/DataImporter';
import { AddPanelDialog } from '@/components/dashboard/AddPanelDialog';
import { SampleDataButton } from '@/components/dashboard/SampleDataButton';
import { GlobalFilter } from '@/components/dashboard/GlobalFilter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LayoutDashboard, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="border-b bg-card/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20"
          >
            <Zap className="h-6 w-6 text-primary-foreground" />
          </motion.div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              NexusInsight
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/80">
              Next-Gen Data Orchestration
            </p>
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
      </motion.header>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="flex-1 overflow-auto bg-muted/20"
      >
        <Dashboard />
      </motion.div>
    </main>
  );
}
