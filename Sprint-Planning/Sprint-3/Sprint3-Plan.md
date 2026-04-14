## Sprint 3 Plan



## Sprint Duration

* **April 20 – May 1**



## Team Capacity

* **Total Available Hours:** 72 hours (6 members × 6 hours/week × 2 weeks)

* **Effective Development Capacity:** 60–65 hours

- **Analysis:** The team is at peak efficiency. We have removed the "learning curve" overhead from Next.js and Supabase. However, we have allocated extra time for Real-time integration and E2E testing, as debugging asynchronous chat state and socket connections typically requires more intensive QA than standard CRUD operations.


## Forecasted Velocity

* **Forecasted Velocity:** 13 Story Points (High Complexity)

- **Analysis:** While the point total is lower than Sprint 2, the complexity density is significantly higher.

- **Focused Work:** 100% of efforts are dedicated to User Story 7 (Messaging).

- **Point-to-Hour Ratio:** Because messaging involves real-time triggers, presence tracking, and 12+ rigorous tests, these 13 points represent a deep technical dive rather than a broad feature set. This ensures the team can deliver a stable, production-ready communication suite for the final release.


## Selected Sprint Backlog Items

### New for Sprint 3

* **Story 7 – Send in-app messages – 13 pts**

### **Total:** 13 Story Points



## Sprint Goal

* **Goal:** Complete the Outty ecosystem by launching a real-time communication suite, enabling secure in-app messaging, live presence tracking, and instant notifications to bridge the gap between discovery and coordinated adventurer action.



## Rationale

The primary focus of Sprint 3 is to "close the loop" of the adventurer journey by transforming Outty from a discovery-only directory into a high-utility social ecosystem. While Sprints 1 and 2 established the data foundation and search intelligence, Sprint 3 provides the essential transactional utility required for users to act on their discoveries. By prioritizing User Story 7, the team is solving the final architectural hurdle: Secure Coordination. In a distributed system, this means moving beyond simple data retrieval to manage complex, stateful interactions between two private parties. We are engineering a "walled garden" where users can vet potential partners and coordinate trip logistics without the risk of platform leakage or the premature exposure of sensitive personal identifiers, such as emails or phone numbers.

This final push is driven by three core pillars: Privacy, Engagement, and Technical Rigor. From a security perspective, implementing an internal messaging suite ensures that user data remains encrypted and protected under our established Row Level Security (RLS) policies. To drive engagement, we are integrating low-latency features like live presence tracking and typing indicators; these are not merely aesthetic additions but are critical for establishing "User Trust"—the signal that the platform is active and reliable. Finally, dedicating the entire 2-week sprint to a single, high-complexity story allows the team to enforce a strict quality gate. By backing our real-time logic with ten targeted unit tests and BDD validation, we ensure the messaging infrastructure is robust, scalable, and fully prepared for the final project showcase.
