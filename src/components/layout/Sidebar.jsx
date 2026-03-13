import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: ROUTES.ADMIN_DASHBOARD, icon: '📊', label: 'Dashboard' },
    { path: ROUTES.ADMIN_TENANTS, icon: '👥', label: 'Tenants' },
    { path: ROUTES.ADMIN_UNITS, icon: '🏠', label: 'Units' },
    { path: ROUTES.ADMIN_OWNER, icon: '👤', label: 'Owner Info' },
    { path: ROUTES.ADMIN_RENT, icon: '💰', label: 'Rent Collection' },
    { path: ROUTES.ADMIN_MAINTENANCE, icon: '🔧', label: 'Maintenance' },
    { path: ROUTES.ADMIN_COMPLAINTS, icon: '💬', label: 'Complaints' },
    { path: ROUTES.ADMIN_REPORTS, icon: '📈', label: 'Reports' },
    { path: ROUTES.ADMIN_SETTINGS, icon: '⚙️', label: 'Settings' },
  ];

  const handleLogout = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-circle">🏢</div>
        <div className="logo-text">JJJ APARTMENT</div>
      </div>

      <div className="user-pill">
        <div className="user-avatar">A</div>
        <span>Admin</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </div>
  );
}
