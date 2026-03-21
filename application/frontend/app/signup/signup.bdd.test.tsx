import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SignUpPage from './page';

// 1. Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/signup',
  useSearchParams: () => new URLSearchParams(),
}));

// 2. Mock Supabase to prevent "supabaseUrl is required" and "not a function" errors
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      // Mock the signup for the test logic
      signUp: vi.fn(() => Promise.resolve({ data: { user: {} }, error: null })),
signUp: vi.fn(() => Promise.resolve({ data: { user: {} }, error: null })),
      
      // Combined Mocks: Session + AuthStateChange + SignOut
      getSession: vi.fn(() => 
        Promise.resolve({ data: { session: null }, error: null })
      ),
      onAuthStateChange: vi.fn(() => ({
        data: { 
          subscription: { unsubscribe: vi.fn() } 
        },
      })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
    },
  },
}));

// 3. Mock the auth error handler
vi.mock('../../lib/authErrors', () => ({
  getAuthErrorMessage: vi.fn((err) => 'Mocked Error Message'),
}));

describe('Sign Up Feature (BDD)', () => {
  /**
   * FEATURE: User Registration Validation
   * AS A: New user
   * I WANT: To be notified when my password doesn't meet security requirements
   * SO THAT: I can create a secure account
   */

  it('SCENARIO: Password missing uppercase letter should display a clear error message', async () => {
    // GIVEN: The user is on the Sign Up page
    render(<SignUpPage />);

    // Find all necessary inputs
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i, { selector: 'input#signup-password' });
    const confirmInput = screen.getByLabelText(/confirm password/i);

    // Find the form element specifically
    const form = screen.getByRole('main').querySelector('form')!;

    // WHEN: The user fills out the form but provides a password without an uppercase letter
    fireEvent.change(nameInput, { target: { value: 'Gilberto' } });
    fireEvent.change(emailInput, { target: { value: 'test@kennesaw.edu' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });

    // Submit the form directly to trigger the handleSubmit function
    fireEvent.submit(form);

    // THEN: The user should see the specific validation error message on the screen
    await waitFor(() => {
      const error = screen.getByText(/Password must include at least one uppercase letter/i);
      expect(error).toBeDefined();
      // Verify visual feedback (Red color #b00020)
      expect(error.getAttribute('style')).toContain('color: rgb(176, 0, 32)');
    });
  });

  it('Tests if having non-matching passwords returns the expected error message', async () => {
    // GIVEN: The user is on the Sign Up page
    render(<SignUpPage />);

    // Find all necessary inputs
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i, { selector: 'input#signup-password' });
    const confirmInput = screen.getByLabelText(/confirm password/i);

    // Find the form element specifically
    const form = screen.getByRole('main').querySelector('form')!;

    // WHEN: The user fills out the form but provides different passwords in the password fields
    fireEvent.change(nameInput, { target: { value: 'Gilberto' } });
    fireEvent.change(emailInput, { target: { value: 'test@kennesaw.edu' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmInput, { target: { value: 'Password456' } });

    // Submit the form directly to trigger the handleSubmit function
    fireEvent.submit(form);

    // THEN: The user should see the specific validation error message on the screen
    await waitFor(() => {
        const error = screen.getByText(/Passwords need to match before continuing./i);
        expect(error).toBeDefined();
        // Verify visual feedback (Red color #b00020)
        expect(error.getAttribute('style')).toContain('color: rgb(176, 0, 32)');
    });
});
});
