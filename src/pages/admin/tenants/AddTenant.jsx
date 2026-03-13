import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/layout/Sidebar';
import Topbar from '../../../components/layout/Topbar';
import Button from '../../../components/ui/Button';
import { APARTMENT_TYPES, DURATION_OPTIONS, ROUTES } from '../../../constants';
import { validateEmail, validatePhoneNumber, isAdult } from '../../../utils';
import './AddTenant.css';

export default function AddTenant() {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Step 1: Personal Information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [occupation, setOccupation] = useState('');

  // Step 2: Stay Details
  const [apartmentType, setApartmentType] = useState('');
  const [duration, setDuration] = useState('');

  // Step 3: Account Setup
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateStep1 = () => {
    const newErrors = {};

    if (!fullName || fullName.length < 2) {
      newErrors.fullName = 'Full name is required (min 2 characters)';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!contact) {
      newErrors.contact = 'Contact number is required';
    } else if (!validatePhoneNumber(contact)) {
      newErrors.contact = 'Contact must start with 09 and be 11 digits';
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (!isAdult(dateOfBirth)) {
      newErrors.dateOfBirth = 'Must be 18 years or older';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!apartmentType) {
      newErrors.apartmentType = 'Apartment type is required';
    }

    if (!duration) {
      newErrors.duration = 'Duration of stay is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!username || username.length < 4) {
      newErrors.username = 'Username is required (min 4 characters)';
    }

    if (!password || password.length < 6) {
      newErrors.password = 'Password is required (min 6 characters)';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep3()) {
      alert('Tenant added successfully!');
      navigate(ROUTES.ADMIN_TENANTS);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Add New Tenant" />
        <div className="page-content">
          <div className="add-tenant-container">
            <div className="step-indicator">
              <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                <div className="step-circle">{currentStep > 1 ? '✓' : '1'}</div>
                <div className="step-label">Personal Info</div>
              </div>
              <div className={`step-line ${currentStep > 1 ? 'active' : ''}`}></div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                <div className="step-circle">{currentStep > 2 ? '✓' : '2'}</div>
                <div className="step-label">Stay Details</div>
              </div>
              <div className={`step-line ${currentStep > 2 ? 'active' : ''}`}></div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="step-circle">3</div>
                <div className="step-label">Account Setup</div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="form-step">
                  <h2 className="step-title">Personal Information</h2>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className={`form-input ${errors.fullName ? 'error' : ''}`}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter full name"
                      />
                      {errors.fullName && <div className="error-message">{errors.fullName}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date of Birth *</label>
                      <input
                        type="date"
                        className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                      />
                      {errors.dateOfBirth && <div className="error-message">{errors.dateOfBirth}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                      />
                      {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Occupation</label>
                      <input
                        type="text"
                        className="form-input"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        placeholder="Enter occupation (optional)"
                      />
                    </div>

                    <div className="form-group form-group-full">
                      <label className="form-label">Contact Number *</label>
                      <input
                        type="tel"
                        className={`form-input ${errors.contact ? 'error' : ''}`}
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="09XX-XXXX-XXXX"
                      />
                      {errors.contact && <div className="error-message">{errors.contact}</div>}
                    </div>
                  </div>

                  <div className="form-actions">
                    <Button type="button" variant="primary" onClick={handleNext}>
                      Next →
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="form-step">
                  <h2 className="step-title">Stay Details & Contract</h2>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Apartment Type *</label>
                      <select
                        className={`form-input ${errors.apartmentType ? 'error' : ''}`}
                        value={apartmentType}
                        onChange={(e) => setApartmentType(e.target.value)}
                      >
                        <option value="">-- Select Type --</option>
                        {APARTMENT_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.apartmentType && <div className="error-message">{errors.apartmentType}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Duration of Stay *</label>
                      <select
                        className={`form-input ${errors.duration ? 'error' : ''}`}
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      >
                        <option value="">-- Select Duration --</option>
                        {DURATION_OPTIONS.map(duration => (
                          <option key={duration} value={duration}>{duration}</option>
                        ))}
                      </select>
                      {errors.duration && <div className="error-message">{errors.duration}</div>}
                    </div>
                  </div>

                  <div className="form-actions">
                    <Button type="button" variant="outline" onClick={handleBack}>
                      ← Back
                    </Button>
                    <Button type="button" variant="primary" onClick={handleNext}>
                      Next →
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="form-step">
                  <h2 className="step-title">Account Setup</h2>
                  <div className="form-grid">
                    <div className="form-group form-group-full">
                      <label className="form-label">Username *</label>
                      <input
                        type="text"
                        className={`form-input ${errors.username ? 'error' : ''}`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                      />
                      {errors.username && <div className="error-message">{errors.username}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Password *</label>
                      <input
                        type="password"
                        className={`form-input ${errors.password ? 'error' : ''}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                      />
                      {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirm Password *</label>
                      <input
                        type="password"
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                      />
                      {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                    </div>
                  </div>

                  <div className="form-actions">
                    <Button type="button" variant="outline" onClick={handleBack}>
                      ← Back
                    </Button>
                    <Button type="submit" variant="primary">
                      Submit
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
