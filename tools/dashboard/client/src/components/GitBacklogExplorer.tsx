import { useMemo, useState } from 'react';
import { GitBranch } from 'lucide-react';
import { getStatusIcon, getTypeColor } from './backlog.helpers';
import type { BacklogData } from './backlog.types';

interface GitBacklogExplorerProps {
  backlog: BacklogData;
}

export function GitBacklogExplorer({ backlog }: GitBacklogExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const allItems = useMemo(() => {
    const merged = [...backlog.inProgress, ...backlog.pending, ...backlog.completed];
    if (!searchQuery) return merged;
    const q = searchQuery.toLowerCase();
    return merged.filter((item) => item.id.toLowerCase().includes(q) || item.title.toLowerCase().includes(q));
  }, [backlog.completed, backlog.inProgress, backlog.pending, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="card bg-amber-900/20 border-amber-500/30"><p className="text-xs text-amber-400">Dev Only</p><p className="text-2xl font-bold text-amber-400">{backlog.summary.pending}</p></div>
        <div className="card bg-blue-900/20 border-blue-500/30"><p className="text-xs text-blue-400">In Staging</p><p className="text-2xl font-bold text-blue-400">{backlog.summary.inProgress}</p></div>
        <div className="card bg-emerald-900/20 border-emerald-500/30"><p className="text-xs text-emerald-400">Deployed</p><p className="text-2xl font-bold text-emerald-400">{backlog.summary.completed}</p></div>
      </div>

      <div className="card space-y-3">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search git activity..."
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <div className="flex items-center gap-2"><GitBranch className="w-4 h-4 text-slate-400" /><h3 className="font-bold text-white">Git Activity ({allItems.length})</h3></div>
        <div className="space-y-1 max-h-[500px] overflow-y-auto">
          {allItems.map((item) => (
            <div key={item.id + item.hash} className="p-2 bg-slate-800/50 rounded border border-slate-700/50 flex items-center gap-2 text-sm">
              {getStatusIcon(item.status)}
              <span className={`px-1.5 py-0.5 text-xs rounded border ${getTypeColor(item.type)}`}>{item.type}</span>
              <span className="text-xs font-mono text-slate-500">{item.id}</span>
              <span className="flex-1 text-slate-200 truncate">{item.title}</span>
              <span className="text-xs text-slate-500 font-mono">{item.hash.slice(0, 7)}</span>
              <span className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
