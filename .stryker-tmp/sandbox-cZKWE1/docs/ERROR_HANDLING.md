# Error Handling Patterns - Anchor OS

**Version**: 1.0  
**Last Updated**: January 26, 2026  
**Status**: Authoritative Reference

---

## Table of Contents

1. [Error Handling Philosophy](#error-handling-philosophy)
2. [Error Categories](#error-categories)
3. [Error Boundary Pattern](#error-boundary-pattern)
4. [Service-Level Error Handling](#service-level-error-handling)
5. [User-Facing Error Messages](#user-facing-error-messages)
6. [Error Logging Strategy](#error-logging-strategy)
7. [Recovery Patterns](#recovery-patterns)
8. [Testing Error Scenarios](#testing-error-scenarios)

---

## Error Handling Philosophy

### Core Principles

1. **Fail Gracefully**: Errors should never cause white screens or lost data
2. **User-Friendly Messages**: Technical details hidden, actionable guidance shown
3. **Comprehensive Logging**: All errors logged for debugging, but not exposed to users
4. **Recovery Pathways**: Always provide a way for users to recover from errors
5. **Prevent Data Loss**: Save user work before errors escalate

### Error Handling Goals

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING GOALS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. USER EXPERIENCE                                             │
│     ✓ Clear, non-technical error messages                       │
│     ✓ Actionable guidance (what to do next)                     │
│     ✓ No white screens or crashes                              │
│     ✓ Preserve user input when possible                        │
│                                                                  │
│  2. DEVELOPER EXPERIENCE                                        │
│     ✓ Detailed error logs for debugging                         │
│     ✓ Stack traces in development mode                          │
│     ✓ Error boundaries prevent cascading failures              │
│     ✓ Type-safe error handling with TypeScript                 │
│                                                                  │
│  3. SYSTEM RELIABILITY                                          │
│     ✓ Graceful degradation (features fail independently)        │
│     ✓ Automatic retries for transient failures                 │
│     ✓ Circuit breakers for cascading failures                  │
│     ✓ Fallback UI for broken components                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Categories

### 1. Network Errors

**Causes**: Firebase unavailable, no internet connection, timeout

**Examples**:
- `FirebaseError: Failed to get document`
- `TypeError: Failed to fetch`
- Request timeout after 30 seconds

**Handling**:
```typescript
try {
  const account = await getDoc(accountRef);
} catch (error) {
  if (error.code === 'unavailable') {
    // Network error - show retry UI
    showNotification({
      type: 'error',
      title: 'Connection Issue',
      message: 'Unable to connect. Please check your internet connection.',
      action: { label: 'Retry', onClick: () => refetch() }
    });
  }
}
```

---

### 2. Permission Errors

**Causes**: Firestore security rules deny access, insufficient permissions

**Examples**:
- `FirebaseError: Missing or insufficient permissions`
- `permission-denied` error code

**Handling**:
```typescript
try {
  await updateDoc(accountRef, data);
} catch (error) {
  if (error.code === 'permission-denied') {
    showNotification({
      type: 'error',
      title: 'Permission Denied',
      message: 'You do not have permission to edit this account.',
    });
  }
}
```

---

### 3. Validation Errors

**Causes**: Invalid user input, business logic violations

**Examples**:
- Empty required fields
- Invalid email format
- Negative transaction amounts
- String exceeds max length

**Handling**:
```typescript
// Client-side validation BEFORE submission
const validateTransaction = (data: TransactionData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!data.title || data.title.trim() === '') {
    errors.push({ field: 'title', message: 'Title is required' });
  }
  
  if (data.amountCents <= 0) {
    errors.push({ field: 'amount', message: 'Amount must be greater than zero' });
  }
  
  if (containsDangerousPatterns(data.title)) {
    errors.push({ field: 'title', message: 'Title contains invalid characters' });
  }
  
  return errors;
};

// Show validation errors in form
const errors = validateTransaction(formData);
if (errors.length > 0) {
  setFormErrors(errors);
  return; // Don't submit
}
```

---

### 4. Authentication Errors

**Causes**: Expired session, invalid credentials, MFA failure

**Examples**:
- `auth/user-not-found`
- `auth/wrong-password`
- `auth/requires-recent-login`
- `auth/invalid-verification-code` (MFA)

**Handling**:
```typescript
try {
  await signInWithEmailAndPassword(auth, email, password);
} catch (error) {
  switch (error.code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      setError('Invalid email or password');
      break;
      
    case 'auth/too-many-requests':
      setError('Too many failed attempts. Please try again later.');
      break;
      
    case 'auth/invalid-verification-code':
      setError('Invalid verification code. Please try again.');
      break;
      
    default:
      setError('Sign-in failed. Please try again.');
  }
}
```

---

### 5. Application Errors

**Causes**: React component crashes, JavaScript errors, state corruption

**Examples**:
- `TypeError: Cannot read property 'x' of undefined`
- `ReferenceError: variable is not defined`
- React render errors

**Handling**: Use Error Boundaries (see next section)

---

## Error Boundary Pattern

### ErrorBoundary Component

**Location**: `src/components/ErrorBoundary.tsx`

**Purpose**: Catch React component errors and show fallback UI

**Implementation**:

```typescript
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log to console for debugging
    console.error('ErrorBoundary caught error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    
    // In production, send to error tracking service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary-fallback">
          <h3>Something went wrong</h3>
          <p>{this.state.error?.message}</p>
          <button onClick={this.handleReset}>Try Again</button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Usage Patterns

**App-Level Error Boundary** (catch all errors):
```typescript
// src/App.tsx
function App() {
  return (
    <ErrorBoundary componentName="App">
      <AuthProvider>
        <Router>
          <Routes />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
```

**Feature-Level Error Boundary** (isolate failures):
```typescript
// src/features/finance/FinanceView.tsx
export const FinanceView: React.FC = () => {
  return (
    <ErrorBoundary 
      componentName="FinanceView"
      fallback={<FinanceErrorFallback />}
    >
      <AccountList />
      <TransactionList />
      <AnalyticsCharts />
    </ErrorBoundary>
  );
};

// Custom fallback for Finance feature
const FinanceErrorFallback = () => (
  <div className="p-6 text-center">
    <AlertTriangle className="w-12 h-12 mx-auto text-rose-500" />
    <h3 className="mt-4 text-lg font-semibold">Finance Feature Unavailable</h3>
    <p className="mt-2 text-slate-600">
      We're having trouble loading your financial data. 
      Your data is safe, but this feature is temporarily unavailable.
    </p>
    <button onClick={() => window.location.reload()}>
      Refresh Page
    </button>
  </div>
);
```

**Component-Level Error Boundary** (granular isolation):
```typescript
// Wrap individual components that might fail
<ErrorBoundary componentName="AnalyticsChart" fallback={<ChartErrorFallback />}>
  <AnalyticsChart data={transactions} />
</ErrorBoundary>
```

### When to Use Error Boundaries

**DO use for**:
- Complex components with external dependencies
- Third-party libraries that might throw
- Data visualization components
- Feature modules that can fail independently

**DON'T use for**:
- Event handlers (use try-catch instead)
- Asynchronous code (use .catch() or try-catch)
- Server-side rendering
- Simple components (too much overhead)

---

## Service-Level Error Handling

### Pattern: Try-Catch with Typed Errors

```typescript
// src/services/FinanceService.ts
import { FirebaseError } from 'firebase/app';

export class FinanceService {
  async createTransaction(data: TransactionData): Promise<Transaction> {
    try {
      // Validate input
      const errors = validateTransaction(data);
      if (errors.length > 0) {
        throw new ValidationError('Invalid transaction data', errors);
      }
      
      // Create transaction
      const txRef = doc(collection(db, `users/${userId}/finance`));
      await setDoc(txRef, {
        ...data,
        id: txRef.id,
        createdAt: new Date().toISOString(),
      });
      
      // Update account balance
      const accountRef = doc(db, `users/${userId}/accounts/${data.accountId}`);
      await updateDoc(accountRef, {
        balanceCents: increment(-data.amountCents),
      });
      
      return { ...data, id: txRef.id };
      
    } catch (error) {
      // Handle Firebase errors
      if (error instanceof FirebaseError) {
        console.error('[FinanceService] Firebase error:', error.code, error.message);
        
        if (error.code === 'permission-denied') {
          throw new PermissionError('You do not have permission to create transactions');
        }
        
        if (error.code === 'unavailable') {
          throw new NetworkError('Unable to connect to server. Please check your connection.');
        }
      }
      
      // Handle validation errors
      if (error instanceof ValidationError) {
        throw error; // Re-throw for UI to handle
      }
      
      // Unknown error
      console.error('[FinanceService] Unknown error:', error);
      throw new AppError('Failed to create transaction. Please try again.');
    }
  }
}
```

### Custom Error Classes

```typescript
// src/utils/error.ts

export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  public errors: ValidationError[];
  
  constructor(message: string, errors: ValidationError[]) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class PermissionError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}
```

### React Query Error Handling

```typescript
// src/hooks/useFinanceService.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: TransactionData) => financeService.createTransaction(data),
    
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries(['accounts']);
      queryClient.invalidateQueries(['transactions']);
      
      showNotification({
        type: 'success',
        title: 'Transaction Created',
        message: 'Your transaction has been saved.',
      });
    },
    
    onError: (error: Error) => {
      // Handle different error types
      if (error instanceof ValidationError) {
        // Show validation errors in form
        setFormErrors(error.errors);
      } else if (error instanceof PermissionError) {
        showNotification({
          type: 'error',
          title: 'Permission Denied',
          message: error.message,
        });
      } else if (error instanceof NetworkError) {
        showNotification({
          type: 'error',
          title: 'Connection Error',
          message: error.message,
          action: { label: 'Retry', onClick: () => mutation.mutate(data) }
        });
      } else {
        showNotification({
          type: 'error',
          title: 'Error',
          message: 'Something went wrong. Please try again.',
        });
      }
    },
  });
};
```

---

## User-Facing Error Messages

### Writing Good Error Messages

**BAD** (Technical, not actionable):
```
Error: FirebaseError: PERMISSION_DENIED: Missing or insufficient permissions.
at DocumentReference.get (firebase.js:123)
```

**GOOD** (Clear, actionable):
```
You don't have permission to view this account.
Ask the account owner to share it with you.
```

### Error Message Guidelines

1. **Be Specific**: Tell user what went wrong
2. **Be Actionable**: Tell user what to do next
3. **Be Friendly**: Avoid technical jargon
4. **Be Honest**: Don't hide real issues with vague messages

### Error Message Patterns

```typescript
// src/utils/errorMessages.ts

export const getErrorMessage = (error: Error): string => {
  // Authentication errors
  if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
    return 'Invalid email or password. Please try again.';
  }
  
  if (error.code === 'auth/too-many-requests') {
    return 'Too many failed login attempts. Please try again later or reset your password.';
  }
  
  // Permission errors
  if (error.code === 'permission-denied') {
    return 'You do not have permission to perform this action.';
  }
  
  // Network errors
  if (error.code === 'unavailable') {
    return 'Unable to connect. Please check your internet connection and try again.';
  }
  
  // Validation errors
  if (error instanceof ValidationError) {
    return error.errors.map(e => e.message).join('. ');
  }
  
  // Generic fallback
  return 'Something went wrong. Please try again.';
};
```

### Notification System

```typescript
// src/context/NotificationContext.tsx

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number; // Auto-dismiss after ms
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const showNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36);
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Auto-dismiss after duration
    if (notification.duration !== Infinity) {
      setTimeout(() => {
        dismissNotification(id);
      }, notification.duration || 5000);
    }
  };
  
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  return { notifications, showNotification, dismissNotification };
};
```

---

## Error Logging Strategy

### Development Logging

```typescript
// Detailed logging in development
if (import.meta.env.DEV) {
  console.error('[FinanceService] Error details:', {
    error,
    stack: error.stack,
    context: { userId, accountId, data },
  });
}
```

### Production Logging

```typescript
// Minimal logging in production (no sensitive data)
console.error('[FinanceService] Error:', error.message);

// Send to error tracking service (future)
// logErrorToSentry(error, { context: 'FinanceService.createTransaction' });
```

### What to Log

**DO log**:
- Error messages
- Error codes (Firebase, HTTP)
- Function/component names
- User actions that led to error

**DON'T log**:
- User passwords
- Authentication tokens
- Personal financial data
- Full stack traces in production

---

## Recovery Patterns

### Automatic Retry

```typescript
// Retry transient errors (network issues)
const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Only retry on network errors
      if (error.code !== 'unavailable') {
        throw error;
      }
      
      // Wait before retrying
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError!;
};

// Usage
const account = await retryOperation(() => getDoc(accountRef));
```

### Optimistic Updates with Rollback

```typescript
// Optimistically update UI, rollback on error
const mutation = useMutation({
  mutationFn: updateAccount,
  
  onMutate: async (newData) => {
    // Cancel ongoing refetches
    await queryClient.cancelQueries(['account', accountId]);
    
    // Snapshot previous value
    const previousAccount = queryClient.getQueryData(['account', accountId]);
    
    // Optimistically update
    queryClient.setQueryData(['account', accountId], newData);
    
    // Return context with snapshot
    return { previousAccount };
  },
  
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['account', accountId], context.previousAccount);
    
    showNotification({
      type: 'error',
      title: 'Update Failed',
      message: 'Your changes could not be saved. Please try again.',
    });
  },
  
  onSettled: () => {
    // Refetch to ensure sync
    queryClient.invalidateQueries(['account', accountId]);
  },
});
```

---

## Testing Error Scenarios

### Unit Tests

```typescript
// Test error handling in services
describe('FinanceService.createTransaction', () => {
  it('throws ValidationError for invalid data', async () => {
    const invalidData = { title: '', amountCents: -100 };
    
    await expect(
      financeService.createTransaction(invalidData)
    ).rejects.toThrow(ValidationError);
  });
  
  it('throws PermissionError when access denied', async () => {
    // Mock Firestore to return permission-denied
    vi.mocked(setDoc).mockRejectedValueOnce(
      new FirebaseError('permission-denied', 'Permission denied')
    );
    
    await expect(
      financeService.createTransaction(validData)
    ).rejects.toThrow(PermissionError);
  });
});
```

### Component Tests

```typescript
// Test ErrorBoundary catches errors
describe('ErrorBoundary', () => {
  it('catches errors and displays fallback UI', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };
    
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(getByText('Something went wrong')).toBeInTheDocument();
    expect(getByText('Test error')).toBeInTheDocument();
  });
  
  it('allows retry after error', () => {
    // Test reset functionality
  });
});
```

### E2E Tests

```typescript
// Test error scenarios in Playwright
test('displays error when account creation fails', async ({ page }) => {
  // Navigate to finance page
  await page.goto('/finance');
  
  // Try to create account with invalid data
  await page.getByRole('button', { name: 'Add Account' }).click();
  await page.getByRole('button', { name: 'Create' }).click();
  
  // Verify error message shown
  await expect(page.getByText('Account name is required')).toBeVisible();
});
```

---

## Best Practices Summary

### DO

✅ Use Error Boundaries for React components  
✅ Provide clear, actionable error messages  
✅ Log errors with context (but not sensitive data)  
✅ Implement automatic retries for transient failures  
✅ Show loading states and handle async errors  
✅ Test error scenarios thoroughly  
✅ Use typed errors (ValidationError, PermissionError, etc.)

### DON'T

❌ Show technical error messages to users  
❌ Expose stack traces in production  
❌ Log sensitive data (passwords, tokens, financial details)  
❌ Swallow errors silently  
❌ Use generic "Something went wrong" everywhere  
❌ Let errors crash the entire app  
❌ Skip error handling in async code

---

## Related Documentation

- **ErrorBoundary.tsx** - Actual implementation
- **TESTING_STRATEGY.md** - Testing error scenarios
- **SECURITY.md** - Error handling security considerations
- **ARCHITECTURE_OVERVIEW.md** - System error handling

---

## Maintenance & Updates

This document should be updated when:
- New error types are introduced
- Error handling patterns change
- New recovery mechanisms are added
- Error tracking service is integrated

**Document Owner**: Anchor OS Core Team  
**Review Cadence**: Quarterly  
**Last Reviewed**: January 26, 2026
