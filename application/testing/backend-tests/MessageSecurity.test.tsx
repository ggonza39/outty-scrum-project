import { describe, it, expect, beforeAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = 'https://qcdndflbeqowwqdlmteq.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZG5kZmxiZXFvd3dxZGxtdGVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjg4NDMxMSwiZXhwIjoyMDg4NDYwMzExfQ.XdV4YKYZKF38Rq9gV3ozdZESNiZOYyTRt1Bkq3bZQkQ';

let client: ReturnType<typeof createClient>
// Helper to create a signed-in client
const createAuthedClient = async (email: string, password: string) => {
    client = createClient(SUPABASE_URL, ANON_KEY);

    const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;

    return { client, user: data.user, data };
};


describe("verifies conversation object does not return sensitive info", () => {
    let userA: any;
    let clientA: any;
    let userData: any;

    beforeAll(async () => {
        const resA = await createAuthedClient(
            "adventurer10@example.com",
            "Password1"
        );
        userA = resA.user;
        clientA = resA.client;
        userData = resA.data;

    });

    it("verifies conversation object does not return email", async () => {
        const { data, error } = await clientA.from("conversations").select().eq('id', "0cb51bbe-7347-4593-9e6a-f7318bf32424").maybeSingle();

        expect(data).toBeTruthy();
        //console.log(data);

        await expect("email" in data, data).toBe(false);
    });

    it("verifies conversation object does not return password hash", async () => {
        const { data, error } = await clientA.from("conversations").select().eq('id', "0cb51bbe-7347-4593-9e6a-f7318bf32424").maybeSingle();

        expect(data).toBeTruthy();
        //console.log(data);

        await expect("password_hash" in data, data).toBe(false);
    });

    it("verifies conversation object does not return adddress", async () => {
        const { data, error } = await clientA.from("conversations").select().eq('id', "0cb51bbe-7347-4593-9e6a-f7318bf32424").maybeSingle();

        expect(data).toBeTruthy();
        //console.log(data);

        await expect("street_address" in data, data).toBe(false);
    });

    it("verifies conversation object does not return phone number", async () => {
        const { data, error } = await clientA.from("conversations").select().eq('id', "0cb51bbe-7347-4593-9e6a-f7318bf32424").maybeSingle();

        expect(data).toBeTruthy();
        //console.log(data);

        await expect("phone_number" in data, data).toBe(false);
    });
});




describe("User not in conversation tests", () => {
    let userA: any;
    let clientA: any;
    let userData: any;

    it("prevents user from getting conversation database row of a conversation they are not a part of.", async () => {

        const resA = await createAuthedClient(
            "test2@test.com",
            "Password1"
        );
        userA = resA.user;
        clientA = resA.client;
        userData = resA.data;

        const { data, error } = await clientA.from("conversations").select('*').eq('id', "0cb51bbe-7347-4593-9e6a-f7318bf32424").maybeSingle();

        //expect(userA.id).toBeTruthy();

        //  Expect failure due to RLS/storage policy
        if (error) {
            // Acceptable outcome: access blocked explicitly
            expect(error).toBeTruthy()
        } else {
            // Acceptable outcome: row is invisible
            expect(data).toBeNull()
        }
    });

    it("prevents user from getting message history of a conversation they are not a part of.", async () => {

        const resA = await createAuthedClient(
            "test2@test.com",
            "Password1"
        );
        userA = resA.user;
        clientA = resA.client;
        userData = resA.data;

        const { data, error } = await clientA.from("messages").select('*').eq('conversation_id', "0cb51bbe-7347-4593-9e6a-f7318bf32424");

        //expect(userA.id).toBeTruthy();

        //  Expect failure due to RLS/storage policy
        if (error) {
            // Acceptable outcome: access blocked explicitly
            expect(error).toBeTruthy()
        } else {
            // Acceptable outcome: row is invisible
            expect(data[0]).not.toBeTruthy() // either empty array or null depending on your policy
        }
    });

    it("prevents user from inserting a message into the conversation they are not a part of.", async () => {

        const randomString = Math.random().toString(36).substring(2, 12); // Generates a random 10-character string

        const resA = await createAuthedClient(
            "test2@test.com",
            "Password1"
        );
        userA = resA.user;
        clientA = resA.client;
        userData = resA.data;

        const { error } = await clientA.from("messages").insert({
            //id: randomString,
            conversation_id: "0cb51bbe-7347-4593-9e6a-f7318bf32424",
            sender_id: "2d74f07c-1e41-4b76-8fc5-555ae64f4344",
            content: "This message should not be inserted.",
            recipient_id: "92e6030d-9223-4682-8372-6921782ee79c",
        });

        //  Expect failure due to RLS/storage policy
        expect(error).toBeTruthy();
        console.log(error);

        // Optional: assert specific error message (depends on your policy)
        //expect(error?.message.toLowerCase()).toMatch(/new row violates row-level security policy/);
    });

    describe("Message get tests", () => {
        it("returns messages in chronological order", async () => {

            const resA = await createAuthedClient(
                "adventurer10@example.com",
                "Password1"
            );
            userA = resA.user;
            clientA = resA.client;
            userData = resA.data;

            const { data, error } = await clientA.from("messages").select('*').eq('conversation_id', "0cb51bbe-7347-4593-9e6a-f7318bf32424");

            for (let i = 1; i < data.length; i++) {
                const prevTimestamp = new Date(data[i - 1].created_at).getTime();
                const currTimestamp = new Date(data[i].created_at).getTime();
                expect(currTimestamp).toBeGreaterThanOrEqual(prevTimestamp);
            }
           
        });
    });
});