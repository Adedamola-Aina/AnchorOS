
export const mapFirebaseError = (error: unknown): string => {
    if (!error || typeof error !== 'object') return 'An unknown error occurred.';
    const err = error as { code?: string; message?: string };
    const code = err.code || '';
    const msg = err.message || '';

    switch (code) {
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Incorrect email or password.';
        case 'auth/email-already-in-use':
            return 'This email is already registered. Try logging in.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        case 'permission-denied':
            return 'You do not have permission to perform this action.';
        case 'unavailable':
            return 'Service temporarily unavailable. Please try again later.';
        case 'auth/operation-not-allowed':
            return 'This sign-in method is not enabled. Please contact support.';
        case 'auth/quota-exceeded':
            return 'Limit exceeded. Please check your usage or try again later.';
        // Firestore operation errors (BUG-077: improved transfer diagnostics)
        case 'not-found':
            return 'The requested record was not found. It may have been deleted.';
        case 'already-exists':
            return 'This record already exists. Please refresh and try again.';
        case 'deadline-exceeded':
            return 'The operation timed out. Please check your connection and try again.';
        case 'aborted':
            return 'The operation was interrupted. Please try again.';
        case 'failed-precondition':
            return 'This action cannot be completed right now. Please refresh and try again.';
        default:
            // Strip "Firebase: " prefix if present
            return msg.replace('Firebase: ', '') || 'Something went wrong. Please try again.';
    }
};
