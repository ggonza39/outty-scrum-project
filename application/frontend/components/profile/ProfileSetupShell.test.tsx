import { describe, it, expect, vi } from 'vitest';
import { validateInterests } from './ProfileSetupShell';
import { ProfileFormData } from './ProfileSetupShell';
import { validatePreferences } from './ProfileSetupShell';
import { validateBasicInfo } from './ProfileSetupShell';

// 2. Mock Supabase to prevent "supabaseUrl is required" error
vi.mock('../../lib/supabase', () => ({
    supabase: {
        auth: {
            signUp: vi.fn(() => Promise.resolve({ data: { user: {} }, error: null })),
        },
    },
}));

const defaultData: ProfileFormData = {
            mainPhoto: null,
            displayName: "John Doe",
            age: "30",
            zipCode: "30067",
            bio: "asdf",
            interests: ["Fishing"],
            partnerPreference: "Female",
            skillLevel: "Expert",
            distance: 25,
            instagram: "",
            tiktok: "",
            facebook: "",
            linkedin: "",
};

describe('Input Validation Unit Tests', () => {

//Interests

    it('should return error for empty interests', () => {
        const testData: ProfileFormData = structuredClone(defaultData);
        testData.interests = [];
        expect(validateInterests(testData)).toBe('Please select at least one interest.');
    });

    it('should return null for valid interests', () => {
        const testData: ProfileFormData = structuredClone(defaultData);
        testData.interests = ["Camping", "Fishing"];
        expect(validateInterests(defaultData)).toBe(null);
    });

//Partner and Skill Preference

    it('should return null for valid partner preference and skill preference', () => {
        const testData: ProfileFormData = structuredClone(defaultData);
        testData.skillLevel = "Expert";
        testData.partnerPreference = "Male";
        expect(validatePreferences(testData)).toBe(null);
    });

    it('should return error for valid partner preference and invalid skill preference', () => {
        const testData: ProfileFormData = structuredClone(defaultData);
        testData.skillLevel = "";
        testData.partnerPreference = "Male";
        expect(validatePreferences(testData)).toBe('Please select a skill level.');
    });

    it('should return error for invalid partner preference and valid skill preference', () => {
        const testData: ProfileFormData = structuredClone(defaultData);
        testData.skillLevel = "Expert";
        testData.partnerPreference = "";
        expect(validatePreferences(testData)).toBe('Please select a partner preference.');
    });

    it('should return error for invalid partner preference and invalid skill preference', () => {
        const testData: ProfileFormData = structuredClone(defaultData);
        testData.skillLevel = "";
        testData.partnerPreference = "";
        expect(validatePreferences(testData)).toBe('Please select a partner preference.');
    });

//Age

    it('should return null for valid integer age', () => {
        const testData: ProfileFormData = structuredClone(defaultData);
        testData.age = "30";
        expect(validateBasicInfo(testData)).toBe(null);
        testData.age = "18";
        expect(validateBasicInfo(testData)).toBe(null);
        testData.age = "150";
        expect(validateBasicInfo(testData)).toBe(null);
    });

    it('should return error for age outside of range', () => {
        const testData: ProfileFormData = structuredClone(defaultData);
        testData.age = "17";
        expect(validateBasicInfo(testData)).toBe('Please enter an age between 18 and 150, to the nearest year.');
        testData.age = "151";
        expect(validateBasicInfo(testData)).toBe('Please enter an age between 18 and 150, to the nearest year.');
    });

    it('should return error for age that is a floating point number', () => {
        const testData: ProfileFormData = structuredClone(defaultData);
        testData.age = "31.5";
        expect(validateBasicInfo(testData)).toBe('Please enter an age between 18 and 150, to the nearest year.');
    });

    it('should return error for age that is a string of letters', () => {
        const testData: ProfileFormData = structuredClone(defaultData);
        testData.age = "Cat";
        expect(validateBasicInfo(testData)).toBe('Please enter an age between 18 and 150, to the nearest year.');
    });

    it('should return error for empty age', () => {
        const testData: ProfileFormData = structuredClone(defaultData);
        testData.age = "";
        expect(validateBasicInfo(testData)).toBe('Please enter an age.');
    });

//Name

    it('should return error for empty name', () => {
        const testData: ProfileFormData = structuredClone(defaultData);
        testData.displayName = "";
        expect(validateBasicInfo(testData)).toBe('Please enter a name between 1 and 17 letters');
    });

    it('should return error for long name', () => {
        const testData: ProfileFormData = structuredClone(defaultData);
        testData.displayName = "abcdefghijklmnopqr";
        expect(validateBasicInfo(testData)).toBe('Please enter a name between 1 and 17 letters');
    });

    it('should return null for valid name', () => {
        const testData: ProfileFormData = structuredClone(defaultData);
        testData.displayName = "Billy-Bobby-Brown";
        expect(validateBasicInfo(testData)).toBe(null);
    });

//Zip Code 

    it('should return null for valid zip code', () => {
        const testData: ProfileFormData = structuredClone(defaultData);
        testData.zipCode = "30067";
        expect(validateBasicInfo(testData)).toBe(null);
    });

    it('should return error for zip code of wrong length', () => {
        const testData: ProfileFormData = structuredClone(defaultData);
        testData.zipCode = "3006";
        expect(validateBasicInfo(testData)).toBe('Please enter a valid ZIP code.');
        testData.zipCode = "300677";
        expect(validateBasicInfo(testData)).toBe('Please enter a valid ZIP code.');
    });

        it('should return error for non-integer ZIP code', () => {
        const testData: ProfileFormData = structuredClone(defaultData);
        testData.zipCode = "300.7";
            expect(validateBasicInfo(testData)).toBe('Please enter a valid ZIP code.');
        testData.zipCode = "3006A";
            expect(validateBasicInfo(testData)).toBe('Please enter a valid ZIP code.');
        testData.zipCode = "3006#";
            expect(validateBasicInfo(testData)).toBe('Please enter a valid ZIP code.');
        });


});