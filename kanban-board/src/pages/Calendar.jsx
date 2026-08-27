import { useState, useMemo } from 'react';
import { useAppState } from '../context/AppContext.jsx';
import Modal from '../components/Modal.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { useAppActions } from '../context/AppContext.jsx';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function Calendar() {
  const state = useAppState();
  const { editTask } = useAppActions();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedTask, setSelectedTask] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Build calendar grid
  const { weeks, tasksByDay } = useMemo(() => {
    const tasks = Object.values(state.tasks).filter((t) => t.dueDate);
    const byDay = {};
    tasks.forEach((t) => {
      if (!byDay[t.dueDate]) byDay[t.dueDate] = [];
      byDay[t.dueDate].push(t);
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    // Make Monday = 0 (JS getDay: Sun=0, Mon=1... Sat=6)
    const startDow = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const cells = [];
    // Pad before first day
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, dateStr });
    }

    const weeksArr = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeksArr.push(cells.slice(i, i + 7));
    }

    return { weeks: weeksArr, tasksByDay: byDay };
  }, [year, month, state.tasks]);

  const today = new Date().toISOString().split('T')[0];

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }
  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }
  function goToday() {
    setCurrentDate(new Date());
  }

  const assigneeMap = useMemo(() => {
    const m = {};
    state.members.forEach((mem) => (m[mem.id] = mem));
    return m;
  }, [state.members]);

  return (
    <div className="page">
      <div className="calendar-header">
        <h2>Calendar</h2>
        <div className="calendar-nav">
          <button className="btn btn-ghost btn-sm" onClick={goToday}>Today</button>
          <button className="btn btn-ghost btn-sm" onClick={prevMonth} aria-label="Previous month">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="calendar-month-label">
            {MONTHS[month]} {year}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={nextMonth} aria-label="Next month">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {WEEKDAYS.map((d) => (
            <div key={d} className="calendar-weekday">{d}</div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="calendar-week">
            {week.map((cell, ci) => {
              if (!cell) return <div key={`empty-${ci}`} className="calendar-day calendar-day--empty" />;
              const dayTasks = tasksByDay[cell.dateStr] || [];
              const isToday = cell.dateStr === today;
              return (
                <div
                  key={cell.dateStr}
                  className={`calendar-day${isToday ? ' calendar-day--today' : ''}`}
                >
                  <span className="calendar-day__num">{cell.day}</span>
                  <div className="calendar-day__tasks">
                    {dayTasks.slice(0, 3).map((t) => {
                      const a = assigneeMap[t.assigneeId];
                      return (
                        <button
                          key={t.id}
                          className="calendar-task-chip"
                          onClick={() => setSelectedTask(t)}
                          style={{
                            borderLeftColor:
                              t.priority === 'high'
                                ? 'var(--danger)'
                                : t.priority === 'medium'
                                ? 'var(--warning)'
                                : 'var(--neutral-40)',
                          }}
                        >
                          {a && (
                            <span className="calendar-task-avatar">
                              {a.name.split(' ').map((n) => n[0]).join('')}
                            </span>
                          )}
                          <span className="calendar-task-text">{t.title}</span>
                        </button>
                      );
                    })}
                    {dayTasks.length > 3 && (
                      <span className="calendar-more">+{dayTasks.length - 3} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Task detail modal */}
      <Modal open={!!selectedTask} onClose={() => setSelectedTask(null)} title="Task detail">
        {selectedTask && (
          <>
            <TaskForm
              task={selectedTask}
              columnId={selectedTask.columnId}
              onSave={(data) => {
                editTask(selectedTask.id, data);
                setSelectedTask(null);
              }}
              onCancel={() => setSelectedTask(null)}
            />
          </>
        )}
      </Modal>
    </div>
  );
}
