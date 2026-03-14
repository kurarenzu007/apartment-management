import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { 
  LayoutDashboard, Users, Home, User, DollarSign, 
  Wrench, MessageSquare, BarChart3, Settings, LogOut, Building2 
} from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { path: ROUTES.ADMIN_TENANTS, icon: Users, label: 'Tenants' },
    { path: ROUTES.ADMIN_UNITS, icon: Home, label: 'Units' },
    { path: ROUTES.ADMIN_RENT, icon: DollarSign, label: 'Rent Collection' },
    { path: ROUTES.ADMIN_MAINTENANCE, icon: Wrench, label: 'Maintenance' },
    { path: ROUTES.ADMIN_COMPLAINTS, icon: MessageSquare, label: 'Complaints' },
    { path: ROUTES.ADMIN_REPORTS, icon: BarChart3, label: 'Reports' },
    { path: ROUTES.ADMIN_SETTINGS, icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-circle">
          <Building2 size={22} />
        </div>
        <div className="logo-text">JJJ APARTMENT</div>
      </div>

      <div className="user-pill">
        <div className="user-avatar">A</div>
        <span>Admin</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <Icon size={18} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
}
