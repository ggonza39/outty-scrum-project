## Test Traceability & Metrics Report
This document tracks the cumulative test count across all Sprints to ensure the project meets the "Automated Quality Gate" requirements.

### Screenshots of tests passing locally
- [Test Screenshots](/Sprint-Planning/Sprint-3/Test-Screenshots)

### Testing Strategy File
- [Testing Strategy](/Sprint-Planning/Testing-Strategy.md)

### Sprint 1 Summary
- [Sprint 1 Test-Traceability File](/Sprint-Planning/Sprint-1/Test-Traceability.md)

### Sprint 2 Summary
- [Sprint 2 Test-Traceability File](/Sprint-Planning/Sprint-2/Test-Traceability.md)

### Sprint 3 Summary
  - **Goal:** 30 Unit Tests / 3 BDD
  - **Actual:** 115 Unit Tests / 7 BDD
  - **Status:** All tests pass
  - **Files:**
    - /frontend
      - [app.test.ts](https://github.com/ggonza39/outty-scrum-project/blob/main/application/frontend/app.test.ts) (1 test)
      - [validation.test.ts](/application/frontend/lib/validation.test.ts) (12 tests)
      - [signinValidation.test.ts](/application/frontend/lib/signinValidation.test.ts) (4 tests)
      - [ProfileSetupShell.test.tsx](/application/frontend/components/profile/ProfileSetupShell.test.tsx) (19 tests)
      - [ProfilePhotoUploaderSecurity.test.tsx](/application/frontend/components/profile/ProfilePhotoUploaderSecurity.test.tsx) (1 test)
      - [signin.test.tsx](/application/frontend/app/signin/signin.test.tsx) (1 test)
      - [ProfilePhotoUploader.test.tsx](/application/frontend/components/profile/ProfilePhotoUploader.test.tsx) (10 tests)
      - [signup.bdd.test.tsx](/application/frontend/app/signup/signup.bdd.test.tsx) (2 tests)
      - [discover.test.tsx](/application/frontend/app/discover/discover.test.tsx) (7 tests)
      - [profile.test.tsx](/application/frontend/app/profile/profile.test.tsx) (4 tests)
      - [supabaseMessages.test.tsx](/application/frontend/lib/supabaseMessages.test.tsx) (18 tests)
    - /testing
      - [ProfileGet.test.tsx](/application/testing/backend-tests/ProfileGET.test.tsx) (7 tests)
      - [ProfileUploadSecurity.test.tsx](/application/testing/backend-tests/ProfileUploadSecurity.test.tsx) (1 test)
      - [MessageSecurity.test.tsx](/application/testing/backend-tests/MessageSecurity.test.tsx) (8 tests)
      - [DashboardBDDTest.tsx](/application/testing/e2e-tests/DashboardBDDTest.tsx) (1 test)
      - [DiscoverBDDTest.tsx](/application/testing/e2e-tests/DiscoverBDDTest.tsx) (2 tests)
      - [FilteringBDDTest.tsx](/application/testing/e2e-tests/FilteringBDDTest.tsx) (1 test)
      - [ProfileCreationTest.tsx](/application/testing/e2e-tests/ProfileCreationTest.tsx) (6 tests)
      - [ProfileUpdatedDeleteTest.tsx](/application/testing/e2e-tests/ProfileUpdateDeleteTest.tsx) (3 tests)
      - [SigninSignoutE2ETest.tsx](/application/testing/e2e-tests/SigninSignoutE2ETest.tsx) (3 tests)
      - [SignupSupabaseTest.tsx](/application/testing/e2e-tests/SignupSupabaseTest.tsx) (3 tests)
      - [RealTimeSyncTest.tsx](/application/testing/e2e-tests/RealTimeSyncTest.tsx) (7 tests)
      - [RealTimeSyncBDDTest.tsx](/application/testing/e2e-tests/RealTimeSyncBDDTest.tsx) (1 test)

### GitHub Actions with Vercel Summary Logs
- https://github.com/ggonza39/outty-scrum-project/actions/runs/24592632056

- **Note on Count Variance:**  
  - Tier 1 (CI-Gated): Unit and Integration & BDD tests (TBD total) are executed on every Vercel merge/PR. These are headless, fast, and mock external dependencies. These tests are inside the /frontend directory.
  - Tier 2 (Local/Staging): Playwright E2E tests are executed in a local environment or a dedicated staging branch. These are excluded from the Vercel production build to prevent timeout failures and resource contention during browser-based session simulation. Backend tests are also excluded to prevent backend issues from stopping frontend deployments. Playwright tests are changed from ".test.tsx" to "Test.tsx" for deployment to prevent automatic tests execution with the backend tests. These tests are inside the /testing directory.

### Vercel Logs
- https://vercel.com/ggonza39s-projects/outty-scrum-project/deployments
  
  - Warning: Link might not work due to Hobby Account restrictions.  GitHub Actions has Vercel logs embedded due to this restriction.

### **Current Count (Sprint 1, 2 & 3):** 
  - Unit Tests = 115 
  - BDD Tests = 7

