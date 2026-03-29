# Journal of Changes - Accounting Project Restructuring

This journal documents the major changes and improvements made to the Accounting project.

## 1. File Structure Restructuring
- **Location**: `Accounting/src/`
- **Actions**:
    - Created a standard React directory structure: `components`, `pages`, `services`, `context`, `styles`.
    - Moved legacy screens from `Screens/` to `src/pages/`.
    - Moved reusable utilities and components from `Tools/` to `src/components/` and `src/services/`.
    - Updated all global import paths to reflect the new structure.

## 2. Component Atomization and SOLID Principles
- **Location**: `Accounting/src/components/`
- **Actions**:
    - Decomposed the monolithic `Tools/Components.jsx` (which contained over 10 different components) into individual files: `Button.jsx`, `InputField.jsx`, `Card.jsx`, `TopBar.jsx`, etc.
    - Each component now follows the Single Responsibility Principle (SRP).
    - Created an `index.js` in `src/components/` for easier, cleaner imports across the project.

## 3. Design Pattern: Service Layer
- **Location**: `Accounting/src/services/`
- **Actions**:
    - Implemented a centralized `apiClient.js` using Axios for all HTTP requests, including request/response interceptors for token management.
    - Created `authService.js` to encapsulate authentication logic, separating it from UI components (following SOLID).
    - Introduced `mockService.js` to handle data retrieval for the Demo mode.

## 4. Removal of Repeated Code & Styles
- **Location**: `Accounting/src/styles/SharedStyles.js`
- **Actions**:
    - Extracted repeated Styled Components (like `Header`, `Form`, `StyledInput`) into a shared styles file.
    - Centralized common design values (colors, shadows, transitions) to ensure consistency and easier maintenance.

## 5. Implementation of Demo Mode (Guest Access)
- **Location**: `Accounting/src/pages/Login.jsx`, `Accounting/src/context/AuthContext.jsx`, and all Page components.
- **Actions**:
    - Added a "Guest Demo Login" button on the login screen.
    - Implemented logic to bypass API calls when in Guest mode, instead using `mockService.js` which persists data in `localStorage`.
    - All CRUD operations (Create, Read, Update, Delete) are supported in Guest mode for a realistic preview.

## 6. Testing and Quality Assurance
- **Location**: `Accounting/`
- **Actions**:
    - Integrated `Vitest` and `React Testing Library`.
    - Created unit tests for `authService` and `mockService` to ensure core business logic remains stable.
    - Verified production readiness by resolving multiple build-time errors related to case-sensitivity and circular dependencies.

## 7. Documentation
- **Location**: `Accounting/README.md` and Root `README.md`.
- **Actions**:
    - Comprehensive update to documentation explaining the project's purpose, architectural decisions, and setup instructions.

---
**Status**: Ready for Production.
**Build Verification**: Passed (`npm run build`).
**Functional Verification**: Passed (Manual & Playwright verification).
