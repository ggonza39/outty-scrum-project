## Sprint 2 – Increment Deployment

---

## Deployment Environment

- **Platform:** Vercel  
- **Environment:** Production / Staging  
- **Framework:** Next.js / Tailwind CSS / PostGIS
- **Backend:** Supabase (PostgreSQL / Auth / Storage)

---

## Live Application Link

-  [Outty App](https://outty-scrum-project.vercel.app/)

---

## Deployment Notes

- **Version Deployed:** (Stable Sprint 2 Release)  
  - **v2.0.0**
---

## Key Features Included

- **Advanced Discovery Engine (Story 5)** Successfully integrated **PostGIS** for geographic intelligence. Users can now filter search results by distance radius (0-500 miles), age ranges, and specific activity intersections using a dynamic query builder.

- **Integrated Media Gallery (Story 8)** Implemented the **profile-galleries** Supabase Storage bucket. Users can now upload, preview, and manage travel photos with enforced RLS security, ensuring private folders remain isolated.

- **Personal Profile & Explorer Views (Story 3 & 6)** Launched high-fidelity profile layouts for both "Self-View" and "Explorer-View." Includes dynamic routing (`/discover/[username]`) and a **View Tracking** system to monitor profile engagement.

- **Unified Account Management (Story 2, 4, 9)** Resolved the persistence limitations from Sprint 1. Profile creation, adventure preferences, and account deletion are now fully functional with 100% data persistence to the Supabase database.

- **Enhanced Security & Quality Gate** The deployment pipeline now includes **34 Unit Tests** and **6 BDD Scenarios**, specifically covering PostGIS distance accuracy, storage RLS policies, and cross-category filtering logic.

---

## Known Limitations

- **Real-Time Communication (Story 7)** The "Message" Floating Action Button (FAB) is visible on Explorer profiles as a UI placeholder; however, the real-time chat infrastructure is scheduled for the Sprint 3 "Secure Coordination" milestone.

- **Mobile Keyboard UI Bug:**
  - **Issue:** On mobile devices, the footer navigation is pushed upward or obscures input fields when the virtual keyboard is active in the "Filter Drawer."
  - **Status:** Identified by QA in the final week of Sprint 2.
  - **Sprint 3 Resolution:** We plan to implement a CSS `visualViewport` resize listener to dynamically hide or adjust the footer position when the keyboard is engaged.

- **Image Optimization Latency:**
  - **Issue:** High-resolution gallery uploads (>3MB) experience a slight delay before the "Primary" photo updates across all components.
  - **Sprint 3 Resolution:** Implementing a more robust client-side "Preview Toggle" and background compression to improve perceived performance.
