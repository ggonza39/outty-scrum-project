# Sprint 1 – Daily Scrum Documentation

**Date:** 03-18-2026

## 1. What did you do in the last 24 hours to help meet the Sprint Goal?

**Hunter Blake:**  
  - Connected the active application/frontend app to Supabase with .env.local and lib/supabase.ts.
  - Built and verified the Supabase-backed signup flow in app/signup/page.tsx.
  - Added user-friendly authentication error handling with lib/authErrors.ts.
  - Created the profiles table, security policies, and auto-create trigger in Supabase.

**Heidi Wilder:**  
  - Description of completed work  

**Gibson Garner:**  
  - Description of completed work  

**Takeshia Banks:**  
  - Description of completed work  

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
  - Connect the login form to the Supabase authentication API.
  - Send the submitted email and password in a login request.
  - Handle successful login by receiving and storing the authenticated session.
  - Handle failed login by returning clear error messages.
  - Test the login flow locally for both success and failure cases.

**Heidi Wilder:**  
  - Planned work 

**Gibson Garner:**  
  - Planned work 

**Takeshia Banks:**  
  - Planned work 

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
