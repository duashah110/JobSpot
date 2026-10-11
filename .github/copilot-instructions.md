# Copilot instructions for JobSpot

## Project layout and commands

The repository has separate frontend and backend Node.js packages; run commands from the package directory because there is no root `package.json`.

Frontend commands (from `frontend/`):

```sh
npm run dev
npm run build
npm run lint
npm run lint -- src/pages/FindJobs.jsx
```

The last command lints one file with Oxlint. There is currently no frontend test script or test suite.

Backend commands (from `backend/`):

```sh
npm run dev
npm start
```

The backend package does not currently define lint or test scripts, and there are no test files or configured single-test command.

## Architecture and request flow

- The frontend is a React single-page app bootstrapped in `frontend/src/main.jsx`; `frontend/src/App.jsx` owns React Router routes and maps them to page components in `frontend/src/pages/`.
- Pages make HTTP requests through the shared Axios instance in `frontend/src/services/api.js`, whose base URL is `http://localhost:5000/api`. The frontend stores the login token and user in `localStorage`.
- `backend/server.js` configures Express middleware and mounts route modules under `/api/auth`, `/api/jobs`, and `/api/companies`.
- Backend request handling is split into route modules (`backend/src/routes/`), controllers (`backend/src/controllers/`), and MySQL query modules (`backend/src/models/`). The connection pool is configured in `backend/src/config/db.js` using `mysql2/promise`.
- Authentication registration hashes passwords with bcrypt; login signs a JWT. Protected routes use `backend/src/middleware/authMiddleware.js`, which verifies the bearer token and attaches its payload to `req.user`.
- The job domain joins jobs to companies for job listings. Employer job creation uses the authenticated user's company profile; account roles are `job_seeker` and `employer`.
- Backend configuration is read from `backend/.env`: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `JWT_SECRET`, and optionally `PORT`. Keep credentials and other secrets out of source control.

## Codebase conventions

- Frontend files use ES module imports/exports and JSX; backend files use CommonJS `require` and `module.exports`.
- Keep data access in model modules and HTTP status/response handling in controllers. Routes bind HTTP methods and paths to controller functions; protected routes apply `authenticateToken` as route middleware.
- MySQL calls use `db.query` with `?` placeholders and a separate values array for user-provided values.
- API responses generally use JSON. Successful job-list responses have `{ success: true, jobs }`; single-job and company responses similarly wrap data, while errors provide a `message`.
- Database fields and request fields commonly use `snake_case` (for example, `company_name`, `job_type`, and `salary_min`); retain those names at the API/database boundary.
- Frontend linting uses Oxlint with React and Oxc plugins; the configured React Hooks rules are errors.
