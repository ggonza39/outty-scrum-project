import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
//import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ExplorerProfileClient from './ExplorerProfileClient';
import React from 'react';
import DiscoverPage from './page';

 //Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
    usePathname: () => '/signup',
    useSearchParams: () => new URLSearchParams(),
}));

// Mock Supabase to prevent "supabaseUrl is required" and "not a function" errors
vi.mock('../../lib/supabase', () => ({
    supabase: {
        auth: {
            // Combined Mocks: Session + AuthStateChange
            getSession: vi.fn(() =>
                Promise.resolve({ data: { session: null }, error: null })
            ),
            onAuthStateChange: vi.fn(() => ({
                data: {
                    subscription: { unsubscribe: vi.fn() }
                },
            }))
        },
    },
}));

// Mock useNavigate
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})


describe('Open linked profile expected failure', () => {
    it('tests if inputting an invalid profile returns "Profile not found"', async () => {
        render(<ExplorerProfileClient profileId={'invalid_profile'}/>);

        await waitFor(() => {
            const error = screen.getByText(/Profile not found/i);
            expect(error).toBeDefined();

        });
    });

    it('tests if inputting an invalid profile shows back button', async () => {
        render(
            <MemoryRouter initialEntries={['/discover/invalid_profile']}>
                <ExplorerProfileClient profileId={'invalid_profile'} />
            </MemoryRouter>
        )

        await waitFor(() => {
            const error = screen.getByText(/Profile not found/i);
            expect(error).toBeDefined();
        });

        //const user = userEvent.setup();
        await fireEvent.click(screen.getByRole('button', { name: /Back to Discover/i }));

        // Verify that button navigates back
        expect(mockNavigate).toHaveBeenCalled;
    });
});