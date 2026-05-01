import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// to record, run npx playwright codegen https://outty-scrum-project.vercel.app

test('Successful deep linking BDD', async ({ page }) => {
    //Performance: The page settles into a "Ready" state within the acceptable performance threshold after the skeleton loader clears.
    test.setTimeout(10000); // Set a timeout of 10 seconds for this test

    //GIVEN: A user is logged in and possesses a direct URL to an adventurer’s profile.
    const validProfileLink = './discover/2';
    await page.goto('./signin');
    //await page.getByRole('link', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1');
    await page.getByRole('button', { name: 'SIGN IN' }).click();
    await page.waitForURL('./discover');
    //await expect(page.getByText('Discover').first()).toBeVisible();
    await page.getByRole('link', { name: 'Home' }).click();
    await page.waitForURL('./');

    //WHEN: They navigate directly to that URL in their browser.
    await page.goto(validProfileLink)
    await page.waitForURL(validProfileLink);

    //THEN: The page correctly fetches the data and renders the unique name, age, bio, and adventure tags for that specific explorer.
    //await expect(page.getByRole('heading', { name: 'Jordan,' })).toBeVisible({ timeout: 20_000 });
    //await expect(page.locator('.pill').filter({ hasText: 'Camping' })).toBeVisible();
    //await expect(page.locator('.pill').filter({ hasText: 'Hiking' })).toBeVisible();
    await expect(page.getByText('Designer, traveler, and dog')).toBeVisible();
});

test('Invalid profile and return to discovery BDD', async ({ page }) => {
    //Performance: The page settles into a "Ready" state within the acceptable performance threshold after the skeleton loader clears.
    test.setTimeout(10000); // Set a timeout of 10 seconds for this test
    //test.slow();

    //GIVEN: A user is logged in and possesses a direct URL to an adventurer’s profile that does not exist.
    const invalidProfileLink = './discover/invalid_profile';
    await page.goto('./signin');
    //await page.getByRole('link', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1');
    await page.getByRole('button', { name: 'SIGN IN' }).click();
    await page.waitForURL('./discover');
    //await expect(page.getByText('Discover').first()).toBeVisible();
    await page.getByRole('link', { name: 'Home' }).click();
    await page.waitForURL('./');

    //WHEN: They navigate directly to that URL in their browser.
    await page.goto(invalidProfileLink);
    await page.waitForURL(invalidProfileLink);

    //THEN: The page correctly shows a "Profile not found" message and a button that links back to the "Discover" page.
    await expect(page.getByText('Profile not found')).toBeVisible();
    await page.getByRole('button', { name: 'Back to Discover' }).click();
    await page.waitForURL('./discover');

});
