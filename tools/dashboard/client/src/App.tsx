import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { RefreshCw, Clock, GitBranch, CheckSquare, Lightbulb, Shield, AlertTriangle } from 'lucide-react';
import { EnvironmentParity } from './components/EnvironmentParity';
import { EnterpriseKanban } from './components/EnterpriseKanban';
import { GitTimeline } from './components/GitTimeline';
import { UnifiedBacklog } from './components/UnifiedBacklog';
import { CommandCenter } from './components/CommandCenter';

type TabType = 'command' | 'kanban' | 'parity' | 'timeline' | 'backlog';

interface Summary {
    projectStatus: unknown;
    bugs: unknown;
    kanban: unknown;
    parity: { total: number; devOnly: number; stagingPending: number; fullyDeployed: number };
    git: { branch: string; lastCommit: { hash: string; message: string; date: string } };
    lastRefresh: string;
}

function App() {
    const [activeTab, setActiveTab] = useState<TabType>('command');
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchSummary = useCallback(async () => {
        try {
            setIsRefreshing(true);
            const res = await axios.get('/api/summary');
            setSummary(res.data);
            setLastRefresh(new Date());
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch data');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchSummary();
        // Auto-refresh every 5 minutes
        const interval = setInterval(fetchSummary, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchSummary]);

    const handleRefresh = () => {
        fetchSummary();
    };

    const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
        { id: 'command', label: 'Command Center', icon: <Shield className="w-4 h-4" /> },
        { id: 'kanban', label: 'Kanban Board', icon: <CheckSquare className="w-4 h-4" /> },
        { id: 'parity', label: 'Environment Parity', icon: <GitBranch className="w-4 h-4" /> },
        { id: 'timeline', label: 'Git Timeline', icon: <Clock className="w-4 h-4" /> },
        { id: 'backlog', label: 'Backlog & Roadmap', icon: <Lightbulb className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <header className="bg-slate-800/50 border-b border-slate-700/50 sticky top-0 z-10 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">A</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">Anchor OS</h1>
                                <p className="text-xs text-slate-400">Internal PM Dashboard</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {summary?.git && (
                                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
                                    <GitBranch className="w-3 h-3" />
                                    <span>{summary.git.branch}</span>
                                    <span className="text-slate-600">|</span>
                                    <span className="font-mono">{summary.git.lastCommit?.hash}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Clock className="w-3 h-3" />
                                <span>Updated {lastRefresh.toLocaleTimeString()}</span>
                            </div>

                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <nav className="bg-slate-800/30 border-b border-slate-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'text-emerald-400 border-emerald-400'
                                    : 'text-slate-400 border-transparent hover:text-white hover:border-slate-600'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex items-center gap-3 text-slate-400">
                            <RefreshCw className="w-6 h-6 animate-spin" />
                            <span>Loading dashboard...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="card border-red-500/50">
                        <div className="flex items-center gap-3 text-red-400">
                            <AlertTriangle className="w-6 h-6" />
                            <div>
                                <p className="font-medium">Failed to load dashboard</p>
                                <p className="text-sm text-red-400/70">{error}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'command' && <CommandCenter onNavigate={(tab) => setActiveTab(tab as TabType)} />}
                        {activeTab === 'kanban' && <EnterpriseKanban />}
                        {activeTab === 'parity' && <EnvironmentParity />}
                        {activeTab === 'timeline' && <GitTimeline />}
                        {activeTab === 'backlog' && <UnifiedBacklog />}
                    </>
                )}
            </main>
        </div>
    );
}

export default App;
