import { create } from 'zustand';
import { DashboardState, Dataset, PanelConfig, PanelLayout } from '@/types/dashboard';

export const useDashboardStore = create<DashboardState>((set) => ({
  datasets: [],
  panels: [],
  layouts: [],
  globalFilter: '',
  addDataset: (dataset) =>
    set((state) => ({ datasets: [...state.datasets, dataset] })),
  removeDataset: (id) =>
    set((state) => ({
      datasets: state.datasets.filter((d) => d.id !== id),
    })),
  addPanel: (panel, layout) =>
    set((state) => ({
      panels: [...state.panels, panel],
      layouts: [...state.layouts, layout],
    })),
  updatePanel: (id, updates) =>
    set((state) => ({
      panels: state.panels.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  removePanel: (id) =>
    set((state) => ({
      panels: state.panels.filter((p) => p.id !== id),
      layouts: state.layouts.filter((l) => l.i !== id),
    })),
  updateLayouts: (layouts) => set({ layouts }),
  setGlobalFilter: (globalFilter) => set({ globalFilter }),
}));
