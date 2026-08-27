import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Settings() {
  const { settings, board, updateSettings, updateColumnTitle, deleteColumn, addColumn } = useAppContext();
  const [form, setForm] = useState({
    boardBackground: settings.boardBackground || '#ffffff',
    columnLimit: settings.columnLimit || 10,
    defaultPriority: settings.defaultPriority || 'medium',
  });
  const [saved, setSaved] = useState(false);
  const [colForms, setColForms] = useState({});
  const [newColName, setNewColName] = useState('');

  useEffect(() => {
    setForm({
      boardBackground: settings.boardBackground || '#ffffff',
      columnLimit: settings.columnLimit || 10,
      defaultPriority: settings.defaultPriority || 'medium',
    });
  }, [settings]);

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setSaved(false);
  };

  const handleColTitleChange = (colId, value) => {
    setColForms((prev) => ({ ...prev, [colId]: value }));
  };

  const handleColTitleSave = (colId) => {
    const val = (colForms[colId] || '').trim();
    if (val) {
      updateColumnTitle(colId, val);
    }
    setColForms((prev) => {
      const next = { ...prev };
      delete next[colId];
      return next;
    });
  };

  const handleAddColumn = () => {
    const name = newColName.trim();
    if (!name) return;
    const id = `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    addColumn({ id, title: name });
    setNewColName('');
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="settings-form">
        {/* Appearance */}
        <div className="settings-section">
          <div className="settings-section-title">Appearance</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
            <div className="field">
              <label className="field-label" htmlFor="set-bg">Board background color</label>
              <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center' }}>
                <input
                  id="set-bg"
                  type="color"
                  value={form.boardBackground}
                  onChange={set('boardBackground')}
                  style={{
                    width: 40,
                    height: 36,
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-sm)',
                    cursor: 'pointer',
                    padding: 2,
                    background: 'none',
                  }}
                />
                <input
                  className="field-input"
                  value={form.boardBackground}
                  onChange={set('boardBackground')}
                  style={{ width: 120 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Board config */}
        <div className="settings-section">
          <div className="settings-section-title">Board Configuration</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
            <div className="field">
              <label className="field-label" htmlFor="set-limit">Max tasks per column</label>
              <input
                id="set-limit"
                type="number"
                className="field-input"
                value={form.columnLimit}
                onChange={set('columnLimit')}
                min={1}
                max={100}
                style={{ width: 100 }}
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="set-priority">Default task priority</label>
              <select
                id="set-priority"
                className="field-select"
                value={form.defaultPriority}
                onChange={set('defaultPriority')}
                style={{ width: 160 }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Column management */}
        <div className="settings-section">
          <div className="settings-section-title">Columns</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
            {board.columns
              .sort((a, b) => a.order - b.order)
              .map((col) => (
                <div
                  key={col.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--s-2)',
                  }}
                >
                  <input
                    className="field-input"
                    value={colForms[col.id] !== undefined ? colForms[col.id] : col.title}
                    onChange={(e) => handleColTitleChange(col.id, e.target.value)}
                    onBlur={() => handleColTitleSave(col.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleColTitleSave(col.id);
                    }}
                    style={{ flex: 1 }}
                  />
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => deleteColumn(col.id)}
                    style={{ color: 'var(--danger)', flexShrink: 0 }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            <div style={{ display: 'flex', gap: 'var(--s-2)', marginTop: 'var(--s-2)' }}>
              <input
                className="field-input"
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddColumn(); }}
                placeholder="New column name"
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary btn-sm" onClick={handleAddColumn}>
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="settings-section" style={{ borderColor: 'var(--danger)' }}>
          <div className="settings-section-title" style={{ color: 'var(--danger)' }}>
            Data Management
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: 'var(--s-3)' }}>
            All data is stored locally in your browser. Clearing it cannot be undone.
          </p>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm('This will delete all boards, tasks, and members. Are you sure?')) {
                const keys = Object.keys(localStorage).filter((k) => k.startsWith('flowboard_'));
                keys.forEach((k) => localStorage.removeItem(k));
                window.location.reload();
              }
            }}
          >
            Clear all data
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)' }}>
          <button className="btn btn-primary" onClick={handleSave}>
            Save settings
          </button>
          {saved && (
            <span style={{ fontSize: '0.8125rem', color: 'var(--ok)' }}>
              Settings saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
