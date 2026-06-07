import { PanelConfig } from '@/types/dashboard';

export function aggregateData(data: any[], config: PanelConfig) {
  const { xKey, yKey, aggregation, groupBy } = config;

  if (!xKey || !yKey || !data.length) return [];

  // 1. Group data by X-axis key
  const groupedByX = data.reduce((acc: any, curr) => {
    const xVal = String(curr[xKey] ?? 'Unknown');
    if (!acc[xVal]) acc[xVal] = [];
    acc[xVal].push(curr);
    return acc;
  }, {});

  // 2. Identify all groups if groupBy is set
  const allGroups = groupBy 
    ? Array.from(new Set(data.map(d => String(d[groupBy] ?? 'Other'))))
    : ['Value'];

  // 3. Process each X-axis group
  return Object.keys(groupedByX).map((xVal) => {
    const result: any = { [xKey]: xVal };
    const rowsInX = groupedByX[xVal];

    if (groupBy) {
      // Pivot data for each subgroup
      allGroups.forEach(groupName => {
        const rowsInGroup = rowsInX.filter((d: any) => String(d[groupBy] ?? 'Other') === groupName);
        result[groupName] = calculateValue(rowsInGroup, yKey, aggregation);
      });
    } else {
      result[yKey] = calculateValue(rowsInX, yKey, aggregation);
    }

    return result;
  });
}

function calculateValue(rows: any[], yKey: string, aggregation: string) {
  const values = rows
    .map(r => {
      const val = r[yKey];
      return typeof val === 'number' ? val : parseFloat(val);
    })
    .filter(v => !isNaN(v));

  if (values.length === 0) return 0;

  switch (aggregation) {
    case 'sum':
      return values.reduce((a, b) => a + b, 0);
    case 'avg':
      return values.reduce((a, b) => a + b, 0) / values.length;
    case 'count':
      return values.length;
    case 'min':
      return Math.min(...values);
    case 'max':
      return Math.max(...values);
    default:
      return 0;
  }
}

export function getSeriesKeys(data: any[], xKey: string): string[] {
  if (data.length === 0) return [];
  return Object.keys(data[0]).filter(k => k !== xKey);
}
