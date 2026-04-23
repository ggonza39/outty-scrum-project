# Sprint 3 – Daily Scrum Documentation

**Date:** 04-22-2026

## 1. What did you do in the last 24 hours to help meet the Sprint Goal?

**Hunter Blake:**  
- Created the conversations and messages tables in Supabase and RLS policies so users can only access conversations and messages they are part of.
- Added read receipt support by creating is_read and read_at, mark_conversation_as_read RPC and trigger 
logic to timestamp messages when they are marked as read.
- Built a temporary messages-test page that loads an active conversation, fetches its messages, sends new messages, and subscribes to INSERT events for that conversation so the team can validate the realtime acceptance criteria before the full messaging UI exists.

**Heidi Wilder:**  
- Completed and the subtasks within them:
US7] [UI/UX] Task 1: Design a "Message Center" (Inbox) layout featuring a sidebar for the conversation list and a main window for the active chat.
[US7] [UI/UX] Task 2: Create the "Chat Bubble" UI with distinct styles for "Sent" vs. "Received" messages, including timestamps and Read Receipt icons (e.g., single/double checkmarks).
[US7] [UI/UX] Task 3: Design a "User Status Indicator" (e.g., a green dot on the avatar) to visually represent the online/offline status of the contact.
US7] [UI/UX] Task 4: Create "Push Notification" alerts and an in-app "Unread Badge" (e.g., a red number on the navigation icon).

**Gibson Garner:**  
- Created framework for first contact BDD test
- Created framework for real-time sync BDD test

**Takeshia Banks:**  
- Completed frontend chat window (dynamic rendering, sticky scroll, input validation)
- Built inbox UI with sorting, preview snippets, and unread counts using mock store
- Connected discover to profile to chat navigation with consistent conversation IDs

**Anthony Nguyen:**  
- Checking off the remaining  acceptance criteria for Sprint 7
- Double-checking for any bugs or missing features that are restricting the completion of our User Stories.

**Gilberto Gonzalez:**  
- Conducted a comprehensive review of sub-tasks for the active User Story 7 to ensure alignment with the Definition of Done.
- Revised the project presentation (PPT) and developed a dedicated "Demo Flow" slide to provide a strategic roadmap for the live walkthrough.

---

## 2. What will you do in the next 24 hours to help meet the Sprint Goal?

**Hunter Blake:**  
- Complete the remaining realtime messaging validation.
- Implement online and offline presence tracking for users within the messaging feature.

**Heidi Wilder:**  
- All tasks/sub tasks are completed.
- Working on presentation.

**Gibson Garner:**  
- Write and execute backend tests
- Start work on frontend tests

**Takeshia Banks:**  
- Fully wire US7 Tasks 10-12 (typing indicators, inbox query, notifications) once backend is finalized

**Anthony Nguyen:**  
- Report any bugs for each update to the app to fix or to create the missing feature
- Manage and merge each pull request after reviewing the file changes

**Gilberto Gonzalez:**  
- Continue polishing any remaining tasks triggered by the final review.
- Begin drafting the Sprint 3 cumulative documentation and finalize the narrative for the presentation flow.
  
---

## 3. Impediments

**Identified Impediment:**  
 - None at this time.
  
**Impediment Removal Plan:**  
  - N/A
  
**Responsible (if applicable):**  
  - N/A

---

  
