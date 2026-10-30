# Job Recruitment Portal

A simple job portal where recruiters post jobs and candidates browse and apply for them.
Built with React, Vite and React Router, using `json-server` as a mock backend.

## Features

- **Candidates:** register, log in, search and filter jobs, view job details, apply with a cover letter, and track application status.
- **Recruiters:** log in, post, edit and delete jobs, view applications, and update their status (Pending, Shortlisted, Rejected, Hired).
- Role-based pages (`RoleGuard`) so each role only sees its own screens.

## Tech Stack

- React 18 + React Router 6
- Vite 5
- json-server (REST API backed by `db.json`)
- Deployed with Vercel (frontend) and Render (API)

## Project Structure

```
JobPortal/
├── public/
│   └── Resumes/              # Sample resume PDFs used by demo candidates
├── src/
│   ├── components/           # Reusable UI pieces (each with its own .css)
│   │   ├── ApplicationCard   # One application row/card
│   │   ├── Footer
│   │   ├── JobCard           # Job summary card on the home page
│   │   ├── JobForm           # Post / edit job form (recruiter)
│   │   ├── Navbar
│   │   ├── RoleGuard         # Restricts a route to a role
│   │   └── SearchFilters     # Search and filter bar
│   ├── context/
│   │   └── AuthContext.jsx   # Login state and current role/candidate
│   ├── pages/                # One file per route (each with its own .css)
│   │   ├── Home              # Job listing + search
│   │   ├── JobDetails        # Job info + apply box
│   │   ├── Login
│   │   ├── Register          # Candidate registration
│   │   ├── Dashboard         # Recruiter dashboard
│   │   ├── ManageJobs        # Recruiter: list, edit, delete jobs
│   │   ├── EditJob
│   │   ├── Applications      # Recruiter: review applications
│   │   └── CandidateApplications  # Candidate: track own applications
│   ├── services/
│   │   └── api.js            # All fetch calls (jobs, candidates, applications)
│   ├── utils/
│   │   ├── constants.js      # Job types, statuses, experience options
│   │   └── format.js         # Date, experience and skills helpers
│   ├── App.jsx               # Routes
│   ├── main.jsx              # App entry point
│   └── index.css             # Global styles
├── db.json                   # Mock database: jobs, candidates, applications
├── index.html
├── package.json
├── vite.config.js
└── vercel.json               # Vercel routing config
```

## Routes

| Path | Who | Page |
| --- | --- | --- |
| `/` | Everyone | Home (job list) |
| `/jobs/:id` | Everyone | Job details and apply |
| `/login`, `/register` | Everyone | Authentication |
| `/my-applications` | Candidate | Track applications |
| `/recruiter` | Recruiter | Dashboard |
| `/recruiter/jobs` | Recruiter | Manage jobs |
| `/recruiter/jobs/:id/edit` | Recruiter | Edit a job |
| `/applications` | Recruiter | Review applications |

## Data Model (`db.json`)

- **jobs:** `id`, `title`, `company`, `location`, `experience`, `salary`, `description`, `skills[]`, `jobType`, `createdAt`
- **candidates:** `id`, `name`, `email`, `phone`, `password`, `experience`, `skills[]`, `resumeUrl`
- **applications:** `id`, `jobId`, `candidateId`, `appliedAt`, `status`, `coverLetter`

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the mock API (runs on port 3000):

   ```bash
   npm run server
   ```

3. In another terminal, point the app at the local API and start Vite:

   ```bash
   echo "VITE_API_URL=http://localhost:3000" > .env
   npm run dev
   ```

If `VITE_API_URL` is not set, the app uses the hosted API at `https://jobportal-xbvf.onrender.com`.
That server can take up to a minute to wake up on the first request.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run server` | Run json-server on port 3000 |
| `npm start` | Run json-server on `$PORT` (used on Render) |

## Demo Access

- Candidates: use any entry in `db.json` under `candidates` (for example `priya@example.com`), or register a new one.
- Recruiters: log in with the demo passcode defined in `src/utils/constants.js`.

This is a demo project: passwords are stored in plain text in `db.json`, so do not use real credentials.
