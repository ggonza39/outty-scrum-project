# Sprint 1 – Burndown Chart

## ZenHub Burndown Link for Sprint 1: Mar 9 - Mar 27
- [Burndown Chart](https://app.zenhub.com/workspaces/outty-scrum-workspace-69a15c1f78024f000f6d197b/reports/burndown?milestoneId=Z2lkOi8vcmFwdG9yL1NwcmludC80ODEzOTM0&selectedPipelines=Z2lkOi8vcmFwdG9yL1BpcGVsaW5lLzM1NDMyODc&showPRs=false)

## Screenshots (if link does not work due to account restrictions)

<img width="1369" height="865" alt="Screenshot 2026-03-27 205736" src="https://github.com/user-attachments/assets/f0d51470-f92f-4f8d-a06d-16800faa5fd7" />

<img width="1368" height="603" alt="Screenshot 2026-03-27 205945" src="https://github.com/user-attachments/assets/266b28d1-1c1f-4411-8f14-0345ee79741c" />


## Sprint Metrics & Analysis

### Burndown Chart Analysis

- **Observation:**  
  The chart shows a **plateau from March 9 to March 25**, followed by a **sharp drop** in story points.

- **Rationale:**  
  This reflects our strict **Definition of Done (DoD)**. While frontend and backend components were developed concurrently, points were not "burned" until **final integration and security tests** passed on March 25.

- **Result:**  
  This **"Step-Drop"** pattern confirms that infrastructure was **100% verified** before closing, rather than claiming partial progress on unverified code.

---

### Quality Over Quantity (Automated Quality Gate)

- **Performance:**  
  Exceeded testing goals with **16 Unit / 2 BDD tests** *(Goal: 10 / 1)*

- **Strategy:**  
  Prioritized the **Automated Quality Gate** over prematurely closing stories. **Stories 2, 4, and 9** remain **In-Progress** to maintain high testing standards.

- **Evidence:**  
  Test Traceability & Metrics Report shows **160% of Unit Testing goal** achieved, ensuring a **robust foundation**.

---

## Sprint 1 Execution Summary

- **Total Story Points Committed:** 18  
- **Total Story Points Completed:** 9  

- **Cumulative Flow Diagram:** View CFD Chart
  - [CFD Chart](https://github.com/users/ggonza39/projects/1/insights/3)


---

## Observations

**Did the sprint finish on time?**  
- **Yes.** The sprint concluded on **March 27th**.
   
- **Context:** While we closed **50% of points**, ~**85% of total sub-task workload** is technically complete. Stories were held in **"In-Progress"** due to missing final unit tests:  
  - Profile validation (#26)  
  - Preference persistence (#31)  
  - API updates (#33 / #36)

**Were story points re-estimated?**  
- **Yes.** Recalibrated effort for the **authentication handshake** mid-sprint to reflect actual complexity.

**Any scope changes?**  
- **Yes – Scope Growth:**  
  Added **User Story 11 (User Login)** as a separate **3-point story** to decouple it from registration for better security architecture. Scope moved from **15 → 18 points**.

- **Yes – Scope Refinement:**  
  Deferred **Image Validation** to the Product Backlog to avoid mid-sprint scope creep and maintain focus on **core delivery**.
