/**
 * EditCommitmentView — the full-page editor at `/commitments/:id/edit`.
 *
 * The editor used to render inline in the Commitments page flow, so editing one
 * task meant 2–3 screens of page scroll to reach Cancel / Save, and the shell's
 * floating button and the staging banner sat on top of the form. It is its own
 * destination now: a title, the form, and an action bar pinned to the bottom of
 * the page.
 *
 * It owns the save, so it also clears the shell's FAB — the page's primary action
 * is the Save button, not "+ New commitment".
 */


import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import type { AnchorTask } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { useNotifications } from '../../context/NotificationContext';
import { useFamilySharing } from '../../hooks/useFamilySharing';
import { useRegisterFab } from '../../context/FabContext';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
import { captureError } from '../../utils/error';
import { EditTaskForm } from './components/EditTaskForm';

const EditCommitmentView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, updateTask } = useTasks();
  const { user } = useAuth();
  const { connection } = useFamilySharing(user?.uid);
  const { showToast } = useNotifications();

  // This page's primary action is Save, so the shell's FAB stands down.
  useRegisterFab(null);

  const task = useMemo(
    () => (id ? tasks.find((candidate) => candidate.id === id) ?? null : null),
    [tasks, id],
  );

  const backToCommitments = () => navigate('/commitments');

  const handleSave = async (taskId: string, updates: Partial<AnchorTask>) => {
    try {
      await updateTask(taskId, updates);
      showToast('Commitment updated!', 'success');
      backToCommitments();
    } catch (err) {
      captureError(err, 'Commitments.updateTask');
      showToast('Could not update commitment. Please try again.', 'error');
    }
  };

  if (!task) {
    return (
      <FeatureErrorBoundary featureName="Commitments">
        <div className="max-w-2xl mx-auto space-y-4" data-testid="edit-commitment-missing">
          <button
            type="button"
            onClick={backToCommitments}
            className="inline-flex items-center gap-1 min-h-11 px-2 -ml-2 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            Commitments
          </button>
          <h1 className="text-h2 text-slate-900 dark:text-white tracking-tight">Commitment not found</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            It may have been deleted, or the link may be out of date.
          </p>
        </div>
      </FeatureErrorBoundary>
    );
  }

  return (
    <FeatureErrorBoundary featureName="Commitments">
      <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
        <button
          type="button"
          onClick={backToCommitments}
          data-testid="edit-commitment-back"
          className="inline-flex items-center gap-1 min-h-11 px-2 -ml-2 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          Commitments
        </button>

        <h1 className="text-h2 text-slate-900 dark:text-white tracking-tight">Edit commitment</h1>

        <EditTaskForm
          task={task}
          hasFamilyActive={!!connection}
          onSave={handleSave}
          onCancel={backToCommitments}
        />
      </div>
    </FeatureErrorBoundary>
  );
};

export default EditCommitmentView;