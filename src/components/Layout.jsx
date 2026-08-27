import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

const navItems = [
  { to: '/', label: 'Board', icon: BoardIcon },
  { to: '/calendar', label: 'Calendar', icon: CalendarIcon },
  { to: '/team', label: 'Team', icon: TeamIcon },
  { to: '/analytics', label: 'Analytics', icon: AnalyticsIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar rail */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">F</div>
          FlowBoard
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `sidebar-link${isActive ? ' active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content area */}
      <main className="main-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', marginBottom: 'var(--s-6)' }}>
          <button
            className="mobile-nav-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="4" x2="15" y2="4" />
              <line x1="3" y1="9" x2="15" y2="9" />
              <line x1="3" y1="14" x2="15" y2="14" />
            </svg>
          </button>
        </div>
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
}

/* ---- Simple SVG Icons (inline to avoid extra deps) ---- */

function BoardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="1" y="1" width="5" height="16" rx="1" />
      <rect x="7" y="1" width="5" height="10" rx="1" />
      <rect x="13" y="1" width="4" height="7" rx="1" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="1.5" y="2.5" width="15" height="14" rx="1.5" />
      <line x1="1.5" y1="6" x2="16.5" y2="6" />
      <line x1="5" y1="1" x2="5" y2="4" />
      <line x1="13" y1="1" x2="13" y2="4" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="7" cy="5" r="2" />
      <circle cx="13" cy="5" r="2" />
      <path d="M2 15c0-2.2 1.8-4 4-4h2" />
      <path d="M10 15c0-2.2 1.8-4 4-4" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="M6 13c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="1" y="8" width="3" height="8" rx="0.5" />
      <rect x="6" y="4" width="3" height="12" rx="0.5" />
      <rect x="11" y="1" width="3" height="15" rx="0.5" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="9" cy="9" r="2.5" />
      <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M3.7 14.3l1.4-1.4M12.9 5.1l1.4-1.4" />
    </svg>
  );
}
