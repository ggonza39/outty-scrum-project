# Sprint 1 Backlog

Sprint Goal: Establish the core authentication and profile management features of Outty.

---

## Story 1 – User Account Creation (5 pts)

### Backend Tasks
- Configure Supabase project and enable authentication provider
- Set up environment variables in Next.js (.env.local)
- Implement registration API integration with Supabase
- Handle authentication error responses

### Frontend Tasks
- Design registration form in Figma
- Implement registration form component in Next.js
- Add client-side form validation (email, password strength)
- Connect registration form to Supabase authentication

### Testing Tasks
- Write unit test for form validation logic
- Write integration test for successful registration
- Write Playwright E2E test for account creation flow

---

## Story 2 – Create Adventure-Based User Profile (3 pts)

- Design PostgreSQL profile table schema in Supabase
- Create profile creation form UI component
- Implement profile submission API call
- Associate profile with authenticated user ID
- Write unit test for profile validation logic

---

## Story 3 – Set Adventure Preferences (3 pts)

- Extend profile schema to include adventure preferences
- Implement preferences selection UI (checkboxes/tags)
- Persist preferences to database
- Validate preference input
- Write unit test for preference persistence

---

## Story 4 – Edit or Delete Profile (3 pts)

- Implement profile edit form pre-filled with existing data
- Implement update profile API call
- Implement delete profile functionality
- Add confirmation modal for deletion
- Write unit test for update/delete logic

---

## Story 5 – Log Out Securely (1 pt)

- Implement logout button in navigation
- Connect logout to Supabase session termination
- Redirect user to login page after logout
- Write unit test for logout behavior

---

## Story 6 – View Matched Profiles (UI Stub) (2 pts)

- Create mock matched user dataset
- Design matched profile card UI component
- Render list of matched profile cards
- Add placeholder routing for future matching logic
