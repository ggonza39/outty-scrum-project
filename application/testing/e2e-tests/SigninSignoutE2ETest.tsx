import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { ProfileFormData } from '../../frontend/components/profile/ProfileSetupShell';

// to record, run the following: npx playwright codegen https://outty-scrum-project.vercel.app/signin


test('Login and logout creates correct cookies. Logout displays correct message.', async ({ page, context }) => {
    await page.goto('https://outty-scrum-project.vercel.app/signin');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1');
    await page.getByRole('button', { name: 'SIGN IN' }).click();

    await page.waitForURL('https://outty-scrum-project.vercel.app/discover');

    //  2. Verify session cookie exists
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name.includes('sb-'));

    expect(sessionCookie).toBeTruthy();
    expect(sessionCookie?.value).not.toBe('');
;
    //  4. (Stronger) Verify authenticated API call works
    const response = await page.request.get('https://your-app.com/api/me');
    expect(response.status()).toBe(200);

    let dialogAppeared = false;

    page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toContain('logged out');
        dialogAppeared = true;
        await dialog.accept(); // or dialog.dismiss()
    });

    await page.getByRole('link', { name: 'Home' }).click();
    await page.getByRole('button', { name: 'Toggle menu' }).click();

    await page.getByRole('button', { name: 'Log out' }).click();

    //expect(dialogMessage).toBe('You have successfully logged out.');

    await page.waitForURL('https://outty-scrum-project.vercel.app/signin');

    expect(dialogAppeared).toBe(true);

    //  2. Verify session cookie exists
    const newCookies = await context.cookies();
    const newSessionCookie = newCookies.find(c => c.name.includes('sb-'));

    // Either fully removed OR empty/expired
    expect(newSessionCookie === undefined || newSessionCookie.value === '').toBeTruthy();

    // 4. Verify aredirect if match page access attempted
    const newResponse = await page.request.get('https://outty-scrum-project.vercel.app/match');
    await page.waitForURL('https://outty-scrum-project.vercel.app/signin');

});

test('Login blocked if password incorrect.', async ({ page, context }) => {
    await page.goto('https://outty-scrum-project.vercel.app/signin');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('12435678');
    await page.getByRole('button', { name: 'SIGN IN' }).click();

    await expect(page.getByText('Invalid email or password. Please try again.')).toBeVisible();

});

test('Login blocked if account doesnt exist.', async ({ page, context }) => {
    await page.goto('https://outty-scrum-project.vercel.app/signin');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('DONOTUSE@test.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1');
    await page.getByRole('button', { name: 'SIGN IN' }).click();

    await expect(page.getByText('Invalid email or password. Please try again.')).toBeVisible();

});