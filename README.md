# Accounting Web (React)

## What problem it solves

Frontend for a small-business accounting system: manage customers, suppliers, inventory, sales, purchases, income, payments, employees, and cash funds through a web UI with auth and multi-language support.

## Tech stack

React 18, Vite, React Router, Axios, Tailwind/PostCSS, styled-components, i18next, date-fns.

## Scripts

- `npm run dev` — dev server (port 5173)
- `npm run build` — production build
- `npm run preview` — preview build
- `npm run lint` — eslint

## Page routes (`src/App.jsx`)

`/`, `/register`, `/reset-pass`, `/setup-account`, `/main/*` (dashboard, customers, sell-customers, money-income, income, payments, types, supplies, dispatch-supplies, dispatches, reciepts, receipts, employees, sells, customer-sells, inventory, options), `/math-notes`.

## Backend integration

`src/services/apiClient.js` (baseURL `VITE_API_URL` or `http://localhost:3000/api`); `BackendServices.js` calls `/users/:username/*` and `/data/*`.

## Tests

`tests/`, `src/services/*.test.jsx`.
