import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import Sidebar from '../../../components/layout/Sidebar';
import Topbar from '../../../components/layout/Topbar';
import Button from '../../../components/ui/Button';
import Toast from '../../../components/ui/Toast';
import { APARTMENT_TYPES, DURATION_OPTIONS, ROUTES } from '../../../constants';
import { validateEmail, validatePhoneNumber, isAdult } from '../../../utils';
import { createTenant, getUnits } from '../../../services/database';
import { supabase } from '../../../lib/supabase';
import './AddTenant.css';

export default function AddTenant() {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [availableUnits, setAvailableUnits] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  // Step 1: Personal Information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [occupation, setOccupation] = useState('');
  const [address, setAddress] = useState('');

  // Step 2: Stay Details
  const [apartmentType, setApartmentType] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [moveInDate, setMoveInDate] = useState('');

  // Step 3: Account Setup
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchAvailableUnits();
  }, []);

  const fetchAvailableUnits = async () => {
    try {
      const units = await getUnits();
      // Filter only vacant units
      const vacant = units.filter(u => u.status === 'vacant');
      setAvailableUnits(vacant);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

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

    if (!selectedUnit) {
      newErrors.selectedUnit = 'Please select a unit';
    }

    if (!moveInDate) {
      newErrors.moveInDate = 'Move-in date is required';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) {
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            role: 'tenant'
          }
        }
      });

      if (authError) throw authError;

      // Step 2: Create tenant record in database
      const tenantData = {
        user_id: authData.user?.id,
        username: username,
        full_name: fullName,
        email: email,
        contact: contact,
        address: address || '',
        date_of_birth: dateOfBirth,
        occupation: occupation || '',
        unit_id: selectedUnit,
        status: 'active',
        move_in_date: moveInDate,
        contract_duration: duration
      };

      await createTenant(tenantData);

      // Step 3: Update unit status to occupied
      await supabase
        .from('units')
        .update({ status: 'occupied' })
        .eq('id', selectedUnit);

      showToast('Tenant added successfully!', 'success');
      
      setTimeout(() => {
        navigate(ROUTES.ADMIN_TENANTS);
      }, 1500);

    } catch (error) {
      console.error('Error creating tenant:', error);
      showToast(error.message || 'Failed to add tenant', 'error');
    } finally {
      setLoading(false);
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
                <div className="step-circle">
                  {currentStep > 1 ? <Check size={20} /> : '1'}
                </div>
                <div className="step-label">Personal Info</div>
              </div>
              <div className={`step-line ${currentStep > 1 ? 'active' : ''}`}></div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                <div className="step-circle">
                  {currentStep > 2 ? <Check size={20} /> : '2'}
                </div>
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

                    <div className="form-group form-group-full">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        className="form-input"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter address (optional)"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <Button type="button" variant="primary" onClick={handleNext}>
                      Next
                      <ArrowRight size={16} />
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

                    <div className="form-group">
                      <label className="form-label">Select Unit *</label>
                      <select
                        className={`form-input ${errors.selectedUnit ? 'error' : ''}`}
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)}
                      >
                        <option value="">-- Select Unit --</option>
                        {availableUnits.map(unit => (
                          <option key={unit.id} value={unit.id}>
                            {unit.name} - {unit.location} (₱{unit.rentalFee.toLocaleString()}/month)
                          </option>
                        ))}
                      </select>
                      {errors.selectedUnit && <div className="error-message">{errors.selectedUnit}</div>}
                      {availableUnits.length === 0 && (
                        <div className="info-message">No vacant units available</div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Move-in Date *</label>
                      <input
                        type="date"
                        className={`form-input ${errors.moveInDate ? 'error' : ''}`}
                        value={moveInDate}
                        onChange={(e) => setMoveInDate(e.target.value)}
                      />
                      {errors.moveInDate && <div className="error-message">{errors.moveInDate}</div>}
                    </div>
                  </div>

                  <div className="form-actions">
                    <Button type="button" variant="outline" onClick={handleBack}>
                      <ArrowLeft size={16} />
                      Back
                    </Button>
                    <Button type="button" variant="primary" onClick={handleNext}>
                      Next
                      <ArrowRight size={16} />
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
                      <ArrowLeft size={16} />
                      Back
                    </Button>
                    <Button type="submit" variant="primary" disabled={loading}>
                      <Check size={16} />
                      {loading ? 'Creating...' : 'Submit'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
