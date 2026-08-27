# INSTALL.md — Full setup guide

## Step-by-step

### 1. Install dependencies

```bash
npm install
```

Uses `package-lock.json` for reproducible installs.

### 2. Seed demo data

The app seeds itself automatically on first launch — no separate seed step needed.
Demo data includes a board with 5 columns, 14 tasks, and 4 team members.

### 3. Start the dev server

```bash
npm run dev -- --host 0.0.0.0
```

The app runs at http://localhost:5173.

### 4. Production build (optional)

```bash
npm run build
npm run preview -- --host 0.0.0.0
```

## One-command setup

```bash
./install.sh
```

The `install.sh` script runs `npm install` then starts the dev server.

## Verifying

After starting the dev server, navigate to:

- `/` — Kanban board with draggable task cards
- `/calendar` — Monthly calendar with tasks on due dates
- `/team` — Team member cards with edit/remove
- `/analytics` — Bar and pie charts of task data
- `/settings` — Board customization options
