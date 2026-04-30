import { render, waitFor, screen } from '@testing-library/react'
import { describe, it, vi, expect, beforeEach, beforeAll } from 'vitest'
import ProfilePage from './page'

beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
        value: {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
        },
        writable: true,
    })
})

// --- mock next/navigation ---
const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
    }),
  usePathname: () => '/profile',
}))

const defaultData: ProfileFormData = {
    mainPhoto: null,
    displayName: "John Doe",
    age: "30",
    zipCode: "30067",
    bio: "asdf",
    gender: "Female",
    interests: ["Fishing"],
    partnerPreference: "Female",
    skillLevel: "Expert",
    distance: 25,
    instagram: "",
    tiktok: "",
    facebook: "",
    linkedin: "",
};

const createQueryBuilderMock = (response: { data: ProfileFormData; error: null }) => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue(response),
});

// --- mock supabase ---
vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: vi.fn(() =>
            createQueryBuilderMock({
                data: defaultData,
                error: null,
            })
        ),
    auth: {
          getUser: vi.fn(),
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
}))

import { supabase } from '@/lib/supabase'
import { ProfileFormData } from '../../components/profile/ProfileSetupShell'

describe('ProfilePage auth redirect', () => {
    beforeEach(() => {
        vi.clearAllMocks(); // Clear history between tests
    });


    it('redirects to /signin if there is no active supabase session', async () => {
        // Arrange: no user
        vi.mocked(supabase.auth.getUser as any).mockResolvedValue({
            data: { user: null },
            error: null,
        })

        render(<ProfilePage />)

        // Assert: router.replace gets called
        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('/signin')
        })
    })


    it('tests if Loading profile page shows "Edit Profile" button', async () => {
        // Arrange: user
        vi.mocked(supabase.auth.getUser as any).mockResolvedValue({
            data: {
                user: {
                    id: "acf4d9cb-2f6f-4f09-9edc-41444835dcd4",
                    email: "test@test.com",
                }, },
          error: null,
        })

        render(<ProfilePage />)

        await waitFor(() => {
            expect(mockReplace).not.toHaveBeenCalledWith('/signin')
        })

        await waitFor(() => {
            const button = screen.getByRole('button', { name: /Edit Profile/i });
            expect(button).toBeDefined();
        });
    })

    it('tests if Loading profile page shows "Edit Profile" button after refresh', async () => {
        // Arrange: user
        vi.mocked(supabase.auth.getUser as any).mockResolvedValue({
            data: {
                user: {
                    id: "acf4d9cb-2f6f-4f09-9edc-41444835dcd4",
                    email: "test@test.com",
                },
            },
            error: null,
        })

        render(<ProfilePage />)

        await waitFor(() => {
            const button = screen.getByRole('button', { name: /Edit Profile/i });
            expect(button).toBeDefined();
        });
        window.location.reload();

        await waitFor(() => {
            expect(mockReplace).not.toHaveBeenCalledWith('/signin')
        })

        await waitFor(() => {
            const button = screen.getByRole('button', { name: /Edit Profile/i });
            expect(button).toBeDefined();
        });
    })

    it('Verifies app does not crash if session expires', async () => {
        // Arrange: user
        vi.mocked(supabase.auth.getUser as any).mockResolvedValue({
            data: {
                user: {
                    id: "acf4d9cb-2f6f-4f09-9edc-41444835dcd4",
                    email: "test@test.com",
                },
            },
            error: null,
        })

        render(<ProfilePage />)

        await waitFor(() => {
            const button = screen.getByRole('button', { name: /Edit Profile/i });
            expect(button).toBeDefined();
        });

        //terminate session
        vi.mocked(supabase.auth.getUser as any).mockResolvedValue({
            data: { user: null },
            error: null,
        })
        await waitFor(() => {
            const button = screen.getByRole('button', { name: /Edit Profile/i });
            expect(button).toBeDefined();
        });

        //reload page
        window.location.reload();
        render(<ProfilePage />)
        // Assert: router.replace gets called
        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('/signin')
        })
    })

})