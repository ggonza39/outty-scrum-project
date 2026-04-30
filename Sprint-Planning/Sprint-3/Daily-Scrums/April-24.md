# Sprint 3 – Daily Scrum Documentation

**Date:** 04-24-2026

**Recording Link:**
- [Team Scrum Meeting](https://kennesawedu-my.sharepoint.com/:v:/g/personal/ggonza39_students_kennesaw_edu/IQDi6QbHCN7dSpV1gTVntrqjAeeKSqThGMxu4R_HrkhzAEI?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=seze0r)

---

## 1. What did you do in the last 24 hours to help meet the Sprint Goal?

**Hunter Blake:**  
- Implemented user presence tracking to complete all backend tasks for Sprint 3.
- Completed the realtime messaging validation.

**Heidi Wilder:**  
- Worked on final presentation slides for ux/ui.

**Gibson Garner:**  
- Completed backend tests
- Began real-time logic tests

**Takeshia Banks:**  
- Complete US7 messaging tasks for the frontend
- Updated display to match UI wireframe

**Anthony Nguyen:**  
- Conducted a final audit of the Sprint 3 Acceptance Criteria to ensure all functional requirements for the "Outty" discovery engine were met.
- Double-checking for any bugs or missing features that are restricting the completion of our User Stories.

**Gilberto Gonzalez:**  
- Conducted documentation audit and submission prep.
  - Refined final presentation slides for logical flow and technical narrative.
  - Collaborated with Gibson to troubleshoot Task 13 security testing constraints.

---

## 2. What will you do in the next 24 hours to help meet the Sprint Goal?

**Hunter Blake:**  
- Continue to support the team as needed as bugs/inefficiencies are discovered.

**Heidi Wilder:**  
- All UX/UI is complete at this time, will remain on standby for any needed support.

**Gibson Garner:**  
- Finish real-time logic tests
- Continue BDD tests

**Takeshia Banks:**  
- Fix issues with realtime messaging for US7.

**Anthony Nguyen:**  
- Report any bugs for each update to the app to fix or to create the missing feature
- Manage and merge each pull request after reviewing the file changes

**Gilberto Gonzalez:**  
- Revise and finalize Task 13 (Security & Privacy) unit test D.
  - Lead the technical investigation into the real-time refresh bug using the 2.0 reference architecture.
  - Coordinate with Anthony to ensure all user stories meet the "Definition of Done" before the project deadline.
  
---

## 3. Impediments

**Identified Impediment:**  
 - Real-Time Synchronization Bug: Messages are persisting in the database but the UI fails to trigger an automatic refresh upon receipt.
  
**Impediment Removal Plan:**  
  - Gilberto and Gibson will perform a code-diff against the Application-2.0 reference components to identify missing realtime listeners and then, coordinate with Backend and Frontend to implement a surgical fix.
  
**Responsible (if applicable):**  
  - Gilberto, Gibson Garner, Hunter, Takeshia.

---
