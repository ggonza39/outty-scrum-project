## Test Traceability & Metrics Report
This document tracks the cumulative test count across all Sprints to ensure the project meets the "Automated Quality Gate" requirements.

### Testing Strategy File
- [Testing Strategy](/Sprint-Planning/Testing-Strategy.md)

### Sprint 1 Summary
- [Sprint 1 Test-Traceability File](/Sprint-Planning/Sprint-1/Test-Traceability.md)

### Sprint 2 Summary
- [Sprint 2 Test-Traceability File](/Sprint-Planning/Sprint-2/Test-Traceability.md)

### Sprint 3 Summary
  - **Goal:** 30 Unit Tests / 3 BDD
  - **Actual:** TBD Unit Tests / TBD BDD
  - **Status:** TBD
  - **Files:**
    -   

### GitHub Actions with Vercel Summary Logs
- https://github.com/ggonza39/outty-scrum-project/actions/runs/24592632056

- **Note on Count Variance:**  
  - Tier 1 (CI-Gated): Unit and Integration & BDD tests (TBD total) are executed on every Vercel merge/PR. These are headless, fast, and mock external dependencies.
  - Tier 2 (Local/Staging): Playwright E2E tests are executed in a local environment or a dedicated staging branch. These are excluded from the Vercel production build to prevent timeout failures and resource contention during browser-based session simulation. Backend tests are also excluded to prevent backend issues from stopping frontend deployments.

### Vercel Logs
- https://vercel.com/ggonza39s-projects/outty-scrum-project/deployments
  
  - Warning: Link might not work due to Hobby Account restrictions.  GitHub Actions has Vercel logs embedded due to this restriction.

### **Current Count (Sprint 1, 2 & 3):** 
  - Unit Tests = 81 
  - BDD Tests = 6

