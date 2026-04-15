# Sprint 2 – Daily Scrum Documentation

**Date:** 04-09-2026

---

## 1. What did you do in the last 24 hours to help meet the Sprint Goal?

**Hunter Blake:**  
- Configured the profile-galleries Supabase Storage bucket and added access rules so authenticated users can view images and only upload or delete files within their own folder structure.
- Built the backend gallery photo workflow by creating the photo metadata table and the database function that lets one image be set as the single primary photo while syncing the profile’s avatar_url.
- Implemented the backend cleanup process for deleted photos by adding a delete queue, trigger, and Edge Function flow so removed photo records can also remove the related storage file.

**Heidi Wilder:**  
-

**Gibson Garner:**  
- 

**Takeshia Banks:**  
- Completend frontend implementation for US8
- Implemented file validation, instant preview, upload overlay, and retry handling
- Tested UI locally

**Anthony Nguyen:**  
- 

**Gilberto Gonzalez:**    
- Task Orchestration: Actively tracked and monitored the progress of all active User Stories to ensure velocity remains consistent with the Sprint 2 timeline.
- Blocker Mitigation: Conducted real-time task refinement to bypass technical hurdles and prevent resource bottlenecks.

---

## 2. What will you do in the next 24 hours to help meet the Sprint Goal?

**Hunter Blake:**  
- I will continue supporting development through the refinement of backend tasks as bugs and any inefficiencies are discovered.

**Heidi Wilder:**  
- 

**Gibson Garner:**  
- 

**Takeshia Banks:**  
- Support testing once backend Supabase configuration is complete for US8
- Starting US9
  
**Anthony Nguyen:**  
- 

**Gilberto Gonzalez:**  
- UI Oversight: Monitor the recovery plan for the delayed UI tasks to ensure the frontend team is unblocked for end of week integration.
- Documentation Audit: Update the project board to reflect refined tasks and ensure all sub-tasks are accurately pointed.


---

## 3. Impediments

**Identified Impediment:**  
  - UI Delivery Delay: Several UI design tasks have fallen behind the current sprint schedule, potentially impacting the frontend integration of the new components.
  
**Impediment Removal Plan:**  
  - Recovery Schedule: Coordinated with the UI lead (Heidi), who has committed to finalizing US3 & US8 UI tasks by 4/11.
  - Continue to monitor progress daily to ensure no further slippage (Anthony & Gilberto)
  
**Responsible (if applicable):**  
  - Heidi, Anthony, and Gilberto

---
