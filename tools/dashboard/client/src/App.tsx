// @ts-nocheck
import { useState } from 'react';
import axios from 'axios';
import { RefreshCw, LayoutDashboard, GitBranch, GitCommitHorizontal, Gauge, Rocket } from 'lucide-react';
import { EnvironmentParity } from './components/EnvironmentParity';
import { GitTimeline } from './components/GitTimeline';
import { OverviewTab } from './components/OverviewTab';
import { QualityTab } from './components/QualityTab';
import { ReleaseTab } from './components/ReleaseTab';

type TabType = 'overview' | 'environments' | 'delivery' | 'quality' | 'release';

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'environments', label: 'Environments', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'delivery', label: 'Delivery', icon: <GitCommitHorizontal className="w-4 h-4" /> },
    { id: 'quality', label: 'Quality', icon: <Gauge className="w-4 h-4" /> },
    { id: 'release', label: 'Release', icon: <Rocket className="w-4 h-4" /> },
];

function App() {
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [refreshKey, setRefreshKey] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Cache refresh on the server, then remount the active tab so it refetches.
    const handleRefresh = async () => {
        try {
            setIsRefreshing(true);
            await axios.post('/api/refresh');
            setRefreshKey((k) => k + 1);
        } finally {
            setIsRefreshing(false);
        }
    };

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
                                <h1 className="text-lg font-bold text-white">AnchorOS</h1>
                                <p className="text-xs text-slate-400">Engineering Console</p>
                            </div>
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
            </header>

            {/* Tabs — horizontally scrollable on mobile */}
            <nav className="bg-slate-800/30 border-b border-slate-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-1 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id
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
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" key={refreshKey}>
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'environments' && <EnvironmentParity />}
                {activeTab === 'delivery' && <GitTimeline />}
                {activeTab === 'quality' && <QualityTab />}
                {activeTab === 'release' && <ReleaseTab />}
            </main>
        </div>
    );
}

export default App;

