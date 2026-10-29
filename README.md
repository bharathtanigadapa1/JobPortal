# JobPortal – Job Recruitment Portal (React + Vite + JSON Server)

## Run it

```bash
npm install
npx json-server --watch db.json --port 3000   # terminal 1 – API
npm run dev                           # terminal 2 – React app
```

Open the URL Vite prints (usually http://localhost:5173).

## Changing the color scheme

Open `index.html` and change one word on the first lines:

```html
<html lang="en" data-theme="mint">   <!-- light | mint | lavender | peach | rose | teal | blue | purple | orange -->
```

The palettes are defined at the top of `src/index.css`. To create your own,
copy one `:root[data-theme='...']` block, rename it and change the colors.

## Demo logins

| Role      | Credentials                          |
|-----------|--------------------------------------|
| Candidate | `priya@example.com` / `demo123`      |
| Recruiter | passcode `recruiter123`              |

> **Security limitation:** JSON Server is not a secure authentication backend.
> Candidate passwords are stored as plain text in `db.json` and the recruiter
> passcode is in front-end code, purely so the demo works. Passwords are never
> displayed in the UI or kept in the session. Do not use real passwords.

## Folder structure

```
src/
  main.jsx, App.jsx, index.css
  services/api.js            all fetch() calls (jobs, candidates, applications)
  context/AuthContext.jsx    demo login state (sessionStorage)
  utils/constants.js, format.js
  components/  Navbar, Footer, JobCard, JobForm, SearchFilters,
               ApplicationCard, RoleGuard      (each has its own .jsx + .css)
  pages/       Home, JobDetails, Register, Login, Dashboard, ManageJobs,
               Applications, CandidateApplications   (each has its own .jsx + .css)
```

Small helper files (`utils/`, `context/`) were added beyond the required
structure; `RoleGuard` is an extra component that protects role-only routes.

## Testing checklist

**Read (GET)**
- [ ] Home lists jobs from JSON Server; stop the server and reload → error message + "Try again".
- [ ] Search by title/company/skill, location, experience, job type; Reset clears; no match → empty state.
- [ ] `/jobs/1` shows full details; `/jobs/999` shows "Job not found".

**Candidate flow**
- [ ] Register: empty submit shows errors; bad email / phone / short password / mismatch rejected.
- [ ] Register with `priya@example.com` → "already registered".
- [ ] Register a new candidate → appears in `db.json`, logged in automatically.
- [ ] Log out, log in as `priya@example.com` / `demo123`; wrong password → error.
- [ ] Apply on a job page (POST /applications); applying again is blocked; card shows "✓ Applied".
- [ ] `/my-applications` shows only this candidate's applications.
- [ ] Logged out, a job page asks you to log in or register.

**Recruiter flow**
- [ ] Login tab "Recruiter (demo)" with `recruiter123`; wrong passcode rejected.
- [ ] Dashboard counts (jobs, candidates, applications, pending, shortlisted, hired) match `db.json`.
- [ ] Manage Jobs → Post New Job (POST); validation for empty fields and non-numeric experience.
- [ ] Edit opens /recruiter/jobs/:id/edit (useParams + GET /jobs/:id), loads existing values, Update saves (PUT) and returns to the list with a success message.
- [ ] Delete asks for confirmation, then removes the job (DELETE) and refreshes.
- [ ] Search/filter posted jobs.
- [ ] Applications: change status (PUT) → Dashboard counts update; filter by status and job.
- [ ] Deleting a job also removes its applications (JSON Server 0.17 cascades deletes by foreign key such as `jobId`), so Dashboard totals drop accordingly.

**Routing / responsive**
- [ ] `/recruiter`, `/recruiter/jobs`, `/applications` blocked for non-recruiters; `/my-applications` for non-candidates.
- [ ] Mobile width: hamburger menu works, tables become stacked cards.
