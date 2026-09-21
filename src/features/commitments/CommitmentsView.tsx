/**
 * CommitmentsView - Task management page orchestrator
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * UI components extracted to CommitmentsViewParts.tsx
 */
// @ts-nocheck


import { useState, useMemo } from 'react';
import { captureError } from '../../utils/error';
import type { AnchorTask } from '../../types';
import { useApp } from '../../context/AnchorContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFamilySharing } from '../../hooks/useFamilySharing';
import { useTasks } from '../../context/TaskContext';
import { useNotifications } from '../../context/NotificationContext';
import { SectionHeader } from '../../components/shared';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { Button } from '@anchor-os/ui';
import { WeeklyView } from './components/WeeklyView';
import { MonthCalendarView } from './components/MonthCalendarView';
import { TimelineView } from './components/TimelineView';
import { CommitmentsEmptyState, CommitmentsViewSwitcher } from './components/CommitmentsViewParts';
import { CommitmentFindOrAdd } from './components/CommitmentToolbar';
import { CommitmentUndoBar } from './components/CommitmentHistory';
import { useCommitmentsWorkspace } from './hooks/useCommitmentsWorkspace';
import { useRegisterFab } from '../../context/FabContext';
import type { QuickAddDraft } from './utils/parseQuickAdd';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';

const CommitmentsView = () => {
  const { tasks, addTask, toggleTask, deleteTask, loadingTasks } = useTasks();
  const { user } = useAuth();
  const { connection } = useFamilySharing(user?.uid);
  const { navigateTo } = useApp();
  const { confirm, showToast } = useNotifications();
  const navigate = useNavigate();

  const hasFamilyActive = !!connection;
  const [showAdd, setShowAdd] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'list' | 'calendar'>('list');
  const [calendarRange, setCalendarRange] = useState<'week' | 'month'>('week');

  // CM-21 / CM-23 / CM-25: smart views, search, selection and undo.
  const workspace = useCommitmentsWorkspace({ tasks, addTask, toggleTask, deleteTask });
  // CM-16: a parsed quick-add draft, handed to the composer when the user adjusts.
  const [quickAddDraft, setQuickAddDraft] = useState<QuickAddDraft | null>(null);

  const closeComposer = () => { setShowAdd(false); setQuickAddDraft(null); };

  // UX-GL-04: this page's one primary action, rendered as the mobile FAB.
  useRegisterFab({ label: 'New commitment', onClick: () => setShowAdd(true) });

  const handleAdd = async (taskPayload: Omit<AnchorTask, 'id' | 'createdAt'>) => {
    try {
      if (taskPayload.title.includes('<') || taskPayload.title.includes('>')) { showToast('Title contains invalid content', 'error'); return; }
      await addTask(taskPayload); setShowAdd(false); showToast('Commitment added successfully', 'success');
    } catch (error: unknown) { captureError(error, 'Commitments.addTask'); showToast(`Failed to add task: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error'); }
  };

  /**
   * Editing is its own destination (`/commitments/:id/edit`) rather than a form
   * wedged into the list, so a single task no longer costs 2-3 screens of scroll
   * to reach Cancel / Save.
   */
  const handleStartEdit = (id: string) => navigate(`/commitments/${id}/edit`);

  /** CM-16: a parsed draft → the same shape the composer submits. */
  const draftToTask = (draft: QuickAddDraft): Omit<AnchorTask, 'id' | 'createdAt'> => ({
    title: draft.title,
    type: draft.type,
    completed: false,
    category: 'personal',
    reminderTime: draft.reminderTime,
    daysOfWeek: draft.daysOfWeek,
    daysOfMonth: draft.dayOfMonth ? [draft.dayOfMonth] : undefined,
    interval: draft.interval,
    dueDate: draft.dueDate,
  });

  /**
   * CM-08: completing a financial-looking commitment used to interrupt with a
   * blocking cross-domain "Financial Transaction?" modal. It now raises an
   * inline, dismissible chip on the completed row instead — same offer, no
   * interruption, and the user keeps their place in the list.
   */
  const [financialNudgeTaskId, setFinancialNudgeTaskId] = useState<string | null>(null);

  const handleFinancialNudge = (taskId: string) => setFinancialNudgeTaskId(taskId);

  const handleRecordTransaction = () => {
    setFinancialNudgeTaskId(null);
    navigateTo('finance');
  };

  // Only offer it while that commitment is still completed, so un-completing or
  // deleting the row cannot leave a chip pointing at nothing.
  const activeFinancialNudgeId = useMemo(() => {
    if (!financialNudgeTaskId) return null;
    const task = tasks.find(t => t.id === financialNudgeTaskId);
    return task?.completed ? financialNudgeTaskId : null;
  }, [financialNudgeTaskId, tasks]);

  /**
   * CM-23: completion goes through the workspace so the change is undoable and
   * the undo bar can say what happened.
   */
  const handleToggle = (id: string, completed: boolean) => {
    const task = tasks.find((entry) => entry.id === id);
    void workspace.completeWithUndo(id, task?.title ?? 'commitment', completed);
  };

  const handleDeleteTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (await confirm({ title: 'Delete Commitment?', message: task?.category === 'family' ? `Are you sure you want to delete "${task?.title}"? This is a family commitment and will no longer be tracked.` : `Are you sure you want to delete "${task?.title}"? This action cannot be undone.`, confirmText: 'Delete', cancelText: 'Keep', type: 'danger' })) {
      try { if (task) await workspace.deleteWithUndo(task); else await deleteTask(taskId); } catch (err) { captureError(err, 'Commitments.deleteTask'); showToast('Could not delete commitment', 'error'); }
    }
  };

  const { activeTasks, completedTasks, totalFiltered, allFiltered } = useMemo(() => {
    const filtered = workspace.visible;
    return { activeTasks: filtered.filter(t => !t.completed), completedTasks: filtered.filter(t => t.completed), totalFiltered: filtered.length, allFiltered: filtered };
  }, [workspace.visible]);

  return (
    <FeatureErrorBoundary featureName="Commitments">
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8">
        {/*
          * One control stack, not four.
          *
          * This header carried a "Select" button for bulk complete/delete, and the
          * "Show me" bar (six smart views) and "Show" filter (five cadences) sat
          * below it. Fifteen controls appeared before a single commitment did.
          *
          * Select is gone: it was an unexplained word that turned the rows into
          * checkboxes. The "Show me" bar is gone: its six views mostly restated
          * what each row already says, and — because its default was "Today" — a
          * user with commitments but nothing due today saw an empty page. The list
          * now shows everything, always.
          *
          * "Show" is gone: filtering your day by how a commitment is *stored* is a
          * question about the database, not about your day.
          */}
        <SectionHeader title="Commitments" subtitle={hasFamilyActive ? "Manage your daily obligations, goals, and family duties." : "Manage your daily obligations and goals."} />

        <CommitmentFindOrAdd
          value={workspace.query}
          onChange={workspace.setQuery}
          resultCount={totalFiltered}
          onSaveDraft={(draft) => { void handleAdd(draftToTask(draft)); workspace.setQuery(''); }}
          onAdjustDraft={(draft) => { setQuickAddDraft(draft); setShowAdd(true); workspace.setQuery(''); }}
        />

        <CommitmentsViewSwitcher viewMode={viewMode} onViewChange={setViewMode} />

        {showAdd && <TaskForm onClose={closeComposer} onAdd={handleAdd} hasFamilyActive={hasFamilyActive} initialDraft={quickAddDraft} />}
        <div className={loadingTasks ? 'opacity-50' : ''}>
          {viewMode === 'timeline' ? <TimelineView tasks={activeTasks} onToggle={handleToggle} onStartFocus={(_id) => showToast('Focus mode coming soon!', 'info')} onStartEdit={handleStartEdit} onDelete={handleDeleteTask} /> : viewMode === 'list' ? <TaskList activeTasks={activeTasks} completedTasks={completedTasks} hasFamilyActive={hasFamilyActive} editingTaskId={null} onToggle={handleToggle} onStartEdit={handleStartEdit} onDelete={handleDeleteTask} financialNudgeTaskId={activeFinancialNudgeId} onFinancialNudge={handleFinancialNudge} onRecordTransaction={handleRecordTransaction} onDismissFinancialNudge={() => setFinancialNudgeTaskId(null)} /> : (
            <div className="space-y-3">
              <div className="flex gap-2">
                {(['week', 'month'] as const).map(r => (<Button key={r} variant={calendarRange === r ? 'primary' : 'secondary'} size="sm" onClick={() => setCalendarRange(r)} className="capitalize text-xs">{r}</Button>))}
              </div>
              {calendarRange === 'week' ? <WeeklyView tasks={allFiltered} onToggle={toggleTask} /> : <MonthCalendarView tasks={allFiltered} onToggle={toggleTask} />}
            </div>
          )}
        </div>
        {totalFiltered === 0 && !showAdd && <CommitmentsEmptyState filter={workspace.typeFilter} hasFamilyActive={hasFamilyActive} onCreateFirst={() => setShowAdd(true)} onLearnMore={() => showToast('Commitment exports will be available in the next update.', 'info')} />}
        {/* CM-23: the safety net after completing or deleting. */}
        <CommitmentUndoBar state={workspace.undo} onDismiss={workspace.dismissUndo} />
      </div>
    </FeatureErrorBoundary>
  );
};

export default CommitmentsView;
