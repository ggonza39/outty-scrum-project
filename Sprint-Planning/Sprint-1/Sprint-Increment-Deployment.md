# Sprint 1 – Sprint Increment Deployment

## Deployment Environment
- Platform: Vercel
- Environment: Production / Preview

---

## Live Application Link
- https://outty-scrum-project.vercel.app

---

## Deployment Notes
- ### Version Deployed:
  - v1.1-increment
- ### Key features included
  - Successful Database Integration:
    - The app is now correctly connected to Supabase (verified by fixing the lib folder pathing).
  - Mobile-First Responsive Layout:
    - The Outty demo interface is live and scrollable.
  - User Signup Flow:
    - Functional pathing between the landing page and the signup form.
  - Password Validation:
    - Added client-side validation requiring a minimum of 8 characters before submission.
- ### Known limitations (if any)
  - Login & Profile:
    - Buttons exist in the UI but the logic for these pages is still in the backlog for future sprints.
  - Auth Feedback:
    - While validation works, full "email verification" status is handled by Supabase and may require further UI refinement.
