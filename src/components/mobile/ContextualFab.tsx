// @ts-nocheck
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useFab } from '../../context/FabContext';

/**
 * UX-GL-04 — the contextual FAB.
 *
 * Rendered by the mobile shell, above the bottom nav and clear of the safe area.
 * It disappears with the nav (same scroll state) and is 56px with a 44px minimum
 * target, so it is reachable one-handed. It is a real button with an accessible
 * name from the page's registered action — never an unlabelled "+".
 *
 * It used to be `md:hidden`, which meant the *only* floating action in the app
 * simply did not exist at ≥768px — reported as "why is the floating icon not
 * there?". It is the page's primary action, so it is now present at every width.
 *
 * It also stands down while a sheet is open (`data-modal-open` on <body>): a
 * floating button pinned over a modal is what blocked PRIORITY and
 * Cancel / Save Changes in the editor.
 *
 * Colour: Anchor Blue, like every other primary action. It was the task purple,
 * which made the FAB, the Save button and the selected chips three different
 * accents for one role. Purple stays the *commitment* identity (streaks, tints).
 */
export const ContextualFab = ({ navHidden = false }: { navHidden?: boolean }) => {
  const { action } = useFab();
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const target = document.body;
    const sync = () => setSheetOpen(target.dataset.modalOpen === 'true');
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(target, { attributes: true, attributeFilter: ['data-modal-open'] });
    return () => observer.disconnect();
  }, []);

  if (!action || sheetOpen) return null;

  return (
    <button
      type="button"
      onClick={action.onClick}
      aria-label={action.label}
      data-testid="contextual-fab"
      data-nav-hidden={navHidden ? 'true' : 'false'}
      className={`fixed right-4 z-40 inline-flex items-center gap-2 h-14 min-w-14 px-4 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/30 active:scale-[0.97] transition-all duration-200 motion-reduce:transition-none ${navHidden ? 'translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}
      style={{ bottom: 'calc(var(--bottom-nav-height, 49px) + var(--fab-offset, 1rem))' }}
    >
      <Plus className="w-5 h-5" aria-hidden="true" />
      <span className="text-sm font-semibold">{action.label}</span>
    </button>
  );
};
