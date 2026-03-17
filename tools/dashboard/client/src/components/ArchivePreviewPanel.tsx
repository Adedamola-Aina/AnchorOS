import type { ArchivePreview } from './archiveViewer.utils';

interface ArchivePreviewPanelProps {
  preview: ArchivePreview;
  onClose: () => void;
}

export function ArchivePreviewPanel({ preview, onClose }: ArchivePreviewPanelProps) {
  return (
    <div className="card border-blue-500/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Archive Preview</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>
      <p className="text-blue-400 mb-4">{preview.message}</p>
      {preview.items && preview.items.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {preview.items.map((item, i) => (
            <div key={i} className="p-3 bg-slate-800/50 rounded-lg">
              <p className="text-sm text-slate-300">{item.text}</p>
              <p className="text-xs text-slate-500 mt-1">Completed: {item.completionDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
