## Test Traceability & Metrics Report
This document tracks the cumulative test count across all Sprints to ensure the project meets the "Automated Quality Gate" requirements.

### Testing Strategy File
- [Testing Strategy](/Sprint-Planning/Testing-Strategy.md)

### Sprint 1 Summary
- [Sprint 1 Test-Traceability File](/Sprint-Planning/Sprint-1/Test-Traceability.md)

### Sprint 2 Summary
  - **Goal:** 20 Unit Tests / 2 BDD
  - **Actual:** 81 Unit Tests / 6 BDD
  - **Status:** Completed
  - **Files:**  
    - /frontend
      - [validation.test.ts](/application/frontend/lib/validation.test.ts) (12 tests)
      - [signinValidation.test.ts](/application/frontend/lib/signinValidation.test.ts) (4 tests)
      - [ProfileSetupShell.test.tsx](/application/frontend/components/profile/ProfileSetupShell.test.tsx) (19 tests)
      - [ProfilePhotoUploaderSecurity.test.tsx](/application/frontend/components/profile/ProfilePhotoUploaderSecurity.test.tsx) (1 test)
      - [signin.test.tsx](/application/frontend/app/signin/signin.test.tsx) (1 test)
      - [ProfilePhotoUploader.test.tsx](/application/frontend/components/profile/ProfilePhotoUploader.test.tsx) (10 tests)
      - [signup.bdd.test.tsx](/application/frontend/app/signup/signup.bdd.test.tsx) (2 tests)
      - [discover.test.tsx](/application/frontend/app/discover/discover.test.tsx) (7 tests)
      - [profile.test.tsx](/application/frontend/app/profile/profile.test.tsx) (4 tests)
    - /testing
      - [ProfileGet.test.tsx](/application/testing/backend-tests/ProfileGET.test.tsx) (7 tests)
      - [ProfileUploadSecurity.test.tsx](/application/testing/backend-tests/ProfileUploadSecurity.test.tsx) (1 test)
      - [DashboardBDDTest.tsx](/application/testing/e2e-tests/DashboardBDDTest.tsx) (1 test)
      - [DiscoverBDDTest.tsx](/application/testing/e2e-tests/DiscoverBDDTest.tsx) (2 tests)
      - [FilteringBDDTest.tsx](/application/testing/e2e-tests/FilteringBDDTest.tsx) (1 test)
      - [ProfileCreationTest.tsx](/application/testing/e2e-tests/ProfileCreationTest.tsx) (6 tests)
      - [ProfileUpdatedDeleteTest.tsx](/application/testing/e2e-tests/ProfileUpdateDeleteTest.tsx) (3 tests)
      - [SigninSignoutE2ETest.tsx](/application/testing/e2e-tests/SigninSignoutE2ETest.tsx) (3 tests)
      - [SignupSupabaseTest.tsx](/application/testing/e2e-tests/SignupSupabaseTest.tsx) (3 tests)
     
### GitHub Actions with Vercel Summary Logs
- https://github.com/ggonza39/outty-scrum-project/actions/runs/24592632056

- **Note on Count Variance:**
- Tier 1 (CI-Gated): Unit and Integration tests (61 total) are executed on every Vercel merge/PR. These are headless, fast, and mock external dependencies.
- Tier 2 (Local/Staging): Playwright E2E tests are executed in a local environment or a dedicated staging branch. These are excluded from the Vercel production build to prevent timeout failures and resource contention during browser-based session simulation.

### Vercel Logs
- https://vercel.com/ggonza39s-projects/outty-scrum-project/deployments
  
  - Warning: Link might not work due to Hobby Account restrictions.  GitHub Actions has Vercel logs embedded due to this restriction.

### **Current Count (Sprint 1 & 2):** 
  - Unit Tests = 81 
  - BDD Tests = 6
