## Sprint 1 – Increment Deployment

---

## Deployment Environment

- **Platform:** Vercel  
- **Environment:** Production / Preview  
- **Framework:** Next.js / Tailwind CSS  
- **Backend:** Supabase (PostgreSQL / Auth)

---

## Live Application Link

- **Outty - Sprint 1 Production Build**
  [Outty App](https://outty-scrum-project.vercel.app/)

---

## Deployment Notes

- **Version Deployed:**  
  **v1.1.0 (Stable Sprint 1 Release)**

---

## Key Features Included

- **Verified Supabase Handshake**  
  Successfully resolved initial library pathing issues. The application now securely communicates with Supabase for **user authentication** and **data persistence**.

- **Functional Authentication Flow**
  - **Sign-Up:** Users can create accounts with real-time client-side validation (**8+ characters required**).
  - **Secure Login (Story 11):** Dedicated login path allows registered users to access the dashboard.
  - **Secure Logout (Story 10):** Session termination is verified; unauthorized access via back-button or direct URL is blocked after logout.

- **Mobile-First Responsive UI**  
  High-fidelity, scrollable **Outty interface** based on Figma templates, optimized for mobile for now.

- **Automated Quality Gate**  
  Production-ready code validated with **16 Unit Tests** and **2 BDD Tests**, integrated into the deployment pipeline.

---

## Known Limitations

- **Profile Persistence (Stories 2, 4, 9)**  
  UI for Profile Creation, Preferences, and Editing is fully interactive; however, final data persistence depends on completion of backend API validation and unit tests *(Sub-issues #26, #31, #36)*.

- **Browser Cache Persistence (Post-Logout):**
  - **Issue:** After a successful logout, the browser’s "Back" button may still display cached versions of authenticated pages (e.g., the Dashboard).
  - **Status:** While the active session is correctly terminated in Supabase—preventing any further API interaction or data fetching—the UI remains visible in the browser history.
  - **Sprint 2 Resolution:** We plan to implement specific Cache-Control headers (e.g., no-store, no-cache) and a layout-level middleware check to ensure that a hardware or software "Back" command triggers a fresh authentication verification.

- 
