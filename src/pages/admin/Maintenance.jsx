import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import Toast from '../../components/ui/Toast';
import { 
  Table, LayoutGrid, Eye, Settings as SettingsIcon, CheckCircle, 
  AlertCircle, Clock, Wrench, Search, X, ChevronDown 
} from 'lucide-react';
import './Maintenance.css';

const mockRequests = [
  { id: 1, tenantName: 'Jonathan Cruz', initials: 'JC', unit: 'Apartment 3', title: 'Broken Door', description: 'Fix the broken door, we have noticed it late. Because we did not have time to explore things but please fix this.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', dateSubmitted: '03/12/2026', priority: 'high', status: 'open', assignedTo: null, category: 'Door/Window' },
  { id: 2, tenantName: 'Jonathan Cruz', initials: 'JC', unit: 'Apartment 3', title: 'Sink Not Draining', description: 'The kitchen sink has been clogged for 2 days. Water is not draining at all.', image: null, dateSubmitted: '03/12/2026', priority: 'medium', status: 'in_progress', assignedTo: 'Maintenance Staff A', category: 'Plumbing' },
  { id: 3, tenantName: 'Ana Reyes', initials: 'AR', unit: 'Room 1', title: 'Flickering Lights', description: 'The bedroom lights have been flickering every night for a week.', image: null, dateSubmitted: '03/10/2026', priority: 'low', status: 'resolved', assignedTo: 'Maintenance Staff B', category: 'Electrical' },
  { id: 4, tenantName: 'Smith Don', initials: 'SD', unit: 'Apartment A-1', title: 'Leaking Faucet', description: 'Bathroom faucet has been leaking since last week.', image: null, dateSubmitted: '03/11/2026', priority: 'medium', status: 'open', assignedTo: null, category: 'Plumbing' },
];

const STAFF_OPTIONS = ['Unassigned', 'Maintenance Staff A', 'Maintenance Staff B', 'Plumber', 'Electrician'];
const AVATAR_COLORS = ['teal', 'blue', 'purple', 'orange', 'green'];
const CATEGORIES = ['All Categories', 'Door/Window', 'Plumbing', 'Electrical', 'General'];

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [activeFilter, setActiveFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('');
  const [assignStaff, setAssignStaff] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    setTimeout(() => { setRequests(mockRequests); setLoading(false); }, 800);
  }, []);

  function showToast(message, type = 'success') {
    setToast({ show: true, message, type });
  }

  function computeSummary() {
    return {
      open: requests.filter(r => r.status === 'open').length,
      inProgress: requests.filter(r => r.status === 'in_progress').length,
      resolved: requests.filter(r => r.status === 'resolved').length,
    };
  }

  function filterRequests() {
    return requests.filter(r => {
      const matchFilter = activeFilter === 'all' || r.status === activeFilter;
      const matchPriority = priorityFilter === 'all' || r.priority === priorityFilter;
      const matchCategory = categoryFilter === 'all' || r.category === categoryFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || r.tenantName.toLowerCase().includes(q) || r.unit.toLowerCase().includes(q) || r.title.toLowerCase().includes(q);
      return matchFilter && matchPriority && matchCategory && matchSearch;
    });
  }

  function getRequestsByStatus(status) {
    return requests.filter(r => r.status === status);
  }

  function handleViewDetails(req) {
    setSelectedRequest(req);
    setPendingStatus(req.status);
    setAssignStaff(req.assignedTo || 'Unassigned');
    setDetailModalOpen(true);
  }

  function handleStatusUpdate(req, newStatus) {
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: newStatus } : r));
    if (selectedRequest?.id === req.id) setSelectedRequest(prev => ({ ...prev, status: newStatus }));
    showToast(`Status updated to "${newStatus.replace('_', ' ')}"`, 'success');
    setStatusModalOpen(false);
  }

  function handleMarkResolved(req) {
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'resolved' } : r));
    showToast(`✅ Marked as resolved: ${req.title}`, 'success');
  }

  function handleAssignStaff(req, staff) {
    const assigned = staff === 'Unassigned' ? null : staff;
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, assignedTo: assigned } : r));
    if (selectedRequest?.id === req.id) setSelectedRequest(prev => ({ ...prev, assignedTo: assigned }));
    showToast(`Assigned to ${staff}`, 'info');
  }

  function handleSaveChanges() {
    if (selectedRequest) {
      handleStatusUpdate(selectedRequest, pendingStatus);
      handleAssignStaff(selectedRequest, assignStaff);
      setDetailModalOpen(false);
    }
  }

  function priorityBadge(priority) {
    const map = { 
      high: { label: 'High', cls: 'mn-badge-high', icon: AlertCircle }, 
      medium: { label: 'Medium', cls: 'mn-badge-medium', icon: Clock }, 
      low: { label: 'Low', cls: 'mn-badge-low', icon: CheckCircle } 
    };
    const b = map[priority] || { label: priority, cls: '', icon: AlertCircle };
    const Icon = b.icon;
    return <span className={`mn-badge ${b.cls}`}><Icon size={12} />{b.label}</span>;
  }

  function statusBadge(status) {
    const map = { 
      open: { label: 'Open', cls: 'mn-badge-open', icon: AlertCircle }, 
      in_progress: { label: 'In Progress', cls: 'mn-badge-inprogress', icon: Clock }, 
      resolved: { label: 'Resolved', cls: 'mn-badge-resolved', icon: CheckCircle } 
    };
    const b = map[status] || { label: status, cls: '', icon: AlertCircle };
    const Icon = b.icon;
    return <span className={`mn-badge ${b.cls}`}><Icon size={12} />{b.label}</span>;
  }

  const summary = computeSummary();
  const filtered = filterRequests();

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Maintenance" />
        <div className="page-content animate-fade-in">

          {/* Header */}
          <div className="mn-page-header">
            <div>
              <h1 className="mn-title">Maintenance Requests</h1>
              <p className="mn-breadcrumb">Home / Maintenance Requests</p>
            </div>
            <div className="mn-view-toggle">
              <button className={`mn-toggle-btn ${viewMode === 'table' ? 'mn-toggle-active' : ''}`} onClick={() => setViewMode('table')}>
                <Table size={16} />
                Table
              </button>
              <button className={`mn-toggle-btn ${viewMode === 'board' ? 'mn-toggle-active' : ''}`} onClick={() => setViewMode('board')}>
                <LayoutGrid size={16} />
                Board
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          {loading ? (
            <div className="mn-skeleton-row">
              <div className="mn-skeleton-card" /><div className="mn-skeleton-card" /><div className="mn-skeleton-card" />
            </div>
          ) : (
            <div className="mn-summary-cards">
              <div className="mn-stat-card mn-stat-blue">
                <div className="mn-stat-icon mn-icon-blue"><AlertCircle size={20} /></div>
                <div><div className="mn-stat-label">Open</div><div className="mn-stat-value">{summary.open}</div></div>
              </div>
              <div className="mn-stat-card mn-stat-orange">
                <div className="mn-stat-icon mn-icon-orange"><Clock size={20} /></div>
                <div><div className="mn-stat-label">In Progress</div><div className="mn-stat-value">{summary.inProgress}</div></div>
              </div>
              <div className="mn-stat-card mn-stat-green">
                <div className="mn-stat-icon mn-icon-green"><CheckCircle size={20} /></div>
                <div><div className="mn-stat-label">Resolved</div><div className="mn-stat-value">{summary.resolved}</div></div>
              </div>
            </div>
          )}

          {/* Filter Row */}
          <div className="mn-filter-row">
            <div className="mn-filter-tabs">
              {['all', 'open', 'in_progress', 'resolved'].map(f => (
                <button key={f} className={`mn-tab ${activeFilter === f ? 'mn-tab-active' : ''}`} onClick={() => setActiveFilter(f)}>
                  {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="mn-filter-right">
              <select className="mn-select" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select className="mn-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c === 'All Categories' ? 'all' : c}>{c}</option>)}
              </select>
              <div className="mn-search-wrap">
                <Search size={16} className="mn-search-icon" />
                <input className="mn-search" type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="mn-table-wrap">
              {loading ? (
                <div className="mn-skeleton-table">{[...Array(4)].map((_, i) => <div key={i} className="mn-skeleton-line" />)}</div>
              ) : (
                <table className="mn-table">
                  <thead>
                    <tr>
                      <th>#</th><th>Tenant / Unit</th><th>Category</th><th>Title</th>
                      <th>Priority</th><th>Status</th><th>Date</th><th>Assigned To</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={9} className="mn-empty">😕 No requests found</td></tr>
                    ) : filtered.map((r, i) => (
                      <tr key={r.id} className={`mn-row ${r.status === 'open' ? 'mn-row-new' : ''}`}>
                        <td>{i + 1}</td>
                        <td>
                          <div className="mn-tenant-cell">
                            <div className={`mn-avatar mn-avatar-${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>{r.initials}</div>
                            <div>
                              <div className="mn-tenant-name">{r.tenantName}</div>
                              <div className="mn-tenant-unit">{r.unit}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="mn-category-chip">{r.category}</span></td>
                        <td className={r.status === 'open' ? 'mn-bold' : ''}>{r.title}</td>
                        <td>{priorityBadge(r.priority)}</td>
                        <td>{statusBadge(r.status)}</td>
                        <td>{r.dateSubmitted}</td>
                        <td>{r.assignedTo || <span className="mn-unassigned">Unassigned</span>}</td>
                        <td>
                          <div className="mn-actions">
                            <button className="mn-action-btn mn-action-gray" title="View Details" onClick={() => handleViewDetails(r)}><Eye size={14} /></button>
                            <button className="mn-action-btn mn-action-orange" title="Update Status" onClick={() => { setSelectedRequest(r); setPendingStatus(r.status); setStatusModalOpen(true); }}><SettingsIcon size={14} /></button>
                            <button className="mn-action-btn mn-action-green" title="Mark Resolved" onClick={() => handleMarkResolved(r)}><CheckCircle size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Board View */}
          {viewMode === 'board' && (
            <div className="mn-board">
              {[
                { status: 'open', label: '📬 Open', cls: 'mn-col-open' },
                { status: 'in_progress', label: '⚙️ In Progress', cls: 'mn-col-inprogress' },
                { status: 'resolved', label: '✅ Resolved', cls: 'mn-col-resolved' },
              ].map(col => {
                const colItems = getRequestsByStatus(col.status);
                return (
                  <div key={col.status} className={`mn-board-col ${col.cls}`}>
                    <div className="mn-board-col-header">
                      <span>{col.label}</span>
                      <span className="mn-board-count">{colItems.length}</span>
                    </div>
                    <div className="mn-board-cards">
                      {colItems.length === 0 && <div className="mn-board-empty">No requests</div>}
                      {colItems.map((r, i) => (
                        <div key={r.id} className="mn-board-card">
                          <div className="mn-board-card-top">
                            <div className={`mn-avatar mn-avatar-${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>{r.initials}</div>
                            <div>
                              <div className="mn-tenant-name">{r.tenantName}</div>
                              <div className="mn-tenant-unit">{r.unit}</div>
                            </div>
                          </div>
                          <div className="mn-board-card-title">{r.title}</div>
                          <div className="mn-board-card-meta">
                            <span className="mn-category-chip">{r.category}</span>
                            {priorityBadge(r.priority)}
                          </div>
                          <div className="mn-board-card-date">📅 {r.dateSubmitted}</div>
                          <div className="mn-board-card-assigned">{r.assignedTo ? `👷 ${r.assignedTo}` : <span className="mn-unassigned">Unassigned</span>}</div>
                          {r.image && <img src={r.image} alt="preview" className="mn-board-thumb" />}
                          <button className="mn-board-view-link" onClick={() => handleViewDetails(r)}>View Details →</button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {detailModalOpen && selectedRequest && (
        <div className="mn-modal-overlay" onClick={() => setDetailModalOpen(false)}>
          <div className="mn-modal" onClick={e => e.stopPropagation()}>
            <div className="mn-modal-header">
              <div className="mn-modal-header-top">
                {priorityBadge(selectedRequest.priority)}
                <span className="mn-category-chip mn-chip-white">{selectedRequest.category}</span>
              </div>
              <h2 className="mn-modal-title">{selectedRequest.title}</h2>
              <p className="mn-modal-sub">From: {selectedRequest.tenantName} — {selectedRequest.unit}</p>
              <button className="mn-modal-close" onClick={() => setDetailModalOpen(false)}>×</button>
            </div>
            <div className="mn-modal-body">
              <div className="mn-modal-left">
                <div className="mn-desc-box">
                  <div className="mn-desc-label">💬 Description</div>
                  <p className="mn-desc-text">{selectedRequest.description}</p>
                </div>
                {selectedRequest.image && (
                  <div className="mn-photo-section">
                    <div className="mn-photo-label">📷 Attached Photo</div>
                    <img src={selectedRequest.image} alt="attachment" className="mn-photo" onClick={() => setLightboxOpen(true)} />
                  </div>
                )}
              </div>
              <div className="mn-modal-right">
                <div className="mn-info-card">
                  <div className="mn-info-title">Request Info</div>
                  {[
                    ['📅 Date Submitted', selectedRequest.dateSubmitted],
                    ['🏠 Unit', selectedRequest.unit],
                    ['🔧 Category', selectedRequest.category],
                  ].map(([k, v]) => (
                    <div key={k} className="mn-info-row"><span className="mn-info-key">{k}</span><span className="mn-info-val">{v}</span></div>
                  ))}
                  <div className="mn-info-row"><span className="mn-info-key">⚡ Priority</span><span>{priorityBadge(selectedRequest.priority)}</span></div>
                  <div className="mn-info-row"><span className="mn-info-key">📊 Status</span><span>{statusBadge(selectedRequest.status)}</span></div>
                  <div className="mn-info-row"><span className="mn-info-key">👷 Assigned To</span><span className="mn-info-val">{selectedRequest.assignedTo || 'Unassigned'}</span></div>
                </div>

                <div className="mn-update-section">
                  <div className="mn-update-label">Change Status:</div>
                  <div className="mn-status-pills">
                    {['open', 'in_progress', 'resolved'].map(s => (
                      <button key={s} className={`mn-status-pill ${pendingStatus === s ? 'mn-status-pill-active' : ''}`} onClick={() => setPendingStatus(s)}>
                        {s === 'open' ? '📬 Open' : s === 'in_progress' ? '⚙️ In Progress' : '✅ Resolved'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mn-assign-section">
                  <div className="mn-update-label">Assign to:</div>
                  <div className="mn-assign-row">
                    <select className="mn-select mn-select-full" value={assignStaff} onChange={e => setAssignStaff(e.target.value)}>
                      {STAFF_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="mn-modal-footer">
              <button className="mn-btn-cancel" onClick={() => setDetailModalOpen(false)}>Close</button>
              <button className="mn-btn-confirm" onClick={handleSaveChanges}>✅ Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {statusModalOpen && selectedRequest && (
        <div className="mn-modal-overlay" onClick={() => setStatusModalOpen(false)}>
          <div className="mn-modal mn-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="mn-modal-header">
              <h2 className="mn-modal-title">Update Status</h2>
              <button className="mn-modal-close" onClick={() => setStatusModalOpen(false)}>×</button>
            </div>
            <div className="mn-modal-body">
              <p className="mn-status-current">Current: {statusBadge(selectedRequest.status)}</p>
              <div className="mn-status-cards">
                {[
                  { key: 'open', label: '📬 Open', cls: 'mn-sc-open' },
                  { key: 'in_progress', label: '⚙️ In Progress', cls: 'mn-sc-inprogress' },
                  { key: 'resolved', label: '✅ Resolved', cls: 'mn-sc-resolved' },
                ].map(opt => (
                  <div key={opt.key} className={`mn-status-card ${opt.cls} ${pendingStatus === opt.key ? 'mn-status-card-active' : ''}`} onClick={() => setPendingStatus(opt.key)}>
                    {opt.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="mn-modal-footer">
              <button className="mn-btn-cancel" onClick={() => setStatusModalOpen(false)}>Cancel</button>
              <button className="mn-btn-confirm" onClick={() => handleStatusUpdate(selectedRequest, pendingStatus)}>Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && selectedRequest?.image && (
        <div className="mn-lightbox" onClick={() => setLightboxOpen(false)}>
          <img src={selectedRequest.image} alt="full" className="mn-lightbox-img" />
          <button className="mn-lightbox-close" onClick={() => setLightboxOpen(false)}>×</button>
        </div>
      )}

      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: '' })} />
    </div>
  );
}
