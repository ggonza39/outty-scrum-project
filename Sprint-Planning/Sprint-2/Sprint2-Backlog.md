# Sprint 2 Backlog

Sprint Goal: 
- Transform 'Outty' into a high-utility discovery platform by launching a location-intelligent search engine, personalized user dashboards, and a robust media gallery system to facilitate national adventurer connections.
---

## Project Board Link:
- [Project Board](https://github.com/users/ggonza39/projects/1/views/1?reload=1)

---

## User Story 5: Advanced Discovery & Multi-Criteria Filtering (10 pts)

**Goal:** As an Adventurer looking for a compatible travel partner, I want to access a centralized discovery engine with advanced filters for location, demographics, and specific activities, so that I can find the most relevant travel companions who match my specific trip requirements, whether they are local or across the country.

---

### UI/UX Tasks

- **Task 1:** Design an **"Advanced Search Drawer"** or Modal that neatly categorizes filters: **Location**, **Demographics**, **Skill Levels**, and **Activities**.  
- **Task 2:** Create a **"Distance Slider"** UI component (e.g., 0 to 500+ miles) to complement the Zip/City search.  
- **Task 3:** Design a **"Gender & Age Range"** selection tool (e.g., a dual-handle slider for age: 21–45).  

---

### Backend Tasks

- **Task 4:** Refactor the `GET /discover` API to support a complex `jsonb` query object containing `min_age`, `max_age`, `gender`, `activity_list[]`, `skill_level`, and `location_data`.  
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

## User Story 3: Personal Profile Dashboard & View (4 pts)

**Goal:** As a logged-in user, I want a dedicated **"My Profile"** page that displays my information exactly as others see it, serving as the central hub for managing my account.

---

### UI/UX Tasks

- **Task 1:** Design the **"Self-View" Dashboard** layout.  
  - Note: We ust use the exact same components in the **Explorer Profile (Story 6)** to ensure visual consistency across the app.  

- **Task 2:** Add a prominent **"Edit Profile"** toggle button that, when clicked, renders the **Profile Edit Form (#32)** from Story 9.  

- **Task 3:** Design a **"Settings/Danger Zone"** section at the bottom to house the **Delete Account button (#35)** from Story 9.  

---

### Backend Tasks

- **Task 4:** Create a **GET `/profile/me` helper function**.  
  - Use the user's Supabase Auth Session to fetch the correct record securely (no UUID in URL).  

- **Task 5:** Map the **"View Count"** logic from Story 6 so the user can see their own total profile views on this dashboard.  

---

### Frontend Tasks

- **Task 6:** Build **Route Protection**: Ensure `/profile` is a **Protected Route** that redirects unauthenticated visitors to the Login page.  

- **Task 7:** Implement the **State Switcher**: Create a React state (e.g., `isEditing`) that toggles the UI between the **Read-Only Dashboard** and the **Edit Form**.  
  - **Coordination Note:** This connects Story 3's layout to Story 9's existing form (#32).  

---

### Testing Tasks

- **Task 8 (Unit):** **Session Persistence**: Verify that the profile page correctly re-loads the user's data after a page refresh if the session is still active.  

- **Task 9 (BDD):** **Scenario: Accessing the Dashboard**  
  - **Given** I am logged into Outty  
  - **When** I click on **"My Profile"** in the navigation  
  - **Then** I see my **photo, bio, and adventure tags** displayed in a non-editable view

---
## User Story 6: View Explorer Profiles (4 pts)

**Goal:** As a Discovering Adventurer browsing the national feed, I want to access a full-page, detailed profile view for any user who matches my search criteria, so that I can evaluate their bio, adventure experience, and location to ensure compatibility before initiating a direct conversation.

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

## User Story 8: Upload & Manage Profile Photo Gallery (5 pts)

**Goal:** As an adventurer, I want to upload, organize, and delete photos of my travels so that my profile accurately represents my personality and experience.

---

### UI/UX Tasks

- **Task 1:** Design a **"Gallery Management"** interface with a clear **"Upload Photo"** button and a grid of existing user images.  
- **Task 2:** Create **"Delete"** and **"Set as Primary"** overlays (e.g., a trash icon or star icon) that appear when hovering or tapping an image in the management view.  
- **Task 3:** Design a **"Progress Indicator"** (spinner or bar) to show the user that their high-resolution image is currently being processed and uploaded.  

---

### Backend Tasks

- **Task 4:** Configure a **Supabase Storage Bucket** named `profile-galleries` with specific RLS (Row Level Security) policies so users can only upload to/delete from their own folders.  
- **Task 5:** Create a **database function** to automatically update the `profiles` table's `avatar_url` whenever a user selects a new **"Primary"** photo.  
- **Task 6:** Implement a **Storage Cleanup Trigger**: Ensure that if a user deletes a photo from the UI, the physical file is also removed from Supabase Storage to save space.  

---

### Frontend Tasks

- **Task 7:** Integrate the `supabase.storage.upload` method with a file picker that restricts uploads to **image formats** (.jpg, .png, .webp) and a **maximum file size** (e.g., 5MB).  
- **Task 8:** Build **Client-Side Preview** logic so the user sees their photo immediately while the background upload is still finishing.  
- **Task 9:** Add a "Preview Toggle" so the user can see how their uploaded photo will appear in both the "Circular Avatar" and the "Square Discovery Card" formats before they hit save.

---

### Testing Tasks

- **Task 10 (Unit):** **File Type Validation**: Write a unit test to ensure the upload function rejects non-image files (e.g., .pdf, .exe) and provides a clear error message to the user.  
- **Task 11 (Unit):** **Test the Security Policy**: Verify that User A cannot trigger a deletion of User B’s photos via a direct API call.  
- **Task 12 (BDD):** **Scenario: Managing the gallery**  
  - **Given** a user is on their **"Edit Profile"** page  
  - **When** they upload a new photo and click **"Set as Primary"**  
  - **Then** that photo becomes the main image shown on their **Discovery card** and in the header.
 
---

