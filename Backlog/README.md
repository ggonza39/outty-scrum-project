# Product Backlog

The product backlog for the Outty project is managed using GitHub Projects.

Backlog URL:
https://github.com/users/ggonza39/projects/1

---

## Backlog Ordering Rationale

The product backlog is ordered based on a combination of business value, technical dependencies, risk reduction, and learning priorities.

Foundational features such as user account creation are prioritized first because they enable secure access to the application and are required before any user-specific data can be stored or retrieved. Without authentication in place, no other functionality can be meaningfully validated.

User profile creation and adventure preference selection are ordered next because they establish the core data model required for matching users. These features allow the system to collect structured information about users’ interests, skill levels, and availability, which directly supports the application’s primary goal of adventure-based matching.

Core matching functionality, including swipe-based discovery and distance filtering, is prioritized early to validate the central value proposition of Outty. Implementing these features early reduces product risk by confirming that users can successfully discover and connect with relevant adventure partners within a defined geographic range.

Once matching is established, viewing matched profiles and in-app messaging are introduced to enable meaningful interaction and coordination between users. These features depend on successful matches and therefore logically follow the matching functionality.

Enhancement features such as photo uploads, profile editing, and secure logout are placed later in the backlog. While important for usability, security, and user experience, these items are lower risk and depend on previously implemented core functionality. Prioritizing them later allows the team to focus first on delivering and validating the most critical aspects of the product.

---

## Current Backlog (Ordered)

1. User account creation – 5 pts

2. Create adventure-based user profile – 3 pts

3. Swipe and match with nearby adventurers – 8 pts

4. Set adventure preferences – 3 pts

5. Filter matches by distance – 5 pts

6. View matched user profiles – 2 pts

7. Send in-app messages – 8 pts

8. Upload profile photos – 5 pts

9. Edit or delete profile – 3 pts

10. Log out securely – 1 pt

### **Estimation Approach**
Story points were assigned using relative estimation rather than time-based estimation. The team considered factors such as technical complexity, required effort, uncertainty, and potential dependencies.

Each Product Backlog Item (PBI) was compared against previously estimated items to determine whether it was smaller, similar in size, or larger in scope. Higher story points reflect greater implementation complexity or uncertainty, while lower story points represent well-understood or narrowly scoped functionality.

Estimation was performed sequentially, starting at the top of the backlog and working downward to the bottom, to ensure consistent relative comparison across all items.

**Note:** Each Product Backlog Item (PBI) is listed by its summary title for scannability. The full User Stories and other detailed technical requirements are documented within the description field of each individual item on the GitHub Project board.

---


