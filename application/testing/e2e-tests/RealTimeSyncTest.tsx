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

test('Does not send null message', async ({ page }) => {
    //Given: I am authenticated and have an active Chat Window open with "User B".

    await page.goto('./signin');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('adventurer32@example.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1');
    await page.getByRole('button', { name: 'SIGN IN' }).click();
    await page.waitForURL('./discover');
    await page.waitForLoadState('networkidle')
    await page.getByRole('heading', { name: 'Discover' }).click();
    await page.goto('./message/0cb51bbe-7347-4593-9e6a-f7318bf32424');
    await page.getByRole('textbox', { name: 'Input here........' }).click();
    await page.getByRole('textbox', { name: 'Input here........' }).fill('');
    await page.getByRole('button', { name: 'Send message' }).click();

    const { data, error } = await supabase.from("messages").select('*').eq('conversation_id', "0cb51bbe-7347-4593-9e6a-f7318bf32424").order('created_at', { ascending: true })

    await expect(data[data.length - 1].content).toBeTruthy();
});

test('Does send message under 2001 characters', async ({ page }) => {
    //Given: I am authenticated and have an active Chat Window open with "User B".

    const string: string = generateRandomString(2000);

    await page.goto('./signin');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('adventurer32@example.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1');
    await page.getByRole('button', { name: 'SIGN IN' }).click();
    await page.waitForURL('./discover');
    await page.waitForLoadState('networkidle')
    await page.getByRole('heading', { name: 'Discover' }).click();
    await page.goto('./message/0cb51bbe-7347-4593-9e6a-f7318bf32424');
    await page.getByRole('textbox', { name: 'Input here........' }).click();
    await page.getByRole('textbox', { name: 'Input here........' }).fill(string);
    await page.getByRole('button', { name: 'Send message' }).click();
    await page.getByText(string).click();

    const { data, error } = await supabase.from("messages").select('*').eq('conversation_id', "0cb51bbe-7347-4593-9e6a-f7318bf32424").order('created_at', { ascending: true })

    await expect(data[data.length - 1].content).toEqual(string);
});

test('Does not send message over 2000 characters', async ({ page }) => {
    //Given: I am authenticated and have an active Chat Window open with "User B".

    const string: string = generateRandomString(2001);

    await page.goto('./signin');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('adventurer32@example.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1');
    await page.getByRole('button', { name: 'SIGN IN' }).click();
    await page.waitForURL('./discover');
    await page.waitForLoadState('networkidle')
    await page.getByRole('heading', { name: 'Discover' }).click();
    await page.goto('./message/0cb51bbe-7347-4593-9e6a-f7318bf32424');
    await page.getByRole('textbox', { name: 'Input here........' }).click();
    await page.getByRole('textbox', { name: 'Input here........' }).fill(string);
    await page.getByRole('button', { name: 'Send message' }).click();
    await page.getByText(string.slice(0, 2000)).click();

    const { data, error } = await supabase.from("messages").select('*').eq('conversation_id', "0cb51bbe-7347-4593-9e6a-f7318bf32424").order('created_at', { ascending: true })

    await expect(data[data.length - 1].content).toEqual(string.slice(0, 2000));
});

test('Does not send HTML tags', async ({ page }) => {
    //Given: I am authenticated and have an active Chat Window open with "User B".

    const randstring: string = generateRandomString(10);
    const string = "<" + randstring + ">";

    await page.goto('./signin');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('adventurer32@example.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1');
    await page.getByRole('button', { name: 'SIGN IN' }).click();
    await page.waitForURL('./discover');
    await page.waitForLoadState('networkidle')
    await page.getByRole('heading', { name: 'Discover' }).click();
    await page.goto('./message/0cb51bbe-7347-4593-9e6a-f7318bf32424');
    await page.getByRole('textbox', { name: 'Input here........' }).click();
    await page.getByRole('textbox', { name: 'Input here........' }).fill(string);
    await page.getByRole('button', { name: 'Send message' }).click();
    await page.getByText(randstring).click();

    const { data, error } = await supabase.from("messages").select('*').eq('conversation_id', "0cb51bbe-7347-4593-9e6a-f7318bf32424").order('created_at', { ascending: true })

    await expect(data[data.length - 1].content).toEqual(randstring);
});

test('Renders new conversation properly', async ({ page }) => {
    //Given: I am authenticated and have an active Chat Window open with "User B".

    await page.goto('./signin');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('adventurer32@example.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1');
    await page.getByRole('button', { name: 'SIGN IN' }).click();
    await page.waitForURL('./discover');
    await page.waitForLoadState('networkidle')
    await page.getByRole('heading', { name: 'Discover' }).click();
    await page.goto('./message/conv-5');

    await page.getByText('No messages yet.').click();

});

test.describe('Conversation presence — online / offline status', () => {
    test(
        'both sides show Online when both are open; status changes to Offline when one side closes',
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

                // ----------------------------------------------------------------
                // Step 3: Verify both sides show "Online".
                // ----------------------------------------------------------------

                await expect(statusLocator(pageA)).toHaveText('Online', {
                    timeout: 10_000,
                })

                await expect(statusLocator(pageB)).toHaveText('Online', {
                    timeout: 10_000,
                })

                // ----------------------------------------------------------------
                // Step 4: Close one side (pageB / adventurer33).
                // ----------------------------------------------------------------

                await contextB.close()

                // ----------------------------------------------------------------
                // Step 5: Allow presence to propagate the departure.
                //
                // Supabase Presence emits an "leave" event when a channel
                // subscriber disconnects. 5 s gives the WebSocket time to
                // detect the drop and fire the sync callback on pageA.
                // ----------------------------------------------------------------
                await pageA.waitForTimeout(5_000)

                // ----------------------------------------------------------------
                // Step 6: Verify pageA now shows "Offline".
                // ----------------------------------------------------------------

                await expect(statusLocator(pageA)).toHaveText('Offline', {
                    timeout: 10_000,
                })
            } finally {
                // Always clean up — contextB may already be closed above.
                await pageA.close().catch(() => { })
                await contextA.close().catch(() => { })
                await contextB.close().catch(() => { })
            }
        }
    )
})

test.describe('Conversation read receipts', () => {
    test(
        'message shows "Sent" when recipient is offline, then updates to "Read" in real-time when recipient opens the conversation',
        async ({ browser }) => {
            const contextA: BrowserContext = await browser.newContext()
            const contextB: BrowserContext = await browser.newContext()

            const pageA: Page = await contextA.newPage()
            const pageB: Page = await contextB.newPage()

            try {
                // ----------------------------------------------------------------
                // Step 1: Sign in adventurer32 (sender) and open the conversation.
                // adventurer10 (recipient) stays offline for now.
                // ----------------------------------------------------------------

                await signInAndOpenConversation(pageA, USERS.adventurer32)

                // ----------------------------------------------------------------
                // Step 2: Send a uniquely identifiable message while the
                // recipient is offline so we can track this exact bubble.
                // ----------------------------------------------------------------

                const testMessage = `Read receipt test — ${Date.now()}`

                const input = pageA.locator('input[type="text"]')
                await input.fill(testMessage)
                await pageA.getByRole('button', { name: 'Send message' }).click()

                // ----------------------------------------------------------------
                // Step 3: Confirm the message shows "Sent" immediately after
                // sending (recipient is not yet online to trigger a read event).
                // ----------------------------------------------------------------

                await expect(lastOutgoingStatusLocator(pageA)).toHaveText('Sent', {
                    timeout: 10_000,
                })

                // ----------------------------------------------------------------
                // Step 4: Sign in adventurer10 (recipient) and open the same
                // conversation. The component calls markConversationAsRead()
                // on load, which triggers the Supabase RPC that flips is_read
                // and broadcasts the update via the realtime channel.
                // ----------------------------------------------------------------

                await signInAndOpenConversation(pageB, USERS.adventurer10)

                // ----------------------------------------------------------------
                // Step 5: Confirm the sent message is visible in pageB so we
                // know the recipient actually loaded the right conversation.
                // ----------------------------------------------------------------

                await expect(pageB.getByText(testMessage)).toBeVisible({
                    timeout: 10_000,
                })

                // ----------------------------------------------------------------
                // Step 6: Verify that pageA's status label updates to "Read"
                // in real-time now that adventurer10 has opened the conversation.
                //
                // The component subscribes to INSERT events on the messages
                // channel and re-checks is_read; markConversationAsRead() on
                // pageB fires the RPC which updates the row, and the realtime
                // subscription on pageA picks up the change.
                // ----------------------------------------------------------------

                await expect(lastOutgoingStatusLocator(pageA)).toHaveText('Read', {
                    timeout: 15_000,
                })
            } finally {
                await pageA.close().catch(() => { })
                await pageB.close().catch(() => { })
                await contextA.close().catch(() => { })
                await contextB.close().catch(() => { })
            }
        }
    )
})