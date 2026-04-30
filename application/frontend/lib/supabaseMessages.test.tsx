vi.mock('@/lib/supabase', () => ({
    supabase: {
        auth: {
            getUser: vi.fn(() =>
                Promise.resolve({ data: { user: null }, error: null })
            ),
            getSession: vi.fn(() =>
                Promise.resolve({ data: { session: null }, error: null })
            ),
            onAuthStateChange: vi.fn(() => ({
                data: { subscription: { unsubscribe: vi.fn() } },
            })),
        },
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn(),
            maybeSingle: vi.fn(),
            order: vi.fn(() => Promise.resolve({ data: [], error: null })),
            insert: vi.fn().mockReturnThis(),
        })),
        channel: vi.fn(() => ({
            on: vi.fn().mockReturnThis(),
            subscribe: vi.fn().mockReturnThis(),
        })),
        removeChannel: vi.fn(),
    },
}))

import { describe, it, expect, vi } from 'vitest'
import { sanitizeString } from './supabaseMessages'


describe('sanitizeString', () => {
    // -----------------------------------------------------------------------
    // Truncation
    // -----------------------------------------------------------------------

    it('returns the string unchanged when it is exactly 2000 characters', () => {
        const input = 'a'.repeat(2000)
        expect(sanitizeString(input)).toBe(input)
    })

    it('returns the string unchanged when it is under 2000 characters', () => {
        const input = 'a'.repeat(1999)
        expect(sanitizeString(input)).toBe(input)
    })

    it('truncates a string that exceeds 2000 characters to exactly 2000', () => {
        const input = 'a'.repeat(2001)
        const result = sanitizeString(input)
        expect(result).toHaveLength(2000)
        expect(result).toBe('a'.repeat(2000))
    })

    it('truncates before sanitizing when the string is over 2000 characters and contains tags', () => {
        // Place a tag just after the 2000-character boundary so it should be
        // cut off entirely rather than partially sanitized.
        const input = 'a'.repeat(2000) + '<div>'
        const result = sanitizeString(input)
        expect(result).toHaveLength(2000)
        expect(result).not.toContain('<')
        expect(result).not.toContain('>')
    })

    // -----------------------------------------------------------------------
    // Tag stripping
    // -----------------------------------------------------------------------

    it('removes angle brackets from a tag embedded mid-string', () => {
        expect(sanitizeString('hello <wor>ld')).toBe('hello world')
    })

    it('removes angle brackets from an opening HTML tag', () => {
        expect(sanitizeString('<div>hello')).toBe('divhello')
    })

    it('removes angle brackets from a closing HTML tag', () => {
        expect(sanitizeString('hello</div>')).toBe('hello/div')
    })

    it('removes angle brackets from multiple tags in one string', () => {
        expect(sanitizeString('<b>hello</b>')).toBe('bhello/b')
    })

    it('removes angle brackets from a self-closing tag', () => {
        expect(sanitizeString('line one<br />line two')).toBe('line onebr /line two')
    })

    it('removes angle brackets from a script tag', () => {
        expect(sanitizeString('<script>alert(1)</script>')).toBe('scriptalert(1)/script')
    })

    it('removes angle brackets from an iframe tag', () => {
        expect(sanitizeString('<iframe src="javascript:alert(1)"></iframe>')).toBe(
            'iframe src="javascript:alert(1)"/iframe'
        )
    })

    it('handles a string that is only a tag', () => {
        expect(sanitizeString('<div>')).toBe('div')
    })

    it('handles empty angle brackets', () => {
        expect(sanitizeString('<>')).toBe('')
    })

    // -----------------------------------------------------------------------
    // Pass-through (no mutation)
    // -----------------------------------------------------------------------

    it('returns a plain string with no tags unchanged', () => {
        expect(sanitizeString('hello world')).toBe('hello world')
    })

    it('returns an empty string unchanged', () => {
        expect(sanitizeString('')).toBe('')
    })

    it('does not alter numbers or special characters that are not angle brackets', () => {
        const input = 'price: $9.99 (50% off) & more!'
        expect(sanitizeString(input)).toBe(input)
    })

    it('does not alter a lone < that has no closing >', () => {
        expect(sanitizeString('3 < 5')).toBe('3 < 5')
    })

    it('does not alter a lone > that has no opening <', () => {
        expect(sanitizeString('5 > 3')).toBe('5 > 3')
    })
})