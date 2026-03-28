# Sprint 1 – Daily Scrum Documentation

**Date:** 03-25-2026

---

## 1. What did you do in the last 24 hours to help meet the Sprint Goal?

**Hunter Blake:**  
  - Completed backend tasks for US4 & US9

**Heidi Wilder:**  
  - 
**Gibson Garner:**  
  - Completed E2E tests for sign up
  - Completed E2E tests for sign in
  - Completed E2E tests for sign out

**Takeshia Banks:**  
  - Worked on US4 and US9
  - Implemented profile setup validation
  - Added profile pre-fill form from Supabase
  - Built the delete confirmation modal
    
**Anthony Nguyen:**  
  - Identified security bypass via manual URL entry for protected routes
  - Validated E2E test scripts for sign-out functionality
  - Facilitated team alignment on server-side session enforcement requirements
    
**Gilberto Gonzalez:**  
  - ZenHub Workspace Restoration: Performed a comprehensive reset and reconfiguration of the ZenHub Project Board. Resolved a critical "Snapshot Lock" issue that was obstructing the Burndown chart’s ability to capture mid-sprint velocity.

  - Native Analytics Implementation: Configured a custom GitHub Insights "Execution Flow" Chart. This dual-model visualization tracks both Cumulative Progress and Product Scope changes (capturing our shift from 15 to 18 points) to provide a single "Source of Truth."

  - Sprint Lifecycle Initialization: Created and structured dedicated project directories for Sprint 2 and Sprint 3, ensuring organizational readiness for upcoming iterations.

  - Iteration Management: Revised the Product Backlog for the upcoming Sprint 2. Re-prioritized user stories based on current velocity and technical dependencies.

  - Metadata Standardization: Audited and applied a unified tagging schema (User-Story, Sprint-1, Iteration) across the repository to ensure automated reporting integrity between GitHub and ZenHub.

---

## 2. What will you do in the next 24 hours to help meet the Sprint Goal?

**Hunter Blake:**  
  - Address bug reports and refinements related to backend development tasks for Sprint 1

**Heidi Wilder:**  
  - 
**Gibson Garner:**  
  - Create unit tests for profile setup
  - Create E2E tests for profile setup
  - Write unit tests for preference persistance

**Takeshia Banks:**  
  - Prepare for sprint review and support any final fixes or adjustments based on team feedback.
    
**Anthony Nguyen:**  
  - Monitor implementation of Middleware for session verification
  - Update "Definition of Done" to include server-side route protection
  - Refine user story acceptance criteria for upcoming profile features
    
**Gilberto Gonzalez:**  
  - Review acceptance criteria on completed user stories and pending user stories for sprint 1.
  - Conduct sprint review and retrospective to close Sprint 1.
  - Sprint 2 Preparation: Currently finalizing Sprint 2 planning documentation and backlog organization to meet the Sunday project deadline.
---

## 3. Impediments

**Identified Impediment:**  
  - Security & Regression Audit: Identified a critical security "Ghost Session" bug in Story 10 (Secure Logout). Verified that cached sessions permitted unauthorized access via direct URL pasting; subsequently blocked the story from being marked "Done" to maintain our Definition of Done (DoD) and project security standards.

**Impediment Removal Plan:**  
  - Troubleshoot the bug with backend and testing.

**Responsible (if applicable):**  
  - Anthony, Hunter, Gibson

---

*Note: Multiple Daily Scrums were conducted throughout the sprint. This entry serves as documented evidence in the repository.*
