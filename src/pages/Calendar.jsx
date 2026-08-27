import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { getMemberById } from '../components/utils';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function Calendar() {
  const { tasks, members } = useAppContext();
  const today = new Date();
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const tasksWithDates = useMemo(
    () => tasks.filter((t) => t.dueDate),
    [tasks]
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startOffset = firstDay.getDay(); // 0=Sun

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));

  // Build grid cells
  const cells = [];
  // Previous month filler
  const prevLastDay = new Date(year, month, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ day: prevLastDay - i, month: 'prev', date: `${year}-${String(month).padStart(2, '0')}-${String(prevLastDay - i).padStart(2, '0')}` });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      month: 'current',
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    });
  }
  // Next month filler to fill grid
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, month: 'next', date: '' });
    }
  }

  // Group tasks by date
  const tasksByDate = {};
  for (const task of tasksWithDates) {
    if (!tasksByDate[task.dueDate]) {
      tasksByDate[task.dueDate] = [];
    }
    tasksByDate[task.dueDate].push(task);
  }

  const isToday = (day, m) => {
    if (m !== 'current') return false;
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Calendar</h1>
      </div>

      <div className="calendar-view">
        <div className="calendar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)' }}>
            <button className="btn btn-sm btn-ghost" onClick={prevMonth}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="12,3 6,9 12,15" />
              </svg>
            </button>
            <h2 style={{ fontSize: '1rem', minWidth: 180, textAlign: 'center' }}>
              {MONTH_NAMES[month]} {year}
            </h2>
            <button className="btn btn-sm btn-ghost" onClick={nextMonth}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="6,3 12,9 6,15" />
              </svg>
            </button>
          </div>
          <button className="btn btn-sm" onClick={goToday}>Today</button>
        </div>

        <div className="calendar-grid">
          {DAY_NAMES.map((name) => (
            <div key={name} className="calendar-day-header">{name}</div>
          ))}
          {cells.map((cell, i) => {
            const cellTasks = tasksByDate[cell.date] || [];
            const cellIsToday = isToday(cell.day, cell.month);
            return (
              <div
                key={i}
                className={`calendar-cell${cellIsToday ? ' today' : ''}${cell.month !== 'current' ? ' other-month' : ''}`}
              >
                <div className="calendar-date">{cell.day}</div>
                {cellTasks.slice(0, 3).map((task) => {
                  const assignee = getMemberById(members, task.assigneeId);
                  return (
                    <div
                      key={task.id}
                      className="calendar-task-dot"
                      title={`${task.title}${assignee ? ' — ' + assignee.name : ''}`}
                    >
                      <span className={`priority-dot priority-${task.priority}`} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {task.title}
                      </span>
                    </div>
                  );
                })}
                {cellTasks.length > 3 && (
                  <div style={{ fontSize: '0.625rem', color: 'var(--muted)', padding: '2px 4px' }}>
                    +{cellTasks.length - 3} more
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
