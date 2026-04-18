# Cummulative Contribution Analysis

## Executive Summary
This report provides a comprehensive analysis of cummulative team contributions for the "Outty" project through all sprints. Metrics are derived from Git numstat data across all branches to provide a transparent view of code volume and architectural development.

## Metric Definitions
To ensure accurate interpretation of the data, the metrics are defined as follows:

- **Added:** The total number of new lines of code, configuration, or documentation committed to the repository. High counts typically correlate with new feature implementation and initial project scaffolding.

- **Removed:** The total number of lines deleted or replaced. In a Test-Driven Development (TDD) environment, a high "Removed" count is an indicator of Refactoring—the process of cleaning, optimizing, and maintaining code health without changing its external behavior.

- **Total Impact:** The sum of Added and Removed lines, representing the total volume of technical interaction with the codebase.

## Contribution Matrix through Sprint 1
| Team Member | Added | Removed | Total Impact | Primary Focus |
| :--- | :---: | :---: | :---: | :--- |
| **Hunter Blake** | 7,801 | 52 | 7,853 | Backend|
| **Gilberto Gonzalez** | 6,293 | 968 | 7,261 | Scrum Master & Project Architecture |
| **Heidi Wilder** | 2,991 | 256 | 3,247 | UI/UX |
| **Takeshia Banks** | 607 | 134 | 741 | Frontend |
| **Gibson Garner** | 161 | 62 | 223 | Testing |
| **Anthony Nguyen** | 9 | 8 | 17 | Product Owner & Quality Control |

## Contribution Matrix through Sprint 2
| Team Member | Added | Removed | Total Impact | Primary Focus |
| :--- | :---: | :---: | :---: | :--- |
| **Heidi Wilder** | 38,101 | 804 | 38,905 | UI/UX |
| **Gilberto Gonzalez** | 19,355 | 10,283 | 29,638 | Scrum Master & Project Architecture |
| **Hunter Blake** | 8,597 | 104 | 8,701 | Backend |
| **Takeshia Banks** | 4,360 | 980 | 5,340 | Frontend |
| **Gibson Garner** | 830 | 186 | 1,016 | Testing |
| **Anthony Nguyen** | 47 | 21 | 68 | Product Owner & Quality Control |


## Data Interpretation & Role Breakdown
- **Technical Leadership & 2.0 Infrastructure:** 

Beyond code authorship, Gilberto orchestrated the project's operational transition from the initial MVP to the Outty 2.0 version designed for the final presentation. This involved a massive architectural refactor, as evidenced by the high "Removed" count, ensuring the codebase remained clean and performant while introducing complex new features. His leadership included establishing the directory structure, configuring Vercel deployments, setting up GitHub Actions for CI/CD, and implementing Branch Protection Rules to ensure team stability.

- **Development & UI/UX:** 

Hunter led the backend integration, focusing on high-volume logic and data entity definitions. The frontend was a collaborative effort between Heidi (UI/UX) and Takeshia (Frontend), ensuring the visual design translated into functional components.

- **Refactoring & TDD Standards:** 

The high "Removed" count for Gilberto is a direct result of the Red-Green-Refactor cycle. This reflects the intentional effort to reduce technical debt during the initial Outty foundation and the Gilded Rose legacy refactor.

- **Quality Gate & Product Ownership:** 

The metrics for Anthony and Gibson reflect specialized roles that occur "outside the IDE." As Product Owner, Anthony focused on requirement validation and PR reviews to ensure the Quality Gate was maintained. The Testing role involved extensive manual and automated verification of features, ensuring that the "Definition of Done" was met for each user story before final integration.
