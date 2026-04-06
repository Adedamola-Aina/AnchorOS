import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsGroup, SettingsRow } from './SettingsGroup';

describe('SettingsGroup', () => {
  it('renders title and children', () => {
    render(
      <SettingsGroup title="Profile">
        <div>Child content</div>
      </SettingsGroup>,
    );
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <SettingsGroup title="Test" icon={<span data-testid="icon">I</span>}>
        <div>Content</div>
      </SettingsGroup>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders footer text', () => {
    render(
      <SettingsGroup title="Test" footer="Some help text">
        <div>Content</div>
      </SettingsGroup>,
    );
    expect(screen.getByText('Some help text')).toBeInTheDocument();
  });

  it('renders dividers between children', () => {
    const { container } = render(
      <SettingsGroup title="Test">
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </SettingsGroup>,
    );
    const divider = container.querySelector('.divide-y');
    expect(divider).toBeInTheDocument();
    expect(divider?.children).toHaveLength(3);
  });

  it('supports custom testId', () => {
    render(
      <SettingsGroup title="Test" testId="profile-group">
        <div>Content</div>
      </SettingsGroup>,
    );
    expect(screen.getByTestId('profile-group')).toBeInTheDocument();
  });

  it('filters out null children', () => {
    const { container } = render(
      <SettingsGroup title="Test">
        <div>First</div>
        {null}
        <div>Third</div>
      </SettingsGroup>,
    );
    const divider = container.querySelector('.divide-y');
    expect(divider?.children).toHaveLength(2);
  });
});

describe('SettingsRow', () => {
  it('renders label', () => {
    render(<SettingsRow label="Display Name" />);
    expect(screen.getByText('Display Name')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<SettingsRow label="Push" description="Real-time alerts" />);
    expect(screen.getByText('Real-time alerts')).toBeInTheDocument();
  });

  it('renders children (control slot)', () => {
    render(
      <SettingsRow label="Theme">
        <span data-testid="toggle">toggle</span>
      </SettingsRow>,
    );
    expect(screen.getByTestId('toggle')).toBeInTheDocument();
  });

  it('renders as button when onClick provided', () => {
    const onClick = vi.fn();
    render(<SettingsRow label="Change Password" onClick={onClick} />);
    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalled();
  });

  it('renders disclosure chevron', () => {
    const { container } = render(<SettingsRow label="Details" disclosure />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has 44px min height', () => {
    const { container } = render(<SettingsRow label="Test" />);
    const row = container.firstElementChild;
    expect(row?.className).toContain('min-h-[44px]');
  });
});
