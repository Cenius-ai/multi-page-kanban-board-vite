# Kanban Board

A client-side React + Vite kanban board with drag-and-drop, calendar view, team management, analytics, and settings. All data persists in localStorage — no backend required.

## Demo accounts

This app has no authentication. All data is stored locally in your browser.

## Prerequisites

- Node.js 18+ and npm

## Quickstart

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser. The app seeds itself with demo data on first launch.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |

## Features

- **Board** — drag-and-drop columns and tasks for visual workflow management
- **Calendar** — monthly calendar view showing tasks by due date
- **Team** — add, edit, and remove team members
- **Analytics** — charts and statistics on task distribution and workload
- **Settings** — customize board appearance and task defaults

## Tech stack

- React 19 + Vite
- react-router-dom (client-side routing)
- @dnd-kit (drag-and-drop)
- Recharts (analytics charts)
- localStorage (data persistence)
