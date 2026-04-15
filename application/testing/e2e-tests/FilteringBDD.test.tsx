import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// to record, run npx playwright codegen https://outty-scrum-project.vercel.app

test('Cross-category Filtering BDD, Results Header', async ({ page }) => {
    //Given: A user is on the Discovery Feed
    await page.goto('./signin');
    //await page.getByRole('link', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1');
    await page.getByRole('button', { name: 'SIGN IN' }).click();
    await page.waitForURL('./discover');

    //When: User selects "Activity: Hiking," "Gender: Female," and "State: Colorado".
    await page.getByRole('button', { name: 'Discovery Filtering' }).click();
    await page.getByRole('button', { name: 'Female' }).click();
    await page.getByRole('button', { name: 'Hiking' }).click();
    await page.getByRole('textbox', { name: 'Enter city' }).click();
    await page.getByRole('textbox', { name: 'Enter city' }).fill('Denver');
    await page.getByRole('button', { name: 'Denver, CO' }).click();
    await page.getByRole('button', { name: 'Apply Filters' }).click();

    //Verification: Manual walkthrough confirms the "Results Header" text matches the displayed profile cards
    await expect(page.getByText(/Showing .* match for Hiking, ages 18-65, Female, within 25 miles, Denver, CO./)).toBeVisible();
});