import { useAppState } from '../context/AppContext.jsx';

const priorityColors = {
  high: 'var(--danger)',
  medium: 'var(--warning)',
  low: 'var(--neutral-40)',
};

const priorityLabels = { high: 'High', medium: 'Med', low: 'Low' };

export default function TaskCard({ task, onEdit }) {
  const state = useAppState();
  const assignee = state.members.find((m) => m.id === task.assigneeId);
  const doneCol = Object.values(state.columns).find((c) => c.title === 'Done');
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.columnId !== doneCol?.id;

  return (
    <div
      className={`task-card${isOverdue ? ' task-card--overdue' : ''}`}
      onClick={() => onEdit(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onEdit(task); }}
    >
      <div className="task-card__header">
        <span
          className="task-priority-dot"
          style={{ background: priorityColors[task.priority] || priorityColors.medium }}
          title={priorityLabels[task.priority] || 'Medium'}
        />
        <span className="task-card__title">{task.title}</span>
      </div>
      <div className="task-card__meta">
        {task.labels.length > 0 && (
          <div className="task-card__labels">
            {task.labels.map((lbl) => (
              <span key={lbl} className="task-label">{lbl}</span>
            ))}
          </div>
        )}
        <div className="task-card__footer">
          {assignee && (
            <span className="task-assignee" title={assignee.name}>
              {assignee.name.split(' ').map((n) => n[0]).join('')}
            </span>
          )}
          {task.dueDate && (
            <span className={`task-due${isOverdue ? ' task-due--overdue' : ''}`}>
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDueDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  if (days < 0 && days > -7) return `${Math.abs(days)}d ago`;
  if (days > 0 && days < 7) return `${days}d left`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
