import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Edit2, Archive, ArrowUpDown, Home } from 'lucide-react';
import { Sidebar, Topbar } from '../../../components/layout';
import { Badge, Modal, Button } from '../../../components/ui';
import { ROUTES } from '../../../constants';
import './Units.css';

const mockUnits = [
  { id: 1, name: 'Apartment 1', location: 'Building A - Floor 1', rentalFee: 5500, status: 'occupied', tenant: 'Ten Nant' },
  { id: 2, name: 'Apartment 24', location: 'Building A - Floor 2', rentalFee: 4000, status: 'occupied', tenant: 'Nan Tent' },
  { id: 3, name: 'House 2', location: 'Building B', rentalFee: 11500, status: 'occupied', tenant: 'Mike Conley' },
  { id: 4, name: 'Apartment A-1', location: 'Building A - Floor 1', rentalFee: 2500, status: 'occupied', tenant: 'Smith Don' },
  { id: 5, name: 'Apartment A-14', location: 'Building A - Floor 1', rentalFee: 3000, status: 'occupied', tenant: 'John Doe' },
  { id: 6, name: 'Room 1', location: 'Building C - Floor 1', rentalFee: 2220, status: 'occupied', tenant: 'Ana Reyes' },
  { id: 7, name: 'Apartment 5', location: 'Building A - Floor 1', rentalFee: 5000, status: 'vacant', tenant: null },
  { id: 8, name: 'Apartment 12', location: 'Building A - Floor 2', rentalFee: 4500, status: 'vacant', tenant: null },
  { id: 9, name: 'Studio 3', location: 'Building D - Floor 3', rentalFee: 6000, status: 'maintenance', tenant: null },
  { id: 10, name: 'Room 5', location: 'Building C - Floor 2', rentalFee: 2500, status: 'vacant', tenant: null },
];

export default function Units() {
  const [units, setUnits] = useState(mockUnits);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false);
  const [unitToArchive, setUnitToArchive] = useState(null);
  const navigate = useNavigate();

  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (unit.tenant && unit.tenant.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleViewUnit = (unit) => {
    setSelectedUnit(unit);
    setViewModalOpen(true);
  };

  const handleEditUnit = (unit) => {
    alert(`Edit functionality for ${unit.name} - Coming soon!`);
  };

  const handleArchiveUnit = (unit) => {
    setUnitToArchive(unit);
    setArchiveConfirmOpen(true);
  };

  const confirmArchive = () => {
    setUnits(units.map(u =>
      u.id === unitToArchive.id ? { ...u, status: 'archived' } : u
    ));
    setArchiveConfirmOpen(false);
    setUnitToArchive(null);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      occupied: 'success',
      vacant: 'warning',
      maintenance: 'danger',
      archived: 'default'
    };
    return statusMap[status] || 'default';
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Unit Management" />
        <div className="page-content">
          <div className="breadcrumb">Home &gt; Units</div>

          <div className="units-container">
            <div className="units-header">
              <div className="entries-control">
                <label>Show</label>
                <select value={showEntries} onChange={(e) => setShowEntries(Number(e.target.value))}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <label>entries</label>
              </div>

              <div className="header-actions">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search units..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="add-unit-btn" onClick={() => alert('Add Unit - Coming soon!')}>
                  <Plus size={18} />
                  Add Unit
                </button>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="units-table">
                <thead>
                  <tr>
                    <th className="sortable" onClick={() => handleSort('name')}>
                      <div className="th-content">
                        Unit Name
                        <ArrowUpDown size={14} />
                      </div>
                    </th>
                    <th className="sortable" onClick={() => handleSort('location')}>
                      <div className="th-content">
                        Location
                        <ArrowUpDown size={14} />
                      </div>
                    </th>
                    <th className="sortable" onClick={() => handleSort('rentalFee')}>
                      <div className="th-content">
                        Rental Fee
                        <ArrowUpDown size={14} />
                      </div>
                    </th>
                    <th>Current Tenant</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUnits.slice(0, showEntries).map((unit) => (
                    <tr key={unit.id}>
                      <td className="unit-name">
                        <Home size={18} className="unit-icon" />
                        {unit.name}
                      </td>
                      <td>{unit.location}</td>
                      <td className="rental-fee">₱{unit.rentalFee.toLocaleString()}</td>
                      <td>{unit.tenant || <span className="text-muted">—</span>}</td>
                      <td>
                        <Badge variant={getStatusBadge(unit.status)}>
                          {unit.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn action-btn-view" onClick={() => handleViewUnit(unit)} title="View Details">
                            <Eye size={16} />
                          </button>
                          <button className="action-btn action-btn-edit" onClick={() => handleEditUnit(unit)} title="Edit Unit">
                            <Edit2 size={16} />
                          </button>
                          <button className="action-btn action-btn-archive" onClick={() => handleArchiveUnit(unit)} title="Archive">
                            <Archive size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUnits.length === 0 && (
              <div className="empty-state">
                <Home size={64} className="empty-icon" />
                <p>No units found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Unit Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={selectedUnit ? `${selectedUnit.name} - Unit Details` : 'Unit Details'}
      >
        {selectedUnit && (
          <div className="unit-details">
            <div className="info-grid">
              <div className="info-card">
                <div className="info-label">Unit Name</div>
                <div className="info-value">{selectedUnit.name}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Location</div>
                <div className="info-value">{selectedUnit.location}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Rental Fee</div>
                <div className="info-value">₱{selectedUnit.rentalFee.toLocaleString()}/month</div>
              </div>
              <div className="info-card">
                <div className="info-label">Status</div>
                <div className="info-value">
                  <Badge variant={getStatusBadge(selectedUnit.status)}>
                    {selectedUnit.status}
                  </Badge>
                </div>
              </div>
              <div className="info-card">
                <div className="info-label">Current Tenant</div>
                <div className="info-value">{selectedUnit.tenant || 'Vacant'}</div>
              </div>
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
        <p>Are you sure you want to archive {unitToArchive?.name}?</p>
      </Modal>
    </div>
  );
}
