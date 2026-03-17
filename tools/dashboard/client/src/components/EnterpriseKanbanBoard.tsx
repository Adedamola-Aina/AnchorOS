import {
    closestCorners,
    DndContext,
    DragOverlay,
    type DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { getDragDisabledMessage, getPriorityBadge, getTypeIcon } from './enterpriseKanban.helpers';
import type { EnterpriseKanbanColumn, KanbanData } from './enterpriseKanban.types';
import { EnterpriseKanbanCard } from './EnterpriseKanbanCard';

interface EnterpriseKanbanBoardProps {
    data: KanbanData;
    columns: EnterpriseKanbanColumn[];
}

export function EnterpriseKanbanBoard({ data, columns }: EnterpriseKanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

    const activeItem = activeId ? data.items[activeId] : null;

    const handleDragStart = (event: DragStartEvent): void => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (): void => {
        setActiveId(null);
        alert(getDragDisabledMessage());
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {columns.map((column) => (
                    <div
                        key={column.id}
                        className={`card border-t-2 ${column.color} ${column.bgColor} min-h-[400px]`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                {column.icon}
                                <h3 className="font-bold text-white">{column.title}</h3>
                            </div>
                            <span className="text-sm font-semibold text-slate-400">{column.items.length}</span>
                        </div>

                        <SortableContext items={column.items} strategy={verticalListSortingStrategy}>
                            <div className="space-y-2">
                                {column.items.map((itemId) => {
                                    const item = data.items[itemId];
                                    if (!item) {
                                        return null;
                                    }

                                    return (
                                        <EnterpriseKanbanCard
                                            key={item.id}
                                            item={item}
                                            expandedCard={expandedCard}
                                            setExpandedCard={setExpandedCard}
                                        />
                                    );
                                })}
                                {column.items.length === 0 && (
                                    <p className="text-sm text-slate-500 text-center py-8">No items</p>
                                )}
                            </div>
                        </SortableContext>
                    </div>
                ))}
            </div>

            <DragOverlay>
                {activeItem && (
                    <div className="bg-slate-800 rounded-lg p-3 border border-blue-500 shadow-xl opacity-90">
                        <div className="flex items-start gap-2">
                            {getTypeIcon(activeItem.type)}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono text-slate-500">{activeItem.id}</span>
                                    {getPriorityBadge(activeItem.priority)}
                                </div>
                                <p className="text-sm text-slate-200 font-medium">{activeItem.title}</p>
                            </div>
                        </div>
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
}
