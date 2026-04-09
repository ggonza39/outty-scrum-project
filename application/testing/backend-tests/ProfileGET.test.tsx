//import { useRouter } from "next/navigation";
import { GET } from "../../frontend/app/api/discover/[id]/route";
import { describe, it, expect, vi, beforeEach } from 'vitest';

beforeEach((ctx) => {
    const logs: any[] = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args);

    ctx.onTestFailed(() => {
        logs.forEach(args => originalLog(...args));
    });

    return () => { console.log = originalLog; };
});
async function fetchProfile() {
    const response = await fetch(`https://outty-scrum-project.vercel.app/api/discover/2`, {
        cache: "no-store",
    });
    return await response.json();
}

describe('Profile API positive validation', () => {

    it('Tests if profile API response returns name.', async () => {
        const data = await fetchProfile();
        console.log(data);
        await expect("name" in data, data).toBe(true);
    });

    it('Tests if profile API response returns bio.', async () => {
        const data = await fetchProfile();
        console.log(data);
        await expect("bio" in data, data).toBe(true);
    });

    it('Tests if profile API response returns adventure_tags.', async () => {
        const data = await fetchProfile();
        console.log(data);
        await expect("tags" in data, data).toBe(true);
    });

});

describe('Profile API negative validation', () => {
    it('Ensures profile API respose does NOT return email', async () => {
        const data = await fetchProfile();
        console.log(data);
        await expect("email" in data, data).toBe(false);
    });

    it('Ensures profile API respose does NOT return password_hash', async () => {
        const data = await fetchProfile();
        console.log(data);
        await expect("password_hash" in data, data).toBe(false);
    });

    it('Ensures profile API respose does NOT return street_address', async () => {
        const data = await fetchProfile();
        console.log(data);
        await expect("street_address" in data, data).toBe(false);
    });

    it('Ensures profile API respose does NOT return phone_number', async () => {
        const data = await fetchProfile();
        console.log(data);
        await expect("phone_number" in data, data).toBe(false);
    });
});