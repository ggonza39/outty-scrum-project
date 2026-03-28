# Sprint 1 Review - Mar 27-2026

## Recording Link:
- https://kennesawedu-my.sharepoint.com/:v:/g/personal/ggonza39_students_kennesaw_edu/IQDqxterx_1wR5joiafCyzx5Ae_rYYM1B_aiUelv7WL9VW8?e=cNcr6a&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D

## Sprint Goal

- **Establish the core authentication and profile management features of Outty**, enabling users to create accounts, define preferences, and manage their profiles securely.

---

## Completed Work

- **User Story 1: User account creation** – 5 pts

- **User Story 11: User login (Added mid-sprint for architectural clarity)** – 3 pts

- **User Story 10: Log out securely (Verified fix for session termination)** – 1 pt

- **Automated Quality Gate**  
  Exceeded testing goals with **16 Unit Tests** and **2 BDD Tests** *(Goal: 10 Unit / 1 BDD)*

---

## Demonstration Summary

- **Account Creation**  
  Successfully registered a new user via Supabase.

- **Secure Login**  
  Demonstrated Story 11 functionality, allowing a registered user to access the dashboard.

- **Secure Logout**  
  Demonstrated the fix for the **"Ghost Session"** bug, proving that reusing the URL after logout correctly redirects to the login page.

- **Metrics Dashboard**  
  Showcased the **Test Traceability & Metrics Report** and **ZenHub Burndown/Burn-up charts**, highlighting **50% completion** of the total 18-point scope.

---

## Stakeholder Feedback

- **Traceability**  
  Approval granted for the **"Root-Relative" linking system** in the README, enabling direct navigation to test files (e.g., `signup.bdd.test.tsx`).

- **Scope Transparency**  
  Acknowledged the shift from a **15-point forecast to an 18-point scope** due to separation of login and registration logic.

- **Access Note**  
  Discussed limitations of the **"Hobby Account"** for external integrations; the team provided logs and explanations to maintain transparency.

---

## Incomplete Work

The following stories are **60–80% complete** but were not moved to **Done** to maintain a strict Definition of Done:

- **User Story 2: Create adventure-based user profile** – 3 pts  
  - **Reason:** Core logic for handling complex profile data is complete, but final UI polish and validation were delayed due to the Story 10 regression fix.

- **User Story 4: Set adventure preferences** – 3 pts  
  - **Reason:** Dependent on the finalized data schema from User Story 2.

- **User Story 9: Edit or delete profile** – 3 pts  
  - **Reason:** CRUD operations are functional in the backend, but frontend **Edit views** are not yet implemented.
