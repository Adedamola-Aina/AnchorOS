/**
 * useOnboardingProgress tests — TDD: RED → GREEN
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOnboardingProgress } from './useOnboardingProgress';

const mockUpdateProfile = vi.fn();
let mockProfile: Record<string, unknown> = {};

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ profile: mockProfile, updateProfile: mockUpdateProfile }),
}));

describe('useOnboardingProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockProfile = { name: 'Test', theme: 'light', familyMode: false };
  });

  it('returns default progress when none exists', () => {
    const { result } = renderHook(() => useOnboardingProgress());
    expect(result.current.progress).toEqual({
      gettingStartedStep: 0,
      securityStepSeen: false,
      beyondBasicsComplete: false,
      completedItems: [],
    });
  });

  it('returns existing progress from profile', () => {
    mockProfile.onboardingProgress = {
      gettingStartedStep: 2,
      securityStepSeen: true,
      beyondBasicsComplete: false,
      completedItems: ['explore_finance'],
    };
    const { result } = renderHook(() => useOnboardingProgress());
    expect(result.current.progress.gettingStartedStep).toBe(2);
    expect(result.current.progress.securityStepSeen).toBe(true);
    expect(result.current.completionCount).toBe(1);
  });

  it('markGettingStartedStep updates step forward', async () => {
    const { result } = renderHook(() => useOnboardingProgress());
    await act(() => result.current.markGettingStartedStep(2));
    expect(mockUpdateProfile).toHaveBeenCalledWith({
      onboardingProgress: expect.objectContaining({ gettingStartedStep: 2 }),
    });
  });

  it('markGettingStartedStep does not go backwards', async () => {
    mockProfile.onboardingProgress = {
      gettingStartedStep: 3,
      securityStepSeen: false,
      beyondBasicsComplete: false,
      completedItems: [],
    };
    const { result } = renderHook(() => useOnboardingProgress());
    await act(() => result.current.markGettingStartedStep(1));
    expect(mockUpdateProfile).not.toHaveBeenCalled();
  });

  it('markSecuritySeen sets flag', async () => {
    const { result } = renderHook(() => useOnboardingProgress());
    await act(() => result.current.markSecuritySeen());
    expect(mockUpdateProfile).toHaveBeenCalledWith({
      onboardingProgress: expect.objectContaining({ securityStepSeen: true }),
    });
  });

  it('completeItem adds item to list', async () => {
    const { result } = renderHook(() => useOnboardingProgress());
    await act(() => result.current.completeItem('explore_finance'));
    expect(mockUpdateProfile).toHaveBeenCalledWith({
      onboardingProgress: expect.objectContaining({
        completedItems: ['explore_finance'],
      }),
    });
  });

  it('completeItem ignores duplicates', async () => {
    mockProfile.onboardingProgress = {
      gettingStartedStep: 0,
      securityStepSeen: false,
      beyondBasicsComplete: false,
      completedItems: ['explore_finance'],
    };
    const { result } = renderHook(() => useOnboardingProgress());
    await act(() => result.current.completeItem('explore_finance'));
    expect(mockUpdateProfile).not.toHaveBeenCalled();
  });
});
