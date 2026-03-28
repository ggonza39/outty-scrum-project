# Sprint 2 Backlog

Sprint Goal: 

---

## User Story 5: Advanced Discovery & Multi-Criteria Filtering (10 pts)

**Goal:** Empower users to find specific travel partners by combining **location** (City, State, Zip, Distance), **demographics** (Age, Gender), and **Adventure Activity**.

---

### UI/UX Tasks

- **Task 1:** Design an **"Advanced Search Drawer"** or Modal that neatly categorizes filters: **Location**, **Demographics**, and **Activities**.  
- **Task 2:** Create a **"Distance Slider"** UI component (e.g., 0 to 500+ miles) to complement the Zip/City search.  
- **Task 3:** Design a **"Gender & Age Range"** selection tool (e.g., a dual-handle slider for age: 21–45).  

---

### Backend Tasks

- **Task 4:** Refactor the `GET /discover` API to support a complex `jsonb` query object containing `min_age`, `max_age`, `gender`, `activity_list[]`, and `location_data`.  
- **Task 5:** Build a **dynamic SQL query builder** (or use Supabase `.filter()`) that conditionally appends `WHERE` clauses only for the filters the user has active.  
- **Task 6:** **PostGIS Integration:** Implement PostGIS on the Supabase profiles table to calculate distances between Zip Codes/Coordinates for the **Distance** filter.  

---

### Frontend Tasks

- **Task 7:** Create a **"Search State" Provider** (using React Context or URL params) to manage the global state of all 7+ filter variables.  
- **Task 8:** Implement **"Auto-Suggest"** for the City/State input to ensure users enter valid geographic data.  
- **Task 9:** Build the **"Results Header"** that dynamically updates, e.g.:  
  *"Showing 14 Hikers, Men, Ages 25-40, within 50 miles of 30301."*  

---

### Testing Tasks

- **Task 10 (Unit):** Validate Multi-Criteria Age-Range Logic.  
  - Test Case A (Boundaries): Verify the search query correctly includes or excludes users based on an integer age field (e.g., searching for 25–30 correctly excludes a 24-year-old and a 31-year-old).
  - Test Case B (Null/Optional): Ensure the discovery feed remains functional and displays users even if their age field is null (if optional) or if the search filter is left blank.  
  - Test Case C (Integrity): Validate that the POST /profile API rejects non-integer or unrealistic age inputs (e.g., "abc", "-5", or "200") to prevent corrupting the
discovery results.
- **Task 11 (Unit):** Test the **Intersection Logic**: If "Hiking" AND "Men" are selected, results only show users who meet both criteria.  
- **Task 12 (BDD):** **Scenario: Cross-category filtering**  
  - **Given** User A is looking for a travel buddy  
  - **When** they filter for **"Activity: Camping" AND "Gender: Female" AND "State: Colorado"**  
  - **Then** the feed refreshes to show only profiles matching all three specific requirements.  

---
## User Story 6: View Explorer Profiles (4 pts)

**Goal:** Allow users to click on any profile from the **Discovery Feed** to view a full-page, detailed summary of that adventurer before deciding to message them.

---

### UI/UX Tasks

- **Task 1:** Design a **"Profile Detail" layout** with clear hierarchy:  
  - High-resolution header (Profile Photo / Name / Age)  
  - Middle section for **Adventure Tags**  
  - Bottom section for **"About Me" bio**

- **Task 2:** Design a **"Message" Floating Action Button (FAB)** or fixed footer button to keep the **Start Conversation** call-to-action always reachable while scrolling.

- **Task 3:** Create a visual **"Back" navigation element** indicating the user is returning to their filtered Discovery results.

---

### Backend Tasks

- **Task 4:** Develop a specialized `GET /profile/:id` API route.  
  - Ensure this route returns only **public fields**, excluding private data (e.g., UUIDs, email addresses).

- **Task 5:** Implement **"View Tracking"** in the database to increment a `profile_views` counter, allowing users to see engagement on their own profile.

---

### Frontend Tasks

- **Task 6:** Build the **Dynamic Route** (`/discover/[username]`) in Next.js to fetch and render specific user data based on the URL parameter.

- **Task 7:** Implement **Skeleton Loading** states to keep the page fast and responsive while fetching profile data from Supabase.

- **Task 8:** Create a **"Share Profile"** utility that copies a direct link to the user's clipboard for external sharing.

---

### Testing Tasks

- **Task 9 (Unit):** **Data Privacy Check**  
  Verify that the profile API response does **not** contain the user's password hash, email, or precise physical address.

- **Task 10 (Unit):** **Error Boundary Test**  
  Ensure the UI displays a clean **"User Not Found"** message if a traveler tries to access a non-existent profile ID.

- **Task 11 (BDD):** **Scenario: Deep-linking to an Explorer**  
  - **Given** a user has a direct URL to an adventurer’s profile  
  - **When** they navigate to that URL while logged in  
  - **Then** the page correctly renders the explorer's **bio, adventure tags, and distance**

---
