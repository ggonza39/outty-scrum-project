# Outty App 2.0 – Adventure Identity Portal

- **Live Demo:** [Outty 2.0](https://outty-app20.vercel.app/)
  
- **Status:** Stable / Production-Ready (Demo Build)

---

## The Purpose of 2.0
Outty 2.0 represents the transition from conceptual architecture to a high-fidelity, user-centric matching platform. This version focuses on the **"Identity & Discovery"** phase of the user journey—ensuring that the first touchpoint (Auth, Onboarding, and Global Navigation) feels as rugged and adventurous as the activities the app supports.

### Core Objectives:
* **Zero-Latency Auth:** Implementing a seamless Supabase authentication flow with high-performance edge routing.
* **Immersive UI/UX:** A "Glassmorphism" aesthetic designed for outdoor enthusiasts, utilizing deep dark modes and high-visibility emerald accents.
* **Robust Navigation:** A unified `GlobalNav` system featuring real-time unread message counts and session persistence.
* **Stability for Demo:** A hardened codebase that gracefully handles edge cases like session timeouts, manual URL manipulation, and logout redirects.

---

## Technical Stack (The 2.0 Evolution)

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15 (App Router)** | Server-side rendering & optimized client-side transitions. |
| **Styling** | **Tailwind CSS** | Custom utility-first design system with an "Adventure" theme. |
| **Icons** | **Lucide-React** | Lightweight, consistent iconography for intuitive navigation. |
| **Backend** | **Supabase** | Real-time PostgreSQL database & Auth GoTrue integration. |
| **Deployment**| **Vercel** | CI/CD pipeline with instant edge-network delivery and preview builds. |
| **State** | **React Hooks** | Managing complex UI states (Modals, Toasts, and Auth status). |

---

## Key Features (Live for Demo)

### 1. The Adventure Bouncer & Onboarding Guard
* **Persistent Onboarding:** Implemented a "Completion Gate"—users who cancel profile creation are warned and restricted from the discovery dashboard. Re-logging in automatically routes incomplete profiles back to the Onboarding Portal to ensure data integrity.
* **Dynamic Identity Creation:** Real-time **Username Availability** checks and automated **Geolocation** (Zip-to-City/State) to minimize friction during setup.
* **Media Management:** Bulk upload support for up to 6 high-resolution adventure photos with a "Pre-flight" preview mode before final submission. Photos can be expanded into a seamless full-screen "Lightbox" view and closed instantly.
* **Session Guard:** An "Adventure Timed Out" modal that prevents unauthorized access to private routes if a session expires or is manually cleared.

### 2. Global Command Center (`GlobalNav`) & Real-Time Presence
* **Presence Indicators:** Visual "Live Status" via glowing/pulsing avatar rings and "Online Now" glowing text, powered by Supabase Realtime.
* **Centralized Inbox & InstaChat:** Dual-layer messaging with a general inbox and a persistent floating "InstaChat" button for immediate engagement.
* **Live Notification Sync:** Dynamic unread counters on both the chat toggle and main navigation that clear instantly upon reading.
* **Navigation Lock:** The "Outty" logo/home redirect is intelligently disabled during profile creation and editing to prevent accidental data loss or process cancellation.

### 3. High-Fidelity "Glass" UI & Environment Effects
* **Atmospheric Backgrounds:** Context-aware visual effects including **Shimmer**, **Snow Particles**, **Dynamic Lighting**, **Flashes**, and **Wind** effects to match the outdoor theme.
* **Precision Filtering:** A right-side drawer interface in the Dashboard allowing for precise **Mileage Radius** filtering and activity matching.
* **Adaptive Design:** Fully responsive views tailored for Mobile (Slide-out blur menu) vs. Desktop (Floating glass bar).

### 4. Profile Management & Accessibility
* **Self-Service Portal:** A dedicated Settings page allowing users to toggle **Profile Visibility** (Invisible Mode) or permanently delete their account.
* **Edit-in-Place:** Users are redirected to a personalized profile view post-onboarding where they can refine their adventure identity.
* **The "Outty Way":** A simplified, step-by-step "How it Works" guide integrated into the populated About Page, accessible via the persistent global footer.
---

## Demo Limitations & Roadmap

To ensure maximum stability for the live presentation, the following constraints are currently in place:

* **Authentication & Security:** Single-factor authentication only; **Multi-factor (MFA) layers** are not yet active.
    * **Password Reset** functionality is disabled for the demo build to simplify account management.
    * Security protocols for **concurrent multi-device logins** or automated **session timeout sign-outs** are pending implementation.
* **Account Controls:** While the button exists in Settings, **Account Suspension** is not yet functional (users can currently only toggle Visibility or Delete).
* **Messaging Management:** The Inbox is "Read/Reply Only." Features to **Delete** or **Archive** conversations have been scoped for the post-demo sprint.
* **Responsive Layouts:** Design is strictly optimized for **Desktop** and **Mobile**. Intermediate tablet sizes or ultra-wide monitors have not been fully formatted yet.
* **Discovery Logic:** Dashboard sorting is currently based on direct database query results and active user filters; complex automated "compatibility scoring" is in development for future releases.

---

## Development Team

* **Scrum Master:** Gilberto Gonzalez
* **Product Owner:** Anthony Nguyen
* **UI/UX Design:** Heidi Wilder
* **Frontend Design:** Takeshia Banks
* **Backend Design:** Hunter Blake
* **Testing & Quality:** Gibson Garner

---

## Getting Started (Local Dev)

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/ggonza39/outty-scrum-project.git](https://github.com/ggonza39/outty-scrum-project.git)
    ```
2.  **Navigate to the App 2.0 Directory:**
    ```bash
    cd Application-2.0
    ```
3.  **Install Dependencies:**
    ```bash
    npm install
    ```
4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

---

> **Built for the Wild.** Designed by the Outty Scrum Team. © 2026.
