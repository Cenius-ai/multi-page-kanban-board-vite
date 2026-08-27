# FlowBoard — Installation Guide

## Prerequisites

- **Node.js** 18.0 or later
- **npm** 9.0 or later (the lockfile is `package-lock.json`)

## Step-by-step setup

### 1. Install dependencies

```bash
npm ci
```

This installs exact versions from the lockfile for reproducible builds.

### 2. Seed demo data

The app seeds itself automatically — no separate seed step is needed. On first load, if localStorage is empty, the app populates:

- 1 board with 3 columns (Backlog, In Progress, Done)
- 10 realistic tasks with priorities, labels, due dates, and assignees
- 2 team members (Alex Chen, Jordan Reyes)
- Default settings

### 3. Start the dev server

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

### 4. Production build (optional)

```bash
npm run build      # outputs to dist/
npm run preview    # serves the built app on http://localhost:4173
```

## Reset demo data

Open the browser console and run:

```js
Object.keys(localStorage).filter(k => k.startsWith('flowboard_')).forEach(k => localStorage.removeItem(k));
location.reload();
```

Or use the "Clear all data" button on the Settings page.

## Verification checklist

- [ ] `npm ci` completes with 0 vulnerabilities
- [ ] `npm run dev` starts on port 5173
- [ ] Navigate to `/` — see the kanban board with seeded columns and tasks
- [ ] Navigate to `/calendar` — see tasks on a monthly calendar
- [ ] Navigate to `/team` — see 2 team member cards
- [ ] Navigate to `/analytics` — see charts with task stats
- [ ] Navigate to `/settings` — see configuration options
- [ ] Drag a task card to another column — the move persists after reload
- [ ] `npm run build` completes with no errors
