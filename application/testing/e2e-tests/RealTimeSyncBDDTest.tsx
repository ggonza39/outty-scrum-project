
import { test, expect, Browser, Page, BrowserContext } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// to record, run npx playwright codegen https://outty-scrum-project.vercel.app

const SUPABASE_URL = 'https://qcdndflbeqowwqdlmteq.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZG5kZmxiZXFvd3dxZGxtdGVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjg4NDMxMSwiZXhwIjoyMDg4NDYwMzExfQ.XdV4YKYZKF38Rq9gV3ozdZESNiZOYyTRt1Bkq3bZQkQ';

const supabase = createClient(
    'https://qcdndflbeqowwqdlmteq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZG5kZmxiZXFvd3dxZGxtdGVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjg4NDMxMSwiZXhwIjoyMDg4NDYwMzExfQ.XdV4YKYZKF38Rq9gV3ozdZESNiZOYyTRt1Bkq3bZQkQ'
);

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

function generateRandomString(length: number): string {
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result: string = '';
    const charactersLength: number = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

function lastOutgoingStatusLocator(page: Page) {
    // The component renders "Sent" or "Read" in a right-aligned div beneath
    // every outgoing bubble. `last()` targets the newest one.
    return page.locator('div[style*="text-align: right"]', {
        hasText: /^(Sent|Read)$/,
    }).last()
}

const CONVERSATION_URL = './message/0cb51bbe-7347-4593-9e6a-f7318bf32424'

const USERS = {
    adventurer32: {
        email: 'adventurer32@example.com',
        password: 'Password1',
    },
    adventurer10: {
        email: 'adventurer10@example.com',
        password: 'Password1',
    },
} as const

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Signs in as the given user in the provided page and navigates directly to
 * the shared conversation, then waits for the chat UI to be ready.
 */
async function signInAndOpenConversation(
    page: Page,
    user: { email: string; password: string }
) {
    await page.goto('./signin')

    await page.getByRole('textbox', { name: 'Email' }).click()
    await page.getByRole('textbox', { name: 'Email' }).fill(user.email)

    await page.getByRole('textbox', { name: 'Password' }).click()
    await page.getByRole('textbox', { name: 'Password' }).fill(user.password)

    await page.getByRole('button', { name: 'SIGN IN' }).click()

    await page.waitForURL('./discover')
    await page.waitForLoadState('networkidle')

    // Confirm we landed on the Discover page before navigating to the chat.
    await page.getByRole('heading', { name: 'Discover' }).click()

    await page.goto(CONVERSATION_URL)

    // Wait for the conversation to finish loading — the input should be enabled.
    await page.getByRole('textbox', { name: 'Input here........' }).click();
}

/**
 * Returns the online/offline status text shown in the conversation header
 * for the current page ("Online" or "Offline").
 */
function statusLocator(page: Page) {
    // The status sits in a small div beneath the recipient's display name.
    // It reads "Online" or "Offline" for real conversations.
    return page.locator('text=Online').or(page.locator('text=Offline')).first()
}



test('Real-time sync and status BDD', async ({ page }) => {
//Given: I am authenticated and have an active Chat Window open with "User A".
    async ({ browser }) => {
        // Open two isolated browser contexts so each has its own session cookie.
        const contextA: BrowserContext = await browser.newContext()
        const contextB: BrowserContext = await browser.newContext()

        const pageA: Page = await contextA.newPage()
        const pageB: Page = await contextB.newPage()

        try {
            // ----------------------------------------------------------------
            // Step 1: Sign in both users and open the conversation.
            // ----------------------------------------------------------------

            // Sign in concurrently to keep the test fast.
            await Promise.all([
                signInAndOpenConversation(pageA, USERS.adventurer32),
                signInAndOpenConversation(pageB, USERS.adventurer10),
            ])

            // ----------------------------------------------------------------
            // Step 2: Allow presence channels time to sync.
            //
            // Supabase Presence relies on a WebSocket broadcast — give both
            // sides a moment to track each other after joining.
            // ----------------------------------------------------------------
            await pageA.waitForTimeout(3_000)

//When: "User A" sends a message while my tab is focused and the window is open.
            const testMessage = `Read receipt test — ${Date.now()}`

            const input = pageA.locator('input[type="text"]')
            await input.fill(testMessage)
            await pageA.getByRole('button', { name: 'Send message' }).click()

//Then: The message appears in my UI instantly via the Supabase Realtime listener without a page refresh.
            await expect(pageB.getByText(testMessage)).toBeVisible({
                timeout: 10_000,
            })

//Then: The message status for "User A" updates to show a "Read" receipt in their interface.
            await expect(lastOutgoingStatusLocator(pageA)).toHaveText('Read', {
                timeout: 15_000,
            })

        } finally {
            // Always clean up — contextB may already be closed above.
            await pageA.close().catch(() => { })
            await contextA.close().catch(() => { })
            await contextB.close().catch(() => { })
        }

    }

});


