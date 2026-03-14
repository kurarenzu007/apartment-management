import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants';
import { Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import './Topbar.css';

export default function Topbar({ title = 'Dashboard' }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    navigate(ROUTES.LOGIN);
  };

  const notifications = [
    { id: 1, message: 'New maintenance request from Apartment 3', time: '5 min ago', unread: true },
    { id: 2, message: 'Rent payment received from John Doe', time: '1 hour ago', unread: true },
    { id: 3, message: 'New complaint submitted', time: '2 hours ago', unread: true },
  ];

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="topbar-right">
        <div className="notification-wrapper">
          <button className="notification-btn" onClick={() => setNotificationOpen(!notificationOpen)}>
            <Bell size={20} />
            <span className="notification-badge">{notifications.filter(n => n.unread).length}</span>
          </button>

          {notificationOpen && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
                <button className="mark-read-btn">Mark all as read</button>
              </div>
              <div className="notification-list">
                {notifications.map(notif => (
                  <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                    <div className="notification-message">{notif.message}</div>
                    <div className="notification-time">{notif.time}</div>
                  </div>
                ))}
              </div>
              <div className="notification-footer">
                <button className="view-all-btn">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        <div className="user-menu">
          <button
            className="user-menu-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="user-menu-avatar">A</div>
            <ChevronDown size={16} className="dropdown-arrow" />
          </button>

          {dropdownOpen && (
            <div className="user-dropdown">
              <div className="dropdown-item">
                <User size={16} />
                Profile
              </div>
              <div className="dropdown-item">
                <Settings size={16} />
                Settings
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-item" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
