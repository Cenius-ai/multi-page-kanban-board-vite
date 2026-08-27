# Usage

Once the app is running (typically `http://localhost:5173`), you will see the main board. The sidebar allows navigation between pages. All data is saved to your browser's localStorage.

## Routes

| Route | Page | Description |
|---|---|---|
| `/` | Board | Main Kanban board with columns and tasks |
| `/calendar` | Calendar | Monthly calendar with tasks on their due dates |
| `/team` | Team | Manage team members and see their task counts |
| `/analytics` | Analytics | Charts and summary stats |
| `/settings` | Settings | Board appearance and configuration |
| `*` | 404 Not Found | Fallback page for unknown routes |

## Board (`/`)

- **Columns** are shown horizontally. You can drag columns to reorder them.
- **Tasks** are cards inside columns. Drag a task to another column to move it.
- Use the **+** button on a column header to create a new task.
- Click a task card to edit it, or use the delete icon to remove it.
- A **+ Add column** button lets you create a new column.
- Column headers can be edited by clicking the title, and the column can be deleted via the trash icon.

## Calendar (`/calendar`)

- Displays a month grid. Days with tasks show task titles and avatars of assigned members.
- Use the arrows to switch months and the **Today** button to jump to the current month.

## Team (`/team`)

- Lists all team members. Each card shows the member's initials, name, role, and number of assigned tasks.
- Click **Add member** to create a new member (name and role are required).
- Hover over a member card to reveal edit and delete buttons.

## Analytics (`/analytics`)

- Summary cards: Total Tasks, Completed, Overdue, Team Members.
- Bar chart: Tasks per column.
- Pie chart: Tasks by priority.
- Bar chart: Tasks per team member.

## Settings (`/settings`)

- **Appearance**: Change the board background color with a color picker or hex value.
- **Board Configuration**:
  - *Max tasks per column*: limit the number of tasks that can be added to any column.
  - *Default task priority*: new tasks will use this priority.
- **Columns**: Edit column titles inline, delete columns, or add a new column.

## Data

The app ships with seed data to demonstrate functionality. You can clear the `kanban-board` key in localStorage to reset to the initial seed data.