# Outty Testing Suite: Quality Assurance & BDD Strategy
This repository utilizes a multi-layered testing strategy to ensure the integrity of the Outty matching platform. All tests are integrated into a GitHub Actions CI/CD pipeline, serving as a mandatory quality gate for all Pull Requests.

### Testing Architecture Overview
The testing architecture is divided into three distinct tiers to ensure full coverage. Unit Testing via Vitest focuses on logic-level validation of isolated functions during the standard dev loop. BDD Testing combines Vitest with React Testing Library to verify component behavior and User Stories during every PR to the main branch. Finally, E2E Testing with Playwright provides full browser automation and cross-browser checks as a final deployment gate.

### Unit Testing (Validation Logic)
We employ Vitest to verify the core business rules for user registration without rendering the UI, ensuring the underlying engine is mathematically sound before it touches the frontend. The suite targets application/frontend/app/signup/validation.ts with 10 comprehensive test cases. These scenarios cover length enforcement (8-character minimum), casing logic (requiring at least one uppercase letter), and numeric presence. Additionally, the tests sanitize edge cases like empty strings or spaces and verify a "Happy Path" valid input to confirm the system accepts correct data.

### Behavior-Driven Development (BDD)
Our BDD tests utilize React Testing Library (RTL) to simulate real user interactions, ensuring the frontend correctly communicates logic failures through UI components. In the User Registration Validation feature, we test the scenario where a new user provides a password missing an uppercase letter. The test verifies that when the user attempts to submit the form with an invalid password (i.e. password123), the system prevents submission and displays a clear error message. The suite further confirms that this error provides necessary visual feedback by appearing in the system's primary error color (rgb(176, 0, 32)).

### Infrastructure & Mocking Strategy
To maintain test isolation and prevent "flaky" results caused by external API calls or environment drift, we utilize Vitest Mocks for all external dependencies. We mock Supabase Auth functions—including signUp, getSession, and onAuthStateChange, to simulate various authentication states without hitting live servers. We also mock Next.js Navigation hooks like useRouter and usePathname to prevent routing crashes during component mounting. Finally, we simulate responses for Auth Error Handlers to ensure the UI reacts predictably to backend rejection codes.

### Execution & Quality Gates
The suite can be executed locally using npm run test for Vitest or npx playwright test for end-to-end validation. It is a strict project requirement that a Pull Request cannot be merged to main until all automated checks pass and the code receives formal approval from the Code Owner (@SteveJaman = Anthony Nguyen).
