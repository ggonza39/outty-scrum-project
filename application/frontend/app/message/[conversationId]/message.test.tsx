import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import ConversationPage from '@/app/message/[conversationId]/page'

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

// --- Stable mocks ---
const singleMock = vi.fn()
const markConversationAsRead = vi.fn()

vi.mock('next/navigation', () => ({
    useParams: () => ({
        conversationId: 'real-convo-id',
    }),
    usePathname: () => '/message',
    useRouter: () => ({
        push: vi.fn(),
    }),
}))

vi.mock('@/lib/supabase', () => ({
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
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: singleMock,
        })),
    },
}))

vi.mock('@/lib/supabaseMessages', () => ({
    getCurrentUser: vi.fn(),
    fetchConversationMessages: vi.fn(),
    markConversationAsRead: (...args: any[]) =>
        markConversationAsRead(...args),
    subscribeToConversationMessages: vi.fn(() => () => { }),
    createTypingChannel: vi.fn(() => ({ cleanup: vi.fn() })),
    createPresenceChannel: vi.fn(() => () => { }),
    sendConversationMessage: vi.fn(),
}))

describe('Conversation read behavior', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('marks as read when recipient opens thread', async () => {
        const { getCurrentUser, fetchConversationMessages } =
            await import('@/lib/supabaseMessages')

        vi.mocked(getCurrentUser).mockResolvedValue({
            id: 'recipient-id',
        })

        singleMock.mockResolvedValue({
            data: {
                id: 'real-convo-id',
                user1_id: 'sender-id',
                user2_id: 'recipient-id',
            },
            error: null,
        })

        vi.mocked(fetchConversationMessages).mockResolvedValue([
            {
                id: 'msg-1',
                content: 'Hello',
                sender_id: 'sender-id',
                created_at: new Date().toISOString(),
                is_read: false,
            },
        ])

        render(<ConversationPage />)

        await waitFor(() => {
            expect(fetchConversationMessages).toHaveBeenCalled()
        })

        expect(markConversationAsRead).toHaveBeenCalledWith('real-convo-id')
    })

    it('does NOT mark as read when sender opens thread', async () => {
        const { getCurrentUser, fetchConversationMessages } =
            await import('@/lib/supabaseMessages')

        vi.mocked(getCurrentUser).mockResolvedValue({
            id: 'sender-id',
        })

        singleMock.mockResolvedValue({
            data: {
                id: 'real-convo-id',
                user1_id: 'sender-id',
                user2_id: 'recipient-id',
            },
            error: null,
        })

        vi.mocked(fetchConversationMessages).mockResolvedValue([
            {
                id: 'msg-1',
                content: 'Hello',
                sender_id: 'sender-id',
                created_at: new Date().toISOString(),
                is_read: false,
            },
        ])

        render(<ConversationPage />)

        await waitFor(() => {
            expect(fetchConversationMessages).toHaveBeenCalled()
        })

        expect(markConversationAsRead).not.toHaveBeenCalled()
    })
})