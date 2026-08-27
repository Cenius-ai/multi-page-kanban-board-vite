import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { countTasksForMember } from '../components/utils';
import Modal from '../components/Modal';

let memberIdCounter = 0;
function makeMemberId() {
  memberIdCounter += 1;
  return `m_${Date.now().toString(36)}_${memberIdCounter.toString(36)}`;
}

export default function Team() {
  const { members, tasks, addMember, updateMember, deleteMember } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const [form, setForm] = useState({ name: '', role: '' });
  const [errors, setErrors] = useState({});

  const openAdd = () => {
    setEditingMember(null);
    setForm({ name: '', role: '' });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (member) => {
    setEditingMember(member);
    setForm({ name: member.name, role: member.role || '' });
    setErrors({});
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (form.name.length > 80) errs.name = 'Name must be under 80 characters';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const initials = form.name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    if (editingMember) {
      updateMember({
        id: editingMember.id,
        name: form.name.trim(),
        role: form.role.trim(),
        initials,
      });
    } else {
      addMember({
        id: makeMemberId(),
        name: form.name.trim(),
        role: form.role.trim(),
        avatarUrl: '',
        initials,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (member) => {
    setMemberToDelete(member);
    setDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (memberToDelete) {
      deleteMember(memberToDelete.id);
      setMemberToDelete(null);
      setDeleteConfirm(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Team</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="9" y1="3" x2="9" y2="15" />
            <line x1="3" y1="9" x2="15" y2="9" />
          </svg>
          Add member
        </button>
      </div>

      {members.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <div className="empty-state-title">No team members</div>
          <div className="empty-state-desc">
            Add team members to assign tasks and track workload.
          </div>
          <button className="btn btn-primary" onClick={openAdd}>
            Add your first member
          </button>
        </div>
      ) : (
        <div className="team-grid">
          {members.map((member) => {
            const taskCount = countTasksForMember(tasks, member.id);
            return (
              <div key={member.id} className="member-card">
                <div className="member-avatar">
                  {member.initials || member.name.charAt(0)}
                </div>
                <div className="member-info">
                  <div className="member-name">{member.name}</div>
                  <div className="member-tasks">
                    {member.role || 'No role'} &middot; {taskCount} task{taskCount !== 1 ? 's' : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--s-1)' }}>
                  <button
                    className="btn btn-ghost btn-sm btn-icon"
                    onClick={() => openEdit(member)}
                    title="Edit member"
                  >
                    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 2l4 4L6 16H2v-4z" />
                    </svg>
                  </button>
                  <button
                    className="btn btn-ghost btn-sm btn-icon"
                    onClick={() => handleDelete(member)}
                    title="Remove member"
                    style={{ color: 'var(--danger)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="4" y1="6" x2="14" y2="6" />
                      <line x1="6" y1="6" x2="6" y2="15" />
                      <line x1="10" y1="6" x2="10" y2="15" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMember ? 'Edit member' : 'Add team member'}
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
          <div className="field">
            <label className="field-label" htmlFor="mem-name">Name *</label>
            <input
              id="mem-name"
              className="field-input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Full name"
              autoFocus
            />
            {errors.name && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.name}</span>}
          </div>
          <div className="field">
            <label className="field-label" htmlFor="mem-role">Role</label>
            <input
              id="mem-role"
              className="field-input"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              placeholder="e.g. Developer, Designer"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {editingMember ? 'Save changes' : 'Add member'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        title="Remove team member"
        footer={
          <>
            <button className="btn" onClick={() => setDeleteConfirm(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={confirmDelete}>Remove</button>
          </>
        }
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
          Are you sure you want to remove &ldquo;{memberToDelete?.name}&rdquo;? Their tasks will be unassigned.
        </p>
      </Modal>
    </div>
  );
}
