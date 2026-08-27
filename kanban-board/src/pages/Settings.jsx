import { useState } from 'react';
import { useAppState, useAppActions } from '../context/AppContext.jsx';

export default function Settings() {
  const state = useAppState();
  const { updateSettings, resetAll } = useAppActions();

  const [bg, setBg] = useState(state.settings.boardBackground || '#ffffff');
  const [colLimit, setColLimit] = useState(state.settings.columnLimit || 0);
  const [defPriority, setDefPriority] = useState(state.settings.defaultPriority || 'medium');
  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    updateSettings({
      boardBackground: bg,
      columnLimit: Number(colLimit) || 0,
      defaultPriority: defPriority,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    if (window.confirm('Reset all data to the demo dataset? This cannot be undone.')) {
      resetAll();
      setBg('#ffffff');
      setColLimit(0);
      setDefPriority('medium');
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Settings</h2>
      </div>

      <form className="settings-form" onSubmit={handleSave}>
        <div className="settings-section">
          <h4 className="settings-section__title">Board appearance</h4>

          <div className="form-field">
            <label htmlFor="set-bg" className="form-label">Board background</label>
            <div className="color-picker-row">
              <input
                id="set-bg"
                className="form-input form-input--color"
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
              />
              <code className="color-value">{bg}</code>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h4 className="settings-section__title">Task defaults</h4>

          <div className="form-field">
            <label htmlFor="set-priority" className="form-label">Default priority for new tasks</label>
            <select
              id="set-priority"
              className="form-input"
              value={defPriority}
              onChange={(e) => setDefPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="set-limit" className="form-label">Column task limit (0 = unlimited)</label>
            <input
              id="set-limit"
              className="form-input"
              type="number"
              min="0"
              max="100"
              value={colLimit}
              onChange={(e) => setColLimit(e.target.value)}
            />
          </div>
        </div>

        <div className="settings-section">
          <h4 className="settings-section__title">Data</h4>
          <p className="settings-hint">
            All data is stored in your browser&rsquo;s localStorage. Clearing your browser data will
            remove the board.
          </p>
          <button type="button" className="btn btn-danger-ghost" onClick={handleReset}>
            Reset all data to demo
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {saved ? '✓ Saved' : 'Save settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
