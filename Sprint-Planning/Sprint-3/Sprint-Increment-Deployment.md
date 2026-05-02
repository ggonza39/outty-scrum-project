## Sprint 3 – Increment Deployment

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
  - **v1.3.0**
---

## Key Features Included

- **Real-Time Messaging System (Story 7)**  
  Fully implemented in-app chat system using Supabase Realtime. Users can send and receive messages instantly without page refresh, with persistent storage in the database.

- **Live Presence Tracking**  
  Integrated Supabase Presence to display real-time online/offline user status via visual indicators, enabling more interactive communication.

- **Read Receipts & Message Status**  
  Implemented database-triggered read receipt logic. Messages update dynamically to reflect “sent” and “read” states based on user interaction.

- **Typing Indicators & Chat UX Enhancements**  
  Added live typing indicators and auto-scrolling chat window behavior to improve real-time communication experience.

- **Inbox & Conversation Management**  
  Built a Message Center with conversation previews, chronological sorting, and dynamic routing for seamless navigation between chats.

- **Push Notifications & Unread Badges**  
  Integrated browser notifications and in-app unread message badges to ensure users are alerted to new activity even when inactive.

- **Secure Messaging Architecture**  
  Enforced strict Supabase RLS policies ensuring only participants can access messages, with protections against unauthorized access, data leakage, and invalid inserts.

- **Comprehensive Testing Suite**  
  - Security & Privacy Tests validating RLS enforcement, payload protection, and access control.  
  - Real-Time Logic Tests covering sorting, presence tracking, read receipts, and UI stability.  
  - BDD Scenario validating real-time synchronization and message state accuracy.  

- **CI/CD Pipeline Integration**  
  GitHub Actions + Vercel pipeline ensured all tests passed before deployment. Final build was automatically deployed with production-ready stability and environment synchronization.

---

## Known Limitations

- **Discovery Feed Sync**  
  Newly created user accounts are not yet dynamically reflected in the discovery feed, which currently relies on placeholder/mock data. This is a known limitation due to project time constraints rather than a backend capability issue.

- **Limited Real-Time Collaboration Time**  
  While messaging features are fully functional, additional refinements (e.g., enhanced group chat or media messaging) were not implemented due to limited development time.

- **Testing Timing Optimization**  
  Although all required tests were completed successfully, some testing could have been initiated earlier in the sprint to further streamline validation.

---

## Final Deployment Summary

- All Sprint 3 backlog items were successfully completed.  
- The messaging system is fully functional, secure, and production-ready.  
- The application has been deployed to Vercel with automated CI/CD validation.  
- This release represents the final, complete version of the Outty platform.
