/**
 * CommitmentsView - Task management page orchestrator
 * 
 * JUSTIFICATION (CLAUDE.md §3.2): This view exceeds 200 lines because it already
 * delegates UI to TaskList, TaskForm, EditTaskForm, and WeeklyView components.
 * The remaining code handles view switching, task CRUD operations, and modal state.
 */

import { useState, useMemo } from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';
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
import { Button } from '../../components/ui';

import { WeeklyView } from './components/WeeklyView';
import { LayoutList, CalendarDays } from 'lucide-react';

const CommitmentsView = () => {
  const { tasks, addTask, toggleTask, deleteTask, updateTask, loadingTasks } = useTasks();
  const { user } = useAuth();
  const { connection } = useFamilySharing(user?.uid);
  const { navigateTo } = useApp();
  const { confirm, showToast } = useNotifications();

  const hasFamilyActive = !!connection;
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleAdd = async (taskPayload: Omit<AnchorTask, 'id' | 'createdAt'>) => {
    try {
      if (taskPayload.title.includes('<') || taskPayload.title.includes('>')) {
        showToast('Title contains invalid content', 'error');
        return;
      }

      await addTask(taskPayload);
      setShowAdd(false);
      showToast('Commitment added successfully', 'success');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showToast(`Failed to add task: ${errorMessage}`, 'error');
    }
  };

  const handleSaveEdit = async (taskId: string, updates: Partial<AnchorTask>) => {
    try {
      await updateTask(taskId, updates);
      setEditingTaskId(null);
      showToast('Commitment updated!', 'success');
    } catch {
      showToast('Could not update commitment. Please try again.', 'error');
    }
  };

  const handleConfirmFinancial = async (title: string) => {
    setTimeout(async () => {
      const confirmed = await confirm({
        title: 'Financial Transaction?',
        message: `You've marked '${title} ' as done. Would you like to record a financial transaction for this now?`,
        confirmText: 'Yes, Record',
        cancelText: 'Not now'
      });
      if (confirmed) {
        navigateTo('finance');
      }
    }, 100);
  };

  const handleDeleteTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    const isFamilyTask = task?.category === 'family';

    const confirmed = await confirm({
      title: 'Delete Commitment?',
      message: isFamilyTask
        ? `Are you sure you want to delete "${task?.title}"? This is a family commitment and will no longer be tracked.`
        : `Are you sure you want to delete "${task?.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Keep',
      type: 'danger'
    });

    if (confirmed) {
      try {
        await deleteTask(taskId);
        showToast('Commitment deleted', 'success');
      } catch {
        showToast('Could not delete commitment', 'error');
      }
    }
  };

  const { activeTasks, completedTasks, totalFiltered, allFiltered } = useMemo(() => {
    const filtered = tasks.filter(t => filter === 'all' || t.type === filter);
    return {
      activeTasks: filtered.filter(t => !t.completed),
      completedTasks: filtered.filter(t => t.completed),
      totalFiltered: filtered.length,
      allFiltered: filtered
    };
  }, [tasks, filter]);

  const editingTask = useMemo(() =>
    editingTaskId ? tasks.find(t => t.id === editingTaskId) : null
    , [editingTaskId, tasks]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8">
      <SectionHeader
        title="Commitments"
        subtitle={hasFamilyActive ? "Manage your daily obligations, goals, and family duties." : "Manage your daily obligations and goals."}
        action={
          <Button
            onClick={() => setShowAdd(!showAdd)}
            variant={showAdd ? 'secondary' : 'primary'}
            className="gap-2"
          >
            <Plus className="w-4 h-4" /> <span>{showAdd ? 'Close' : 'New Commitment'}</span>
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {(['all', 'daily', 'weekly', 'monthly'] as const).map((f) => (
            <Button
              key={f}
              onClick={() => setFilter(f)}
              variant={filter === f ? 'primary' : 'secondary'}
              size="sm"
              className="capitalize uppercase tracking-widest text-[10px]"
            >
              {f}
            </Button>
          ))}
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
            title="List View"
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`p-2 rounded-md transition-all ${viewMode === 'calendar' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
            title="Week View"
          >
            <CalendarDays className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showAdd && (
        <TaskForm
          onClose={() => setShowAdd(false)}
          onAdd={handleAdd}
          hasFamilyActive={hasFamilyActive}
        />
      )}

      {editingTask && (
        <EditTaskForm
          task={editingTask}
          hasFamilyActive={hasFamilyActive}
          onSave={handleSaveEdit}
          onCancel={() => setEditingTaskId(null)}
        />
      )}

      <div className={loadingTasks ? 'opacity-50 pointer-events-none' : ''}>
        {viewMode === 'list' ? (
          <TaskList
            activeTasks={activeTasks}
            completedTasks={completedTasks}
            hasFamilyActive={hasFamilyActive}
            editingTaskId={editingTaskId}
            onToggle={toggleTask}
            onStartEdit={setEditingTaskId}
            onDelete={handleDeleteTask}
            onConfirmFinancial={handleConfirmFinancial}
          />
        ) : (
          <WeeklyView tasks={allFiltered} onToggle={toggleTask} />
        )}
      </div>

      {/* Empty State */}
      {totalFiltered === 0 && !showAdd && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-blue-500/60 dark:text-blue-400/60" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            {filter === 'all' ? 'Welcome to your Commitments' : `No ${filter} commitments`}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-8">
            {filter === 'all'
              ? (hasFamilyActive
                ? "This is where you'll build consistency. Commitments are recurring obligations that keep you and your family on track."
                : "This is where you'll build consistency. Commitments are recurring obligations that keep you on track.")
              : `You don't have any ${filter} commitments. Create one to get started.`}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => setShowAdd(true)}
              className="gap-3"
              size="lg"
            >
              <Plus className="w-5 h-4" />
              <span>Create First Commitment</span>
            </Button>
            <Button
              onClick={() => {
                showToast('Commitment exports will be available in the next update.', 'info');
              }}
              variant="secondary"
              size="lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitmentsView;
