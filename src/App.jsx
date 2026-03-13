import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/Dashboard';
import ViewTenants from './pages/admin/tenants/ViewTenants';
import AddTenant from './pages/admin/tenants/AddTenant';
import Units from './pages/admin/units/Units';
import { ROUTES } from './constants';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.ADMIN_TENANTS} element={<ViewTenants />} />
        <Route path={ROUTES.ADMIN_TENANTS_ADD} element={<AddTenant />} />
        <Route path={ROUTES.ADMIN_UNITS} element={<Units />} />
        <Route path={ROUTES.ADMIN_OWNER} element={<PlaceholderPage title="Owner Info" />} />
        <Route path={ROUTES.ADMIN_RENT} element={<PlaceholderPage title="Rent Collection" />} />
        <Route path={ROUTES.ADMIN_MAINTENANCE} element={<PlaceholderPage title="Maintenance" />} />
        <Route path={ROUTES.ADMIN_COMPLAINTS} element={<PlaceholderPage title="Complaints" />} />
        <Route path={ROUTES.ADMIN_REPORTS} element={<PlaceholderPage title="Reports" />} />
        <Route path={ROUTES.ADMIN_SETTINGS} element={<PlaceholderPage title="Settings" />} />
        
        {/* Tenant dashboard placeholder */}
        <Route path={ROUTES.TENANT_DASHBOARD} element={<PlaceholderPage title="Tenant Dashboard" />} />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </Router>
  );
}

// Placeholder component for unimplemented pages
function PlaceholderPage({ title }) {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      fontFamily: 'Inter, sans-serif',
      fontSize: '18px',
      color: '#7F8C8D'
    }}>
      <h1 style={{ color: '#1A9E96', marginBottom: '16px' }}>{title}</h1>
      <p>Coming Soon</p>
    </div>
  );
}

export default App;
