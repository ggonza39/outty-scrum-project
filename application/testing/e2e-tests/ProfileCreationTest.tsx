import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { ProfileFormData } from '../../frontend/components/profile/ProfileSetupShell';

// to record, run the following: npx playwright codegen https://outty-scrum-project.vercel.app

const supabase = createClient(
    'https://qcdndflbeqowwqdlmteq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZG5kZmxiZXFvd3dxZGxtdGVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjg4NDMxMSwiZXhwIjoyMDg4NDYwMzExfQ.XdV4YKYZKF38Rq9gV3ozdZESNiZOYyTRt1Bkq3bZQkQ'
);

const defaultData: ProfileFormData = {
    mainPhoto: null,
    displayName: "",
    age: "30",
    zipCode: "30067",
    bio: "My bio.",
    interests: ["Backpacking", "Ice-Fishing", "Bow-Hunting", "Fishing", "Boating", "Hiking", "Skiing", "Rock-Climbing", "Hang-Gliding", "Kayaking", "Camping", "Mountain-Biking", "Trail-Running", "Snowmobiling", "Wildlife-Photography"],
    partnerPreference: "No Preference",
    skillLevel: "Beginner",
    distance: 25,
    instagram: "asdf",
    tiktok: "asdf",
    facebook: "asdf",
    linkedin: "asdf",
}

test('Profile creation stores preferences in supabase table', async ({ page }) => {

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

    await page.getByRole('textbox', { name: 'Age' }).click();
    await page.getByRole('textbox', { name: 'Age' }).fill(defaultData.age);
    await page.getByRole('textbox', { name: 'ZIP Code' }).click();
    await page.getByRole('textbox', { name: 'ZIP Code' }).fill(defaultData.zipCode);
    await page.getByRole('textbox', { name: 'Gender' }).click();
    await page.getByRole('textbox', { name: 'Gender' }).fill('Male');
    await page.getByRole('textbox', { name: 'Bio' }).click();
    await page.getByRole('textbox', { name: 'Bio' }).fill('My bio.');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Backpacking' }).click();
    await page.getByRole('button', { name: 'Ice-Fishing' }).click();
    await page.getByRole('button', { name: 'Bow-Hunting' }).click();
    await page.getByRole('button', { name: 'Fishing', exact: true }).click();
    await page.getByRole('button', { name: 'Boating' }).click();
    await page.getByRole('button', { name: 'Hiking' }).click();
    await page.getByRole('button', { name: 'Skiing' }).click();
    await page.getByRole('button', { name: 'Rock-Climbing' }).click();
    await page.getByRole('button', { name: 'Hang-Gliding' }).click();
    await page.getByRole('button', { name: 'Kayaking' }).click();
    await page.getByRole('button', { name: 'Camping' }).click();
    await page.getByRole('button', { name: 'Mountain-Biking' }).click();
    await page.getByRole('button', { name: 'Trail-Running' }).click();
    await page.getByRole('button', { name: 'Snowmobiling' }).click();
    await page.getByRole('button', { name: 'Wildlife-Photography' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Beginner' }).click();
    await page.getByRole('button', { name: 'No Preference' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('textbox', { name: 'Instagram' }).click();
    await page.getByRole('textbox', { name: 'Instagram' }).fill(defaultData.instagram);
    await page.getByRole('textbox', { name: 'TikTok' }).click();
    await page.getByRole('textbox', { name: 'TikTok' }).fill(defaultData.tiktok);
    await page.getByRole('textbox', { name: 'Facebook' }).click();
    await page.getByRole('textbox', { name: 'Facebook' }).fill(defaultData.facebook);
    await page.getByRole('textbox', { name: 'LinkedIn' }).click();
    await page.getByRole('textbox', { name: 'LinkedIn' }).fill(defaultData.linkedin);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Save Profile' }).click();

    await expect(page).toHaveURL('https://outty-scrum-project.vercel.app/match');

    // 2. Use the Supabase client to check the database directly
    const { data, error } = await supabase.from('profiles').select().eq('display_name', randomString);

    // 3. Make assertions using Playwright's expect
    expect(error).toBeNull();
    expect(data?.length).toBe(1);
    expect(data[0].display_name).toBe(randomString);
    expect(data[0].bio).toBe(defaultData.bio);
    expect(data[0].interests).toStrictEqual(defaultData.interests);
    expect(data[0].age).toBe(Number(defaultData.age));
    expect(data[0].zip_code).toBe(defaultData.zipCode);
    expect(data[0].partner_preference).toBe(defaultData.partnerPreference);
    expect(data[0].skill_level).toBe(defaultData.skillLevel);
    expect(data[0].distance).toBe(defaultData.distance);
    expect(data[0].instagram).toBe(defaultData.instagram);
    expect(data[0].tiktok).toBe(defaultData.tiktok);
    expect(data[0].facebook).toBe(defaultData.facebook);
    expect(data[0].linkedin).toBe(defaultData.linkedin);

    // Cleanup: Delete the user using the admin client
    await supabase.auth.admin.deleteUser(data[0].id);

});

test('Profile submission shows confirmation message', async ({ page }) => {

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

    await page.getByRole('textbox', { name: 'Age' }).click();
    await page.getByRole('textbox', { name: 'Age' }).fill(defaultData.age);
    await page.getByRole('textbox', { name: 'ZIP Code' }).click();
    await page.getByRole('textbox', { name: 'ZIP Code' }).fill(defaultData.zipCode);
    await page.getByRole('textbox', { name: 'Gender' }).click();
    await page.getByRole('textbox', { name: 'Gender' }).fill('Male');
    await page.getByRole('textbox', { name: 'Bio' }).click();
    await page.getByRole('textbox', { name: 'Bio' }).fill('My bio.');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Backpacking' }).click();
    await page.getByRole('button', { name: 'Ice-Fishing' }).click();
    await page.getByRole('button', { name: 'Bow-Hunting' }).click();
    await page.getByRole('button', { name: 'Fishing', exact: true }).click();
    await page.getByRole('button', { name: 'Boating' }).click();
    await page.getByRole('button', { name: 'Hiking' }).click();
    await page.getByRole('button', { name: 'Skiing' }).click();
    await page.getByRole('button', { name: 'Rock-Climbing' }).click();
    await page.getByRole('button', { name: 'Hang-Gliding' }).click();
    await page.getByRole('button', { name: 'Kayaking' }).click();
    await page.getByRole('button', { name: 'Camping' }).click();
    await page.getByRole('button', { name: 'Mountain-Biking' }).click();
    await page.getByRole('button', { name: 'Trail-Running' }).click();
    await page.getByRole('button', { name: 'Snowmobiling' }).click();
    await page.getByRole('button', { name: 'Wildlife-Photography' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Beginner' }).click();
    await page.getByRole('button', { name: 'No Preference' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('textbox', { name: 'Instagram' }).click();
    await page.getByRole('textbox', { name: 'Instagram' }).fill(defaultData.instagram);
    await page.getByRole('textbox', { name: 'TikTok' }).click();
    await page.getByRole('textbox', { name: 'TikTok' }).fill(defaultData.tiktok);
    await page.getByRole('textbox', { name: 'Facebook' }).click();
    await page.getByRole('textbox', { name: 'Facebook' }).fill(defaultData.facebook);
    await page.getByRole('textbox', { name: 'LinkedIn' }).click();
    await page.getByRole('textbox', { name: 'LinkedIn' }).fill(defaultData.linkedin);
    await page.getByRole('button', { name: 'Continue' }).click();


    //check if profile save confirm message appears
    let dialogAppeared = false;

    page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toContain('saved');
        dialogAppeared = true
        await dialog.accept(); // or dialog.dismiss()
    });

    await page.getByRole('button', { name: 'Save Profile' }).click();

    await expect(page).toHaveURL('https://outty-scrum-project.vercel.app/match');

    expect(dialogAppeared).toBe(true);

    // 2. Use the Supabase client to check the database directly
    const { data, error } = await supabase.from('profiles').select().eq('display_name', randomString);

    // Cleanup: Delete the user using the admin client
    await supabase.auth.admin.deleteUser(data[0].id);

});

test('Invalid name throws correct error at "About Me" page', async ({ page }) => {

    const randomString = Math.random().toString(36).substring(2, 12); // Generates a random 10-character string
    const email = `${randomString}@${'gmail.com'}`

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

    //enter blank name
    await page.getByRole('textbox', { name: 'Display Name' }).click();
    await page.getByRole('textbox', { name: 'Display Name' }).fill('');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Please enter a name between 1 and 17 letters')).toBeVisible();

    //enter name longer than 17 characters
    await page.getByRole('textbox', { name: 'Display Name' }).click();
    await page.getByRole('textbox', { name: 'Display Name' }).fill('012345678912345678');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Please enter a name between 1 and 17 letters')).toBeVisible();

    // 2. Use the Supabase client to check the database directly
    const { data, error } = await supabase.from('profiles').select().eq('display_name', randomString);

    // Cleanup: Delete the user using the admin client
    await supabase.auth.admin.deleteUser(data[0].id);

});

test('Invalid age throws correct error at "About Me" page', async ({ page }) => {

    const randomString = Math.random().toString(36).substring(2, 12); // Generates a random 10-character string
    const email = `${randomString}@${'gmail.com'}`

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

    //enter blank age
    await page.getByRole('textbox', { name: 'Age' }).click();
    await page.getByRole('textbox', { name: 'Age' }).fill('');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Please enter an age.')).toBeVisible();

    //enter low age
    await page.getByRole('textbox', { name: 'Age' }).click();
    await page.getByRole('textbox', { name: 'Age' }).fill('17');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Please enter an age between 18 and 150, to the nearest year.')).toBeVisible();

    //enter high age
    await page.getByRole('textbox', { name: 'Age' }).click();
    await page.getByRole('textbox', { name: 'Age' }).fill('151');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Please enter an age between 18 and 150, to the nearest year.')).toBeVisible();

    // 2. Use the Supabase client to check the database directly
    const { data, error } = await supabase.from('profiles').select().eq('display_name', randomString);

    // Cleanup: Delete the user using the admin client
    await supabase.auth.admin.deleteUser(data[0].id);

});

test('Invalid ZIP code throws correct error at "About Me" page', async ({ page }) => {

    const randomString = Math.random().toString(36).substring(2, 12); // Generates a random 10-character string
    const email = `${randomString}@${'gmail.com'}`

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

    //enter blank ZIP code
    await page.getByRole('textbox', { name: 'Age' }).click();
    await page.getByRole('textbox', { name: 'Age' }).fill('30');
    await page.getByRole('textbox', { name: 'ZIP Code' }).click();
    await page.getByRole('textbox', { name: 'ZIP Code' }).fill('');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Please enter a valid ZIP code.')).toBeVisible();

    //enter invalid ZIP code
    await page.getByRole('textbox', { name: 'Age' }).click();
    await page.getByRole('textbox', { name: 'Age' }).fill('30');
    await page.getByRole('textbox', { name: 'ZIP Code' }).click();
    await page.getByRole('textbox', { name: 'ZIP Code' }).fill('3006');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Please enter a valid ZIP code.')).toBeVisible();

    // 2. Use the Supabase client to check the database directly
    const { data, error } = await supabase.from('profiles').select().eq('display_name', randomString);

    // Cleanup: Delete the user using the admin client
    await supabase.auth.admin.deleteUser(data[0].id);

});

test('Empty interests throws error on Interests page', async ({ page }) => {

    const randomString = Math.random().toString(36).substring(2, 12); // Generates a random 10-character string
    const email = `${randomString}@${'gmail.com'}`

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

    //enter blank interests
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill(randomString);
    await page.getByRole('textbox', { name: 'Age' }).click();
    await page.getByRole('textbox', { name: 'Age' }).fill('30');
    await page.getByRole('textbox', { name: 'ZIP Code' }).click();
    await page.getByRole('textbox', { name: 'ZIP Code' }).fill('30067');
    await page.getByRole('textbox', { name: 'Gender' }).click();
    await page.getByRole('textbox', { name: 'Gender' }).fill('Male');
    await page.getByRole('button', { name: 'Continue' }).click(); 

    await expect(page.getByText('Adventure Interests')).toBeVisible();

    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Please select at least one interest.')).toBeVisible();

    // 2. Use the Supabase client to check the database directly
    const { data, error } = await supabase.from('profiles').select().eq('display_name', randomString);

    // Cleanup: Delete the user using the admin client
    await supabase.auth.admin.deleteUser(data[0].id);

});
