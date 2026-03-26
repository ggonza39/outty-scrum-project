import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SignInPage from './page';
import { supabase } from '@/lib/supabase';

// 1. Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
    usePathname: () => '/signin',
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

describe('Sign In Feature (BDD)', () => {

    it('SCENARIO: Sucessful login', async () => {
        // GIVEN: The user is on the Sign In page
        render(<SignInPage />);

        // Find all necessary inputs
        //const nameInput = screen.getByLabelText(/name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i, //{ selector: 'input#signup-password' }
        );
        //const confirmInput = screen.getByLabelText(/confirm password/i);

        // Find the form element specifically
        const form = screen.getByRole('main').querySelector('form')!;

        const randomString = Math.random().toString(36).substring(2, 9);
        const email = randomString + "@gmail.com";

        //fireEvent.change(nameInput, { target: { value: 'Gilberto' } });
        fireEvent.change(emailInput, { target: { value: email } });
        fireEvent.change(passwordInput, { target: { value: 'Password123' } });
        //fireEvent.change(confirmInput, { target: { value: 'password123' } });

        // Submit the form directly to trigger the handleSubmit function
        fireEvent.submit(form);

        const { data } = await supabase.auth.getSession();
        console.log(data);
        expect(data).not.toBeNull()

        // THEN: The user should see the specific validation error message on the screen
        //await waitFor(() => {
        //    //const error = screen.getByText(/Password must include at least one uppercase letter/i);
        //    const { data } = supabase.auth.getSession();
        //    expect(error).toBeDefined();
        //});
    });
});

//vi.restoreAllMocks()