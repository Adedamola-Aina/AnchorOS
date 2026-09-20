// @ts-nocheck
import { Plus } from 'lucide-react';
import { useFab } from '../../context/FabContext';

/**
 * UX-GL-04 — the contextual FAB.
 *
 * Rendered by the mobile shell, above the bottom nav and clear of the safe area.
 * It disappears with the nav (same scroll state) and is 56px with a 44px minimum
 * target, so it is reachable one-handed. It is a real button with an accessible
 * name from the page's registered action — never an unlabelled "+".
 */
export const ContextualFab = ({ navHidden = false }: { navHidden?: boolean }) => {
  const { action } = useFab();

  if (!action) return null;

  return (
    <button
      type="button"
      onClick={action.onClick}
      aria-label={action.label}
      data-testid="contextual-fab"
      data-nav-hidden={navHidden ? 'true' : 'false'}
      className={`md:hidden fixed right-4 z-40 inline-flex items-center gap-2 h-14 min-w-14 px-4 rounded-full bg-task-600 text-white shadow-lg shadow-task-600/30 active:scale-[0.97] transition-all duration-200 motion-reduce:transition-none ${navHidden ? 'translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}
      style={{ bottom: 'calc(var(--bottom-nav-height, 49px) + 1rem)' }}
    >
      <Plus className="w-5 h-5" aria-hidden="true" />
      <span className="text-sm font-semibold">{action.label}</span>
    </button>
  );
};
