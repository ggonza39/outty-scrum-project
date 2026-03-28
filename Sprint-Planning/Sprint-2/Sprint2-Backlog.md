# Sprint 2 Backlog

Sprint Goal: 
- Transform 'Outty' into a high-utility discovery platform by launching a location-intelligent search engine, personalized user dashboards, and a robust media gallery system to facilitate national adventurer connections.
---

## Project Board Link:
- [Project Board](https://github.com/users/ggonza39/projects/1/views/1?reload=1)

---

## User Story 5: Advanced Discovery & Multi-Criteria Filtering (10 pts)

**Goal:** As an Adventurer looking for a compatible travel partner, I want to access a centralized discovery engine with advanced filters for location, demographics, and specific activities, so that I can find the most relevant travel companions who match my specific trip requirements, whether they are local or across the country.

### UI/UX Tasks
- **Task 1:** Design an **"Advanced Search Drawer"** or Modal that neatly categorizes filters: **Location**, **Demographics**, **Skill Levels**, and **Activities**.
- **Task 2:** Create a **"Distance Slider"** UI component (e.g., 0 to 500+ miles) to complement the Zip/City search.
- **Task 3:** Design a **"Gender & Age Range"** selection tool (e.g., a dual-handle slider for age: 21–45).

### Backend Tasks
- **Task 4:** Refactor the `GET /discover` API to support a complex `jsonb` query object containing `min_age`, `max_age`, `gender`, `activity_list[]`, `skill_level`, and `location_data`.
- **Task 5:** Build a **dynamic SQL query builder** (or use Supabase `.filter()`) that conditionally appends `WHERE` clauses only for the filters the user has active.
- **Task 6:** **PostGIS Integration:** Implement PostGIS on the Supabase profiles table to calculate distances between Zip Codes/Coordinates for the **Distance** filter.

### Frontend Tasks
- **Task 7:** Create a **"Search State" Provider** (using React Context or URL params) to manage the global state of all 7+ filter variables.
- **Task 8:** Implement **"Auto-Suggest"** for the City/State input to ensure users enter valid geographic data.
- **Task 9:** Build the **"Results Header"** that dynamically updates, e.g.: *"Showing 14 Hikers, Men, Ages 25-40, within 50 miles of 30301."*

### Testing Tasks
- **Task 10 (Unit):** Validate Multi-Criteria Age-Range Logic.
  - Test Case A (Boundaries): Verify query correctly includes/excludes users based on integer age field.
  - Test Case B (Null/Optional): Ensure feed remains functional if age is null or filter is blank.
  - Test Case C (Integrity): Validate that API rejects non-integer or unrealistic age inputs.
- **Task 11 (Unit):** Test the **Intersection Logic**: If "Hiking" AND "Men" are selected, results only show users who meet both.
- **Task 12 (BDD):** **Scenario: Cross-category filtering**
  - **Given** User A is looking for a travel buddy
  - **When** they filter for **"Activity: Camping" AND "Gender: Female" AND "State: Colorado"**
  - **Then** the feed refreshes to show only matching profiles.

---

## User Story 3: Personal Profile Dashboard & View (4 pts)

**Goal:** As a logged-in user, I want a dedicated **"My Profile"** page that displays my information exactly as others see it, serving as the central hub for managing my account.

### UI/UX Tasks
- **Task 1:** Design the **"Self-View" Dashboard** layout (Mirrors Story 6 for consistency).
- **Task 2:** Add a prominent **"Edit Profile"** toggle button to render the **Profile Edit Form (#32)** from Story 9.
- **Task 3:** Design a **"Settings/Danger Zone"** section for the **Delete Account button (#35)** from Story 9.

### Backend Tasks
- **Task 4:** Create a **GET `/profile/me` helper function** using Supabase Auth Session (no UUID in URL).
- **Task 5:** Map the **"View Count"** logic from Story 6 so the user can see engagement on their own dashboard.

### Frontend Tasks
- **Task 6:** Build **Route Protection**: Ensure `/profile` is a **Protected Route** that redirects unauthenticated visitors to Login.
- **Task 7:** Implement the **State Switcher**: Create a React state (`isEditing`) to toggle between Dashboard and Edit Form.

### Testing Tasks
- **Task 8 (Unit):** **Session Persistence**: Verify profile re-loads correctly after a page refresh if session is active.
- **Task 9 (BDD):** **Scenario: Accessing the Dashboard**
  - **Given** I am logged into Outty
  - **When** I click on **"My Profile"**
  - **Then** I see my **photo, bio, and adventure tags** in a non-editable view.

---

## User Story 6: View Explorer Profiles (4 pts)

**Goal:** As a Discovering Adventurer, I want to access a full-page profile view for any user in the feed so I can evaluate their bio and experience before messaging.

### UI/UX Tasks
- **Task 1:** Design a **"Profile Detail" layout** (Header, Adventure Tags, and "About Me" sections).
- **Task 2:** Design a **"Message" FAB** to keep the call-to-action reachable while scrolling.
- **Task 3:** Create a visual **"Back" navigation element** to return to filtered results.

### Backend Tasks
- **Task 4:** Develop a specialized `GET /profile/:id` API route returning only **public fields**.
- **Task 5:** Implement **"View Tracking"** to increment the `profile_views` counter.

### Frontend Tasks
- **Task 6:** Build the **Dynamic Route** (`/discover/[username]`) in Next.js.
- **Task 7:** Implement **Skeleton Loading** states for a responsive data-fetching experience.
- **Task 8:** Create a **"Share Profile"** utility for copying direct links to the clipboard.

### Testing Tasks
- **Task 9 (Unit):** **Data Privacy Check**: Verify API response excludes password, email, or precise physical address.
- **Task 10 (Unit):** **Error Boundary Test**: Ensure a clean **"User Not Found"** message for invalid IDs.
- **Task 11 (BDD):** **Scenario: Deep-linking**
  - **Given** a user has a direct URL to an adventurer’s profile
  - **Then** the page renders the **bio, tags, and distance** correctly.

---

## User Story 8: Upload & Manage Profile Photo Gallery (5 pts)

**Goal:** As an adventurer, I want to upload and organize travel photos so my profile accurately represents my experience.

### UI/UX Tasks
- **Task 1:** Design a **"Gallery Management"** interface with a grid and upload button.
- **Task 2:** Create **"Delete"** and **"Set as Primary"** overlays for easy organization.
- **Task 3:** Design a **"Progress Indicator"** for high-resolution image processing.

### Backend Tasks
- **Task 4:** Configure **Supabase Storage** `profile-galleries` with RLS policies.
- **Task 5:** Create a database function to update `avatar_url` when a new **"Primary"** photo is chosen.
- **Task 6:** Implement a **Storage Cleanup Trigger** to remove physical files upon deletion.

### Frontend Tasks
- **Task 7:** Integrate `supabase.storage.upload` with file type/size (5MB) restrictions.
- **Task 8:** Build **Client-Side Preview** logic for immediate visual feedback.
- **Task 9:** Add a **Preview Toggle** for both "Circular Avatar" and "Square Card" formats.

### Testing Tasks
- **Task 10 (Unit):** **File Type Validation**: Ensure the system rejects non-image formats.
- **Task 11 (Unit):** **Security Policy**: Verify User A cannot delete User B’s photos.
- **Task 12 (BDD):** **Scenario: Managing the gallery**
  - **When** a user uploads a photo and clicks **"Set as Primary"**
  - **Then** that photo becomes the main image on their **Discovery card**.

