 import { describe, it, expect, beforeAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = 'https://qcdndflbeqowwqdlmteq.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZG5kZmxiZXFvd3dxZGxtdGVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjg4NDMxMSwiZXhwIjoyMDg4NDYwMzExfQ.XdV4YKYZKF38Rq9gV3ozdZESNiZOYyTRt1Bkq3bZQkQ';

// Helper to create a signed-in client
const createAuthedClient = async (email: string, password: string) => {
    const client = createClient(SUPABASE_URL, ANON_KEY);

    // sign up (ignore error if already exists)
    await client.auth.signUp({ email, password });

    const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;

    return { client, user: data.user };
};

describe("Storage RLS - cross user upload protection", () => {
    let userA: any;
    let userB: any;
    let clientB: any;

    beforeAll(async () => {
        const resA = await createAuthedClient(
            "user-a@test.com",
            "password123"
        );
        userA = resA.user;

        const resB = await createAuthedClient(
            "user-b@test.com",
            "password123"
        );
        userB = resB.user;
        clientB = resB.client;
    });

    it("prevents user B from uploading into user A's folder", async () => {
        const file = new Blob(["malicious"], { type: "image/jpeg" });

        //  Attempt to upload into userA's directory
        const filePath = `${userA.id}/hacked.jpg`;

        const { error } = await clientB.storage
            .from("profile-galleries")
            .upload(filePath, file);

        //  Expect failure due to RLS/storage policy
        expect(error).toBeTruthy();

        // Optional: assert specific error message (depends on your policy)
        expect(error?.message.toLowerCase()).toMatch(/new row violates row-level security policy/);
    });
});