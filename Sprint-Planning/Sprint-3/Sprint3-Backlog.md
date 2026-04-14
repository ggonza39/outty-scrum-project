# Sprint 3 Backlog

Sprint Goal: 

---

## Project Board Link:
- [Project Board](https://github.com/users/ggonza39/projects/1/views/1?reload=1)

---

## User Story 7: In-App Messaging & Chat System

**Goal:** As a matched user, I want to send and receive messages in real-time, see when others are online, and receive notifications so that I can coordinate outings and communicate easily with my adventure partners.

### UI/UX Tasks

* **Task 1:** Design a "Message Center" (Inbox) layout featuring a sidebar for the conversation list and a main window for the active chat.

* **Task 2:** Create the "Chat Bubble" UI with distinct styles for "Sent" vs. "Received" messages, including timestamps and Read Receipt icons (e.g., single/double checkmarks).

* **Task 3:** Design a "User Status Indicator" (e.g., a green dot on the avatar) to visually represent the online/offline status of the contact.

* **Task 4:** Create "Push Notification" alerts and an in-app "Unread Badge" (e.g., a red number on the navigation icon).

---

### Backend Tasks

* **Task 5:** Schema Design: Create a messages table and a conversations table in Supabase with RLS policies ensuring users can only read messages where their user_id is either the sender or recipient.

* **Task 6:** Supabase Realtime Integration: Enable "Realtime" replication on the messages table to allow for instant message delivery without page refreshes.

* **Task 7:** Read Receipt Logic: Implement a database trigger or RPC function that updates is_read status to TRUE when a user opens the specific chat thread.

* **Task 8:** Presence Tracking: Utilize Supabase Presence to track and broadcast the Online/Offline status of users based on their active socket connection.

---

### Frontend Tasks

* **Task 9:** Build the "Chat Window" Component with auto-scrolling logic that keeps the newest messages in view as they arrive.

* **Task 10:** Implement "Typing Indicators" using broadcast events to show when the other user is composing a message.

* **Task 11:** Create the Inbox Logic: Build a query that fetches a list of recent conversations, sorted by the latest message timestamp, and displays a "Preview" snippet of the last text sent.

* **Task 12:** Integrate Browser Notifications (via the Notification API) so users are alerted of new messages even if the Outty tab is not currently focused.

---

### Testing Tasks

* **Task 13 (Unit): Security & Privacy Test Suite (4 Tests)**

  **A. Unauthorized Access:** Verify that a user cannot fetch message history for a conversation they are not a participant in ($403$ Forbidden).

  **B. Data Leakage:** Ensure the message payload does not contain sensitive sender/receiver metadata (e.g., email addresses or internal UUIDs).

  **C. RLS Validation:** Confirm that Supabase Row Level Security prevents INSERT operations into the messages table from users pretending to be someone else.

  **D. Delete Constraints:** Verify that a user can only "soft delete" their own view of a message and cannot remove it for the other participant.


* **Task 14 (Unit): Real-Time & Logic Test Suite (6 Tests)**

  **A. Chronological Sorting:** Verify the query logic correctly orders messages by created_at timestamp (ascending) for the chat window.

  **B. Read Receipt Trigger:** Test that the is_read flag toggles to true specifically when the recipient's session ID matches the active chat view.

  **C. Presence Logic:** Validate that the online_status helper correctly interprets the heartbeat/socket connection from Supabase Presence.

  **D. Empty State:** Verify the UI correctly handles a "New Conversation" with zero messages without crashing.

  **E. Payload Validation:** Ensure the "Send" function rejects empty messages or payloads exceeding character limits (e.g., 2000+ chars).

  **F. Notification Dispatch:** Test the utility function that triggers the Browser Notification API to ensure it only fires when the tab is inactive.

---

## Behavior-Driven Development (BDD) Tasks

* **Task 15 (BDD): Scenario – The "First Contact" Workflow**

  **Given** I am on an Explorer's profile and we have no previous history  

  **When** I click the "Message" FAB and send "Hey, let's go hiking!"  

  **Then** a new Conversation ID is generated, I am redirected to the Chat Window, and my message appears with a "Sent" status.


* **Task 16 (BDD): Scenario – Real-Time Sync & Status**

  **Given** I am in an active chat with User B  

  **When** User B sends a message while I have the window open  

  **Then** the message appears instantly via Supabase Realtime, my "Unread" badge does not increment, and User B sees a "Read" receipt immediately.

  ---
