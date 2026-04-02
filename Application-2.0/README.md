# Outty App 2.0 – Adventure Identity Portal

**Live Demo:** [Outty 2.0](https://outty-app20.vercel.app/)  
**Status:** Stable / Production-Ready (Demo Build)

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

### 1. The Adventure Bouncer (Auth & Security)
* **Secure Entry:** Full Email/Password authentication flow via Supabase.
* **Session Guard:** An "Adventure Timed Out" modal that prevents unauthorized access to private routes if a session expires or is manually cleared.
* **Intelligent Logout:** A multi-stage logout process that clears local/session storage, updates user "Online" status, and triggers a smooth, animated "Adventure Paused" toast.

### 2. Global Command Center (`GlobalNav`)
* **Adaptive Navigation:** Fully responsive views tailored for Mobile (Slide-out blur menu) vs. Desktop (Floating glass bar).
* **Real-time Intelligence:** Utilizes PostgreSQL listeners to update unread message badges instantly without requiring page refreshes.
* **Context Awareness:** Navigation elements automatically hide on critical-focus pages (Login/Onboarding) to streamline the user experience.

### 3. Responsive "Glass" UI
* **Mobile-First Design:** Optimized for one-handed use and high-glare outdoor environments.
* **Smooth Motion:** Custom CSS animations (`fade-in`, `slide-in`, `zoom-in`) provide a premium, tactile feel during the investor pitch.

---

## Demo Limitations & Roadmap

As this is the **Sprint 2/3 Stable Build**, the following constraints apply for the live demo:
* **Profile Persistence:** While account creation is live, advanced profile editing/photo uploads are scoped for the final release.
* **Matching Algorithm:** The swipe-based discovery UI is functional; however, the "Experience-Based" sorting logic currently utilizes mock-data weights for demonstration purposes.
* **Messaging:** Real-time listeners are active, but message history is limited to the current active database records.

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
