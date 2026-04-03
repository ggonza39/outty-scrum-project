# Sprint 2 – Daily Scrum Documentation

**Date:** 04-01-2026

## 1. What did you do in the last 24 hours to help meet the Sprint Goal?

**Hunter Blake:**  
- Built secure profile retrieval so signed-in users can access their own profile data safely without exposing profile IDs in the URL.
- Added profile view tracking so users can see how many times their profile has been viewed, while preventing self-views and repeated refreshes from inflating the count.
- Created a public profile access flow for authenticated users that returns specified profile information for viewing other users.
- Expanded the profiles table to accommodate user gender selection.

**Heidi Wilder:**  
- working on logo
- created male/female radio button wireframe for profile setup
  [US5] [UI/UX] Task 3: Design a "Gender & Age Range" selection tool

**Gibson Garner:**  
- 

**Takeshia Banks:**  
- Worked on frontend gap and bug fixes (GAP #152, BUG #150, BUG #153).
- Added gender field support, fixed validation so errors show on the correct step, updated delete flow to log users out, and aligned unit tests with the new validation logic.

**Anthony Nguyen:**  
- Checking and tracking any new implementation to the app from the Pull Request. Then, testing if the feature has any bugs or is missing any features for submission requirements

**Gilberto Gonzalez:**  
- Infrastructure: Successfully deployed "Outty 2.0" to Vercel, providing a stable staging environment for the final investor pitch and future release visualization.

- Process Engineering: Established and documented the Bug Tracking and Feature Gap master cards to formalize the triage process for Sprint 2.

- Documentation: Performed a comprehensive update of the project repository documentation to align with the current architectural state.

- Backlog Management: Refined the Sprint 2 backlog to ensure all sub-tasks and story points accurately reflect the team's current velocity.

---

## 2. What will you do in the next 24 hours to help meet the Sprint Goal?

**Hunter Blake:**  
- US5: Build out the discovery filtering backend.
- US5: Add distance-based matching so search results can be limited by distance.
- US8: Set up secure profile photo storage so users can upload and manage gallery images with proper access control.
- US8: Implement cleanup handling for deleted profile photos so removed images do not occupy storage space.

**Heidi Wilder:**  
- 

**Gibson Garner:**  
- 

**Takeshia Banks:**  
- Starting US3 tasks (#121, #122) — implementing route protection for /profile and adding the state switcher to toggle between view and edit modes.

**Anthony Nguyen:**  
- Check, test, and log any bugs, gaps, or conflicts when merging the new implementation to the app.

**Gilberto Gonzalez:**  
- Continuous Refinement: Monitor the ZenHub board to ensure the transition from Sprint 1 carry-over tasks to Sprint 2 stories remains fluid.
- Technical Oversight: Review the "Definition of Done" for upcoming User Stories to ensure quality standards remain consistent across the team.
- App 2.0: Polish the app for future demo
  
---

## 3. Impediments

**Identified Impediment:**  
  - Sprint 1 Carry-over Debt: Several functional bugs were identified in User Stories transitioning from Sprint 1 into Sprint 2, creating a potential bottleneck for new feature development.
  
**Impediment Removal Plan:**  
  - Utilize the new Bug Tracking Card to categorize these issues. Coordination is already underway between Gibson (Testing) and Anthony (PO) to prioritize these fixes across the Backend, Frontend, and UI domains without sacrificing Sprint 2 goals.
  
**Responsible (if applicable):**  
  - Full development team

---
