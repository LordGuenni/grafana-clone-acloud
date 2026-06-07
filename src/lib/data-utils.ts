import { PanelConfig } from '@/types/dashboard';

export function aggregateData(data: any[], config: PanelConfig) {
  const { xKey, yKey, aggregation } = config;

  if (!xKey || !yKey || !data.length) return [];

  const grouped = data.reduce((acc: any, curr) => {
    const key = String(curr[xKey] ?? 'Unknown');
    if (!acc[key]) {
      acc[key] = [];
    }
    // Handle both numbers and strings that look like numbers
    const rawValue = curr[yKey];
    const numericValue = typeof rawValue === 'number' ? rawValue : parseFloat(rawValue);
    
    if (!isNaN(numericValue)) {
      acc[key].push(numericValue);
    }
    return acc;
  }, {});

  return Object.keys(grouped).map((key) => {
    const values = grouped[key];
    let value = 0;

    if (values.length > 0) {
      switch (aggregation) {
        case 'sum':
          value = values.reduce((a: number, b: number) => a + b, 0);
          break;
        case 'avg':
          value = values.reduce((a: number, b: number) => a + b, 0) / values.length;
          break;
        case 'count':
          value = values.length;
          break;
        case 'min':
          value = Math.min(...values);
          break;
        case 'max':
          value = Math.max(...values);
          break;
        default:
          value = 0;
      }
    } else if (aggregation === 'count') {
       // If no numeric values, count could still be relevant if we counted rows, 
       // but here we specifically count rows with valid yKey values.
       value = 0;
    }

    return {
      [xKey]: key,
      [yKey]: value,
    };
  });
}
