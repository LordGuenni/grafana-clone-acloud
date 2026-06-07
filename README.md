# ⚡️ NexusInsight

NexusInsight is a high-performance, interactive data visualization dashboard built with **Next.js**, **shadcn/ui**, and **Recharts**. It allows users to import, analyze, and visualize complex datasets with a premium, Grafana-inspired interface.

## 🚀 Key Features

- **Dynamic Layout:** Drag-and-drop, resizable grid system powered by `react-grid-layout`.
- **Intelligent Importer:** Support for CSV, JSON files, and direct Manual JSON entry.
- **Rich Visualizations:** Line, Bar, Area, and Pie charts with smooth animations and multi-colored themes.
- **Full State Backups:** Export and Import your entire dashboard configuration (panels + data) as a single JSON file.
- **Theme-Ready:** Full dark and light mode support with glassmorphism effects.

## 📊 Sample Data for Testing

You can copy and paste these JSON blocks directly into the **Add Panel > Manual JSON** tab.

### 1. Cloud Infrastructure (Time-Series)
```json
[
  { "month": "Jan", "latency": 45, "load": 22 },
  { "month": "Feb", "latency": 42, "load": 28 },
  { "month": "Mar", "latency": 48, "load": 35 },
  { "month": "Apr", "latency": 38, "load": 42 },
  { "month": "May", "latency": 35, "load": 55 },
  { "month": "Jun", "latency": 32, "load": 68 },
  { "month": "Jul", "latency": 30, "load": 72 }
]
```

### 2. Product Sales (Categorical)
```json
[
  { "product": "Laptops", "revenue": 12000, "stock": 45 },
  { "product": "Monitors", "revenue": 8500, "stock": 120 },
  { "product": "Keyboards", "revenue": 2400, "stock": 350 },
  { "product": "Mice", "revenue": 1800, "stock": 480 },
  { "product": "Headsets", "revenue": 5200, "stock": 95 }
]
```

### 3. User Demographics (Pie Chart Ready)
```json
[
  { "region": "North America", "users": 4500 },
  { "region": "Europe", "users": 3800 },
  { "region": "Asia-Pacific", "users": 5200 },
  { "region": "Latin America", "users": 1200 },
  { "region": "Middle East", "users": 850 }
]
```

## 🛠 Setup & Development

First, install dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your dashboard.

## 🚢 Deployment

The project is configured for **GitHub Pages**. To deploy:
1. Ensure `next.config.ts` has the correct `basePath`.
2. Push to the `main` branch.
3. In GitHub Settings > Pages, set the Source to **GitHub Actions**.
