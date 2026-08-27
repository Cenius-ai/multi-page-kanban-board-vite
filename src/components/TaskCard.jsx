import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getMemberById } from './utils';

export default function TaskCard({ task, members, onEdit, onDelete }) {
  const assignee = getMemberById(members, task.assigneeId);
  const priorityClass = `priority-${task.priority}`;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = () => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate + 'T00:00:00');
    return due < today;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card${isDragging ? ' dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="task-card-actions">
        <button
          className="btn btn-ghost btn-sm btn-icon"
          onClick={(e) => { e.stopPropagation(); onEdit(task); }}
          title="Edit task"
          style={{ width: 26, height: 26 }}
        >
          <svg width="12" height="12" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2l4 4L6 16H2v-4z" />
          </svg>
        </button>
        <button
          className="btn btn-ghost btn-sm btn-icon"
          onClick={(e) => { e.stopPropagation(); onDelete(task); }}
          title="Delete task"
          style={{ width: 26, height: 26, color: 'var(--danger)' }}
        >
          <svg width="12" height="12" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="6" x2="14" y2="6" />
            <line x1="6" y1="6" x2="6" y2="15" />
            <line x1="10" y1="6" x2="10" y2="15" />
            <line x1="3" y1="6" x2="15" y2="6" />
          </svg>
        </button>
      </div>

      {(task.labels && task.labels.length > 0) && (
        <div className="task-card-labels">
          {task.labels.map((label, i) => (
            <span key={i} className="task-label">{label}</span>
          ))}
        </div>
      )}

      <div className="task-card-title">{task.title}</div>

      <div className="task-card-meta">
        <div className={`priority-dot ${priorityClass}`} title={task.priority} />
        {task.dueDate && (
          <span
            className="task-card-date"
            style={isOverdue() ? { color: 'var(--danger)' } : undefined}
          >
            <svg width="10" height="10" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="1.5" y="2.5" width="15" height="14" rx="1.5" />
              <line x1="1.5" y1="6" x2="16.5" y2="6" />
            </svg>
            {formatDate(task.dueDate)}
          </span>
        )}
        {assignee && (
          <span className="task-card-assignee" title={assignee.name}>
            {assignee.initials || assignee.name.charAt(0)}
          </span>
        )}
      </div>
    </div>
  );
}
