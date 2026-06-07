export type ChartType = 'line' | 'bar' | 'area' | 'pie';

export interface PanelConfig {
  id: string;
  title: string;
  type: ChartType;
  dataSourceId: string;
  xKey: string;
  yKey: string;
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

export interface PanelLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Dataset {
  id: string;
  name: string;
  data: any[];
  headers: string[];
}

export interface DashboardState {
  datasets: Dataset[];
  panels: PanelConfig[];
  layouts: PanelLayout[];
  globalFilter: string;
  addDataset: (dataset: Dataset) => void;
  removeDataset: (id: string) => void;
  addPanel: (panel: PanelConfig, layout: PanelLayout) => void;
  updatePanel: (id: string, updates: Partial<PanelConfig>) => void;
  removePanel: (id: string) => void;
  updateLayouts: (layouts: PanelLayout[]) => void;
  setGlobalFilter: (filter: string) => void;
  setDashboardState: (datasets: Dataset[], panels: PanelConfig[], layouts: PanelLayout[]) => void;
}
