# Sprint 1 Backlog

- Sprint Goal: Establish the core authentication and profile management features of Outty.

---

## Project Board Link:
- [Project Board](https://github.com/users/ggonza39/projects/1/views/1?reload=1)

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
## Story 11 – User Login (3 pts)

### Backend Tasks
- Implement login API integration with Supabase

### Frontend Tasks
- Design login form UI
- Implement login form component
- Implement login redirect and session handling

### Testing Tasks
- Test login authentication flow

## Story 2 – Create Adventure-Based User Profile (3 pts)

### Backend Tasks
- Design PostgreSQL profile table schema in Supabas
- Implement profile submission API call
- Associate profile with authenticated user ID

### Frontend Tasks  
- Create profile creation form UI component
- Implement profile setup onboarding flow

### Testing Tasks  
- Write unit test for profile validation logic

---

## Story 4 – Set Adventure Preferences (3 pts)

### Backend Tasks 
- Extend profile schema to include adventure preferences
- Persist preferences to database

### Frontend Tasks  
- Implement preferences selection UI

### Testing Tasks  
- Validate preference input
- Write unit test for preference persistence

---

## Story 9 – Edit or Delete Profile (3 pts)

### Backend Tasks  
- Implement update profile API call
- Implement delete profile functionality

### Frontend Tasks  
- Implement profile edit form pre-filled with existing data
- Add confirmation modal for deletion

### Testing Tasks  
- Write unit test for update/delete logic

---

## Story 10 – Log Out Securely (1 pt)

### Backend Tasks  
- Connect logout to Supabase session termination

### Frontend Tasks  
- Implement logout button in navigation
- Redirect user to login page after logout

### Testing Tasks  
- Write unit test for logout behavior

---
