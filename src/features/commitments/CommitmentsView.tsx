/**
 * CommitmentsView - Task management page orchestrator
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * UI components extracted to CommitmentsViewParts.tsx
 */

import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import type { AnchorTask } from '../../types';
import { useApp } from '../../context/AnchorContext';
import { useAuth } from '../../context/AuthContext';
import { useFamilySharing } from '../../hooks/useFamilySharing';
import { useTasks } from '../../context/TaskContext';
import { useNotifications } from '../../context/NotificationContext';
import { SectionHeader } from '../../components/shared';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { EditTaskForm } from './components/EditTaskForm';
import { Button } from '@anchor-os/ui';
import { WeeklyView } from './components/WeeklyView';
import { CommitmentsEmptyState, CommitmentsFilterBar } from './components/CommitmentsViewParts';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';

const CommitmentsView = () => {
  const { tasks, addTask, toggleTask, deleteTask, updateTask, loadingTasks } = useTasks();
  const { user } = useAuth();
  const { connection } = useFamilySharing(user?.uid);
  const { navigateTo } = useApp();
  const { confirm, showToast } = useNotifications();

  const hasFamilyActive = !!connection;
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly' | 'todo'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleAdd = async (taskPayload: Omit<AnchorTask, 'id' | 'createdAt'>) => {
    try {
      if (taskPayload.title.includes('<') || taskPayload.title.includes('>')) { showToast('Title contains invalid content', 'error'); return; }
      await addTask(taskPayload); setShowAdd(false); showToast('Commitment added successfully', 'success');
    } catch (error: unknown) { showToast(`Failed to add task: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error'); }
  };

  const handleSaveEdit = async (taskId: string, updates: Partial<AnchorTask>) => {
    try { await updateTask(taskId, updates); setEditingTaskId(null); showToast('Commitment updated!', 'success'); }
    catch { showToast('Could not update commitment. Please try again.', 'error'); }
  };

  const handleConfirmFinancial = async (title: string) => {
    setTimeout(async () => { if (await confirm({ title: 'Financial Transaction?', message: `You've marked '${title}' as done. Would you like to record a financial transaction for this now?`, confirmText: 'Yes, Record', cancelText: 'Not now' })) navigateTo('finance'); }, 100);
  };

  const handleDeleteTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (await confirm({ title: 'Delete Commitment?', message: task?.category === 'family' ? `Are you sure you want to delete "${task?.title}"? This is a family commitment and will no longer be tracked.` : `Are you sure you want to delete "${task?.title}"? This action cannot be undone.`, confirmText: 'Delete', cancelText: 'Keep', type: 'danger' })) {
      try { await deleteTask(taskId); showToast('Commitment deleted', 'success'); } catch { showToast('Could not delete commitment', 'error'); }
    }
  };

  const { activeTasks, completedTasks, totalFiltered, allFiltered } = useMemo(() => {
    const filtered = tasks.filter(t => filter === 'all' || t.type === filter);
    return { activeTasks: filtered.filter(t => !t.completed), completedTasks: filtered.filter(t => t.completed), totalFiltered: filtered.length, allFiltered: filtered };
  }, [tasks, filter]);

  const editingTask = useMemo(() => editingTaskId ? tasks.find(t => t.id === editingTaskId) : null, [editingTaskId, tasks]);

  return (
    <FeatureErrorBoundary featureName="Commitments">
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8">
        <SectionHeader title="Commitments" subtitle={hasFamilyActive ? "Manage your daily obligations, goals, and family duties." : "Manage your daily obligations and goals."} action={<Button onClick={() => setShowAdd(!showAdd)} variant={showAdd ? 'secondary' : 'primary'} className="gap-2"><Plus className="w-4 h-4" /> <span>{showAdd ? 'Close' : 'New Commitment'}</span></Button>} />
        <CommitmentsFilterBar filter={filter} viewMode={viewMode} onFilterChange={setFilter} onViewChange={setViewMode} />
        {showAdd && <TaskForm onClose={() => setShowAdd(false)} onAdd={handleAdd} hasFamilyActive={hasFamilyActive} />}
        {editingTask && <EditTaskForm task={editingTask} hasFamilyActive={hasFamilyActive} onSave={handleSaveEdit} onCancel={() => setEditingTaskId(null)} />}
        <div className={loadingTasks ? 'opacity-50 pointer-events-none' : ''}>
          {viewMode === 'list' ? <TaskList activeTasks={activeTasks} completedTasks={completedTasks} hasFamilyActive={hasFamilyActive} editingTaskId={editingTaskId} onToggle={toggleTask} onStartEdit={setEditingTaskId} onDelete={handleDeleteTask} onConfirmFinancial={handleConfirmFinancial} /> : <WeeklyView tasks={allFiltered} onToggle={toggleTask} />}
        </div>
        {totalFiltered === 0 && !showAdd && <CommitmentsEmptyState filter={filter} hasFamilyActive={hasFamilyActive} onCreateFirst={() => setShowAdd(true)} onLearnMore={() => showToast('Commitment exports will be available in the next update.', 'info')} />}
      </div>
    </FeatureErrorBoundary>
  );
};

export default CommitmentsView;
