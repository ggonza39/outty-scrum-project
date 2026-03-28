# Sprint 1 – Burndown Chart

## ZenHub Burndown Link for Sprint 1: Mar 9 - Mar 27
- [Burndown Chart](https://app.zenhub.com/workspaces/outty-scrum-workspace-69a15c1f78024f000f6d197b/reports/burndown?milestoneId=Z2lkOi8vcmFwdG9yL1NwcmludC80ODEzOTM0&selectedPipelines=Z2lkOi8vcmFwdG9yL1BpcGVsaW5lLzM1NDMyODc&showPRs=false)

## Screenshot

<img width="1369" height="865" alt="Screenshot 2026-03-27 205736" src="https://github.com/user-attachments/assets/f0d51470-f92f-4f8d-a06d-16800faa5fd7" />

<img width="1368" height="603" alt="Screenshot 2026-03-27 205945" src="https://github.com/user-attachments/assets/266b28d1-1c1f-4411-8f14-0345ee79741c" />

- ## Sprint Metrics & Analysis

### 1. Burndown Chart Analysis (The "Late Drop" Explanation)

- **Observation:**  
  The Burndown chart shows a **plateau from March 9 to March 25**, followed by a **sharp drop** in story points.

- **Rationale:**  
  This reflects our **Definition of Done (DoD)** and the complexity of the **Supabase/Next.js Authentication handshake**. While frontend and backend components were developed concurrently, points were not "burned" until **final integration and security tests** were passed on March 25.

- **Result:**  
  The **"Step-Drop"** pattern is typical of technical foundation sprints where infrastructure must be **100% verified** before stories can be closed.

---

### 2. Velocity & Scope Growth

- **Observation:**  
  Committed **18 points**, completed **9 points**.

- **Rationale:**  
  Mid-sprint, **User Login (Story 11)** was more complex than expected and required its own story for security reasons, increasing total scope from **15 → 18 points**.

- **Analysis:**  
  - Technically closed **50% of points**
  - Completed over **85% of total sub-tasks**
  - Remaining 9 points are **In-Progress**, blocked only by **final unit test verification**
  - Positions team for a **high-velocity start in Sprint 2**

---

### 3. Quality Over Quantity (Automated Quality Gate)

- **Observation:**  
  Exceeded testing goals: **16 Unit / 2 BDD** vs. **10 / 1 goal**.

- **Rationale:**  
  Prioritized the **Automated Quality Gate** over closing incomplete stories. User Stories 2, 4, and 9 remain **In-Progress** to maintain high testing standards.

- **Evidence:**  
  The **Test Traceability & Metrics Report** shows **160% of Unit Testing goal achieved**, ensuring the **authentication system foundation** is robust and reliable.

---

## Sprint 1 Cumulative Flow Diagram

- [CFD Chart](https://github.com/users/ggonza39/projects/1/insights/3)

---

## Summary
- Total Story Points Committed: 18
- Total Story Points Completed: 9

---

## Observations:
### Did the sprint finish on time?

- **Yes**  
  The sprint concluded on **March 27th** as scheduled.

- However:
  - Approximately **85% of the remaining 9 points** is technically complete.
  - These stories were **not moved to "Done"** because they did not meet the **Definition of Done (DoD)**.

- **Missing Components:**
  - Final unit tests for **profile validation (#26)**
  - Preference persistence tests **(#31)**
  - Update API tests **(#33 / #36)**

---

### Were story points re-estimated?

- **No**

---

### Any scope changes?

- **Yes – Scope Growth**
  - Added **User Story 11 (User Login)** as a separate **3-point story**
  - Originally bundled with registration, but required:
    - Dedicated authentication logic
    - Independent testing coverage

  - **Impact:**
    - Increased sprint scope from **15 → 18 points**

- **Scope Refinement**
  - Deferred **Image Validation feature** to the Product Backlog
  - Identified as **scope creep** during mid-sprint review
  - Decision ensured focus remained on **core authentication delivery**
 
---
  
