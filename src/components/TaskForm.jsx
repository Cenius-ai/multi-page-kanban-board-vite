import { useState } from 'react';

const EMPTY = { title: '', description: '', dueDate: '', assigneeId: '', priority: 'medium', labels: '' };

export default function TaskForm({ initial = null, members, onSave, onCancel }) {
  const [form, setForm] = useState(() => {
    if (initial) {
      return {
        title: initial.title || '',
        description: initial.description || '',
        dueDate: initial.dueDate || '',
        assigneeId: initial.assigneeId || '',
        priority: initial.priority || 'medium',
        labels: (initial.labels || []).join(', '),
      };
    }
    return { ...EMPTY };
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (form.title.length > 200) e.title = 'Title must be under 200 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate,
      assigneeId: form.assigneeId,
      priority: form.priority,
      labels: form.labels
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
      <div className="field">
        <label className="field-label" htmlFor="tf-title">Title *</label>
        <input
          id="tf-title"
          className="field-input"
          value={form.title}
          onChange={set('title')}
          placeholder="Task title"
          autoFocus
        />
        {errors.title && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.title}</span>}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="tf-desc">Description</label>
        <textarea
          id="tf-desc"
          className="field-textarea"
          value={form.description}
          onChange={set('description')}
          placeholder="Add details..."
          rows={3}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-3)' }}>
        <div className="field">
          <label className="field-label" htmlFor="tf-date">Due date</label>
          <input
            id="tf-date"
            type="date"
            className="field-input"
            value={form.dueDate}
            onChange={set('dueDate')}
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="tf-priority">Priority</label>
          <select
            id="tf-priority"
            className="field-select"
            value={form.priority}
            onChange={set('priority')}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="tf-assignee">Assignee</label>
        <select
          id="tf-assignee"
          className="field-select"
          value={form.assigneeId}
          onChange={set('assigneeId')}
        >
          <option value="">Unassigned</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="tf-labels">Labels (comma-separated)</label>
        <input
          id="tf-labels"
          className="field-input"
          value={form.labels}
          onChange={set('labels')}
          placeholder="frontend, bug, urgent"
        />
      </div>

      <div className="modal-actions">
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initial ? 'Save changes' : 'Create task'}
        </button>
      </div>
    </form>
  );
}
