import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import './AdminLayout.css';

export default function AdminLayout({ title = 'Dashboard' }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title={title} />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
