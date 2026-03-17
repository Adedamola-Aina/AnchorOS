import { Calendar, RotateCcw } from 'lucide-react';
import type { ArchivedItem } from './archiveViewer.utils';

interface ArchivedItemsPanelProps {
  archivedItems: ArchivedItem[];
  groupedItems: Record<string, ArchivedItem[]>;
  daysThreshold: number;
  onRestore: (text: string) => void;
}

export function ArchivedItemsPanel({
  archivedItems,
  groupedItems,
  daysThreshold,
  onRestore,
}: ArchivedItemsPanelProps) {
  return (
    <div className="card">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-emerald-400" />
        Archived Items ({archivedItems.length})
      </h3>

      {archivedItems.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">
          No archived items yet. Items will be automatically archived after {daysThreshold} days.
        </p>
      ) : (
        <div className="space-y-6">
          {Object.keys(groupedItems).sort().reverse().map((month) => (
            <div key={month}>
              <h4 className="text-md font-semibold text-emerald-400 mb-3">{month}</h4>
              <div className="space-y-2">
                {groupedItems[month].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm text-slate-300">{item.text}</p>
                      {item.week && <p className="text-xs text-slate-500 mt-1">{item.week}</p>}
                    </div>
                    <button
                      onClick={() => onRestore(item.text)}
                      className="ml-4 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 rounded text-xs text-white font-medium transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
