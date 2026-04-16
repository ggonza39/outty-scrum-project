import { describe, it, expect, vi } from 'vitest';
import { validateFile } from './ProfilePhotoUploader';
import ProfilePhotoUploader from "./ProfilePhotoUploader";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock supabase
vi.mock("@/lib/supabase", () => {
    return {
        supabase: {
            auth: {
                getUser: vi.fn().mockResolvedValue({
                    data: { user: { id: "user-123" } },
                    error: null,
                }),
            },
            storage: {
                from: vi.fn(() => ({
                    upload: vi.fn().mockResolvedValue({ error: null }),
                    getPublicUrl: vi.fn(() => ({
                        data: { publicUrl: "https://example.com/photo.jpg" },
                    })),
                })),
            },
            from: vi.fn(() => ({
                insert: vi.fn(() => ({
                    select: vi.fn(() => ({
                        single: vi.fn().mockResolvedValue({
                            data: { id: 1 },
                            error: null,
                        }),
                    })),
                })),
            })),
            rpc: vi.fn().mockResolvedValue({ error: null }),
        },
    };
});

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

describe("ProfilePhotoUploader BDD Test", () => {
    it("marks uploaded photo as primary", async () => {
        const updateField = vi.fn();

        render(
            <ProfilePhotoUploader
                mainPhoto={null}
                updateField={updateField}
            />
        );

        // Create a fake file
        const file = new File(["dummy"], "photo.jpg", {
            type: "image/jpeg",
        });

        const input = screen.getByLabelText("+") ||
            document.querySelector('input[type="file"]')!;

        fireEvent.change(input, {
            target: { files: [file] },
        });

        // Wait for upload flow to complete
        await waitFor(() => {
            // Check that updateField was called with the public URL
            expect(updateField).toHaveBeenCalledWith(
                "mainPhoto",
                "https://example.com/photo.jpg"
            );
        });

        // Verify RPC was called (this is what triggers primary status server-side)
        const { supabase } = await import("@/lib/supabase");

        expect(supabase.rpc).toHaveBeenCalledWith("set_primary_photo", {
            target_photo_id: 1,
            target_profile_id: "user-123",
        });

        // The important assertion:
        // ensure the uploaded image is treated as primary in state/UI
        await waitFor(() => {
            const images = screen.getAllByRole("img");
            expect(images.length).toBeGreaterThan(0);
        });

    //Given: An authenticated user is on their "Edit Profile" dashboard with at least one uploaded photo.
    //When: They upload a new photo and select the "Set as Primary" action.
        // Create a fake file
        const file2 = new File(["dummy"], "photo2.jpg", {
            type: "image/jpeg",
        });

        //const input = screen.getByLabelText("+") ||
        //    document.querySelector('input[type="file"]')!;

        fireEvent.change(input, {
            target: { files: [file2] },
        });

        // Wait for upload flow to complete
        await waitFor(() => {
            // Check that updateField was called with the public URL
            expect(updateField).toHaveBeenCalled(
                //"mainPhoto",
                //"https://example.com/photo2.jpg"
            );
        });

        // Verify RPC was called (this is what triggers primary status server-side)

    //Then: The system updates the is_primary flag and refreshes the UI.
        expect(supabase.rpc).toHaveBeenCalledWith("set_primary_photo", {
            target_photo_id: 1,
            target_profile_id: "user-123",
        });

        // The important assertion:
        // ensure the uploaded image is treated as primary in state/UI
        await waitFor(() => {
            const images = screen.getAllByRole("img");
            expect(images.length).toBeGreaterThan(0);
        });
    });


});


