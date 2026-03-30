import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// to record, run npx playwright codegen https://outty-scrum-project.vercel.app

const supabase = createClient(
    'https://qcdndflbeqowwqdlmteq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZG5kZmxiZXFvd3dxZGxtdGVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjg4NDMxMSwiZXhwIjoyMDg4NDYwMzExfQ.XdV4YKYZKF38Rq9gV3ozdZESNiZOYyTRt1Bkq3bZQkQ'
);

test('Signup creates profile in supabase table', async ({ page }) => {

    const randomString = Math.random().toString(36).substring(2, 12); // Generates a random 10-character string
    const email = `${randomString}@${'gmail.com'}`

    await page.goto('https://outty-scrum-project.vercel.app/');
    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.goto('https://outty-scrum-project.vercel.app/');
    await page.getByRole('link', { name: 'Create account' }).click();
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill(randomString);
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password', exact: true }).click();
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Password1');
    await page.getByRole('textbox', { name: 'Confirm Password' }).click();
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Password1');
    await page.getByRole('button', { name: 'SIGN UP' }).click();

    await expect(page).toHaveURL('https://outty-scrum-project.vercel.app/profile-setup');

    // 2. Use the Supabase client to check the database directly
    const { data, error } = await supabase.from('profiles').select().eq('display_name', randomString);

    // 3. Make assertions using Playwright's expect
    expect(error).toBeNull();
    expect(data?.length).toBe(1);
    expect(data[0].display_name).toBe(randomString);

    // Cleanup: Delete the user using the admin client
    await supabase.auth.admin.deleteUser(data[0].id);

});

test('Long password rejects registration', async ({ page }) => {

    const randomString = Math.random().toString(36).substring(2, 12); // Generates a random 10-character string
    const email = `${randomString}@${'gmail.com'}`

    await page.goto('https://outty-scrum-project.vercel.app/');
    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.goto('https://outty-scrum-project.vercel.app/');
    await page.getByRole('link', { name: 'Create account' }).click();
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill(randomString);
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password', exact: true }).click();
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('0123456789012345678901234567890123456789012345678901234567890123456789Abcd');
    await page.getByRole('textbox', { name: 'Confirm Password' }).click();
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('0123456789012345678901234567890123456789012345678901234567890123456789Abcd');
    await page.getByRole('button', { name: 'SIGN UP' }).click();

    await expect(page.getByText('Password must be less than 73 characters long.')).toBeVisible();

});

test('Used Email rejects registration', async ({ page }) => {


    await page.goto('https://outty-scrum-project.vercel.app/');
    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.goto('https://outty-scrum-project.vercel.app/');
    await page.getByRole('link', { name: 'Create account' }).click();
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('asdf');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
    await page.getByRole('textbox', { name: 'Password', exact: true }).click();
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('7890123456789Abcd');
    await page.getByRole('textbox', { name: 'Confirm Password' }).click();
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('7890123456789Abcd');
    await page.getByRole('button', { name: 'SIGN UP' }).click();

    await expect(page.getByText('An account with this email already exists.')).toBeVisible();

});
