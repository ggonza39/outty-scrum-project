
import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// to record, run npx playwright codegen https://outty-scrum-project.vercel.app

test('Real-time sync and status BDD', async ({ page }) => {
    //Given: I am authenticated and have an active Chat Window open with "User B".
    const validProfileLink = './discover/1';
    await page.goto('./signin');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1');
    await page.getByRole('button', { name: 'SIGN IN' }).click();
    await page.waitForURL('./discover');
    await page.goto(validProfileLink)

    //When: "User B" sends a message while my tab is focused and the window is open.

    //Then: The message appears in my UI instantly via the Supabase Realtime listener without a page refresh.

    //Then: My global "Unread" navigation badge does not increment (as the message was read immediately).

    //Then: The message status for "User B" updates to show a "Read" receipt in their interface.



});