import axios from 'axios';

export interface ArchivedItem {
  text: string;
  month: string | null;
  week: string | null;
}

export interface ArchivePreview {
  success: boolean;
  archivedCount: number;
  items?: Array<{
    text: string;
    completionDate: string;
  }>;
  message: string;
}

export function groupArchivedItemsByMonth(items: ArchivedItem[]): Record<string, ArchivedItem[]> {
  return items.reduce<Record<string, ArchivedItem[]>>((acc, item) => {
    const month = item.month || 'Unknown';
    if (!acc[month]) acc[month] = [];
    acc[month].push(item);
    return acc;
  }, {});
}

export async function fetchArchivedItemsApi(): Promise<ArchivedItem[]> {
  const res = await axios.get('/api/archive/items');
  return res.data.items;
}

export async function fetchArchivePreview(daysThreshold: number): Promise<ArchivePreview> {
  const res = await axios.get(`/api/archive/preview?days=${daysThreshold}`);
  return res.data;
}

export async function runArchivalNow(daysThreshold: number): Promise<string> {
  const res = await axios.post('/api/archive/run', { daysThreshold, dryRun: false });
  return res.data.message;
}

export async function restoreArchivedItem(itemText: string): Promise<string> {
  const res = await axios.post('/api/archive/restore', { itemText });
  return res.data.message;
}
