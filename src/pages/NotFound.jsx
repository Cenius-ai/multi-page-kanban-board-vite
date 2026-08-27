import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="error-state">
      <div className="empty-state-icon">🔍</div>
      <div className="error-state-title">404 — Page not found</div>
      <div className="error-state-desc">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
      </div>
      <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
        Back to Board
      </Link>
    </div>
  );
}
