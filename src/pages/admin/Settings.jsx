import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import Toast from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { 
  Building2, Lock, Users, FileText, LogOut, 
  Eye, EyeOff, Save, Upload, X 
} from 'lucide-react';
import { ROUTES } from '../../constants';
import './Settings.css';

const mockAccounts = [
  { id: 1, name: 'Ten Nant', username: 'tenant1', unit: 'Apartment 1', status: 'active' },
  { id: 2, name: 'Nan Tent', username: 'tenant2', unit: 'Apartment 24', status: 'active' },
  { id: 3, name: 'Old Tenant', username: 'tenant3', unit: 'N/A', status: 'archived' },
];

export default function Settings() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [logoPreview, setLogoPreview] = useState(null);
  const [profileForm, setProfileForm] = useState({
    businessName: 'JJJ Apartment',
    contact: '',
    email: '',
    address: '',
    aboutUs: "The Basmayor's Apartment was established in 2005 by Mrs. Eliza Basmayor and Mr. Jun Basmayor..."
  });
  const [passwordForm, setPasswordForm] = useState({
    current: '', newPass: '', confirm: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswords, setShowPasswords] = useState({
    current: false, newPass: false, confirm: false
  });
  const [accounts, setAccounts] = useState(mockAccounts);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [contractText, setContractText] = useState(
    "THIS AGREEMENT made this [DATE], by and between JJJ's Apartment, herein called 'Landlord,' and [TENANT NAME], herein called 'Tenant.' Landlord hereby agrees to rent to Tenant the dwelling located at [ADDRESS] under the following terms and conditions..."
  );
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  function showToast(message, type = 'success') {
    setToast({ show: true, message, type });
  }

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }

  function handleRemoveLogo() {
    setLogoPreview(null);
  }

  function handleProfileChange(field, value) {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSaveProfile() {
    showToast('Business profile updated!', 'success');
  }

  function handlePasswordChange(field, value) {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    if (field === 'newPass') {
      calculateStrength(value);
    }
  }

  function calculateStrength(password) {
    if (!password) { setPasswordStrength(0); return; }
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setPasswordStrength(Math.min(score, 3));
  }

  function handleTogglePassword(field) {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  }

  function handleUpdatePassword() {
    const newErrors = {};
    if (!passwordForm.current) newErrors.current = 'Current password is required';
    if (!passwordForm.newPass) newErrors.newPass = 'New password is required';
    else if (passwordForm.newPass.length < 8) newErrors.newPass = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(passwordForm.newPass)) newErrors.newPass = 'Password must contain uppercase letter';
    else if (!/[0-9]/.test(passwordForm.newPass)) newErrors.newPass = 'Password must contain a number';
    else if (!/[^A-Za-z0-9]/.test(passwordForm.newPass)) newErrors.newPass = 'Password must contain special character';
    if (passwordForm.newPass !== passwordForm.confirm) newErrors.confirm = 'Passwords do not match';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      showToast('Password updated successfully!', 'success');
      setPasswordForm({ current: '', newPass: '', confirm: '' });
      setPasswordStrength(0);
    } else {
      showToast('Please fix the errors', 'error');
    }
  }

  function handleArchiveAccount(account) {
    setArchiveTarget(account);
    setArchiveModalOpen(true);
  }

  function confirmArchive() {
    setAccounts(prev => prev.map(a => a.id === archiveTarget.id ? { ...a, status: 'archived' } : a));
    showToast(`${archiveTarget.name} archived`, 'success');
    setArchiveModalOpen(false);
    setArchiveTarget(null);
  }

  function handleRestoreAccount(account) {
    setAccounts(prev => prev.map(a => a.id === account.id ? { ...a, status: 'active' } : a));
    showToast(`${account.name} restored`, 'success');
  }

  function handleContractChange(e) {
    setContractText(e.target.value);
  }

  function handleSaveContract() {
    showToast('Contract template saved!', 'success');
  }

  function handleLogout() {
    setLogoutModalOpen(true);
  }

  function confirmLogout() {
    signOut();
    navigate(ROUTES.LOGIN);
  }

  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];
  const strengthColors = ['', '#E74C3C', '#F39C12', '#2ECC71'];

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Settings" />
        <div className="page-content animate-fade-in">
          
          <div className="st-breadcrumb">Home / Settings</div>

          <div className="st-container">
            {/* Left Menu */}
            <div className="st-menu">
              <div className="st-menu-card">
                <button 
                  className={`st-menu-item ${activeSection === 'profile' ? 'st-menu-active' : ''}`}
                  onClick={() => setActiveSection('profile')}
                >
                  <Building2 size={18} />
                  Business Profile
                </button>
                <button 
                  className={`st-menu-item ${activeSection === 'password' ? 'st-menu-active' : ''}`}
                  onClick={() => setActiveSection('password')}
                >
                  <Lock size={18} />
                  Password & Security
                </button>
                <button 
                  className={`st-menu-item ${activeSection === 'accounts' ? 'st-menu-active' : ''}`}
                  onClick={() => setActiveSection('accounts')}
                >
                  <Users size={18} />
                  Manage Accounts
                </button>
                <button 
                  className={`st-menu-item ${activeSection === 'contract' ? 'st-menu-active' : ''}`}
                  onClick={() => setActiveSection('contract')}
                >
                  <FileText size={18} />
                  Contract Template
                </button>
                <div className="st-menu-divider" />
                <button className="st-menu-item st-menu-logout" onClick={handleLogout}>
                  <LogOut size={18} />
                  Log Out
                </button>
              </div>
            </div>

            {/* Right Content */}
            <div className="st-content">
              
              {/* Business Profile */}
              {activeSection === 'profile' && (
                <div className="st-section">
                  <h2 className="st-section-title">Business Profile</h2>
                  
                  <div className="st-logo-area">
                    <div className="st-logo-preview">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="st-logo-img" />
                      ) : (
                        <Building2 size={32} />
                      )}
                    </div>
                    <div className="st-logo-actions">
                      <label className="st-upload-btn">
                        <Upload size={16} />
                        Change Logo
                        <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                      </label>
                      {logoPreview && (
                        <button className="st-remove-btn" onClick={handleRemoveLogo}>
                          <X size={14} />
                          Remove Logo
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="st-form">
                    <div className="st-form-group">
                      <label className="st-label">Business Name</label>
                      <input 
                        type="text" 
                        className="st-input" 
                        value={profileForm.businessName}
                        onChange={e => handleProfileChange('businessName', e.target.value)}
                      />
                    </div>
                    <div className="st-form-group">
                      <label className="st-label">Contact Number</label>
                      <input 
                        type="tel" 
                        className="st-input" 
                        value={profileForm.contact}
                        onChange={e => handleProfileChange('contact', e.target.value)}
                        placeholder="Enter contact number"
                      />
                    </div>
                    <div className="st-form-group">
                      <label className="st-label">Email Address</label>
                      <input 
                        type="email" 
                        className="st-input" 
                        value={profileForm.email}
                        onChange={e => handleProfileChange('email', e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="st-form-group">
                      <label className="st-label">Address</label>
                      <input 
                        type="text" 
                        className="st-input" 
                        value={profileForm.address}
                        onChange={e => handleProfileChange('address', e.target.value)}
                        placeholder="Enter business address"
                      />
                    </div>
                    <div className="st-form-group">
                      <label className="st-label">About Us</label>
                      <textarea 
                        className="st-textarea" 
                        rows={4}
                        value={profileForm.aboutUs}
                        onChange={e => handleProfileChange('aboutUs', e.target.value)}
                      />
                    </div>
                    <div className="st-form-actions">
                      <button className="st-btn-save" onClick={handleSaveProfile}>
                        <Save size={16} />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Password & Security */}
              {activeSection === 'password' && (
                <div className="st-section">
                  <h2 className="st-section-title">Password & Security</h2>
                  
                  <div className="st-form">
                    <div className="st-form-group">
                      <label className="st-label">Current Password</label>
                      <div className="st-input-wrapper">
                        <input 
                          type={showPasswords.current ? 'text' : 'password'}
                          className={`st-input ${errors.current ? 'st-input-error' : ''}`}
                          value={passwordForm.current}
                          onChange={e => handlePasswordChange('current', e.target.value)}
                          placeholder="Enter current password"
                        />
                        <button 
                          className="st-toggle-password"
                          onClick={() => handleTogglePassword('current')}
                        >
                          {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.current && <div className="st-error">{errors.current}</div>}
                    </div>

                    <div className="st-form-group">
                      <label className="st-label">New Password</label>
                      <div className="st-input-wrapper">
                        <input 
                          type={showPasswords.newPass ? 'text' : 'password'}
                          className={`st-input ${errors.newPass ? 'st-input-error' : ''}`}
                          value={passwordForm.newPass}
                          onChange={e => handlePasswordChange('newPass', e.target.value)}
                          placeholder="Enter new password"
                        />
                        <button 
                          className="st-toggle-password"
                          onClick={() => handleTogglePassword('newPass')}
                        >
                          {showPasswords.newPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {passwordForm.newPass && (
                        <div className="st-strength-bar">
                          <div 
                            className="st-strength-fill" 
                            style={{ 
                              width: `${(passwordStrength / 3) * 100}%`,
                              background: strengthColors[passwordStrength]
                            }}
                          />
                        </div>
                      )}
                      {passwordForm.newPass && (
                        <div className="st-strength-label" style={{ color: strengthColors[passwordStrength] }}>
                          {strengthLabels[passwordStrength]}
                        </div>
                      )}
                      {errors.newPass && <div className="st-error">{errors.newPass}</div>}
                    </div>

                    <div className="st-form-group">
                      <label className="st-label">Confirm New Password</label>
                      <div className="st-input-wrapper">
                        <input 
                          type={showPasswords.confirm ? 'text' : 'password'}
                          className={`st-input ${errors.confirm ? 'st-input-error' : ''}`}
                          value={passwordForm.confirm}
                          onChange={e => handlePasswordChange('confirm', e.target.value)}
                          placeholder="Confirm new password"
                        />
                        <button 
                          className="st-toggle-password"
                          onClick={() => handleTogglePassword('confirm')}
                        >
                          {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.confirm && <div className="st-error">{errors.confirm}</div>}
                    </div>

                    <div className="st-form-actions">
                      <button className="st-btn-save" onClick={handleUpdatePassword}>
                        <Lock size={16} />
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Manage Accounts */}
              {activeSection === 'accounts' && (
                <div className="st-section">
                  <h2 className="st-section-title">Manage Accounts</h2>
                  
                  <div className="st-table-wrap">
                    <table className="st-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Username</th>
                          <th>Unit</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accounts.map(account => (
                          <tr key={account.id}>
                            <td>{account.name}</td>
                            <td>{account.username}</td>
                            <td>{account.unit}</td>
                            <td>
                              <Badge variant={account.status === 'active' ? 'success' : 'default'}>
                                {account.status}
                              </Badge>
                            </td>
                            <td>
                              {account.status === 'active' ? (
                                <button 
                                  className="st-action-btn st-action-archive"
                                  onClick={() => handleArchiveAccount(account)}
                                >
                                  Archive
                                </button>
                              ) : (
                                <button 
                                  className="st-action-btn st-action-restore"
                                  onClick={() => handleRestoreAccount(account)}
                                >
                                  Restore
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Contract Template */}
              {activeSection === 'contract' && (
                <div className="st-section">
                  <h2 className="st-section-title">Contract Template</h2>
                  <p className="st-subtitle">This template is used when adding new tenants.</p>
                  
                  <div className="st-form">
                    <div className="st-form-group">
                      <textarea 
                        className="st-textarea st-contract-textarea" 
                        rows={12}
                        value={contractText}
                        onChange={handleContractChange}
                      />
                    </div>
                    <div className="st-info-box">
                      <div className="st-info-icon">ℹ️</div>
                      <div className="st-info-text">
                        Use placeholders: [DATE], [TENANT NAME], [ADDRESS], [RENT AMOUNT], [START DATE], [END DATE]
                      </div>
                    </div>
                    <div className="st-form-actions">
                      <button className="st-btn-save" onClick={handleSaveContract}>
                        <Save size={16} />
                        Save Template
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Archive Modal */}
      <Modal
        isOpen={archiveModalOpen}
        onClose={() => setArchiveModalOpen(false)}
        title="Archive Account"
        footer={
          <>
            <Button variant="outline" onClick={() => setArchiveModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={confirmArchive}>Archive</Button>
          </>
        }
      >
        <p>Archive {archiveTarget?.name}? They will lose system access.</p>
      </Modal>

      {/* Logout Modal */}
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Log Out"
        footer={
          <>
            <Button variant="outline" onClick={() => setLogoutModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={confirmLogout}>Log Out</Button>
          </>
        }
      >
        <p>Are you sure you want to log out?</p>
      </Modal>

      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: '' })} />
    </div>
  );
}
