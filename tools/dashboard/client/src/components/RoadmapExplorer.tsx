import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, GitCommit, Search } from 'lucide-react';
import { getPriorityColor, getStatusIcon, getTeamIcon } from './backlog.helpers';
import type { RoadmapData } from './backlog.types';

interface RoadmapExplorerProps {
  roadmap: RoadmapData;
}

export function RoadmapExplorer({ roadmap }: RoadmapExplorerProps) {
  const [groupBy, setGroupBy] = useState<'priority' | 'team' | 'status'>('priority');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTeam, setFilterTeam] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = useMemo(() => roadmap.initiatives.filter((item) => {
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterTeam !== 'all' && item.team !== filterTeam) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  }), [filterStatus, filterTeam, roadmap.initiatives, searchQuery]);

  const groups = useMemo(() => {
    const grouped: Record<string, typeof filtered> = {};
    filtered.forEach((item) => {
      const key = item[groupBy];
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
    return grouped;
  }, [filtered, groupBy]);

  const groupOrder = groupBy === 'priority' ? ['P0', 'P1', 'P2', 'P3'] : groupBy === 'status' ? ['in-progress', 'planned', 'completed'] : roadmap.teams;
  const completionPct = Math.round((roadmap.summary.completed / Math.max(roadmap.summary.total, 1)) * 100);
  const toggleExpand = (id: string) => setExpandedItems((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        <div className="card bg-slate-800/50 py-3"><p className="text-xs text-slate-500">Total</p><p className="text-xl font-bold text-white">{roadmap.summary.total}</p></div>
        <div className="card bg-emerald-900/20 border-emerald-500/30 py-3"><p className="text-xs text-emerald-400">Completed</p><p className="text-xl font-bold text-emerald-400">{roadmap.summary.completed}</p></div>
        <div className="card bg-slate-700/30 py-3"><p className="text-xs text-slate-400">Planned</p><p className="text-xl font-bold text-slate-300">{roadmap.summary.planned}</p></div>
        <div className="card bg-purple-900/20 border-purple-500/30 py-3"><p className="text-xs text-purple-400">Auto-Detected</p><p className="text-xl font-bold text-purple-400">{roadmap.summary.autoDetected}</p></div>
        <div className="card bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30 py-3 col-span-2">
          <p className="text-xs text-cyan-400">Progress</p>
          <div className="flex items-center gap-3"><p className="text-xl font-bold text-cyan-400">{completionPct}%</p><div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${completionPct}%` }} /></div></div>
        </div>
      </div>

      <div className="card space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by title or ID..." className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)} className="px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"><option value="all">All Teams</option>{roadmap.teams.map((team) => <option key={team} value={team}>{team}</option>)}</select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"><option value="all">All Status</option><option value="planned">Planned</option><option value="in-progress">In Progress</option><option value="completed">Completed</option></select>
          <div className="flex bg-slate-800 rounded-lg p-1">{(['priority', 'team', 'status'] as const).map((mode) => <button key={mode} onClick={() => setGroupBy(mode)} className={`px-3 py-1 rounded text-sm ${groupBy === mode ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</button>)}</div>
        </div>
      </div>

      {groupOrder.filter((k) => groups[k]?.length > 0).map((groupKey) => (
        <div key={groupKey} className="card">
          <div className="flex items-center gap-2 mb-3">
            {groupBy === 'priority' && <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getPriorityColor(groupKey)}`}>{groupKey}</span>}
            {groupBy === 'team' && getTeamIcon(groupKey)}
            {groupBy === 'status' && getStatusIcon(groupKey)}
            <h3 className="font-bold text-white capitalize">{groupKey}</h3>
            <span className="text-sm text-slate-500">({groups[groupKey].length})</span>
          </div>
          <div className="space-y-1">
            {groups[groupKey].map((item) => (
              <div key={item.id} className="bg-slate-800/50 rounded border border-slate-700/50">
                <div className="p-2 flex items-center gap-2 cursor-pointer hover:bg-slate-800/80 text-sm" onClick={() => toggleExpand(item.id)}>
                  {expandedItems.has(item.id) ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                  {getStatusIcon(item.status, item.detectedFromGit)}
                  <span className="text-xs font-mono text-slate-500">{item.id}</span>
                  {groupBy !== 'priority' && <span className={`px-1.5 py-0.5 text-xs rounded border ${getPriorityColor(item.priority)}`}>{item.priority}</span>}
                  {groupBy !== 'team' && <span className="text-xs text-slate-500 flex items-center gap-1">{getTeamIcon(item.team)}</span>}
                  <span className="flex-1 text-slate-200">{item.title}</span>
                  {item.detectedFromGit && <span className="px-1.5 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded">Auto</span>}
                </div>
                {expandedItems.has(item.id) && (
                  <div className="px-8 pb-2 text-xs text-slate-400 border-t border-slate-700/50 pt-2">
                    <p>{item.description}</p>
                    <div className="flex gap-4 mt-1 text-slate-500">
                      <span>Effort: {item.effort}</span>
                      <span>Impact: {item.impact}</span>
                      {item.completedAt && <span className="text-emerald-400">Completed: {item.completedAt}</span>}
                    </div>
                    {item.matchedCommits?.length ? (
                      <div className="mt-1 space-y-0.5">{item.matchedCommits.slice(0, 2).map((c, i) => <div key={i} className="flex items-center gap-1 text-purple-400"><GitCommit className="w-3 h-3" /><span className="font-mono">{c.hash.slice(0, 7)}</span><span className="text-slate-500 truncate">{c.message}</span></div>)}</div>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
