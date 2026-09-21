// @ts-nocheck

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
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
    Clock: () => <div data-testid="clock-icon">Clock</div>,
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

// Mock HIG components to render as native elements for test interaction
vi.mock('../../components/shared', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    PopoverMenu: ({ items, value, onChange, label, testId }: any) => (
      <div data-testid={testId}>
        {label && <label htmlFor={`mock-pm-${testId}`}>{label}</label>}
        <select id={`mock-pm-${testId}`} value={value} onChange={(e: any) => onChange(e.target.value)}>
          {items.map((item: any) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </div>
    ),
    TimeWheelPicker: ({ label, value, onChange, testId }: any) => (
      <div data-testid={testId}>
        {label && <label htmlFor={`mock-tw-${testId}`}>{label}</label>}
        <input id={`mock-tw-${testId}`} type="time" value={value} onChange={(e: any) => onChange(e.target.value)} />
      </div>
    ),
  };
});

import { useFamilySharing } from '../../hooks/useFamilySharing';
import { FabProvider } from '../../context/FabContext';
import { ContextualFab } from '../../components/mobile/ContextualFab';
import { MemoryRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

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
    daysOfWeek: [0],
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
    dayOfMonth: 28,
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
  const { tasks: mockTasksContext, app: mockAppContext, auth: mockAuthContext, family: _mockFamilyContext, notifications: mockNotificationsContext } = createMockContexts(tasks, app, auth, family, notifications);
  return render(
    /*
     * A Router is required: editing navigates to `/commitments/:id/edit` rather
     * than rendering a form inline.
     */
    <MemoryRouter initialEntries={['/commitments']}>
      <AuthContext.Provider value={mockAuthContext as any}>

        <AppContext.Provider value={mockAppContext as any}>
          <TaskContext.Provider value={mockTasksContext as any}>
            <NotificationContext.Provider value={mockNotificationsContext as any}>
              {/*
                * UX-GL-04: creating a commitment is the FAB's job, so the harness
                * renders the real one. The page registers it, the shell shows it,
                * and the tests click it — the same path a thumb takes.
                */}
              <FabProvider>
                {ui}
                <ContextualFab />
              </FabProvider>
            </NotificationContext.Provider>
          </TaskContext.Provider>
        </AppContext.Provider>

      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('CommitmentsView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('defaults to list view on first render', async () => {
    renderWithContext(<CommitmentsView />);

    expect(await screen.findByText(/Completed \(1\)/i)).toBeInTheDocument();
  });

  describe('Task Rendering', () => {
    it('renders all tasks correctly in list view', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      const listBtn = screen.getByTestId('list-icon').closest('button');
      await user.click(listBtn!);

      // Active tasks are visible immediately
      expect(screen.getByText('Morning Meditation')).toBeInTheDocument();
      expect(screen.getByText('Evening Workout')).toBeInTheDocument();
      expect(screen.getByText('Weekly Review')).toBeInTheDocument();
      expect(screen.getByText('Monthly Bill Payment')).toBeInTheDocument();

      // Switch to list view to find completed tasks container
      const listBtn2 = screen.getByTestId('list-icon').closest('button');
      await user.click(listBtn2!);

      // Completed tasks are in a collapsed section - expand it first
      const completedSection = await screen.findByText(/Completed \(1\)/i);
      await user.click(completedSection);
      expect(screen.getByText('Completed Task')).toBeInTheDocument();
    });

    it('displays task type badges correctly', () => {
      renderWithContext(<CommitmentsView />);

      const dailyBadges = screen.getAllByText('daily');
      expect(dailyBadges.length).toBeGreaterThan(0);

      // We need to switch to List view to test these badges because Timeline layout changes them
      const listBtn = screen.getByTestId('list-icon').closest('button');
      userEvent.setup().click(listBtn!);
    });

    it('shows time of day badge for daily tasks', () => {
      renderWithContext(<CommitmentsView />);

      // Check for morning/evening time indicators
      expect(screen.getByText('morning')).toBeInTheDocument();
      expect(screen.getByText('evening')).toBeInTheDocument();
    });

    it('shows day of week for weekly tasks in list view', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      const listBtn = screen.getByTestId('list-icon').closest('button');
      await user.click(listBtn!);

      // Weekly Review is on Sunday, rendered as 'Su' by TaskContextBadge
      expect(await screen.findByText('Su')).toBeInTheDocument();
    });

    it('shows day of month for monthly tasks in list view', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      // Switch to list view to see the day badge
      const listBtn = screen.getByTestId('list-icon').closest('button');
      await user.click(listBtn!);

      // Monthly Bill Payment on 28th, rendered as '28' by TaskContextBadge
      expect(await screen.findByText('28')).toBeInTheDocument();
    });

    it('shows empty state when no tasks match filter', async () => {
      renderWithContext(<CommitmentsView />, { tasks: { tasks: [] } });
      expect(screen.getByText('Welcome to your Commitments')).toBeInTheDocument();
    });

    it('visually distinguishes completed tasks in list view', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      // Switch to list view to find completed tasks container
      const listBtn = screen.getByTestId('list-icon').closest('button');
      await user.click(listBtn!);

      // Expand the completed section first
      const completedSection = await screen.findByText(/Completed \(1\)/i);
      await user.click(completedSection);

      const completedTask = screen.getByText('Completed Task');
      expect(completedTask).toHaveClass('line-through text-slate-400 dark:text-slate-500');
    });
  });

  describe('Task Filtering', () => {
    it('shows all tasks by default in list view', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      const listBtn = screen.getByTestId('list-icon').closest('button');
      await user.click(listBtn!);

      expect(await screen.findByText('Morning Meditation')).toBeInTheDocument();
      expect(screen.getByText('Weekly Review')).toBeInTheDocument();
      expect(screen.getByText('Monthly Bill Payment')).toBeInTheDocument();
    });

    /**
     * The cadence filter ("Show: All / Daily / Weekly / Monthly / One-off") was
     * removed on purpose: filtering your day by how a commitment is *stored* is a
     * question about the database, not about your day. Asserting the removal keeps
     * it from quietly returning as another row of chips.
     */
    it('offers no cadence filter, and shows every commitment without one', async () => {
      renderWithContext(<CommitmentsView />);

      for (const label of ['Daily', 'Weekly', 'Monthly', 'One-off']) {
        expect(screen.queryByRole('button', { name: new RegExp(`^${label}$`, 'i') })).not.toBeInTheDocument();
      }

      // Nothing is filtered away: every fixture commitment is on screen.
      expect(await screen.findByText('Morning Meditation')).toBeInTheDocument();
      expect(screen.getByText('Weekly Review')).toBeInTheDocument();
      expect(screen.getByText('Monthly Bill Payment')).toBeInTheDocument();
    });

    /**
     * The smart-view default used to be "Today", so a user with commitments but
     * nothing due today landed on an empty page and could reasonably conclude
     * their data was gone. There is no smart-view bar any more, and the list
     * defaults to everything.
     */
    it('has no smart-view bar and never hides the list behind a default view', async () => {
      renderWithContext(<CommitmentsView />);

      expect(screen.queryByTestId('smart-view-bar')).not.toBeInTheDocument();
      expect(await screen.findByText('Morning Meditation')).toBeInTheDocument();
    });
  });

  describe('Add Task Form', () => {
    it('shows choose frequency step when "New Commitment" button is clicked', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      const addButton = screen.getByRole('button', { name: /New Commitment/i });
      await user.click(addButton);

      // UX-CM-01: the composer opens on the NAME, not on a classifier.
      expect(screen.getByText('New Commitment')).toBeInTheDocument();
      expect(screen.getByTestId('task-name')).toBeInTheDocument();
      // Cadence is adjustable in place. Scoped to its own control because
      // "Daily"/"Weekly"/"Monthly" also label the filter chips.
      const cadence = within(screen.getByTestId('cadence-selector'));
      expect(cadence.getByText('Daily')).toBeInTheDocument();
      expect(cadence.getByText('Weekly')).toBeInTheDocument();
      expect(cadence.getByText('Monthly')).toBeInTheDocument();
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

    it('offers the time of day as a pull-down, not a row of buttons', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /New Commitment/i }));
      await user.click(within(screen.getByTestId('cadence-selector')).getByText('Daily'));

      // One control that states its own value…
      const composer = within(screen.getByRole('dialog'));
      expect(composer.getByText('Preferred time')).toBeInTheDocument();

      const select = screen.getByTestId('time-of-day-select').querySelector('select') as HTMLSelectElement;
      expect(select).not.toBeNull();
      expect(select).toHaveValue('morning');
      expect(Array.from(select.options).map((option) => option.textContent))
        .toEqual(['Morning', 'Afternoon', 'Evening', 'Anytime']);

      // …instead of the four standalone buttons it used to render inline.
      ['morning', 'afternoon', 'evening', 'any'].forEach((word) => {
        expect(screen.queryByRole('button', { name: new RegExp(`^${word}$`, 'i') })).not.toBeInTheDocument();
      });

      // And the choice is wired through.
      await user.selectOptions(select, 'evening');
      expect(select).toHaveValue('evening');
    });

    it('shows day of week selector for weekly tasks', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /New Commitment/i }));
      await user.click(within(screen.getByTestId('cadence-selector')).getByText('Weekly'));

      // CM-18: two-letter labels, because a single letter cannot distinguish
      // Tuesday from Thursday or Saturday from Sunday.
      ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach((label) => {
        expect(screen.getAllByText(label).length).toBeGreaterThanOrEqual(1);
      });
    });

    it('opens the day-of-month picker in a half sheet, not a calendar in the form', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /New Commitment/i }));
      await user.click(within(screen.getByTestId('cadence-selector')).getByText('Monthly'));

      // The composer holds one row; the 31 days are not in it.
      expect(screen.getByTestId('month-days-row')).toHaveTextContent('Not set');
      expect(screen.queryByTestId('month-days-sheet')).not.toBeInTheDocument();

      await user.click(screen.getByTestId('month-days-row'));

      const sheet = within(screen.getByTestId('month-days-sheet'));
      expect(sheet.getByRole('button', { name: 'Day 1' })).toBeInTheDocument();
      expect(sheet.getByRole('button', { name: 'Day 31' })).toBeInTheDocument();
    });

    it('calls addTask with correct daily task data', async () => {
      const { tasks } = createMockContexts();
      renderWithContext(<CommitmentsView />, { tasks });

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /New Commitment/i }));
      await user.click(within(screen.getByTestId('cadence-selector')).getByText('Daily'));

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
      await user.click(within(screen.getByTestId('cadence-selector')).getByText('Weekly'));

      const input = screen.getByPlaceholderText(/e.g. Morning Prayer/i);
      await user.type(input, 'New Weekly Task');

      // CM-18: Friday = 5 and Saturday = 6 (weekday indexes, 0 = Sunday), not
      // day-name strings the schedule engine could not read.
      await user.click(screen.getAllByText('Fr')[0]);
      await user.click(screen.getAllByText('Sa')[0]);

      const saveButton = screen.getByRole('button', { name: /Save Commitment/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(tasks.addTask).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'New Weekly Task',
            type: 'weekly',
            daysOfWeek: expect.arrayContaining([5, 6]),
          })
        );
      });
    });

    it('calls addTask with multiple days for monthly tasks', async () => {
      const { tasks } = createMockContexts();
      renderWithContext(<CommitmentsView />, { tasks });
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /New Commitment/i }));
      await user.click(within(screen.getByTestId('cadence-selector')).getByText('Monthly'));

      const input = screen.getByPlaceholderText(/e.g. Morning Prayer/i);
      await user.type(input, 'Multi-day Monthly');

      // Select 1st, 15th, and 30th in the sheet, then confirm the row reports it.
      await user.click(screen.getByTestId('month-days-row'));
      await user.click(screen.getByRole('button', { name: 'Day 1' }));
      await user.click(screen.getByRole('button', { name: 'Day 15' }));
      await user.click(screen.getByRole('button', { name: 'Day 30' }));
      await user.click(screen.getByRole('button', { name: 'Done' }));

      await waitFor(() => {
        expect(screen.getByTestId('month-days-row')).toHaveTextContent('1, 15, 30');
      });

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

      // Daily: the time-of-day pull-down, and nothing else's control.
      await user.click(within(screen.getByTestId('cadence-selector')).getByText('Daily'));
      expect(screen.getByTestId('time-of-day-select')).toBeInTheDocument();
      // CM-18: 'We' only exists in the weekly day picker (two-letter labels).
      expect(screen.queryByText('We')).not.toBeInTheDocument();
      expect(screen.queryByTestId('month-days-row')).not.toBeInTheDocument();

      // Switch to Weekly - should NOT show time of day or the month-days row.
      // UX-CM-01: cadence is switched in place now; there is no "Back" step to
      // navigate (and no second dismiss control).
      await user.click(within(screen.getByTestId('cadence-selector')).getByText('Weekly'));

      await waitFor(() => {
        expect(screen.queryByTestId('time-of-day-select')).not.toBeInTheDocument();
        expect(screen.getByText('We')).toBeInTheDocument();
      });
      expect(screen.queryByTestId('month-days-row')).not.toBeInTheDocument();

      // Switch to Monthly - should NOT show time of day or day of week
      await user.click(within(screen.getByTestId('cadence-selector')).getByText('Monthly'));

      await waitFor(() => {
        expect(screen.queryByText('We')).not.toBeInTheDocument();
        expect(screen.getByTestId('month-days-row')).toBeInTheDocument();
      });
      expect(screen.queryByTestId('time-of-day-select')).not.toBeInTheDocument();
    });

    it('sanitizes input for XSS payloads', async () => {
      const { tasks } = createMockContexts();
      renderWithContext(<CommitmentsView />, { tasks });
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /New Commitment/i }));
      await user.click(within(screen.getByTestId('cadence-selector')).getByText('Daily'));

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
      await user.click(within(screen.getByTestId('cadence-selector')).getByText('Monthly'));

      const input = screen.getByPlaceholderText(/e.g. Morning Prayer/i);
      await user.type(input, 'New Monthly Task');

      // Select 20th
      await user.click(screen.getByTestId('month-days-row'));
      await user.click(screen.getByRole('button', { name: 'Day 20' }));
      await user.click(screen.getByRole('button', { name: 'Done' }));

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
      await user.click(within(screen.getByTestId('cadence-selector')).getByText('Daily'));

      const input = screen.getByPlaceholderText(/e.g. Morning Prayer/i);
      await user.type(input, 'New Family Task');

      // Context is a refinement: one deliberate tap reveals it.
      await user.click(screen.getByTestId('composer-more-toggle'));
      const familyButton = screen.getByRole('button', { name: /^family$/i });
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
      await user.click(within(screen.getByTestId('cadence-selector')).getByText('Daily'));

      const saveButton = screen.getByRole('button', { name: /Save Commitment/i });
      await user.click(saveButton);

      expect(tasks.addTask).not.toHaveBeenCalled();
    });
  });

  describe('Task Interactions', () => {
    it('calls toggleTask when task checkbox is clicked', async () => {
      const { tasks } = createMockContexts();
      renderWithContext(<CommitmentsView />, { tasks });
      const user = userEvent.setup();

      // Switch to List View
      const listBtn = screen.getByTestId('list-icon').closest('button');
      await user.click(listBtn!);

      // Ensure we have rendered the UI list before looking for it
      // Note: Timeline view uses standard Circle lucide icons but the test mocks it
      const circleIcons = await screen.findAllByTestId('circle-icon');
      const firstCheckbox = circleIcons[0].closest('button');

      await user.click(firstCheckbox!);

      // Toggle may be deferred behind animation — wait for it
      await waitFor(() => {
        expect(tasks.toggleTask).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it('shows confirmation dialog and calls deleteTask when confirmed', async () => {
      const { tasks, notifications } = createMockContexts();
      renderWithContext(<CommitmentsView />, { tasks, notifications });
      const user = userEvent.setup();

      // Switch to List View
      const listBtn = screen.getByTestId('list-icon').closest('button');
      await user.click(listBtn!);

      const trashIcons = await screen.findAllByTestId('trash-icon');
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

    // TODO: Completed section animation timing prevents check-circle-icon from rendering in test env
    it.todo('can toggle completed task back to incomplete');

    it('no longer interrupts completion with a blocking transaction modal (UX-CM-08)', async () => {
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

      // Switch to List View
      const listBtn = screen.getByTestId('list-icon').closest('button');
      await user.click(listBtn!);

      const circleIcons = await screen.findAllByTestId('circle-icon');
      await user.click(circleIcons[0].closest('button')!);

      await waitFor(() => expect(tasks.toggleTask).toHaveBeenCalled(), { timeout: 3000 });

      // The completion animation used to run ~800ms and then open a cross-domain
      // "Financial Transaction?" dialog. Give it that window, then prove nothing
      // interrupted the user and nothing navigated on their behalf.
      await new Promise(r => setTimeout(r, 1200));
      expect(notifications.confirm).not.toHaveBeenCalled();
      expect(mockNavigateTo).not.toHaveBeenCalled();
    });

    // The chip itself is covered in TaskList.test.tsx and TaskItem.test.tsx: this
    // harness's toggleTask is a no-op, so a task can never reach `completed` here
    // and the row that carries the offer cannot render.
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
    /**
     * Editing is a destination (`/commitments/:id/edit`), not a form wedged into
     * the list — which is what made one task cost 2-3 screens of scroll to reach
     * Cancel / Save.
     */
    it('navigates to the editor route instead of rendering a form inline', async () => {
      const { tasks } = createMockContexts();
      renderWithContext(
        <Routes>
          <Route path="/commitments" element={<CommitmentsView />} />
          <Route path="/commitments/:id/edit" element={<div data-testid="edit-route" />} />
        </Routes>,
        { tasks },
      );
      const user = userEvent.setup();

      const listBtn = screen.getByTestId('list-icon').closest('button');
      await user.click(listBtn!);

      const editButtons = await screen.findAllByTestId('pencil-icon');
      await user.click(editButtons[0].closest('button')!);

      expect(await screen.findByTestId('edit-route')).toBeInTheDocument();
      // No inline form, and no save path from the list.
      expect(screen.queryByTestId('edit-actions')).not.toBeInTheDocument();
      expect(tasks.addTask).not.toHaveBeenCalled();
    });
  });

  describe('New Features', () => {
    it('displays streak badge for tasks with active streak in List View', async () => {
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
      const user = userEvent.setup();

      const listBtn = screen.getByTestId('list-icon').closest('button');
      await user.click(listBtn!);

      expect(await screen.findByText('Streaked Task')).toBeInTheDocument();
      // UX-DS-01: the streak badge now renders a Lucide icon, not the 🔥 emoji.
      const badge = screen.getByTestId('streak-badge');
      expect(badge.textContent).toContain('5');
      expect(badge.querySelector('svg')).not.toBeNull();
    });

    it('toggles between Timeline, List and Weekly view', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      // Default is List View
      expect(screen.getByTestId('list-icon').closest('button')).toHaveClass('bg-white');

      // Click List Toggle
      const listBtn = screen.getByTestId('list-icon').closest('button');
      await user.click(listBtn!);
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

  /**
   * CM-15 / CM-16 — the search box and the quick-add line were two adjacent
   * full-width inputs both asking for a commitment title. They are now one field:
   * what you type filters what you have, and the same text offers to become a new
   * commitment with its parse shown back first.
   */
  describe('Find or add — one field', () => {
    it('replaces the separate search box and quick-add line', () => {
      renderWithContext(<CommitmentsView />);

      expect(screen.getByLabelText(/^Find or add$/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/^Quick add$/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/^Find$/i)).not.toBeInTheDocument();
    });

    it('filters the list and offers the same text as a new commitment', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      await user.type(screen.getByTestId('commitment-find-or-add'), 'Morning');

      // It reports what it matched…
      expect(screen.getByTestId('search-result-count')).toHaveTextContent(/match/i);
      // …and, in the same breath, offers to create it — parse shown back.
      const preview = screen.getByTestId('quick-add-preview');
      expect(within(preview).getByText('Morning')).toBeInTheDocument();
    });

    it('adds the parsed commitment from the same field', async () => {
      const { tasks } = createMockContexts();
      renderWithContext(<CommitmentsView />, { tasks });
      const user = userEvent.setup();

      await user.type(screen.getByTestId('commitment-find-or-add'), 'Read daily');
      await user.click(within(screen.getByTestId('quick-add-preview')).getByRole('button', { name: 'Add' }));

      await waitFor(() => {
        expect(tasks.addTask).toHaveBeenCalledWith(
          expect.objectContaining({ title: 'Read', type: 'daily' })
        );
      });
    });

    it('hands the same text to the composer when it needs adjusting', async () => {
      renderWithContext(<CommitmentsView />);
      const user = userEvent.setup();

      await user.type(screen.getByTestId('commitment-find-or-add'), 'Pay rent monthly');
      await user.click(within(screen.getByTestId('quick-add-preview')).getByRole('button', { name: 'Adjust' }));

      // The composer opens pre-filled from the parse, not empty.
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      expect(screen.getByPlaceholderText(/e.g. Morning Prayer/i)).toHaveValue('Pay rent');
    });
  });
});
