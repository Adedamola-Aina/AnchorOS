interface DocumentWithViewTransition extends Document {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    finished?: Promise<void>;
  };
}

export function getFinanceViewTransitionName(accountId: string): string {
  return `finance-account-${accountId}`;
}

export async function runFinanceViewTransition(
  callback: () => void | Promise<void>,
): Promise<void> {
  if (typeof document === 'undefined') {
    await callback();
    return;
  }

  const transitionDocument = document as DocumentWithViewTransition;
  if (!transitionDocument.startViewTransition) {
    await callback();
    return;
  }

  const transition = transitionDocument.startViewTransition(callback);
  try {
    await transition.finished;
  } catch {
    // Ignore transition cancellation and keep navigation behavior intact.
  }
}