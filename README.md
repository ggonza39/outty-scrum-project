# Outty – Adventure Matching App

## Team Name
Outty Scrum Team

## Team Roster & Scrum Roles
- Product Owner
  - Anthony Nguyen 
- Scrum Master
  - Gilberto Gonzalez 
- Developers
  - Heidi Wilder (UI/UX Design)
  - Takeshia Banks (Frontend Design)
  - Hunter Blake (Backend Design)
  - Gibson Garner (Unit/System Tester)

## Project Overview
Outty is an adventure-focused matching application designed to connect individuals who are interested in outdoor and experiential activities such as hiking, camping, climbing, and travel-based exploration. The primary goal of the application is to support meaningful connections by matching users based on shared activity interests, experience levels, and availability rather than relying solely on profile-based or appearance-driven matching.

Unlike traditional dating or social networking applications, Outty emphasizes activity compatibility as the core matching criterion. Users create profiles that capture relevant preferences, skill levels, and interests, which are then used to support a structured matching process. The application is intended to support both social and dating use cases, allowing users to connect with others who share similar interests in outdoor and adventure-oriented experiences.

From a software engineering perspective, this project focuses on applying agile development practices to the design and implementation of a real-world, user-centered web application. The system is designed as a modern web application using a component-based front-end, a cloud-hosted backend, and an integrated authentication and data storage solution. The project will be developed incrementally using Scrum, with an emphasis on backlog refinement, iterative delivery, and collaborative development.

## Tools & Collaboration

The Outty project uses the following tools to support collaboration, design, and agile project management:

- **Version Control & Project Management:** GitHub and Zenhub  
  GitHub is used to host the source code repository, manage the product backlog, track issues, and document project artifacts. GitHub Issues serve as the foundation for user stories, tasks, and technical work items, ensuring traceability between requirements and implementation.

  To enhance Scrum-based project management, ZenHub is integrated directly with the GitHub repository. While GitHub manages the codebase and issue tracking, ZenHub provides advanced agile planning capabilities, including:

    - Assigning and estimating user stories using story points

    - Organizing issues into Epics

    - Sprint planning and sprint management

    - Generating the Sprint Burndown Chart

    - Real-time tracking of story points remaining

  ZenHub is primarily used for sprint planning and burndown tracking because it provides more structured story point management and automatic burndown chart generation than GitHub Projects alone.

  Both tools are used in conjunction:

    - GitHub → source control, issue tracking, documentation
    - ZenHub → sprint planning, story point estimation, burndown tracking, and Scrum workflow visualization

  This integration ensures accurate progress tracking while maintaining tight alignment between development work and agile project management practices.

- **UI/UX Design:** Figma  
  Figma is used to collaboratively design and prototype the user interface. One team member is proficient with Figma and leads UI/UX design efforts.

- **Frontend Development:** Next.js (React + TypeScript)  
  Next.js is used to implement the component-based frontend of the web application. It provides routing, server-side rendering capabilities, and a structured development environment suitable for scalable web applications. TypeScript is used to improve maintainability, enhance code reliability, and reduce runtime errors through static type checking.

- **Backend & Database Infrastructure:** Supabase (PostgreSQL, Authentication, APIs)  
  Supabase provides backend infrastructure for the application, including:
  - A centrally managed PostgreSQL database
  - Built-in user authentication and authorization
  - Auto-generated RESTful APIs
  - Real-time data capabilities

  This enables rapid development while maintaining a structured and scalable backend architecture.

- **Runtime & Package Management:** Node.js and npm  
  Node.js provides the runtime environment for developing and running the Next.js application. npm is used for dependency management, package installation, and project scripts, ensuring consistent development environments across team members.

- **Hosting:** Vercel  
  Vercel is used to host and deploy the Next.js application. It provides automated builds, continuous deployment from the GitHub repository, and environment variable management. Vercel also supports preview deployments, allowing the team to test changes safely before production release.

- **Testing:** Vitest and Playwright  
  - **Unit & Integration Testing:** Vitest:
    - We use Vitest for fast, isolated testing of individual components, utility functions, and Supabase integration logic. Its speed allows for a rapid development cycle and immediate feedback during the Red-Green-Refactor process.
  - **End-to-End Testing:** Playwright
    -  We use Playwright to simulate real user journeys across multiple browsers (Chromium, Firefox, and WebKit). This ensures that critical flows—like account creation and profile matching—work perfectly on any device.
  - **Automated Quality Gate:**
    - Both test suites are integrated into our GitHub Actions CI/CD pipeline. A Pull Request cannot be merged to main until all Vitest and Playwright checks pass and receive approval from the Code Owner.

- **CI/CD Pipeline:** GitHub Actions & Vercel  
  We implemented a multi-stage **Continuous Integration and Continuous Deployment (CI/CD)** pipeline to ensure code quality and automated delivery. By separating our testing and deployment environments, we created a "Quality Gate" that prevents broken code from ever reaching our users.

  - **Continuous Integration:** GitHub Actions  
    Every push or Pull Request to the `main` branch triggers our **Frontend Validation** suite.
    - **Automated Testing:** We utilize **Vitest** to run our Unit and BDD (Behavior-Driven Development) test suites.
    - **Quality Gate:** GitHub Actions acts as the primary gatekeeper. **Enforced Branch Protection Rules** ensure that if any of our 12 tests fail, the "Merge" button is disabled and the deployment is blocked.
    - **Build Verification:** The pipeline verifies the Next.js build and ensures all environment variables (Supabase) are correctly mapped.

  - **Continuous Deployment:** Vercel    
    Once GitHub Actions confirms the code is stable (Green), the "handshake" occurs with Vercel for the final rollout.
    - **Automated Production Build:** Vercel executes the final production build using `next build`.
    - **Integrated Deployment Logs:** We configured the pipeline to stream Vercel build logs directly into the **GitHub Actions console**. This allows the team to monitor progress and debug errors in real-time without needing separate Vercel dashboard access.
    - **Instant Rollouts:** Upon a successful build, the application is automatically deployed to our live production environment.
    - **Environment Sync:** We configured Vercel's Root Directory settings to manage our monorepo structure (`application/frontend`) seamlessly.

  - **Evidence & Links**
    - **Live Production Environment:** [Outty-App](https://outty-app.vercel.app)
    - **Primary Deployment Logs:** [Vercel Project Deployments](https://vercel.com/ggonza39/outty-project/deployments)
    - **CI/CD Quality Gate (Fallback):** [GitHub Actions Workflow History](https://github.com/ggonza39/outty-scrum-project/actions)
    - **Latest Successful CI Run:** [View Latest Run](https://github.com/ggonza39/outty-scrum-project/actions/runs/LATEST_ID)

- **Team Communication:** Microsoft Teams  
  Microsoft Teams is used for team communication, including meetings, discussions, and coordination throughout the Scrum process.


## Repository Structure
- /Backlog
- /Definition-of-Ready
- /Design
- /Presentation
- /Product-Vision
- /Sprint-Planning
- /application

