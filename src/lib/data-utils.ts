import { PanelConfig } from '@/types/dashboard';

export function aggregateData(data: any[], config: PanelConfig) {
  const { xKey, yKey, aggregation } = config;

  if (!xKey || !yKey || !data.length) return [];

  const grouped = data.reduce((acc: any, curr) => {
    const key = curr[xKey];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(curr[yKey]);
    return acc;
  }, {});

  return Object.keys(grouped).map((key) => {
    const values = grouped[key].filter((v: any) => typeof v === 'number');
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
    }

    return {
      [xKey]: key,
      [yKey]: value,
    };
  });
}
