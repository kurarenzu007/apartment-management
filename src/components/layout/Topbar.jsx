import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import './Topbar.css';

export default function Topbar({ title = 'Dashboard' }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="topbar-center">
        <input
          type="text"
          className="search-bar"
          placeholder="Search..."
        />
      </div>

      <div className="topbar-right">
        <button className="notification-btn">
          🔔
          <span className="notification-badge">3</span>
        </button>

        <div className="user-menu">
          <button
            className="user-menu-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="user-menu-avatar">A</div>
            <span className="dropdown-arrow">▼</span>
          </button>

          {dropdownOpen && (
            <div className="user-dropdown">
              <div className="dropdown-item">👤 Profile</div>
              <div className="dropdown-item">⚙️ Settings</div>
              <div className="dropdown-item" onClick={handleLogout}>🚪 Logout</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
