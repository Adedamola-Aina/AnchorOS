import { XCircle } from 'lucide-react';
import type { BugItem } from './dashboardSummary.types';

interface BugDetailModalProps {
  bug: BugItem;
  onClose: () => void;
}

export function BugDetailModal({ bug, onClose }: BugDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`badge ${bug.id.startsWith('BUG') ? 'badge-red' : 'badge-green'}`}>{bug.id}</span>
            <h4 className="text-lg font-bold text-white">{bug.title}</h4>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {bug.content ? (
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono bg-slate-900/50 p-4 rounded-lg">{bug.content}</pre>
          ) : (
            <p className="text-slate-400">No additional details available.</p>
          )}
        </div>
        <div className="p-4 border-t border-slate-700 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-medium transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
