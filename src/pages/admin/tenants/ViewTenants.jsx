import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Eye, Edit2, Archive, ArrowUpDown } from 'lucide-react';
import Sidebar from '../../../components/layout/Sidebar';
import Topbar from '../../../components/layout/Topbar';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Toast from '../../../components/ui/Toast';
import { getTenants, archiveTenant } from '../../../services/database';
import { getRemarksBadgeVariant } from '../../../utils';
import { ROUTES } from '../../../constants';
import './ViewTenants.css';

export default function ViewTenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEntries, setShowEntries] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false);
  const [tenantToArchive, setTenantToArchive] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const data = await getTenants();
      // Format data to match frontend expectations
      const formattedData = data.map(tenant => ({
        ...tenant,
        name: tenant.full_name,
        unit: tenant.unit?.name || 'N/A',
        paymentHistory: tenant.rent_payments?.map(payment => ({
          date: new Date(payment.payment_date || payment.due_date).toLocaleDateString(),
          monthlyRent: parseFloat(payment.amount),
          method: payment.payment_method || 'N/A',
          period: payment.billing_period,
          balance: parseFloat(payment.balance || 0),
          remarks: payment.remarks || payment.status
        })) || []
      }));
      setTenants(formattedData);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      showToast('Failed to load tenants', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleViewTenant = (tenant) => {
    setSelectedTenant(tenant);
    setViewModalOpen(true);
  };

  const handleEditTenant = (tenant) => {
    alert(`Edit functionality for ${tenant.name} - Coming soon!`);
  };

  const handleArchiveTenant = (tenant) => {
    setTenantToArchive(tenant);
    setArchiveConfirmOpen(true);
  };

  const confirmArchive = async () => {
    try {
      await archiveTenant(tenantToArchive.id);
      await fetchTenants();
      showToast('Tenant archived successfully');
      setArchiveConfirmOpen(false);
      setTenantToArchive(null);
    } catch (error) {
      console.error('Error archiving tenant:', error);
      showToast('Failed to archive tenant', 'error');
    }
  };

  const getRemarksBadge = (remarks) => {
    return getRemarksBadgeVariant(remarks);
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Tenant Management" />
        <div className="page-content">
          <div className="breadcrumb">Home &gt; Tenants</div>

          <div className="tenants-container">
            <div className="tenants-header">
              <div className="entries-control">
                <label>Show</label>
                <select value={showEntries} onChange={(e) => setShowEntries(Number(e.target.value))}>
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </select>
                <label>entries</label>
              </div>

              <div className="header-actions">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search tenants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="add-tenant-btn" onClick={() => navigate(ROUTES.ADMIN_TENANTS_ADD)}>
                  <UserPlus size={18} />
                  Add Tenant
                </button>
              </div>
            </div>

            <div className="table-wrapper">
              {loading ? (
                <div className="loading-state">Loading tenants...</div>
              ) : (
                <table className="tenants-table">
                <thead>
                  <tr>
                    <th className="sortable" onClick={() => handleSort('username')}>
                      <div className="th-content">
                        Username
                        <ArrowUpDown size={14} />
                      </div>
                    </th>
                    <th className="sortable" onClick={() => handleSort('name')}>
                      <div className="th-content">
                        Name
                        <ArrowUpDown size={14} />
                      </div>
                    </th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Unit</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenants.slice(0, showEntries).map((tenant) => (
                    <tr key={tenant.id}>
                      <td>{tenant.username}</td>
                      <td>{tenant.name}</td>
                      <td>{tenant.email}</td>
                      <td>{tenant.contact}</td>
                      <td>{tenant.address}</td>
                      <td>{tenant.unit}</td>
                      <td>
                        <Badge variant={tenant.status === 'active' ? 'active' : 'archived'}>
                          {tenant.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn action-btn-view" onClick={() => handleViewTenant(tenant)} title="View Details">
                            <Eye size={16} />
                          </button>
                          <button className="action-btn action-btn-edit" onClick={() => handleEditTenant(tenant)} title="Edit Tenant">
                            <Edit2 size={16} />
                          </button>
                          <button className="action-btn action-btn-archive" onClick={() => handleArchiveTenant(tenant)} title="Archive">
                            <Archive size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Tenant Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={selectedTenant ? `${selectedTenant.name} - Tenant Details` : 'Tenant Details'}
      >
        {selectedTenant && (
          <div className="tenant-details">
            <div className="info-grid">
              <div className="info-card">
                <div className="info-label">Name</div>
                <div className="info-value">{selectedTenant.name}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Email</div>
                <div className="info-value">{selectedTenant.email}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Contact</div>
                <div className="info-value">{selectedTenant.contact}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Unit</div>
                <div className="info-value">{selectedTenant.unit}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Address</div>
                <div className="info-value">{selectedTenant.address}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Status</div>
                <div className="info-value">
                  <Badge variant={selectedTenant.status === 'active' ? 'active' : 'archived'}>
                    {selectedTenant.status}
                  </Badge>
                </div>
              </div>
            </div>

            <h3 className="section-title">Payment History</h3>
            <div className="payment-history-table">
              <table>
                <thead>
                  <tr>
                    <th>Payment Date</th>
                    <th>Monthly Rent</th>
                    <th>Payment Method</th>
                    <th>Billing Period</th>
                    <th>Balance</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTenant.paymentHistory.map((payment, index) => (
                    <tr key={index}>
                      <td>{payment.date}</td>
                      <td>₱{payment.monthlyRent.toLocaleString()}</td>
                      <td>{payment.method}</td>
                      <td>{payment.period}</td>
                      <td>₱{payment.balance}</td>
                      <td>
                        <Badge variant={getRemarksBadge(payment.remarks)}>
                          {payment.remarks}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      {/* Archive Confirmation Modal */}
      <Modal
        isOpen={archiveConfirmOpen}
        onClose={() => setArchiveConfirmOpen(false)}
        title="Confirm Archive"
        footer={
          <>
            <Button variant="outline" onClick={() => setArchiveConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmArchive}>
              Archive
            </Button>
          </>
        }
      >
        <p>Are you sure you want to archive {tenantToArchive?.name}?</p>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
