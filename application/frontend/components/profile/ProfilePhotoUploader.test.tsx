import { describe, it, expect, vi } from 'vitest';
import { validateFile } from './ProfilePhotoUploader';

//Mock Supabase to prevent "supabaseUrl is required" error
vi.mock('../../lib/supabase', () => ({
    supabase: {
        auth: {
            signUp: vi.fn(() => Promise.resolve({ data: { user: {} }, error: null })),
        },
    },
}));

describe('validateFile negative type tests', () => {
    it('should return error for pdf file type', () => {
        const file = new File([''], 'photo.pdf', { type: 'application/pdf' });
        expect(validateFile(file)).toBe('Only .jpg, .png, and .webp files are allowed.');
    })

    it('should return error for exe file type', () => {
        const file = new File([''], 'photo.exe', { type: 'application/exe' });
        expect(validateFile(file)).toBe('Only .jpg, .png, and .webp files are allowed.');
    })

    it('should return error for zip file type', () => {
        const file = new File([''], 'photo.zip', { type: 'application/zip' });
        expect(validateFile(file)).toBe('Only .jpg, .png, and .webp files are allowed.');
    })
});


describe('validateFile positive type tests', () => {
    it('should return null for jpg file type', () => {
        const file = new File([''], 'photo.jpg', { type: 'image/jpeg' });
        expect(validateFile(file)).toBe(null);
    })

    it('should return null for JPG file type with capitalized file extension', () => {
        const file = new File([''], 'photo.JPG', { type: 'image/jpeg' });
        expect(validateFile(file)).toBe(null);
    })

    it('should return null for png file type', () => {
        const file = new File([''], 'photo.png', { type: 'image/png' });
        expect(validateFile(file)).toBe(null);
    })

    it('should return null for webp file type', () => {
        const file = new File([''], 'photo.webp', { type: 'image/webp' });
        expect(validateFile(file)).toBe(null);
    })
});

describe('validateFile size tests', () => {

    it('should return error for file size greater than 5MB', () => {
        const mockFile = new File([''], 'large-image.png', { type: 'image/png' });

        Object.defineProperty(mockFile, 'size', {
            value: 5 * 1024 * 1025, // 5MB + 1 byte
            configurable: true
        });

        expect(validateFile(mockFile)).toBe('File too large. Maximum size is 5MB.');
    });

    it('should return null for file size exactly 5MB', () => {
        const mockFile = new File([''], 'large-image.png', { type: 'image/png' });

        Object.defineProperty(mockFile, 'size', {
            value: 5 * 1024 * 1024, // 5MB
            configurable: true
        });

        expect(validateFile(mockFile)).toBe(null);
    });
});
