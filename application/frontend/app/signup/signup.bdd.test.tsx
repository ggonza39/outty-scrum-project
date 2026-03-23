import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SignUpPage from './page';

// 1. Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => '/signup',
  useSearchParams: () => new URLSearchParams(),
}));

// 2. Mock Supabase to prevent "supabaseUrl is required" and "not a function" errors
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(() => Promise.resolve({ data: { user: {} }, error: null })),
      getSession: vi.fn(() =>
        Promise.resolve({ data: { session: null }, error: null })
      ),
      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: { unsubscribe: vi.fn() },
        },
      })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
    },
  },
}));

// 3. Mock the auth error handler
vi.mock('../../lib/authErrors', () => ({
  getAuthErrorMessage: vi.fn(() => 'Mocked Error Message'),
}));

describe('Sign Up Feature (BDD)', () => {
  it('SCENARIO: Password missing uppercase letter should display a clear error message', async () => {
    render(<SignUpPage />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i, {
      selector: 'input#signup-password',
    });
    const confirmInput = screen.getByLabelText(/confirm password/i);

    const form = screen.getByRole('main').querySelector('form')!;

    fireEvent.change(nameInput, { target: { value: 'Gilberto' } });
    fireEvent.change(emailInput, { target: { value: 'test@kennesaw.edu' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });

    fireEvent.submit(form);

    await waitFor(() => {
      const error = screen.getByText(
        /Password must include at least one uppercase letter/i
      );
      expect(error).toBeDefined();
      expect(error.getAttribute('style')).toContain('color: rgb(176, 0, 32)');
    });
  });

  it('Tests if having non-matching passwords returns the expected error message', async () => {
    render(<SignUpPage />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i, {
      selector: 'input#signup-password',
    });
    const confirmInput = screen.getByLabelText(/confirm password/i);

    const form = screen.getByRole('main').querySelector('form')!;

    fireEvent.change(nameInput, { target: { value: 'Gilberto' } });
    fireEvent.change(emailInput, { target: { value: 'test@kennesaw.edu' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmInput, { target: { value: 'Password456' } });

    fireEvent.submit(form);

    await waitFor(() => {
      const error = screen.getByText(
        /Passwords need to match before continuing\./i
      );
      expect(error).toBeDefined();
      expect(error.getAttribute('style')).toContain('color: rgb(176, 0, 32)');
    });
  });
});
