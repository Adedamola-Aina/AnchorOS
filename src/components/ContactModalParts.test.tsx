// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  ContactSuccessMessage,
  ContactHeader,
  SubjectSelect,
  MessageInput,
  IdentityFields,
  SubmitButton,
  SUBJECTS,
} from './ContactModalParts';

describe('ContactModalParts', () => {
  describe('SUBJECTS', () => {
    it('has 6 subject options', () => {
      expect(SUBJECTS).toHaveLength(6);
    });
    it('includes feedback and problem', () => {
      const values = SUBJECTS.map((s: any) => s.value);
      expect(values).toContain('feedback');
      expect(values).toContain('problem');
    });
  });

  describe('ContactSuccessMessage', () => {
    it('renders success content', () => {
      render(<ContactSuccessMessage />);
      // Should contain a success indicator (checkmark or text)
      expect(document.body.textContent).toMatch(/sent|thank|success/i);
    });
  });

  describe('ContactHeader', () => {
    it('renders header with close button', () => {
      const onClose = vi.fn();
      render(<ContactHeader onClose={onClose} />);
      const closeBtn = screen.getByRole('button');
      fireEvent.click(closeBtn);
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('SubjectSelect', () => {
    it('renders a select element', () => {
      render(<SubjectSelect value="feedback" onChange={vi.fn()} />);
      expect(screen.getByTestId('contact-subject')).toBeInTheDocument();
    });

    it('calls onChange on selection', () => {
      const onChange = vi.fn();
      render(<SubjectSelect value="feedback" onChange={onChange} />);
      // PopoverMenu renders a button trigger; click to open, then select
      fireEvent.click(screen.getByTestId('contact-subject'));
      const problemOption = screen.getByRole('option', { name: /problem/i });
      fireEvent.click(problemOption);
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('MessageInput', () => {
    it('renders textarea', () => {
      render(<MessageInput value="" onChange={vi.fn()} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('calls onChange on input', () => {
      const onChange = vi.fn();
      render(<MessageInput value="" onChange={onChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'My feedback' } });
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('IdentityFields', () => {
    it('renders name and email inputs', () => {
      render(
        <IdentityFields
          name="Test"
          email="test@test.com"
          onNameChange={vi.fn()}
          onEmailChange={vi.fn()}
        />
      );
      expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test@test.com')).toBeInTheDocument();
    });
  });

  describe('SubmitButton', () => {
    it('renders send button', () => {
      render(<SubmitButton isSubmitting={false} disabled={false} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
      render(<SubmitButton isSubmitting={false} disabled={true} />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('shows loading state when submitting', () => {
      render(<SubmitButton isSubmitting={true} disabled={true} />);
      expect(screen.getByRole('button')).toBeDisabled();
      expect(screen.getByText(/sending/i)).toBeInTheDocument();
    });
  });
});
