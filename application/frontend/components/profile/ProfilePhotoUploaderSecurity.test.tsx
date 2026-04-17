import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { vi, expect, describe, it } from "vitest";
import ProfilePhotoUploader from "./ProfilePhotoUploader";

const uploadMock = vi.fn().mockResolvedValue({ error: null });
//const rpcMock = vi.fn().mockResolvedValue({ error: null });
const insertMock = vi.fn();

vi.mock("@/lib/supabase", () => {
    return {
        supabase: {
            auth: {
                // Logged in as user-b
                getUser: vi.fn().mockResolvedValue({
                    data: { user: { id: "user-b" } },
                    error: null,
                }),
            },
            storage: {
                from: vi.fn(() => ({
                    upload: uploadMock,
                    getPublicUrl: vi.fn(() => ({
                        data: { publicUrl: "https://example.com/photo.jpg" },
                    })),
                })),
            },
            from: vi.fn(() => ({
                insert: (...args: any[]) => {
                    insertMock(...args);
                    return {
                        select: () => ({
                            single: () =>
                                Promise.resolve({
                                    data: { id: 99 },
                                    error: null,
                                }),
                        }),
                    };
                },
            })),
            rpc: vi.fn().mockResolvedValue({ error: null }),
        },
    };
});

describe("ProfilePhotoUploader - cross user safety", () => {
    it("does not allow uploading a photo to another user's account", async () => {
        const updateField = vi.fn();

        render(
            <ProfilePhotoUploader
                mainPhoto={null}
                updateField={updateField}
            />
        );

        const input = screen.getByLabelText("+") || document.querySelector('input[type="file"]')!;

        const file = new File(["malicious"], "hack.jpg", {
            type: "image/jpeg",
        });

        fireEvent.change(input, {
            target: { files: [file] },
        });

        await waitFor(() => {
            expect(uploadMock).toHaveBeenCalled();
        });

        //  Ensure storage path uses user-b (NOT user-a)
        const uploadArgs = uploadMock.mock.calls[0];
        const uploadedPath = uploadArgs[0];

        expect(uploadedPath.startsWith("user-b/")).toBe(true);
        expect(uploadedPath.includes("user-a")).toBe(false);

        //  Ensure DB insert uses user-b
        expect(insertMock).toHaveBeenCalledWith(
            expect.objectContaining({
                profile_id: "user-b",
            })
        );

        //  Ensure RPC also uses user-b
        const { supabase } = await import("@/lib/supabase");

        expect(supabase.rpc).toHaveBeenCalledWith("set_primary_photo", {
            target_photo_id: 99,
            target_profile_id: "user-b",
        });
    });
});