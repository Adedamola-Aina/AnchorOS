import type { FilterType } from './gitTimeline.types';

export const filterLabels: Record<FilterType, string> = {
  all: 'All',
  anchorOS: '⚓ Product',
  dashboard: '📊 Dashboard',
  docs: '📝 Docs',
  infra: '⚙️ Infra',
};

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === today.toISOString().split('T')[0]) return 'Today';
  if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function getTypeColor(type: string): string {
  switch (type) {
    case 'feature': return 'badge-purple';
    case 'bugfix': return 'badge-red';
    case 'docs': return 'badge-blue';
    case 'refactor': return 'badge-yellow';
    default: return 'badge-green';
  }
}
