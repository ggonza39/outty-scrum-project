import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// to record, run npx playwright codegen https://outty-scrum-project.vercel.app

test('First Contact Workflow BDD', async ({ page }) => {
    //Given: I am authenticated and viewing an Explorer's profile with whom I have no existing message history.
    const validProfileLink = './discover/1';
    await page.goto('./signin');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1');
    await page.getByRole('button', { name: 'SIGN IN' }).click();
    await page.waitForURL('./discover');
    await page.goto(validProfileLink)

    //When: I click the "Message" Floating Action Button (FAB) and submit the text: "Hey, let's go hiking!".

    //Then: The system successfully generates a new unique Conversation ID in the database

    //Then: I am automatically redirected to the Chat Window for that specific ID.

    //Then: My message is visible in the window with a "Sent" status indicator.



});