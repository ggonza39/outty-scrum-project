import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ExplorerProfileClient from './ExplorerProfileClient';
import React from 'react';
import { DiscoverPage, filterPeople } from './page';
 

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
        await expect(mockNavigate).toHaveBeenCalled;
    });
});

describe('filterPeople - age filtering', () => {
    it('returns only people between 18 and 25 inclusive', () => {
        const people = [
            { id: '1', age: 17 },
            { id: '2', age: 18 },
            { id: '3', age: 21 },
            { id: '4', age: 25 },
            { id: '5', age: 26 },
        ]

        const filters = {
            min_age: 18,
            max_age: 25,
            activities: [],
            gender: '',
            skill_level: [],
            location: '',
        }

        const result = filterPeople(people as any, filters as any)

        // Ensure ALL results are within range
        expect(result.every(p => p.age >= 18 && p.age <= 25)).toBe(true)

        // Ensure correct people are included/excluded
        expect(result.map(p => p.id)).toEqual(['2', '3', '4'])
    })

    it('handles invalid ages', () => {
        const people = [
            { id: '1', age: null },
            { id: '2', age: 18 },
            { id: '3', age: 21 },
            { id: '4', age: 25 },
            { id: '6', age: -5 },
            { id: '7', age: 200 },
            { id: '8', age: "Twenty-Five" },
        ]

        const filters = {
            min_age: 18,
            max_age: 25,
            activities: [],
            gender: '',
            skill_level: [],
            location: '',
        }

        const result = filterPeople(people as any, filters as any)

        // Ensure ALL results are within range
        expect(result.every(p => p.age >= 18 && p.age <= 25)).toBe(true)

        // Ensure correct people are included/excluded
        expect(result.map(p => p.id)).toEqual(['2', '3', '4'])
    })

    it('handles blank filters and invalid inputs', () => {
        const people = [
            { id: '2', age: 18 },
            { id: '3', age: 21 },
            { id: '4', age: 25 },
            { id: '6', age: -5 },
            { id: '7', age: 200 },
            { id: '8', age: "Twenty-Five" },
        ]

        const filters = {
            min_age: null,
            max_age: null,
            activities: [],
            gender: '',
            skill_level: [],
            location: '',
        }

        const result = filterPeople(people as any, filters as any)

        // Ensure correct people are included/excluded
        expect(result.map(p => p.id)).toEqual([])
    })

})

describe('filterPeople - intersection filtering', () => {
    it('Excludes profiles matching one criteria but lacking another', () => {
        const people = [
            { id: '1', age: 25, gender: "Female", tags: ["Hiking"] },
            { id: '2', age: 25, gender: "Male", tags: ["Skiing"] },
            { id: '3', age: 25, gender: "Male", tags: ["Hiking"] },
        ]

        const filters = {
            min_age: 18,
            max_age: 150,
            activities: ["Hiking"],
            gender: "Male",
            skill_level: [],
            location: '',
        }

        const result = filterPeople(people as any, filters as any)

        // Ensure correct people are included/excluded
        expect(result.map(p => p.id)).toEqual(['3'])
    })

    it('Includes profiles with overlapping but not matching interests', () => {
        const people = [
            { id: '1', age: 25, gender: "Female", tags: ["Hiking"] },
            { id: '2', age: 25, gender: "Male", tags: ["Skiing"] },
            { id: '3', age: 25, gender: "Male", tags: ["Hiking"] },
        ]

        const filters = {
            min_age: 18,
            max_age: 150,
            activities: ["Hiking", "Skiing"],
            gender: "Male",
            skill_level: [],
            location: '',
        }

        const result = filterPeople(people as any, filters as any)

        // Ensure correct people are included/excluded
        expect(result.map(p => p.id)).toEqual(['2', '3'])
    })
})