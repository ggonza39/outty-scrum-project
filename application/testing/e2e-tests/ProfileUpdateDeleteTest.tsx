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

const updatedData: ProfileFormData = {
    mainPhoto: null,
    displayName: "",
    age: "31",
    zipCode: "30068",
    bio: "My new bio.",
    interests: ["Backpacking"],
    partnerPreference: "Female",
    skillLevel: "Expert",
    distance: 25,
    instagram: "asdf2",
    tiktok: "asdf2",
    facebook: "asdf2",
    linkedin: "asdf2",
}

test('Profile fields can be changed and update in database', async ({ page }) => {

    const randomString = Math.random().toString(36).substring(2, 12); // Generates a random 10-character string
    const email = `${randomString}@${'gmail.com'}`

    //await page.goto('https://outty-scrum-project.vercel.app/');
    //await page.getByRole('link', { name: 'Sign in' }).click();
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
    const { data: beforedata, error: beforeerror } = await supabase.from('profiles').select().eq('display_name', randomString);

    // 3. Make assertions using Playwright's expect
    expect(beforeerror).toBeNull();
    expect(beforedata?.length).toBe(1);
    expect(beforedata[0].display_name).toBe(randomString);
    expect(beforedata[0].bio).toBe(defaultData.bio);
    expect(beforedata[0].interests).toStrictEqual(defaultData.interests);
    expect(beforedata[0].age).toBe(Number(defaultData.age));
    expect(beforedata[0].zip_code).toBe(defaultData.zipCode);
    expect(beforedata[0].partner_preference).toBe(defaultData.partnerPreference);
    expect(beforedata[0].skill_level).toBe(defaultData.skillLevel);
    expect(beforedata[0].distance).toBe(defaultData.distance);
    expect(beforedata[0].instagram).toBe(defaultData.instagram);
    expect(beforedata[0].tiktok).toBe(defaultData.tiktok);
    expect(beforedata[0].facebook).toBe(defaultData.facebook);
    expect(beforedata[0].linkedin).toBe(defaultData.linkedin);

    await page.goto('https://outty-scrum-project.vercel.app/profile-setup');

    await page.getByRole('textbox', { name: 'Age' }).click();
    await page.getByRole('textbox', { name: 'Age' }).fill(updatedData.age);
    await page.getByRole('textbox', { name: 'ZIP Code' }).click();
    await page.getByRole('textbox', { name: 'ZIP Code' }).fill(updatedData.zipCode);
    await page.getByRole('textbox', { name: 'Bio' }).click();
    await page.getByRole('textbox', { name: 'Bio' }).fill(updatedData.bio);
    await page.getByRole('textbox', { name: 'Gender' }).click();
    await page.getByRole('textbox', { name: 'Gender' }).fill('Female');
    await page.getByRole('button', { name: 'Continue' }).click();
    //await page.getByRole('button', { name: 'Backpacking' }).click();
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
    await page.getByRole('button', { name: 'Expert' }).click();
    await page.getByRole('button', { name: 'Female' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('textbox', { name: 'Instagram' }).click();
    await page.getByRole('textbox', { name: 'Instagram' }).fill(updatedData.instagram);
    await page.getByRole('textbox', { name: 'TikTok' }).click();
    await page.getByRole('textbox', { name: 'TikTok' }).fill(updatedData.tiktok);
    await page.getByRole('textbox', { name: 'Facebook' }).click();
    await page.getByRole('textbox', { name: 'Facebook' }).fill(updatedData.facebook);
    await page.getByRole('textbox', { name: 'LinkedIn' }).click();
    await page.getByRole('textbox', { name: 'LinkedIn' }).fill(updatedData.linkedin);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Save Profile' }).click();

    await expect(page).toHaveURL('https://outty-scrum-project.vercel.app/match');

    page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toContain('logged out');
        await dialog.accept(); // or dialog.dismiss()
    });

    await page.getByRole('link', { name: 'Home' }).click();
    await page.getByRole('button', { name: 'Toggle menu' }).click();
    await page.getByRole('button', { name: 'Log out' }).click();
    await page.waitForURL('https://outty-scrum-project.vercel.app/signin');

    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1');
    await page.getByRole('button', { name: 'SIGN IN' }).click();

    await page.waitForURL('https://outty-scrum-project.vercel.app/profile-setup');

    // 2. Use the Supabase client to check the database directly
    const { data: afterdata, error: aftererror } = await supabase.from('profiles').select().eq('display_name', randomString);

    // 3. Make assertions using Playwright's expect
    expect(aftererror).toBeNull();
    expect(afterdata?.length).toBe(1);
    expect(afterdata[0].display_name).toBe(randomString);
    expect(afterdata[0].bio).toBe(updatedData.bio);
    expect(afterdata[0].interests).toStrictEqual(updatedData.interests);
    expect(afterdata[0].age).toBe(Number(updatedData.age));
    expect(afterdata[0].zip_code).toBe(updatedData.zipCode);
    expect(afterdata[0].partner_preference).toBe(updatedData.partnerPreference);
    expect(afterdata[0].skill_level).toBe(updatedData.skillLevel);
    expect(afterdata[0].distance).toBe(updatedData.distance);
    expect(afterdata[0].instagram).toBe(updatedData.instagram);
    expect(afterdata[0].tiktok).toBe(updatedData.tiktok);
    expect(afterdata[0].facebook).toBe(updatedData.facebook);
    expect(afterdata[0].linkedin).toBe(updatedData.linkedin);

    // Cleanup: Delete the user using the admin client
    await supabase.auth.admin.deleteUser(afterdata[0].id);

});

test('Delete button at profile preview removes profile from database', async ({ page }) => {

    const randomString = Math.random().toString(36).substring(2, 12); // Generates a random 10-character string
    const name = `00test${randomString}`
    const email = `${randomString}@${'gmail.com'}`

    //await page.goto('https://outty-scrum-project.vercel.app/');
    //await page.getByRole('link', { name: 'Sign in' }).click();
    await page.goto('https://outty-scrum-project.vercel.app/');
    await page.getByRole('link', { name: 'Create account' }).click();
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill(name);
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password', exact: true }).click();
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Password1');
    await page.getByRole('textbox', { name: 'Confirm Password' }).click();
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Password1');
    await page.getByRole('button', { name: 'SIGN UP' }).click();

    await expect(page).toHaveURL('https://outty-scrum-project.vercel.app/profile-setup');

    await page.getByRole('textbox', { name: 'Age' }).click();
    await page.getByRole('textbox', { name: 'Age' }).fill(updatedData.age);
    await page.getByRole('textbox', { name: 'ZIP Code' }).click();
    await page.getByRole('textbox', { name: 'ZIP Code' }).fill(updatedData.zipCode);
    await page.getByRole('textbox', { name: 'Gender' }).click();
    await page.getByRole('textbox', { name: 'Gender' }).fill('Male');
    await page.getByRole('textbox', { name: 'Bio' }).click();
    await page.getByRole('textbox', { name: 'Bio' }).fill(updatedData.bio);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Backpacking' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Expert' }).click();
    await page.getByRole('button', { name: 'Female' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // 2. Use the Supabase client to check the database directly
    const { data: beforeData, error: beforeError } = await supabase.from('profiles').select().eq('display_name', name);

    // 3. Make assertions using Playwright's expect
    expect(beforeError).toBeNull();
    expect(beforeData?.length).toBeGreaterThanOrEqual(1);
    expect(beforeData[0].display_name).toBe(name);

    //Delete profile
    await page.getByRole('button', { name: 'Delete Profile' }).click();
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => { });
    });
    await page.getByRole('button', { name: 'Yes, Delete' }).click();
    await page.locator('body').press('Enter');
    await page.locator('body').press('Enter');

    await expect(page).toHaveURL('https://outty-scrum-project.vercel.app/signin');

    // 2. Use the Supabase client to check the database directly
    const { data: afterData, error: afterError } = await supabase.from('profiles').select().eq('display_name', name);

    // 3. Make assertions using Playwright's expect
    //expect(afterError).toBeNull();
    expect(afterData?.length).toBe(0);
    //expect(afterData[0].display_name).toBe(randomString);

    // Cleanup: Delete the user using the admin client
    //await supabase.auth.admin.deleteUser(data[0].id);

});

test('Invalid updates are not submitted to database', async ({ page }) => {

    const randomString = Math.random().toString(36).substring(2, 12); // Generates a random 10-character string
    const email = `${randomString}@${'gmail.com'}`

    //await page.goto('https://outty-scrum-project.vercel.app/');
    //await page.getByRole('link', { name: 'Sign in' }).click();
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
    const { data: beforedata, error: beforeerror } = await supabase.from('profiles').select().eq('display_name', randomString);

    // 3. Make assertions using Playwright's expect
    expect(beforeerror).toBeNull();
    expect(beforedata?.length).toBe(1);
    expect(beforedata[0].display_name).toBe(randomString);
    expect(beforedata[0].bio).toBe(defaultData.bio);
    expect(beforedata[0].interests).toStrictEqual(defaultData.interests);
    expect(beforedata[0].age).toBe(Number(defaultData.age));
    expect(beforedata[0].zip_code).toBe(defaultData.zipCode);
    expect(beforedata[0].partner_preference).toBe(defaultData.partnerPreference);
    expect(beforedata[0].skill_level).toBe(defaultData.skillLevel);
    expect(beforedata[0].distance).toBe(defaultData.distance);
    expect(beforedata[0].instagram).toBe(defaultData.instagram);
    expect(beforedata[0].tiktok).toBe(defaultData.tiktok);
    expect(beforedata[0].facebook).toBe(defaultData.facebook);
    expect(beforedata[0].linkedin).toBe(defaultData.linkedin);

    await page.goto('https://outty-scrum-project.vercel.app/profile-setup');

    await page.getByRole('textbox', { name: 'Age' }).click();
    await page.getByRole('textbox', { name: 'Age' }).fill('');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    //await expect(page).toHaveURL('https://outty-scrum-project.vercel.app/match');

    page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toContain('logged out');
        await dialog.accept(); // or dialog.dismiss()
    });

    await page.getByRole('link', { name: 'Home' }).click();
    await page.getByRole('button', { name: 'Toggle menu' }).click();
    await page.getByRole('button', { name: 'Log out' }).click();
    await page.waitForURL('https://outty-scrum-project.vercel.app/signin');

    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1');
    await page.getByRole('button', { name: 'SIGN IN' }).click();

    await page.waitForURL('https://outty-scrum-project.vercel.app/profile-setup');

    // 2. Use the Supabase client to check the database directly
    const { data: afterdata, error: aftererror } = await supabase.from('profiles').select().eq('display_name', randomString);

    // 3. Make assertions using Playwright's expect
    expect(aftererror).toBeNull();
    expect(afterdata?.length).toBe(1);
    expect(afterdata[0].display_name).toBe(randomString);
    expect(afterdata[0].bio).toBe(defaultData.bio);
    expect(afterdata[0].interests).toStrictEqual(defaultData.interests);
    expect(afterdata[0].age).toBe(Number(defaultData.age));
    expect(afterdata[0].zip_code).toBe(defaultData.zipCode);
    expect(afterdata[0].partner_preference).toBe(defaultData.partnerPreference);
    expect(afterdata[0].skill_level).toBe(defaultData.skillLevel);
    expect(afterdata[0].distance).toBe(defaultData.distance);
    expect(afterdata[0].instagram).toBe(defaultData.instagram);
    expect(afterdata[0].tiktok).toBe(defaultData.tiktok);
    expect(afterdata[0].facebook).toBe(defaultData.facebook);
    expect(afterdata[0].linkedin).toBe(defaultData.linkedin);

    // Cleanup: Delete the user using the admin client
    await supabase.auth.admin.deleteUser(afterdata[0].id);

});