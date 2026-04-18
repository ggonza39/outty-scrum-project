# Sprint 2 – Daily Scrum Documentation

**Date:** 04-03-2026

**Recording Link:**
- [Team Scrum Meeting](https://kennesawedu-my.sharepoint.com/:v:/g/personal/ggonza39_students_kennesaw_edu/IQBQS7S3EktRQ4sneF1AHg9GAc6pqP2nqD-YXmn1b0gsT-s?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=1CeAWt)

---

## 1. What did you do in the last 24 hours to help meet the Sprint Goal?

**Hunter Blake:**  
- Replaced the old mock discovery setup with real backend filtering, so discovery results can now be narrowed by things like age, gender, interests, and skill level.
- Added distance-based matching, allowing discovery results to be limited by how far away another user is.
- Cleaned up the discovery pool by separating real searchable profiles from junk test accounts, which made testing more accurate and results more realistic.
- Automated ZIP code location handling so profiles can be mapped to coordinates and used in distance-based discovery without ongoing manual backend updates.

**Heidi Wilder:**  
- created ui/ux for user messags board  
- created ux/ui message indicator in footer navigation. also added icons 
- created ux/ui for matched screen 
- created filtering drawer modal for match didcovery filtering
- reuploaded svg format of logo
- created branded top navigation for appp
- integrated all the above into an interactive figma prototype

**Gibson Garner:**  
- Documented bugs found on previous tasks
- After bug fixes, adjusted tests to fit new logic
- Ran entire test suite after bug fixes to ensure no new bugs were introduced

**Takeshia Banks:**  
- Completed US3 frontend tasks
- Built the protected /profile page and
- Added the view/edit toggle between the read-only profile dashboard and the edit form. I also
- Tested the route protection, edit mode, cancel/save flow, and profile navigation updates.
- Updated home page to remove dummy information

**Anthony Nguyen:**  
- Managing new pull requests and tracking each implementation as to the user stories acceptance criteria.

**Gilberto Gonzalez:**  
- Infrastructure & Deployment: Resolved a series of critical deployment bugs to successfully launch the Outty 2.0 "Vision" environment; currently monitoring the Vercel build to ensure continuous stability.

- Demo Optimization: Prepared and facilitated a live technical walkthrough of the Desktop 2.0 build.

- Stakeholder Alignment: Refactored the Product Showcase and Scrum Journey presentation slides to clearly communicate the technical evolution from the 1.0 (Hardened Baseline) to the 2.0 (Discovery Experience) for our final presentation.


---

## 2. What will you do in the next 24 hours to help meet the Sprint Goal?

**Hunter Blake:**  
- Finish the remaining US3 work by making sure the dashboard clearly shows “0 Views” for brand-new or unvisited accounts.
- Complete the remaining US6 profile response work so public profile requests include the full intended viewing information, especially distance and profile photo URL.
- Begin US8 backend work by setting up the profile photo storage system, including the gallery bucket and the access rules needed to support uploads and photo management.

**Heidi Wilder:**  
- ux/ui refinemements


**Gibson Garner:**  
- Create tests for US3
- Create tests for US8
- Work with teammate on a BDD test

**Takeshia Banks:**  
- Starting US6 frontend tasks. I’ll begin with the dynamic route for viewing explorer profiles, then move into the loading state and share-profile utility if time allows

**Anthony Nguyen:**  
- I will continue to test each new feature or bug fix to verify that it meets the conditions to check our user story goals.

**Gilberto Gonzalez:**  
- Backlog Refinement: Plan a new User Story/Task for the "Test Account Filter" (the Boolean search toggle) to prevent "junk data" from inflating discovery results.

- Sprint 3 Scoping: Begin drafting requirements for the in-app messaging system, specifically focusing on the message-sending logic and UI layout while strictly excluding "inbox management" (deleting/restoring) to maintain scope.

- Technical Refinement: Perform more UI polishes and environment optimizations for 2.0 app version.

- Documentation: Finalize Sprint 2 week 1 documentation, ensuring all user stories, bug tracking, and feature gaps are updated in the repository.

---

## 3. Impediments

**Identified Impediment:**  
  - Test Data Pollution: The accumulation of test accounts is threatening the accuracy of the discovery matching engine.
  
**Impediment Removal Plan:**  
  - Technical Fix: Implementing a Boolean is_searchable field in the profiles table.
  
**Responsible (if applicable):**  
  - Hunter & Gilberto

---
