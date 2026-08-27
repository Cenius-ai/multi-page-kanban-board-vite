# USAGE.md — Feature walkthrough

## Kanban Board (`/`)

The board is the main workspace. It shows columns (Backlog, To Do, In Progress, Review, Done) with task cards.

- **Drag a task** between columns to change its status. Drag within a column to reorder.
- **Click a task card** to open the edit modal. Change title, description, priority, assignee, due date, or labels.
- **Delete a task** from the edit modal (trash button at the bottom).
- **Add a task** with the "+ Add task" button at the bottom of any column.
- **Add a column** using the input field in the board header.
- **Rename a column** with the pencil icon in the column header.
- **Delete a custom column** with the X icon (default columns cannot be deleted).

## Calendar (`/calendar`)

Monthly calendar showing tasks on their due dates.

- Navigate months with the arrow buttons.
- Click **Today** to return to the current month.
- Click a **task chip** on any day to view and edit its details.

## Team (`/team`)

Manage the people assigned to tasks.

- **Add member** — opens a form to enter name and role.
- **Edit** — change a member's name or role.
- **Remove** — deletes the member (tasks assigned to them remain but show as unassigned).

## Analytics (`/analytics`)

Charts summarizing task data:

- **Summary cards** — total, completed, overdue, team size.
- **Tasks by Status** — bar chart of task counts per column.
- **Priority Distribution** — donut chart of high/medium/low breakdown.
- **Workload by Assignee** — horizontal bar chart of tasks per person.

## Settings (`/settings`)

- **Board background** — color picker (affects board area).
- **Default priority** — preselected when creating new tasks.
- **Column task limit** — informational (0 = unlimited).
- **Reset all data** — restores the original demo dataset.

## Data persistence

All data is saved to your browser's localStorage. Closing the tab or restarting the browser preserves your board. Clearing browser data or using the "Reset" button in Settings will remove all custom data.
