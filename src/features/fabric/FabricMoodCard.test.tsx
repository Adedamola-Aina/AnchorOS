import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FabricMoodCard } from './FabricMoodCard';

describe('FabricMoodCard', () => {
  it('shows a save button after mood selection', async () => {
    const onSave = vi.fn(async () => undefined);

    render(<FabricMoodCard moodToday={null} onSave={onSave} />);

    fireEvent.click(screen.getByRole('button', { name: 'Great' }));

    expect(await screen.findByRole('button', { name: /save mood/i })).toBeInTheDocument();
  });

  it('explicitly saves note with selected mood', async () => {
    const onSave = vi.fn(async () => undefined);

    render(<FabricMoodCard moodToday={null} onSave={onSave} />);

    fireEvent.click(screen.getByRole('button', { name: 'Great' }));
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(screen.getByRole('button', { name: /add a note/i }));

    fireEvent.change(screen.getByPlaceholderText(/what's on your mind/i), {
      target: { value: 'Feeling great today' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save mood/i }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(5, 'Feeling great today');
    });
  });
});
