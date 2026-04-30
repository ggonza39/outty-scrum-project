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
  - **v1.2.0**
---

## Key Features Included

- **Advanced Discovery Engine (Story 5)** Successfully integrated **PostGIS** for geographic intelligence. Users can now filter search results by distance radius (0-500 miles), age ranges, and specific activity intersections using a dynamic query builder.

- **Integrated Media Gallery (Story 8)** Implemented the **profile-galleries** Supabase Storage bucket. Users can now upload, preview, and manage travel photos with enforced RLS security, ensuring private folders remain isolated.

- **Personal Profile & Explorer Views (Story 3 & 6)** Launched high-fidelity profile layouts for both "Self-View" and "Explorer-View." Includes dynamic routing (`/discover/[username]`) and a **View Tracking** system to monitor profile engagement.

- **Unified Account Management (Story 2, 4, 9)** Resolved the persistence limitations from Sprint 1. Profile creation, adventure preferences, and account deletion are now fully functional with 100% data persistence to the Supabase database.

- **Enhanced Security & Quality Gate** The project has achieved a comprehensive test suite of **81 total assertions** and **6 BDDs**, providing deep coverage for PostGIS distance accuracy, storage RLS policies, and cross-category filtering logic.
  - **Automated CI Gate:** **61 Unit & Integration and BDD tests** are executed on every Vercel merge to ensure high-velocity deployment stability.
  - **Local E2E Suite:** **Playwright Tests** are maintained in a local environment to validate complex browser-based sessions and multi-user interactions without compromising CI pipeline performance.

---

## Known Limitations

- **Real-Time Communication (Story 7)** The "Message" Floating Action Button (FAB) is visible on Explorer profiles as a UI placeholder; however, the real-time chat infrastructure is scheduled for the Sprint 3 "Secure Coordination" milestone.

