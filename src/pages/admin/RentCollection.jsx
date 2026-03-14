import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import Toast from '../../components/ui/Toast';
import { getRentPayments, markPaymentAsPaid } from '../../services/database';
import { 
  DollarSign, Clock, AlertCircle, Download, Search, 
  CheckCircle, Send, Eye, Calendar, CreditCard, 
  FileText, TrendingUp, Filter, ChevronLeft, ChevronRight 
} from 'lucide-react';
import './RentCollection.css';

const AVATAR_COLORS = ['teal', 'blue', 'purple', 'orange', 'green'];
const REMARK_CHIPS = ['Paid On Time', 'Late Payment', 'Partial Payment', 'Final Payment'];

function fmt(amount) {
  return '₱' + parseFloat(amount).toLocaleString('en-PH');
}

function todayStr() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

export default function RentCollection() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [markPaidModalOpen, setMarkPaidModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ amountPaid: '', method: '', datePaid: '', reference: '', remarks: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchRentPayments();
  }, []);

  async function fetchRentPayments() {
    try {
      setLoading(true);
      const data = await getRentPayments();
      // Format data with initials
      const formatted = data.map(record => ({
        ...record,
        initials: record.tenantName?.split(' ').map(n => n[0]).join('').toUpperCase() || '??',
        unit: record.unitName,
        amountDue: parseFloat(record.amount),
        amountPaid: record.status === 'paid' ? parseFloat(record.amount) : 0,
        dueDate: new Date(record.dueDate).toLocaleDateString(),
        datePaid: record.paymentDate ? new Date(record.paymentDate).toLocaleDateString() : null,
        balance: parseFloat(record.balance || 0),
        billingPeriod: record.billing_period
      }));
      setRecords(formatted);
    } catch (error) {
      console.error('Error fetching rent payments:', error);
      showToast('Failed to load rent payments', 'error');
    } finally {
      setLoading(false);
    }
  }

  function showToast(message, type = 'success') {
    setToast({ show: true, message, type });
  }

  function computeSummary() {
    const collected = records.filter(r => r.status === 'paid').reduce((s, r) => s + r.amountPaid, 0);
    const pendingAmt = records.filter(r => r.status === 'pending' || r.status === 'partial').reduce((s, r) => s + r.balance, 0);
    const overdueAmt = records.filter(r => r.status === 'overdue' || r.status === 'missed').reduce((s, r) => s + r.balance, 0);
    const pendingCount = records.filter(r => r.status === 'pending' || r.status === 'partial').length;
    const overdueCount = records.filter(r => r.status === 'overdue' || r.status === 'missed').length;
    const paidCount = records.filter(r => r.status === 'paid').length;
    return { collected, pendingAmt, overdueAmt, pendingCount, overdueCount, paidCount };
  }

  function filterRecords() {
    return records.filter(r => {
      const matchFilter = activeFilter === 'all' || r.status === activeFilter;
      const matchSearch = r.tenantName?.toLowerCase().includes(searchQuery.toLowerCase()) || r.unit?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }

  function paginateRecords(filtered) {
    const start = (currentPage - 1) * showEntries;
    return filtered.slice(start, start + showEntries);
  }

  function handleOpenMarkPaid(record) {
    setSelectedRecord(record);
    setPaymentForm({ amountPaid: record.balance, method: 'Cash', datePaid: todayStr(), reference: '', remarks: '' });
    setMarkPaidModalOpen(true);
  }

  function handlePaymentFormChange(field, value) {
    setPaymentForm(prev => ({ ...prev, [field]: value }));
  }

  function handleRemarkChip(remark) {
    setPaymentForm(prev => ({ ...prev, remarks: remark }));
  }

  async function handleConfirmPayment() {
    if (!paymentForm.amountPaid || !paymentForm.method || !paymentForm.datePaid) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    
    try {
      await markPaymentAsPaid(selectedRecord.id, {
        paymentDate: paymentForm.datePaid,
        paymentMethod: paymentForm.method
      });
      
      await fetchRentPayments();
      showToast(`Payment recorded for ${selectedRecord.tenantName}.`, 'success');
      setMarkPaidModalOpen(false);
    } catch (error) {
      console.error('Error marking payment:', error);
      showToast('Failed to record payment', 'error');
    }
  }

  function handleSendReminder(record) {
    showToast(`📩 Reminder sent to ${record.tenantName} for ${fmt(record.balance)}`, 'info');
  }

  function handleViewDetails(record) {
    setSelectedRecord(record);
    setViewModalOpen(true);
  }

  function handleExport() {
    window.alert('Export coming soon!');
  }

  const summary = computeSummary();
  const filtered = filterRecords();
  const paginated = paginateRecords(filtered);
  const totalPages = Math.max(1, Math.ceil(filtered.length / showEntries));

  const filterTabs = [
    { key: 'all', label: 'All', icon: null },
    { key: 'paid', label: 'Paid', icon: CheckCircle },
    { key: 'pending', label: 'Pending', icon: Clock },
    { key: 'partial', label: 'Partial', icon: TrendingUp },
    { key: 'missed', label: 'Missed', icon: AlertCircle },
    { key: 'overdue', label: 'Overdue', icon: AlertCircle },
  ];

  function statusBadge(status) {
    const map = {
      paid: { label: 'Paid', cls: 'badge-paid', icon: CheckCircle },
      pending: { label: 'Pending', cls: 'badge-pending', icon: Clock },
      partial: { label: 'Partial', cls: 'badge-partial', icon: TrendingUp },
      missed: { label: 'Missed', cls: 'badge-missed', icon: AlertCircle },
      overdue: { label: 'Overdue', cls: 'badge-overdue', icon: AlertCircle },
    };
    const b = map[status] || { label: status, cls: '', icon: null };
    const Icon = b.icon;
    return (
      <span className={`rc-badge ${b.cls}`}>
        {Icon && <Icon size={12} />}
        {b.label}
      </span>
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Rent Collection" />
        <div className="page-content animate-fade-in">

          {/* Page Header */}
          <div className="rc-page-header">
            <div>
              <h1 className="rc-title">Rent Collection</h1>
              <p className="rc-breadcrumb">Home / Rent Collection</p>
            </div>
            <div className="rc-header-actions">
              <select className="rc-month-select" value={selectedMonth} onChange={e => { setSelectedMonth(e.target.value); setCurrentPage(1); }}>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <button className="rc-export-btn" onClick={handleExport}>
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          {loading ? (
            <div className="rc-skeleton-row">
              <div className="rc-skeleton-card" />
              <div className="rc-skeleton-card" />
              <div className="rc-skeleton-card" />
            </div>
          ) : (
            <div className="rc-summary-cards">
              <div className="rc-stat-card rc-stat-green">
                <div className="rc-stat-icon-wrap rc-icon-green">
                  <DollarSign size={22} />
                </div>
                <div className="rc-stat-body">
                  <div className="rc-stat-label">Total Collected</div>
                  <div className="rc-stat-value">{fmt(summary.collected)}</div>
                  <div className="rc-stat-sub">{summary.paidCount} tenants</div>
                </div>
              </div>
              <div className="rc-stat-card rc-stat-yellow">
                <div className="rc-stat-icon-wrap rc-icon-yellow">
                  <Clock size={22} />
                </div>
                <div className="rc-stat-body">
                  <div className="rc-stat-label">Total Pending</div>
                  <div className="rc-stat-value">{fmt(summary.pendingAmt)}</div>
                  <div className="rc-stat-sub">{summary.pendingCount} tenants</div>
                </div>
              </div>
              <div className="rc-stat-card rc-stat-red">
                <div className="rc-stat-icon-wrap rc-icon-red">
                  <AlertCircle size={22} />
                </div>
                <div className="rc-stat-body">
                  <div className="rc-stat-label">Total Overdue</div>
                  <div className="rc-stat-value">{fmt(summary.overdueAmt)}</div>
                  <div className="rc-stat-sub">{summary.overdueCount} tenants</div>
                </div>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="rc-filter-tabs">
            {filterTabs.map(tab => {
              const count = tab.key === 'all' ? records.length : records.filter(r => r.status === tab.key).length;
              const Icon = tab.icon;
              return (
                <button key={tab.key} className={`rc-tab ${activeFilter === tab.key ? 'rc-tab-active' : ''}`} onClick={() => { setActiveFilter(tab.key); setCurrentPage(1); }}>
                  {Icon && <Icon size={14} />}
                  {tab.label}
                  <span className="rc-tab-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Table Toolbar */}
          <div className="rc-toolbar">
            <div className="rc-search-wrap">
              <Search size={16} className="rc-search-icon" />
              <input className="rc-search" type="text" placeholder="Search tenant or unit..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
            </div>
            <div className="rc-entries">
              Show
              <select value={showEntries} onChange={e => { setShowEntries(Number(e.target.value)); setCurrentPage(1); }}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              entries
            </div>
          </div>

          {/* Table */}
          <div className="rc-table-wrap">
            {loading ? (
              <div className="rc-skeleton-table">
                {[...Array(4)].map((_, i) => <div key={i} className="rc-skeleton-row-line" />)}
              </div>
            ) : (
              <table className="rc-table">
                <thead>
                  <tr>
                    <th>#</th><th>Tenant</th><th>Unit</th><th>Billing Period</th>
                    <th>Due Date</th><th>Amount Due</th><th>Paid</th><th>Balance</th>
                    <th>Method</th><th>Date Paid</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={12} className="rc-empty">😕 No records found</td></tr>
                  ) : paginated.map((r, i) => (
                    <tr key={r.id} className={`rc-row ${r.status === 'overdue' || r.status === 'missed' ? 'rc-row-danger' : ''}`}>
                      <td>{(currentPage - 1) * showEntries + i + 1}</td>
                      <td>
                        <div className="rc-tenant-cell">
                          <div className={`rc-avatar rc-avatar-${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>{r.initials}</div>
                          <span>{r.tenantName}</span>
                        </div>
                      </td>
                      <td>{r.unit}</td>
                      <td>{r.billingPeriod}</td>
                      <td>{r.dueDate}</td>
                      <td>{fmt(r.amountDue)}</td>
                      <td>{fmt(r.amountPaid)}</td>
                      <td>{fmt(r.balance)}</td>
                      <td>{r.paymentMethod || '—'}</td>
                      <td>{r.datePaid || '—'}</td>
                      <td>{statusBadge(r.status)}</td>
                      <td>
                        <div className="rc-actions">
                          <button className="rc-action-btn rc-action-green" title="Mark as Paid" onClick={() => handleOpenMarkPaid(r)}>
                            <CheckCircle size={14} />
                          </button>
                          <button className="rc-action-btn rc-action-blue" title="Send Reminder" onClick={() => handleSendReminder(r)}>
                            <Send size={14} />
                          </button>
                          <button className="rc-action-btn rc-action-gray" title="View Details" onClick={() => handleViewDetails(r)}>
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Footer */}
          <div className="rc-table-footer">
            <span className="rc-showing">
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * showEntries + 1} to {Math.min(currentPage * showEntries, filtered.length)} of {filtered.length} entries
            </span>
            <div className="rc-pagination">
              <button className="rc-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                <ChevronLeft size={14} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} className={`rc-page-btn ${currentPage === i + 1 ? 'rc-page-active' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
              ))}
              <button className="rc-page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mark as Paid Modal */}
      {markPaidModalOpen && selectedRecord && (
        <div className="rc-modal-overlay" onClick={() => setMarkPaidModalOpen(false)}>
          <div className="rc-modal" onClick={e => e.stopPropagation()}>
            <div className="rc-modal-header">
              <h2>Record Payment — {selectedRecord.tenantName}</h2>
              <button className="rc-modal-close" onClick={() => setMarkPaidModalOpen(false)}>×</button>
            </div>
            <div className="rc-modal-body">
              <div className="rc-form-group">
                <label>Amount Paid <span className="rc-required">*</span></label>
                <input type="number" value={paymentForm.amountPaid} onChange={e => handlePaymentFormChange('amountPaid', e.target.value)} />
              </div>
              <div className="rc-form-group">
                <label>Payment Method <span className="rc-required">*</span></label>
                <select value={paymentForm.method} onChange={e => handlePaymentFormChange('method', e.target.value)}>
                  <option value="">Select method</option>
                  <option>Cash</option><option>GCash</option><option>Bank Transfer</option><option>Check</option>
                </select>
              </div>
              <div className="rc-form-group">
                <label>Date Paid <span className="rc-required">*</span></label>
                <input type="date" value={paymentForm.datePaid} onChange={e => handlePaymentFormChange('datePaid', e.target.value)} />
              </div>
              <div className="rc-form-group">
                <label>Reference No. <span className="rc-optional">(optional)</span></label>
                <input type="text" value={paymentForm.reference} onChange={e => handlePaymentFormChange('reference', e.target.value)} placeholder="For GCash / Bank Transfer" />
              </div>
              <div className="rc-form-group">
                <label>Remarks</label>
                <div className="rc-chips">
                  {REMARK_CHIPS.map(chip => (
                    <button key={chip} className={`rc-chip ${paymentForm.remarks === chip ? 'rc-chip-active' : ''}`} onClick={() => handleRemarkChip(chip)}>{chip}</button>
                  ))}
                </div>
                <input type="text" value={paymentForm.remarks} onChange={e => handlePaymentFormChange('remarks', e.target.value)} placeholder="Or type custom remark..." />
              </div>
            </div>
            <div className="rc-modal-footer">
              <button className="rc-btn-cancel" onClick={() => setMarkPaidModalOpen(false)}>Cancel</button>
              <button className="rc-btn-confirm" onClick={handleConfirmPayment}>
                <CheckCircle size={16} />
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewModalOpen && selectedRecord && (
        <div className="rc-modal-overlay" onClick={() => setViewModalOpen(false)}>
          <div className="rc-modal rc-modal-view" onClick={e => e.stopPropagation()}>
            <div className="rc-modal-header rc-view-header">
              <div className="rc-view-header-left">
                <div className={`rc-avatar rc-avatar-teal rc-avatar-lg`}>{selectedRecord.initials}</div>
                <div>
                  <h2>{selectedRecord.tenantName}</h2>
                  <p>{selectedRecord.unit}</p>
                </div>
              </div>
              <button className="rc-modal-close" onClick={() => setViewModalOpen(false)}>×</button>
            </div>
            <div className="rc-modal-body rc-view-body">
              <div className="rc-view-left">
                <h3 className="rc-section-title">Payment Info</h3>
                <div className="rc-info-grid">
                  {[
                    ['Billing Period', selectedRecord.billingPeriod, FileText],
                    ['Amount Due', fmt(selectedRecord.amountDue), DollarSign],
                    ['Amount Paid', fmt(selectedRecord.amountPaid), DollarSign],
                    ['Balance', fmt(selectedRecord.balance), DollarSign],
                    ['Due Date', selectedRecord.dueDate, Calendar],
                    ['Date Paid', selectedRecord.datePaid || 'Not yet paid', Calendar],
                    ['Payment Method', selectedRecord.paymentMethod || '—', CreditCard],
                    ['Reference No.', '—', FileText],
                  ].map(([k, v, Icon]) => (
                    <div key={k} className="rc-info-row">
                      <span className="rc-info-key">
                        <Icon size={14} className="rc-info-icon" />
                        {k}
                      </span>
                      <span className="rc-info-val">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rc-view-right">
                <h3 className="rc-section-title">Payment Timeline</h3>
                <div className="rc-timeline">
                  {[
                    { label: 'Bill Generated', date: selectedRecord.billingPeriod, done: true },
                    { label: 'Payment Due', date: selectedRecord.dueDate, done: true },
                    { label: 'Payment Received', date: selectedRecord.datePaid || 'Not yet paid', done: !!selectedRecord.datePaid },
                  ].map((step, i) => (
                    <div key={i} className="rc-timeline-step">
                      <div className={`rc-timeline-dot ${step.done ? 'rc-dot-done' : 'rc-dot-pending'}`} />
                      <div className="rc-timeline-content">
                        <div className="rc-timeline-label">{step.label}</div>
                        <div className="rc-timeline-date">{step.date}</div>
                      </div>
                      {i < 2 && <div className={`rc-timeline-line ${step.done ? 'rc-line-done' : ''}`} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rc-modal-footer">
              <button className="rc-btn-cancel" onClick={() => setViewModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: '' })} />
    </div>
  );
}
