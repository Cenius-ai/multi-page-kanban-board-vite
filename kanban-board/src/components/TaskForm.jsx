import { useState, useEffect } from 'react';
import { useAppState } from '../context/AppContext.jsx';

/**
 * Form for creating and editing a task.
 * @param {{ task?: object, columnId: string, members: array, onSave: (data) => void, onCancel: () => void }} props
 */
export default function TaskForm({ task, columnId, onSave, onCancel }) {
  const state = useAppState();
  const isEditing = !!task;

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || '');
  const [priority, setPriority] = useState(task?.priority || state.settings.defaultPriority);
  const [labelsInput, setLabelsInput] = useState((task?.labels || []).join(', '));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setDueDate(task.dueDate || '');
      setAssigneeId(task.assigneeId || '');
      setPriority(task.priority || state.settings.defaultPriority);
      setLabelsInput((task.labels || []).join(', '));
    }
  }, [task, state.settings.defaultPriority]);

  function validate() {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (title.length > 200) errs.title = 'Title must be under 200 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const labels = labelsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    onSave({
      columnId,
      title: title.trim(),
      description: description.trim(),
      dueDate,
      assigneeId,
      priority,
      labels,
    });
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="tf-title" className="form-label">
          Title <span className="form-required">*</span>
        </label>
        <input
          id="tf-title"
          className={`form-input${errors.title ? ' form-input--error' : ''}`}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="tf-desc" className="form-label">Description</label>
        <textarea
          id="tf-desc"
          className="form-input form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details…"
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="tf-priority" className="form-label">Priority</label>
          <select
            id="tf-priority"
            className="form-input"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="tf-due" className="form-label">Due date</label>
          <input
            id="tf-due"
            className="form-input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="tf-assignee" className="form-label">Assignee</label>
        <select
          id="tf-assignee"
          className="form-input"
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
        >
          <option value="">Unassigned</option>
          {state.members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="tf-labels" className="form-label">Labels</label>
        <input
          id="tf-labels"
          className="form-input"
          type="text"
          value={labelsInput}
          onChange={(e) => setLabelsInput(e.target.value)}
          placeholder="design, bug, feature (comma-separated)"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Save changes' : 'Create task'}
        </button>
      </div>
    </form>
  );
}
