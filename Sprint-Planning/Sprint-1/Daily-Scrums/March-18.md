# Sprint 1 – Daily Scrum Documentation

**Date:** 03-18-2026

## 1. What did you do in the last 24 hours to help meet the Sprint Goal?

**Hunter Blake:**  

##### US1 – User Account Creation
- Connected the app to Supabase using private URL and API keys located in `.env.local` and through `lib/supabase.ts`.
- Added `lib/authErrors.ts` to provide clear and user-friendly authentication error messages.
- Built and verified the signup flow in `app/signup/page.tsx`, including local testing of successful signup and expected failure cases.

##### US11 – User Login
- Integrated the login flow by sending email and password credentials in a sign-in request to Supabase.
- Implemented login handling for both successful and failed authentications, including clear error messages.
- Tested the login flow locally to confirm both successful and failed sign-in behavior.

##### US10 – Log Out Securely
- Added sign-out logic to navigation.
- Implemented logout handling to terminate the active session.
- Tested the logout flow to confirm the session is cleared successfully.

##### US2 – Create Adventure-Based User Profile
- Updated the `profiles` schema to support the current profile setup fields, including age, location, bio, and interests.
- Implemented profile submission logic in `app/profile-setup/page.tsx` to save profile data for the authenticated user.
- Verified locally and in Supabase that profile data is saved correctly and linked to the authenticated user ID.

**Heidi Wilder:**  
  - Description of completed work  

**Gibson Garner:**  
  - Description of completed work  

**Takeshia Banks:**  
  - Completed frontend work for US11 (Sign In & Session Handling)
  - Built Sign In page and connected it to Supabase auth
  - Added validation and error handling
  - Implemented session-based redirects and route protection
  - Updated UI to mathc Figma design  

**Anthony Nguyen:**  
  - Description of completed work  

**Gilberto Gonzalez:**  
  - CI/CD Infrastructure: Successfully implemented a two-stage pipeline using GitHub Actions and Vercel.
  - Automated Testing: Developed and integrated 12 Vitest cases (Unit & BDD) to serve as a "Quality Gate" for the main branch.
  - Environment Configuration: Resolved critical deployment blockers related to Supabase environment variable mapping and Vercel monorepo pathing (application/frontend).
  - Documentation: Updated the project README.md with the new CI/CD architecture and provided a status update to the team regarding the new "Green" deployment status.
  - Project Presentation: Developed the core slide deck for the project; approximately 70% complete.

---

## 2. What will you do in the next 24 hours to help meet the Sprint Goal?

**Hunter Blake:**  
  ##### US4 – Set Adventure Preferences
  - Extend the Supabase `profiles` schema to include adventure preference fields needed for Sprint 1.
  - Update the database structure in Supabase while preserving existing profile functionality.
  - Implement saving of selected adventure preferences to each user’s profile.
  - Verify that preference data is stored, linked to the correct user, and does not introduce data integrity issues.
  
  ##### US9 – Edit or Delete Profile
  - Implement the backend logic needed to update an existing profile when changes are submitted from the edit form.
  - Ensure updated profile data is saved successfully in Supabase and that proper error handling is included.
  - Implement secure delete functionality so authenticated users can remove their own profile records from the database.
  - Verify that profile deletion works correctly and is restricted to the authenticated user only.

**Heidi Wilder:**  
  - Planned work 

**Gibson Garner:**  
  - Planned work 

**Takeshia Banks:**  
  - US2 profile setup work
  - Build profile creating form UI component (#25)
  - Onboarding flow (#51) 

**Anthony Nguyen:**  
  - Planned work  

**Gilberto Gonzalez:**  
  - Technical Handoff: Support the Tester in transitioning from the initial Vitest scaffolding to the official team test files.
  - Refactoring: Clean up the temporary test files once the official suite is integrated to maintain a clean repository.
  - Feature Development: Begin transitioning focus to Sprint 2 backlog items now that the deployment pipeline is stable.
  - Branch Protection: Look into setting up GitHub branch protection rules to ensure no code can be merged to main without passing the automated tests.
---

## 3. Impediments

**Identified Impediment:**  
  - Initial deployment failures due to recursive pathing in Vercel settings and "act(...)" errors in production React builds during testing.

**Impediment Removal Plan:**  
  - Decoupled the testing and building phases. Moved testing to GitHub Actions (CI) and restricted Vercel to only the production build (CD). Overrode Vercel default build commands to npm run build.

**Responsible (if applicable):**  
  - Gilberto Gonzalez

---

*Note: Multiple Daily Scrums were conducted throughout the sprint. This entry serves as documented evidence in the repository.*
