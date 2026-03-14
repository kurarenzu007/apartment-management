import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import Toast from '../../components/ui/Toast';
import { 
  AlertCircle, CheckCircle, Clock, Eye, MessageSquare, 
  Search, Send, Save, X, ChevronRight 
} from 'lucide-react';
import './Complaints.css';

const mockComplaints = [
  { id: 1, tenantName: 'Jonathan Cruz', initials: 'JC', unit: 'Apartment 3', type: 'complaint', category: 'Cleanliness', title: 'Messy Common Area', message: 'The hallway and common area near apartment 3 has been consistently dirty. Garbage is left in the corridor.', dateSubmitted: '03/13/2026', status: 'new', priority: 'medium', adminReply: null, isRead: false },
  { id: 2, tenantName: 'Jonathan Cruz', initials: 'JC', unit: 'Apartment 3', type: 'feedback', category: 'Service', title: 'Good Services', message: 'I am very satisfied with the quick response to my maintenance request last week. Great job!', dateSubmitted: '03/12/2026', status: 'acknowledged', priority: 'low', adminReply: 'Thank you for your kind words! We always aim to provide the best service.', isRead: true },
  { id: 3, tenantName: 'Jonathan Cruz', initials: 'JC', unit: 'Apartment 3', type: 'feedback', category: 'Cleanliness', title: 'Apartment Was Clean', message: 'The apartment was very clean when I moved in. Everything was properly maintained.', dateSubmitted: '03/10/2026', status: 'resolved', priority: 'low', adminReply: 'Glad to hear that! We will maintain these standards.', isRead: true },
  { id: 4, tenantName: 'Ana Reyes', initials: 'AR', unit: 'Room 1', type: 'complaint', category: 'Noise', title: 'Noisy Neighbors', message: 'The tenants in apartment 4 have been playing loud music past midnight every weekend.', dateSubmitted: '03/11/2026', status: 'under_review', priority: 'high', adminReply: 'We are currently looking into this matter.', isRead: true },
];

const QUICK_REPLIES = [
  "We'll look into this",
  'Issue has been resolved',
  'Thank you for your feedback',
  'We will take action on this',
];

const AVATAR_COLORS = ['teal', 'blue', 'purple', 'orange', 'green'];
const CATEGORIES = ['All', 'Cleanliness', 'Service', 'Noise', 'Maintenance', 'Other'];

export default function Complaints() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('complaint');
  const [activeFilter, setActiveFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    setTimeout(() => { setItems(mockComplaints); setLoading(false); }, 800);
  }, []);

  function showToast(message, type = 'success') {
    setToast({ show: true, message, type });
  }

  function computeSummary() {
    return {
      complaints: items.filter(i => i.type === 'complaint').length,
      feedback: items.filter(i => i.type === 'feedback').length,
      unresolved: items.filter(i => i.status !== 'resolved').length,
      unread: items.filter(i => !i.isRead).length,
    };
  }

  function getUnreadCount() {
    return items.filter(i => !i.isRead).length;
  }

  function filterItems() {
    return items.filter(item => {
      const matchTab = item.type === activeTab;
      const matchFilter = activeFilter === 'all' || item.status === activeFilter;
      const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || item.tenantName.toLowerCase().includes(q) || item.unit.toLowerCase().includes(q) || item.title.toLowerCase().includes(q) || item.message.toLowerCase().includes(q);
      return matchTab && matchFilter && matchCat && matchSearch;
    });
  }

  function handleViewItem(item) {
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, isRead: true } : i));
    setSelectedItem({ ...item, isRead: true });
    setReplyText('');
    setModalOpen(true);
  }

  function handleSendReply(item, reply) {
    if (!reply.trim()) { showToast('Please type a reply first.', 'error'); return; }
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, adminReply: reply, status: i.status === 'new' ? 'acknowledged' : i.status } : i));
    setSelectedItem(prev => ({ ...prev, adminReply: reply, status: prev.status === 'new' ? 'acknowledged' : prev.status }));
    showToast(`Reply sent to ${item.tenantName}`, 'success');
    setReplyText('');
  }

  function handleQuickReply(text) {
    setReplyText(text);
  }

  function handleStatusUpdate(item, status) {
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, status } : i));
    setSelectedItem(prev => ({ ...prev, status }));
    showToast(`Status updated to "${status.replace('_', ' ')}"`, 'success');
  }

  function handleMarkResolved(item) {
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'resolved' } : i));
    setSelectedItem(prev => ({ ...prev, status: 'resolved' }));
    showToast(`✅ Marked as resolved`, 'success');
    setModalOpen(false);
  }

  function handleMarkAllRead() {
    setItems(prev => prev.map(i => ({ ...i, isRead: true })));
    showToast('All items marked as read', 'info');
  }

  function handlePriorityChange(item, priority) {
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, priority } : i));
    setSelectedItem(prev => ({ ...prev, priority }));
  }

  const summary = computeSummary();
  const filtered = filterItems();

  const complaintStatuses = ['all', 'new', 'under_review', 'acknowledged', 'resolved'];
  const feedbackStatuses = ['all', 'new', 'acknowledged', 'resolved'];
  const statusOptions = activeTab === 'complaint' ? complaintStatuses : feedbackStatuses;

  function statusLabel(s) {
    return s === 'all' ? 'All' : s === 'under_review' ? 'Under Review' : s.charAt(0).toUpperCase() + s.slice(1);
  }

  function statusBadge(status) {
    const map = {
      new: { label: 'New', cls: 'cp-badge-new', icon: AlertCircle },
      under_review: { label: 'Under Review', cls: 'cp-badge-review', icon: Clock },
      acknowledged: { label: 'Acknowledged', cls: 'cp-badge-ack', icon: CheckCircle },
      resolved: { label: 'Resolved', cls: 'cp-badge-resolved', icon: CheckCircle },
    };
    const b = map[status] || { label: status, cls: '', icon: AlertCircle };
    const Icon = b.icon;
    return <span className={`cp-badge ${b.cls}`}><Icon size={12} />{b.label}</span>;
  }

  function priorityBadge(priority) {
    const map = { 
      high: { label: 'High', cls: 'cp-badge-high', icon: AlertCircle }, 
      medium: { label: 'Medium', cls: 'cp-badge-medium', icon: Clock }, 
      low: { label: 'Low', cls: 'cp-badge-low', icon: CheckCircle } 
    };
    const b = map[priority] || { label: priority, cls: '', icon: AlertCircle };
    const Icon = b.icon;
    return <span className={`cp-badge ${b.cls}`}><Icon size={12} />{b.label}</span>;
  }

  const complaintSteps = ['new', 'under_review', 'acknowledged', 'resolved'];
  const feedbackSteps = ['new', 'acknowledged', 'resolved'];

  function getStepIndex(steps, status) {
    const idx = steps.indexOf(status);
    return idx === -1 ? 0 : idx;
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Complaints" />
        <div className="page-content animate-fade-in">

          {/* Header */}
          <div className="cp-page-header">
            <div>
              <h1 className="cp-title">Complaints &amp; Feedback</h1>
              <p className="cp-breadcrumb">Home / Complaints &amp; Feedback</p>
            </div>
            <div className="cp-header-actions">
              {getUnreadCount() > 0 && <span className="cp-unread-badge">{getUnreadCount()} unread</span>}
              <button className="cp-mark-read-btn" onClick={handleMarkAllRead}>Mark All as Read</button>
            </div>
          </div>

          {/* Summary Cards */}
          {loading ? (
            <div className="cp-skeleton-row">
              {[...Array(4)].map((_, i) => <div key={i} className="cp-skeleton-card" />)}
            </div>
          ) : (
            <div className="cp-summary-cards">
              <div className="cp-stat-card cp-stat-red">
                <div className="cp-stat-icon cp-icon-red"><AlertCircle size={18} /></div>
                <div><div className="cp-stat-label">Total Complaints</div><div className="cp-stat-value">{summary.complaints}</div></div>
              </div>
              <div className="cp-stat-card cp-stat-green">
                <div className="cp-stat-icon cp-icon-green"><CheckCircle size={18} /></div>
                <div><div className="cp-stat-label">Total Feedback</div><div className="cp-stat-value">{summary.feedback}</div></div>
              </div>
              <div className="cp-stat-card cp-stat-orange">
                <div className="cp-stat-icon cp-icon-orange"><Clock size={18} /></div>
                <div><div className="cp-stat-label">Unresolved</div><div className="cp-stat-value">{summary.unresolved}</div></div>
              </div>
              <div className="cp-stat-card cp-stat-blue">
                <div className="cp-stat-icon cp-icon-blue"><MessageSquare size={18} /></div>
                <div><div className="cp-stat-label">Unread</div><div className="cp-stat-value">{summary.unread}</div></div>
              </div>
            </div>
          )}

          {/* Main Tabs */}
          <div className="cp-main-tabs">
            <button className={`cp-main-tab ${activeTab === 'complaint' ? 'cp-main-tab-complaint-active' : ''}`} onClick={() => { setActiveTab('complaint'); setActiveFilter('all'); }}>
              <AlertCircle size={16} />
              Complaints
              <span className="cp-main-tab-count">{items.filter(i => i.type === 'complaint').length}</span>
            </button>
            <button className={`cp-main-tab ${activeTab === 'feedback' ? 'cp-main-tab-feedback-active' : ''}`} onClick={() => { setActiveTab('feedback'); setActiveFilter('all'); }}>
              <CheckCircle size={16} />
              Feedback
              <span className="cp-main-tab-count">{items.filter(i => i.type === 'feedback').length}</span>
            </button>
          </div>

          {/* Filter Row */}
          <div className="cp-filter-row">
            <div className="cp-filter-pills">
              {statusOptions.map(s => (
                <button key={s} className={`cp-filter-pill ${activeFilter === s ? 'cp-filter-pill-active' : ''}`} onClick={() => setActiveFilter(s)}>
                  {statusLabel(s)}
                </button>
              ))}
            </div>
            <div className="cp-filter-right">
              <select className="cp-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c === 'All' ? 'all' : c}>{c}</option>)}
              </select>
              <div className="cp-search-wrap">
                <Search size={16} className="cp-search-icon" />
                <input className="cp-search" type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="cp-items-list">
            {loading ? (
              [...Array(3)].map((_, i) => <div key={i} className="cp-skeleton-item" />)
            ) : filtered.length === 0 ? (
              <div className="cp-empty">😕 No items found</div>
            ) : filtered.map((item, i) => (
              <div key={item.id} className={`cp-item-card ${!item.isRead ? 'cp-item-unread' : ''}`}>
                <div className={`cp-item-stripe ${item.type === 'complaint' ? 'cp-stripe-complaint' : 'cp-stripe-feedback'}`} />
                <div className={`cp-avatar cp-avatar-${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>{item.initials}</div>
                <div className="cp-item-center">
                  <div className="cp-item-row1">
                    <span className="cp-item-title">{item.title}</span>
                    <span className="cp-category-chip">{item.category}</span>
                    {item.type === 'complaint' && priorityBadge(item.priority)}
                    {!item.isRead && <span className="cp-unread-dot">●</span>}
                  </div>
                  <div className="cp-item-row2">
                    <span className="cp-tenant-name">{item.tenantName}</span>
                    <span className="cp-dot">•</span>
                    <span className="cp-unit">{item.unit}</span>
                  </div>
                  <div className="cp-item-preview">{item.message}</div>
                  <div className="cp-item-row4">
                    <span className="cp-item-date">📅 {item.dateSubmitted}</span>
                    {item.adminReply && <span className="cp-replied">💬 Admin replied</span>}
                  </div>
                </div>
                <div className="cp-item-right">
                  {statusBadge(item.status)}
                  <div className="cp-item-actions">
                    <button className="cp-action-btn cp-action-view" onClick={() => handleViewItem(item)}>
                      <Eye size={14} />
                      View &amp; Reply
                    </button>
                    {item.status !== 'resolved' && (
                      <button className="cp-action-btn cp-action-resolve" onClick={() => { setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'resolved' } : i)); showToast('Marked as resolved', 'success'); }}>
                        <CheckCircle size={14} />
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View & Reply Modal */}
      {modalOpen && selectedItem && (
        <div className="cp-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="cp-modal" onClick={e => e.stopPropagation()}>
            <div className={`cp-modal-header ${selectedItem.type === 'complaint' ? 'cp-modal-header-complaint' : 'cp-modal-header-feedback'}`}>
              <div className="cp-modal-header-top">
                <span className="cp-category-chip cp-chip-white">{selectedItem.category}</span>
                <span className={`cp-type-badge ${selectedItem.type === 'complaint' ? 'cp-type-complaint' : 'cp-type-feedback'}`}>
                  {selectedItem.type === 'complaint' ? '🔴 Complaint' : '🟢 Feedback'}
                </span>
              </div>
              <h2 className="cp-modal-title">{selectedItem.title}</h2>
              <p className="cp-modal-sub">From {selectedItem.tenantName} — {selectedItem.unit} • {selectedItem.dateSubmitted}</p>
              <button className="cp-modal-close" onClick={() => setModalOpen(false)}>×</button>
            </div>
            <div className="cp-modal-body">
              {/* Message */}
              <div className="cp-section">
                <div className="cp-section-label">💬 Message</div>
                <div className={`cp-message-box ${selectedItem.type === 'complaint' ? 'cp-msg-complaint' : 'cp-msg-feedback'}`}>
                  <p>{selectedItem.message}</p>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="cp-section">
                <div className="cp-section-label">📊 Status Flow</div>
                <div className="cp-stepper">
                  {(selectedItem.type === 'complaint' ? complaintSteps : feedbackSteps).map((step, i, arr) => {
                    const currentIdx = getStepIndex(arr, selectedItem.status);
                    const isDone = i <= currentIdx;
                    return (
                      <div key={step} className="cp-step-wrap">
                        <div className={`cp-step ${isDone ? 'cp-step-done' : ''}`} onClick={() => handleStatusUpdate(selectedItem, step)}>
                          <div className={`cp-step-dot ${isDone ? 'cp-step-dot-done' : ''}`}>{isDone ? '✓' : i + 1}</div>
                          <div className="cp-step-label">{statusLabel(step)}</div>
                        </div>
                        {i < arr.length - 1 && <div className={`cp-step-line ${isDone && i < currentIdx ? 'cp-step-line-done' : ''}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reply Thread */}
              <div className="cp-section">
                <div className="cp-section-label">📝 Reply / Notes</div>
                {selectedItem.adminReply && (
                  <div className="cp-reply-bubble">
                    <p>{selectedItem.adminReply}</p>
                    <div className="cp-reply-meta">Admin • {selectedItem.dateSubmitted}</div>
                  </div>
                )}
                <textarea
                  className="cp-reply-input"
                  placeholder="Type your reply or internal note..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  rows={3}
                />
                <div className="cp-quick-replies">
                  {QUICK_REPLIES.map(qr => (
                    <button key={qr} className="cp-quick-chip" onClick={() => handleQuickReply(qr)}>{qr}</button>
                  ))}
                </div>
                <div className="cp-reply-actions">
                  <button className="cp-btn-send" onClick={() => handleSendReply(selectedItem, replyText)}>
                    <Send size={16} />
                    Send Reply
                  </button>
                  <button className="cp-btn-note" onClick={() => { setReplyText(''); showToast('Note saved', 'info'); }}>
                    <Save size={16} />
                    Save as Note
                  </button>
                </div>
              </div>
            </div>
            <div className="cp-modal-footer">
              {selectedItem.type === 'complaint' && (
                <div className="cp-priority-selector">
                  {['high', 'medium', 'low'].map(p => (
                    <button key={p} className={`cp-priority-pill ${selectedItem.priority === p ? 'cp-priority-active' : ''}`} onClick={() => handlePriorityChange(selectedItem, p)}>
                      {p === 'high' ? <><AlertCircle size={14} /> High</> : p === 'medium' ? <><Clock size={14} /> Medium</> : <><CheckCircle size={14} /> Low</>}
                    </button>
                  ))}
                </div>
              )}
              <div className="cp-footer-right">
                <button className="cp-btn-cancel" onClick={() => setModalOpen(false)}>Close</button>
                {selectedItem.status !== 'resolved' && (
                  <button className="cp-btn-resolve" onClick={() => handleMarkResolved(selectedItem)}>
                    <CheckCircle size={16} />
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: '' })} />
    </div>
  );
}
