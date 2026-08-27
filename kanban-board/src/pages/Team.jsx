import { useState, useMemo } from 'react';
import { useAppState, useAppActions } from '../context/AppContext.jsx';
import Modal from '../components/Modal.jsx';

const AVATAR_COLORS = [
  '#009367', '#4A90D9', '#D97A4A', '#8E5EA6',
  '#D94A7A', '#4AD9A6', '#D9A64A', '#5EA68E',
];

export default function Team() {
  const state = useAppState();
  const { addMember, editMember, deleteMember } = useAppActions();
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  // Compute task count per member
  const taskCounts = useMemo(() => {
    const counts = {};
    Object.values(state.tasks).forEach((t) => {
      if (t.assigneeId) counts[t.assigneeId] = (counts[t.assigneeId] || 0) + 1;
    });
    return counts;
  }, [state.tasks]);

  function handleSave(data) {
    if (editing) {
      editMember(editing.id, data);
      setEditing(null);
    } else {
      addMember(data.name, data.role);
      setShowAdd(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Team</h2>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add member
        </button>
      </div>

      <div className="team-grid">
        {state.members.length === 0 && (
          <div className="empty-state">
            <p>No team members yet. Add your first member to get started.</p>
          </div>
        )}
        {state.members.map((member, idx) => {
          const initials = member.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
          const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
          const taskCount = taskCounts[member.id] || 0;

          return (
            <div key={member.id} className="team-card">
              <div className="team-card__avatar" style={{ background: color }}>
                {initials}
              </div>
              <div className="team-card__info">
                <h4 className="team-card__name">{member.name}</h4>
                {member.role && <span className="team-card__role">{member.role}</span>}
                <span className="team-card__tasks">{taskCount} task{taskCount !== 1 ? 's' : ''}</span>
              </div>
              <div className="team-card__actions">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setEditing(member)}
                  title="Edit member"
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger-ghost btn-sm"
                  onClick={() => {
                    if (window.confirm(`Remove ${member.name} from the team?`)) {
                      deleteMember(member.id);
                    }
                  }}
                  title="Remove member"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit modal */}
      <Modal
        open={showAdd || editing !== null}
        onClose={() => { setShowAdd(false); setEditing(null); }}
        title={editing ? 'Edit member' : 'Add team member'}
      >
        <MemberForm
          initial={editing || undefined}
          onSave={handleSave}
          onCancel={() => { setShowAdd(false); setEditing(null); }}
        />
      </Modal>
    </div>
  );
}

function MemberForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || '');
  const [role, setRole] = useState(initial?.role || '');
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (name.length > 80) errs.name = 'Name too long';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave({ name: name.trim(), role: role.trim() });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="mem-name" className="form-label">Name <span className="form-required">*</span></label>
        <input
          id="mem-name"
          className={`form-input${errors.name ? ' form-input--error' : ''}`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          autoFocus
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="mem-role" className="form-label">Role</label>
        <input
          id="mem-role"
          className="form-input"
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Product Manager"
        />
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">
          {initial ? 'Save changes' : 'Add member'}
        </button>
      </div>
    </form>
  );
}
