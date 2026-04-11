import { test, expect, errors } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// to record, run npx playwright codegen https://outty-scrum-project.vercel.app

const supabase = createClient(
    'https://qcdndflbeqowwqdlmteq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZG5kZmxiZXFvd3dxZGxtdGVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjg4NDMxMSwiZXhwIjoyMDg4NDYwMzExfQ.XdV4YKYZKF38Rq9gV3ozdZESNiZOYyTRt1Bkq3bZQkQ'
);

test('Successful dashboard access BDD', async ({ page }) => {

    //GIVEN: User is successfully logged into the Outty platform
    const validProfileLink = './discover/2';
    await page.goto('./signin');
    //await page.getByRole('link', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1');
    await page.getByRole('button', { name: 'SIGN IN' }).click();
    await page.waitForURL('./discover');

    //WHEN: User clicks on the "My Profile" link in the main navigation bar
    await page.getByRole('button', { name: 'Toggle menu' }).click();
    await page.getByRole('link', { name: 'Profile', exact: true }).click();
    await page.waitForURL('./profile');

    //THEN: The page displays the user's profile information. The data matches what is stored in the database for that user, including their name, age, bio, and adventure tags.
        //Pull user data from Supabase to compare against the rendered profile information on the dashboard
    const { data, error } = await supabase.from('profiles').select().eq('display_name', 'Test User');

    await expect(page.getByRole('heading', { name: data[0].display_name + ', ' + data[0].age })).toBeVisible();
    await expect(page.getByText(data[0].bio)).toBeVisible();
    await expect(page.getByText('ZIP Code: ' + data[0].zip_code)).toBeVisible();
    await expect(page.getByText('Gender: ' + data[0].gender)).toBeVisible();
    await expect(page.getByText('Looking For: ' + data[0].partner_preference)).toBeVisible();
    await expect(page.getByText('Skill Level: ' + data[0].skill_level)).toBeVisible();
    await expect(page.getByText('Distance: ' + data[0].distance)).toBeVisible();
    await expect(page.getByText(data[0].interests.join(', '))).toBeVisible();

    //VERIFICATION: The view is confirmed to be "Read-Only"(Form fields are not visible until "Edit" is toggled)
    try {
        // Attempt to click an element with a 2-second timeout
        await page.getByRole('textbox', { name: 'Display Name' }).click({ timeout: 2000 });

        // If it succeeds, the test should fail because we expected a timeout
        test.fail(true, 'Expected click to time out, but it succeeded.');
    } catch (error) {
        // Verify that the error is specifically a TimeoutError
        if (error instanceof errors.TimeoutError) {
            console.log('Successfully caught expected timeout!');
        } else {
            throw error; // Rethrow if it's a different kind of error
        }
    }

    await page.getByRole('button', { name: 'Edit Profile' }).click();
    await page.getByRole('textbox', { name: 'Display Name' }).click();
});