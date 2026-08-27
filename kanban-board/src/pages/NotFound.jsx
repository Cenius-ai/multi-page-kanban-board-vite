import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', color: 'var(--fg-muted)', fontWeight: 700 }}>404</h1>
        <p style={{ color: 'var(--fg-muted)', marginBottom: 'var(--s-6)' }}>
          This page doesn&rsquo;t exist.
        </p>
        <Link to="/" className="btn btn-primary">Back to board</Link>
      </div>
    </div>
  );
}
