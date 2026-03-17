// @ts-nocheck
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    UnsavedChangesProvider,
    useUnsavedChanges,
    useUnsavedChangesGuard,
} from './useUnsavedChanges';

describe('useUnsavedChanges', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <UnsavedChangesProvider>{children}</UnsavedChangesProvider>
    );

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('confirmDiscard returns true when nothing is dirty', () => {
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
        const { result } = renderHook(() => useUnsavedChanges(false), { wrapper });

        expect(result.current.isDirty).toBe(false);
        expect(result.current.confirmDiscard()).toBe(true);
        expect(confirmSpy).not.toHaveBeenCalled();
    });

    it('prompts with window.confirm when dirty and returns user choice', async () => {
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
        const { result } = renderHook(() => useUnsavedChanges(true), { wrapper });

        await waitFor(() => {
            expect(result.current.isDirty).toBe(true);
        });

        expect(result.current.confirmDiscard()).toBe(false);
        expect(confirmSpy).toHaveBeenCalledWith(
            'You have unsaved changes. Are you sure you want to leave?'
        );
    });

    it('registers and removes beforeunload handler while dirty', async () => {
        const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
        const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

        const { rerender } = renderHook(
            ({ dirty }) => useUnsavedChanges(dirty),
            {
                initialProps: { dirty: true },
                wrapper,
            }
        );

        let beforeUnloadHandler: ((event: BeforeUnloadEvent) => void) | undefined;
        await waitFor(() => {
            const handlerCall = addEventListenerSpy.mock.calls.find(
                ([eventName]) => eventName === 'beforeunload'
            );
            expect(handlerCall).toBeDefined();
            beforeUnloadHandler = handlerCall?.[1] as (event: BeforeUnloadEvent) => void;
        });

        const event = {
            preventDefault: vi.fn(),
            returnValue: undefined,
        } as unknown as BeforeUnloadEvent;

        beforeUnloadHandler?.(event);
        expect(event.preventDefault).toHaveBeenCalledTimes(1);
        expect(event.returnValue).toBe('');

        rerender({ dirty: false });

        await waitFor(() => {
            expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', beforeUnloadHandler);
        });
    });

    it('resets dirty state when form hook unmounts', async () => {
        const DirtyState = () => {
            const { isDirty } = useUnsavedChangesGuard();
            return <div data-testid="dirty-state">{isDirty ? 'dirty' : 'clean'}</div>;
        };

        const DirtyForm = () => {
            useUnsavedChanges(true);
            return null;
        };

        const { rerender } = render(
            <UnsavedChangesProvider>
                <DirtyState />
                <DirtyForm />
            </UnsavedChangesProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('dirty-state')).toHaveTextContent('dirty');
        });

        rerender(
            <UnsavedChangesProvider>
                <DirtyState />
            </UnsavedChangesProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('dirty-state')).toHaveTextContent('clean');
        });
    });
});