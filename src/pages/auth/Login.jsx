import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_TYPES, ROUTES } from '../../constants';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('');
  const [language, setLanguage] = useState('EN');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resetAlert, setResetAlert] = useState(false);
  const navigate = useNavigate();

  const validateLoginForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (!userType) {
      newErrors.userType = 'Please select a user type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validateLoginForm()) {
      return;
    }

    setLoading(true);

    // Faster login - reduced from 1500ms to 600ms
    setTimeout(() => {
      setLoading(false);
      if (userType === USER_TYPES.ADMIN) {
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else if (userType === USER_TYPES.TENANT) {
        navigate(ROUTES.TENANT_DASHBOARD);
      }
    }, 600);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setResetAlert(true);
    setTimeout(() => setResetAlert(false), 3000);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-overlay">
          <div className="login-brand-icon">🏢</div>
          <h1 className="login-brand-name">JJJ APARTMENT</h1>
          <p className="login-tagline">Smart Apartment Management</p>
          <div className="feature-pills">
            <div className="feature-pill">📊 Dashboard</div>
            <div className="feature-pill">👥 Tenants</div>
            <div className="feature-pill">💰 Rent Tracking</div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <div className="login-logo">🏢</div>
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">Sign in to your account</p>

          {resetAlert && (
            <div className="success-alert">Reset link sent!</div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">✉️ Email Address</label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">🔒 Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">👤 User Type</label>
              <select
                className={`form-input ${errors.userType ? 'error' : ''}`}
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="">--Select User Type--</option>
                <option value={USER_TYPES.ADMIN}>{USER_TYPES.ADMIN}</option>
                <option value={USER_TYPES.TENANT}>{USER_TYPES.TENANT}</option>
              </select>
              {errors.userType && <div className="error-message">{errors.userType}</div>}
            </div>

            <div className="forgot-password">
              <a href="#" onClick={handleForgotPassword}>Forgot password?</a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>

            <div className="language-switcher">
              <button
                type="button"
                className={`lang-btn ${language === 'EN' ? 'active' : ''}`}
                onClick={() => setLanguage('EN')}
              >
                EN
              </button>
              <span>|</span>
              <button
                type="button"
                className={`lang-btn ${language === 'FIL' ? 'active' : ''}`}
                onClick={() => setLanguage('FIL')}
              >
                FIL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
