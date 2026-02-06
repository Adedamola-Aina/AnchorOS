
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CommitmentsView from './CommitmentsView';
import { AppContext } from '../../context/AnchorContext';
import { TaskContext } from '../../context/TaskContext';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';

import type { AnchorTask, UserProfile, TabView } from '../../types';

// Mock lucide-react icons
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return {
    ...actual,
    Plus: () => <div data-testid="plus-icon">Plus</div>,
    CheckCircle2: () => <div data-testid="check-circle-icon">CheckCircle</div>,
    Circle: () => <div data-testid="circle-icon">Circle</div>,
    Trash2: () => <div data-testid="trash-icon">Trash</div>,
    Sunrise: () => <div data-testid="sunrise-icon">Sunrise</div>,
    Sun: () => <div data-testid="sun-icon">Sun</div>,
    Moon: () => <div data-testid="moon-icon">Moon</div>,
    Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
    Pencil: () => <div data-testid="pencil-icon">Pencil</div>,
    ChevronDown: () => <div data-testid="chevron-down-icon">ChevronDown</div>,
    ChevronUp: () => <div data-testid="chevron-up-icon">ChevronUp</div>,
    LayoutList: () => <div data-testid="list-icon">List</div>,
    CalendarDays: () => <div data-testid="calendar-days-icon">CalendarDays</div>,
  };
});

// Mock useFamilySharing
vi.mock('../../hooks/useFamilySharing', () => ({
  useFamilySharing: vi.fn(() => ({
    connection: null,
    isOwner: true,
    loading: false,
  })),
}));

import { useFamilySharing } from '../../hooks/useFamilySharing';

const mockTasks: AnchorTask[] = [
  {
    id: 'task-1',
    title: 'Morning Meditation',
    type: 'daily',
    completed: false,
    category: 'personal',
    createdAt: new Date('2024-01-01'),
    timeOfDay: 'morning',
  },
  {
    id: 'task-2',
    title: 'Evening Workout',
    type: 'daily',
    completed: false,
    category: 'personal',
    createdAt: new Date('2024-01-01'),
    timeOfDay: 'evening',
  },
  {
    id: 'task-3',
    title: 'Weekly Review',
    type: 'weekly',
    completed: false,
    category: 'personal',
    createdAt: new Date('2024-01-01'),
    daysOfWeek: ['Sunday'],
  },
  {
    id: 'task-4',
    title: 'Completed Task',
    type: 'daily',
    completed: true,
    category: 'personal',
    createdAt: new Date('2024-01-01'),
    timeOfDay: 'afternoon',
  },
  {
    id: 'task-5',
    title: 'Monthly Bill Payment',
    type: 'monthly',
    completed: false,
    category: 'personal',
    createdAt: new Date('2024-01-01'),
    dayOfMonth: 15,
  },
];

const mockProfile: UserProfile = {
  name: 'Test User',
  familyMode: false,
  theme: 'light',
};

const createMockContexts = (taskOverrides = {}, appOverrides = {}, authOverrides = {}, familyOverrides = {}, notificationOverrides = {}) => {
  const tasks = {
    tasks: mockTasks,
    addTask: vi.fn((task) => ({ ...task, id: `new-task-${Date.now()}` })),
    toggleTask: vi.fn(),
    deleteTask: vi.fn(),
    ...taskOverrides,
  };

  const app = {
    navigateTo: vi.fn(),
    activeTab: 'commitments' as TabView,
    ...appOverrides,
  };

  const auth = {
    user: { uid: 'test-user' } as any,
    profile: mockProfile,
    loading: false,
    updateProfile: vi.fn(),
    signIn: vi.fn(),
    signUp: vi.fn(),
    verifyMfa: vi.fn(),
    generateMfaSecret: vi.fn(),
    enrollMfa: vi.fn(),
    unenrollMfa: vi.fn(),
    logout: vi.fn(),
    sendVerificationEmail: vi.fn(),
    ...authOverrides,
  };

  const family = {
    spouseId: null,
    sendInvite: vi.fn(),
    acceptInvite: vi.fn(),
    ...familyOverrides,
  };

  const notifications = {
    showToast: vi.fn(),
    confirm: vi.fn().mockResolvedValue(true),
    ...notificationOverrides,
  };

  return { tasks, app, auth, family, notifications };
};

const renderWithContext = (ui: React.ReactElement, { tasks = {}, app = {}, auth = {}, family = {}, notifications = {} } = {}) => {
  const { tasks: mockTasksContext, app: mockAppContext, auth: mockAuthContext, family: mockFamilyContext, notifications: mockNotificationsContext } = createMockContexts(tasks, app, auth, family, notifications);
  return render(
    <AuthContext.Provider value={mockAuthContext as any}>

      <AppContext.Provider value={mockAppContext as any}>
        <TaskContext.Provider value={mockTasksContext as any}>
          <NotificationContext.Provider value={mockNotificationsContext as any}>
            {ui}
          </NotificationContext.Provider>
        </TaskContext.Provider>
      </AppContext.Provider>

    </AuthContext.Provider>
  );
};

describe('CommitmentsView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Task Rendering', () => {
    it('renders all tasks correctly', async () => {
      renderWithContext(<CommitmentsView />);

      // Active tasks are visible immediately
      expect(screen.getByText('Morning Meditation')).toBeInTheDocument();
      expect(screen.getByText('Evening Workout')).toBeInTheDocument();
      expect(screen.getByText('Weekly Review')).toBeInTheDocument();
      expect(screen.getByText('Monthly Bill Payment')).toBeInTheDocument();

      // Completed tasks are in a collapsed section - expand it first
      const completedSection = screen.getByText(/Completed \(1\)/i);
      const user = userEvent.setup();
      await user.click(completedSection);
      expect(screen.getByText('Completed Task')).toBeInTheDocument();
    });

    it('displays task type badges correctly', () => {
      renderWithContext(<CommitmentsView />);

      const dailyBadges = screen.getAllByText('daily');
      expect(dailyBadges.length).toBeGreaterThan(0);

      expect(screen.getAllByText('weekly').length).toBeGreaterThan(0);
      expect(screen.getAllByText('monthly').length).toBeGreaterThan(0);
    });

    it('shows time of day badge for daily tasks', () => {
      renderWithContext(<CommitmentsView />);

      // Check for morning/evening time indicators
      expect(screen.getByText('morning')).toBeInTheDocument();
      expect(screen.getByText('evening')).toBeInTheDocument();
    });

    it('shows day of week for weekly tasks', () => {
      renderWithContext(<CommitmentsView />);
      // Weekly Review is on Sunday, rendered as 'Su' by TaskContextBadge
      expect(screen.getByText('Su')).toBeInTheDocument();
    });

    it('shows day of month for monthly tasks', () => {
      renderWithContext(<CommitmentsView />);
      // Monthly Bill Payment on 15th, rendered as '15' by TaskContextBadge
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('shows empty state when no tasks match filter', async () => {
      renderWithContext(<CommitmentsView />, { tasks: { tasks: [] } });
      expect(screen.getByText('Welcome to your Commitments')).toBeInTheDocument();
    });

    it('visually distinguishes completed tasks', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      // Expand the completed section first
      const completedSection = screen.getByText(/Completed \(1\)/i);
      await user.click(completedSection);

      const completedTask = screen.getByText('Completed Task');
      expect(completedTask).toHaveClass('line-through');
    });
  });

  describe('Task Filtering', () => {
    it('shows all tasks by default', () => {
      renderWithContext(<CommitmentsView />);
      expect(screen.getByText('Morning Meditation')).toBeInTheDocument();
      expect(screen.getByText('Weekly Review')).toBeInTheDocument();
      expect(screen.getByText('Monthly Bill Payment')).toBeInTheDocument();
    });

    it('filters to show only daily tasks', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      const dailyFilter = screen.getByRole('button', { name: /^daily$/i });
      await user.click(dailyFilter);

      await waitFor(() => {
        expect(screen.getByText('Morning Meditation')).toBeInTheDocument();
        expect(screen.getByText('Evening Workout')).toBeInTheDocument();
        expect(screen.queryByText('Weekly Review')).not.toBeInTheDocument();
        expect(screen.queryByText('Monthly Bill Payment')).not.toBeInTheDocument();
      });
    });

    it('filters to show only weekly tasks', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      const weeklyFilter = screen.getByRole('button', { name: /^weekly$/i });
      await user.click(weeklyFilter);

      await waitFor(() => {
        expect(screen.getByText('Weekly Review')).toBeInTheDocument();
        expect(screen.queryByText('Morning Meditation')).not.toBeInTheDocument();
        expect(screen.queryByText('Monthly Bill Payment')).not.toBeInTheDocument();
      });
    });

    it('filters to show only monthly tasks', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      const monthlyFilter = screen.getByRole('button', { name: /^monthly$/i });
      await user.click(monthlyFilter);

      await waitFor(() => {
        expect(screen.getByText('Monthly Bill Payment')).toBeInTheDocument();
        expect(screen.queryByText('Morning Meditation')).not.toBeInTheDocument();
        expect(screen.queryByText('Weekly Review')).not.toBeInTheDocument();
      });
    });

    it('returns to all tasks when "all" filter is selected', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      // First filter to daily
      const dailyFilter = screen.getByRole('button', { name: /^daily$/i });
      await user.click(dailyFilter);

      // Then back to all
      const allFilter = screen.getByRole('button', { name: /^all$/i });
      await user.click(allFilter);

      await waitFor(() => {
        expect(screen.getByText('Morning Meditation')).toBeInTheDocument();
        expect(screen.getByText('Weekly Review')).toBeInTheDocument();
        expect(screen.getByText('Monthly Bill Payment')).toBeInTheDocument();
      });
    });
  });

  describe('Add Task Form', () => {
    it('shows choose frequency step when "New Commitment" button is clicked', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      const addButton = screen.getByRole('button', { name: /New Commitment/i });
      await user.click(addButton);

      expect(screen.getByText('Choose Frequency')).toBeInTheDocument();
      expect(screen.getByText('Daily')).toBeInTheDocument();
      expect(screen.getByText('Weekly')).toBeInTheDocument();
      expect(screen.getByText('Monthly')).toBeInTheDocument();
    });

    it('closes add task form when top X is clicked', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /New Commitment/i }));

      // Find all buttons, then find the one that contains an X SVG or close-like icon
      // In our code it's <button onClick={() => setShowAdd(false)} ...><X ... /></button>
      // The lucide-x component renders an SVG.
      const buttons = screen.getAllByRole('button');
      const closeButton = buttons.find(b => b.querySelector('.lucide-x') || b.innerHTML.includes('lucide-x'));

      if (closeButton) {
        await user.click(closeButton);
      } else {
        // Fallback to finding the first button that isn't one of the cards
        await user.click(buttons[0]);
      }

      await waitFor(() => {
        expect(screen.queryByText('Choose Frequency')).not.toBeInTheDocument();
      });
    });

    it('shows time of day selector for daily tasks', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /New Commitment/i }));
      await user.click(screen.getByText('Daily'));

      expect(screen.getByRole('button', { name: /morning/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /afternoon/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /evening/i })).toBeInTheDocument();
    });

    it('shows day of week selector for weekly tasks', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /New Commitment/i }));
      await user.click(screen.getByText('Weekly'));

      // Check for S M T W T F S toggles
      expect(screen.getByText('M')).toBeInTheDocument();
      // Should find two 'S' (Sunday, Saturday)
      expect(screen.getAllByText('S').length).toBe(2);
    });

    it('shows day of month selector for monthly tasks', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /New Commitment/i }));
      await user.click(screen.getByText('Monthly'));

      // Check for a few day options in the grid (15 may appear twice: badge + form)
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getAllByText('15').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('31')).toBeInTheDocument();
    });

    it('calls addTask with correct daily task data', async () => {
      const { tasks } = createMockContexts();
      renderWithContext(<CommitmentsView />, { tasks });

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /New Commitment/i }));
      await user.click(screen.getByText('Daily'));

      const input = screen.getByPlaceholderText(/e.g. Morning Prayer/i);
      await user.type(input, 'New Daily Task');

      const saveButton = screen.getByRole('button', { name: /Save Commitment/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(tasks.addTask).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'New Daily Task',
            type: 'daily',
            domain: 'Personal Development',
          })
        );
      });
    });

    it('calls addTask with correct weekly task data', async () => {
      const { tasks } = createMockContexts();
      renderWithContext(<CommitmentsView />, { tasks });
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /New Commitment/i }));
      await user.click(screen.getByText('Weekly'));

      const input = screen.getByPlaceholderText(/e.g. Morning Prayer/i);
      await user.type(input, 'New Weekly Task');

      // Select Friday and Saturday
      const fridayButton = screen.getByText('F');
      const saturdayButton = screen.getAllByText('S')[1]; // Second S is Saturday
      await user.click(fridayButton);
      await user.click(saturdayButton);

      const saveButton = screen.getByRole('button', { name: /Save Commitment/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(tasks.addTask).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'New Weekly Task',
            type: 'weekly',
            daysOfWeek: expect.arrayContaining(['Friday', 'Saturday']),
          })
        );
      });
    });

    it('calls addTask with multiple days for monthly tasks', async () => {
      const { tasks } = createMockContexts();
      renderWithContext(<CommitmentsView />, { tasks });
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /New Commitment/i }));
      await user.click(screen.getByText('Monthly'));

      const input = screen.getByPlaceholderText(/e.g. Morning Prayer/i);
      await user.type(input, 'Multi-day Monthly');

      // Select 1st, 15th, and 30th - find day buttons in form grid (not badge span)
      const dayButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('w-8') && btn.classList.contains('h-8')
      );
      const day1 = dayButtons.find(btn => btn.textContent === '1');
      const day15 = dayButtons.find(btn => btn.textContent === '15');
      const day30 = dayButtons.find(btn => btn.textContent === '30');
      await user.click(day1!);
      await user.click(day15!);
      await user.click(day30!);

      const saveButton = screen.getByRole('button', { name: /Save Commitment/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(tasks.addTask).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Multi-day Monthly',
            type: 'monthly',
            daysOfMonth: [1, 15, 30],
          })
        );
      });
    });

    it('enforces form field isolation for different frequencies', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /New Commitment/i }));

      // Daily should NOT show day of week or day of month selectors
      await user.click(screen.getByText('Daily'));
      expect(screen.queryByText('M')).not.toBeInTheDocument();
      // Note: '15' may appear from task badge, so check form-specific date grid is absent
      expect(screen.queryByText('31')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /morning/i })).toBeInTheDocument();

      // Switch to Weekly - should NOT show time of day or day of month
      const backBtn = await screen.findByRole('button', { name: /back/i });
      await user.click(backBtn);
      await user.click(screen.getByText('Weekly'));

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /morning/i })).not.toBeInTheDocument();
        expect(screen.getByText('M')).toBeInTheDocument();
      });

      // Switch to Monthly - should NOT show time of day or day of week
      const backBtn2 = await screen.findByRole('button', { name: /back/i });
      await user.click(backBtn2);
      await user.click(screen.getByText('Monthly'));

      await waitFor(() => {
        expect(screen.queryByText('M')).not.toBeInTheDocument();
        expect(screen.getAllByText('15').length).toBeGreaterThanOrEqual(1);
      });
    });

    it('sanitizes input for XSS payloads', async () => {
      const { tasks } = createMockContexts();
      renderWithContext(<CommitmentsView />, { tasks });
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /New Commitment/i }));
      await user.click(screen.getByText('Daily'));

      const payload = '<script>alert("xss")</script>Dangerous Task';
      const input = screen.getByPlaceholderText(/e.g. Morning Prayer/i);
      await user.type(input, payload);

      const saveButton = screen.getByRole('button', { name: /Save Commitment/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(tasks.addTask).not.toHaveBeenCalled();
      });
    });

    it('calls addTask with correct monthly task data', async () => {
      const { tasks } = createMockContexts();
      renderWithContext(<CommitmentsView />, { tasks });

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /New Commitment/i }));
      await user.click(screen.getByText('Monthly'));

      const input = screen.getByPlaceholderText(/e.g. Morning Prayer/i);
      await user.type(input, 'New Monthly Task');

      // Select 20th
      const day20 = screen.getByText('20');
      await user.click(day20);

      const saveButton = screen.getByRole('button', { name: /Save Commitment/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(tasks.addTask).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'New Monthly Task',
            type: 'monthly',
            daysOfMonth: [20],
          })
        );
      });
    });

    it('calls addTask with correct family scope', async () => {
      // Override mock for this test
      vi.mocked(useFamilySharing).mockReturnValue({
        connection: { id: 'c1', ownerUid: 'u1', memberUid: 'u2', status: 'active' } as any,
        isOwner: true,
        loading: false,
        shareAccount: vi.fn(),
        disconnectFamily: vi.fn(),
        familyMemberUid: 'u2',
        familyMemberName: 'Partner'
      });

      const { tasks } = createMockContexts();
      renderWithContext(<CommitmentsView />, { tasks });

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /New Commitment/i }));
      await user.click(screen.getByText('Daily'));

      const input = screen.getByPlaceholderText(/e.g. Morning Prayer/i);
      await user.type(input, 'New Family Task');

      const familyButton = screen.getByRole('button', { name: /family/i });
      await user.click(familyButton);

      const saveButton = screen.getByRole('button', { name: /Save Commitment/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(tasks.addTask).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'New Family Task',
            category: 'family',
          })
        );
      });
    });

    it('does not submit empty tasks', async () => {
      const { tasks } = createMockContexts();
      renderWithContext(<CommitmentsView />, { tasks });
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /New Commitment/i }));
      await user.click(screen.getByText('Daily'));

      const saveButton = screen.getByRole('button', { name: /Save Commitment/i });
      await user.click(saveButton);

      expect(tasks.addTask).not.toHaveBeenCalled();
    });
  });

  describe('Task Interactions', () => {
    it.skip('calls toggleTask when task checkbox is clicked', async () => {
      const { tasks } = createMockContexts();
      renderWithContext(<CommitmentsView />, { tasks });
      const user = userEvent.setup();

      // Find an incomplete task's checkbox
      const circleIcons = screen.getAllByTestId('circle-icon');
      const firstCheckbox = circleIcons[0].closest('button');

      await user.click(firstCheckbox!);

      expect(tasks.toggleTask).toHaveBeenCalled();
    });

    it('shows confirmation dialog and calls deleteTask when confirmed', async () => {
      const { tasks, notifications } = createMockContexts();
      renderWithContext(<CommitmentsView />, { tasks, notifications });
      const user = userEvent.setup();

      const trashIcons = screen.getAllByTestId('trash-icon');
      const firstDeleteButton = trashIcons[0].closest('button');

      await user.click(firstDeleteButton!);

      // Verify confirmation was requested
      expect(notifications.confirm).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Delete Commitment?',
          type: 'danger'
        })
      );

      // Since confirm mock returns true, deleteTask should be called
      await waitFor(() => {
        expect(tasks.deleteTask).toHaveBeenCalled();
      });
    });

    it.skip('can toggle completed task back to incomplete', async () => {
      const { tasks } = createMockContexts();
      renderWithContext(<CommitmentsView />, { tasks });
      const user = userEvent.setup();

      // Expand the completed section first
      const completedSection = screen.getByText(/Completed \(1\)/i);
      await user.click(completedSection);

      // Find the completed task's checkbox (CheckCircle2 in the completed section)
      const checkCircleIcons = screen.getAllByTestId('check-circle-icon');
      const completedCheckbox = checkCircleIcons[0].closest('button');

      await user.click(completedCheckbox!);

      expect(tasks.toggleTask).toHaveBeenCalledWith(
        expect.any(String),
        true
      );
    });

    it('prompts to add transaction when completing financial tasks and navigates on confirm', async () => {
      const mockNavigateTo = vi.fn();
      const { tasks, notifications } = createMockContexts({
        tasks: [{
          id: 't-pay', title: 'Pay Rent', completed: false, type: 'daily', category: 'personal', createdAt: new Date()
        }]
      }, {
        navigateTo: mockNavigateTo
      });

      const user = userEvent.setup();

      renderWithContext(<CommitmentsView />, {
        tasks,
        app: { navigateTo: mockNavigateTo },
        auth: {},
        family: {},
        notifications // Pass the same mock instance!
      });

      const circleIcons = screen.getAllByTestId('circle-icon');
      await user.click(circleIcons[0].closest('button')!);

      // Wait for the component's timeout (1300ms animation + rAF)
      await new Promise(r => setTimeout(r, 1500));

      await waitFor(() => {
        expect(notifications.confirm).toHaveBeenCalled();
        expect(mockNavigateTo).toHaveBeenCalledWith('finance');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles tasks without timeOfDay gracefully', () => {
      const tasksWithoutTime: AnchorTask[] = [
        {
          id: 'task-1',
          title: 'Task Without Time',
          type: 'daily',
          completed: false,
          category: 'personal',
          createdAt: new Date('2024-01-01'),
        },
      ];

      renderWithContext(<CommitmentsView />, { tasks: { tasks: tasksWithoutTime } });

      expect(screen.getByText('Task Without Time')).toBeInTheDocument();
    });

    it('renders empty commitments list', () => {
      renderWithContext(<CommitmentsView />, { tasks: { tasks: [] } });
      expect(screen.getByText('Welcome to your Commitments')).toBeInTheDocument();
    });

    it('handles very long task titles', () => {
      const longTitleTask: AnchorTask[] = [
        {
          id: 'task-1',
          title: 'This is a very long task title that should still render correctly without breaking the layout or causing any issues',
          type: 'daily',
          completed: false,
          category: 'personal',
          createdAt: new Date('2024-01-01'),
          timeOfDay: 'morning',
        },
      ];

      renderWithContext(<CommitmentsView />, { tasks: { tasks: longTitleTask } });

      expect(screen.getByText(/This is a very long task title/)).toBeInTheDocument();
    });
  });

  describe('Edit and Delete Operations', () => {
    it('populates edit form with existing task data', async () => {
      const { tasks } = createMockContexts();
      renderWithContext(<CommitmentsView />, { tasks });
      const user = userEvent.setup();

      // Find edit button for 'Morning Meditation'
      const editButtons = screen.getAllByTestId('pencil-icon');
      await user.click(editButtons[0].closest('button')!);

      expect(screen.getByDisplayValue('Morning Meditation')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /morning/i })).toHaveClass('text-task-600');
    });

    it('cancels edit without saving changes', async () => {
      const { tasks } = createMockContexts();
      renderWithContext(<CommitmentsView />, { tasks });
      const user = userEvent.setup();

      const editButtons = screen.getAllByTestId('pencil-icon');
      await user.click(editButtons[0].closest('button')!);

      const input = screen.getByDisplayValue('Morning Meditation');
      await user.clear(input);
      await user.type(input, 'Modified Title');

      await user.click(screen.getByText('Cancel'));

      expect(tasks.addTask).not.toHaveBeenCalled();
      expect(tasks.deleteTask).not.toHaveBeenCalled();
      expect(screen.queryByDisplayValue('Modified Title')).not.toBeInTheDocument();
    });
  });

  describe('New Features', () => {
    it('displays streak badge for tasks with active streak', () => {
      const streakedTasks: AnchorTask[] = [
        {
          id: 't-streak',
          title: 'Streaked Task',
          type: 'daily',
          completed: false,
          category: 'personal',
          createdAt: new Date(),
          currentStreak: 5
        }
      ];

      renderWithContext(<CommitmentsView />, { tasks: { tasks: streakedTasks } });

      expect(screen.getByText('Streaked Task')).toBeInTheDocument();
      // Check for Streak Badge content
      expect(screen.getByText(/5/)).toBeInTheDocument();
      // We can also search for the emoji if exact
      expect(screen.getByText((content) => content.includes('🔥'))).toBeInTheDocument();
    });

    it('toggles between List and Weekly view', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      // Default is List View
      expect(screen.getByTestId('list-icon').closest('button')).toHaveClass('bg-white'); // Active style check if possible, or just check existence

      // Click Calendar Toggle
      const calendarBtn = screen.getByTestId('calendar-days-icon').closest('button');
      await user.click(calendarBtn!);

      // Now WeeklyView should be active. 
      // WeeklyView renders 7 days (Sun, Mon, Tue...). 
      // Let's check for today's day name or just that the grid is present.
      // The WeeklyView renders: <div ...>{dayName}</div>
      const today = new Date();
      const dayName = today.toLocaleDateString('en-US', { weekday: 'short' });

      expect(screen.getByText(dayName)).toBeInTheDocument();
      expect(screen.getAllByText(/[0-9]{1,2}/).length).toBeGreaterThanOrEqual(7); // Dates 1-31
    });
  });
});
