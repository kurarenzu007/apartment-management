import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { Building2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resetAlert, setResetAlert] = useState(false);
  const navigate = useNavigate();

  const CREDENTIALS = {
    ADMIN: { email: 'admin@admin.com', password: 'admin123', route: ROUTES.ADMIN_DASHBOARD },
    TENANT: { email: 'tenant@tenant.com', password: 'tenant123', route: ROUTES.TENANT_DASHBOARD }
  };

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validateLoginForm()) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      
      // Check credentials
      if (email === CREDENTIALS.ADMIN.email && password === CREDENTIALS.ADMIN.password) {
        navigate(CREDENTIALS.ADMIN.route);
      } else if (email === CREDENTIALS.TENANT.email && password === CREDENTIALS.TENANT.password) {
        navigate(CREDENTIALS.TENANT.route);
      } else {
        setErrors({ email: 'Invalid email or password' });
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
          <div className="login-brand-icon">
            <Building2 size={40} />
          </div>
          <h1 className="login-brand-name">JJJ APARTMENT</h1>
          <p className="login-tagline">Smart Apartment Management System</p>
         
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <div className="login-logo">
            <Building2 size={32} />
          </div>
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">Sign in to your account</p>

          {resetAlert && (
            <div className="success-alert">Reset link sent to your email!</div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">
                <Mail size={16} />
                Email Address
              </label>
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
              <label className="form-label">
                <Lock size={16} />
                Password
              </label>
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
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <div className="error-message">{errors.password}</div>}
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
