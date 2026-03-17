import { Tag, User } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import type { KanbanItem } from './enterpriseKanban.types';
import { getPriorityBadge, getTypeIcon } from './enterpriseKanban.helpers';

interface EnterpriseKanbanCardProps {
    item: KanbanItem;
    expandedCard: string | null;
    setExpandedCard: Dispatch<SetStateAction<string | null>>;
}

export function EnterpriseKanbanCard({ item, expandedCard, setExpandedCard }: EnterpriseKanbanCardProps) {
    return (
        <div
            className="bg-slate-800/70 rounded-lg p-3 border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer group"
            onClick={() => setExpandedCard(expandedCard === item.id ? null : item.id)}
        >
            <div className="flex items-start gap-2 mb-2">
                {getTypeIcon(item.type)}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-500">{item.id}</span>
                        {getPriorityBadge(item.priority)}
                    </div>
                    <p className="text-sm text-slate-200 font-medium leading-tight line-clamp-2">
                        {item.title}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                <User className="w-3 h-3" />
                <span>{item.assignee}</span>
                {item.label && (
                    <>
                        <span>•</span>
                        <Tag className="w-3 h-3" />
                        <span>{item.label}</span>
                    </>
                )}
            </div>

            {expandedCard === item.id && (
                <div className="mt-3 pt-3 border-t border-slate-700/50">
                    <p className="text-xs text-slate-400 whitespace-pre-wrap">
                        {item.description.substring(0, 200)}
                        {item.description.length > 200 && '...'}
                    </p>
                </div>
            )}
        </div>
    );
}
