import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import { mockStats, mockUpcomingDues, mockExceededDues } from '../../data/mockData';
import './Dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const currentData = activeTab === 'upcoming' ? mockUpcomingDues : mockExceededDues;

  const filteredData = currentData.filter(item =>
    item.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.unitId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrintGraph = () => {
    window.print();
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Dashboard" />
        <div className="page-content animate-fade-in">
          <div className="stats-grid">
            <StatCard icon="🏢" label="Total Apartment" value="24" color="teal" />
            <StatCard icon="🏠" label="Total House" value="2" color="blue" />
            <StatCard icon="🛏️" label="Total Vacancies" value="8" color="orange" />
            <StatCard icon="👥" label="Total Tenant" value="18" color="purple" />
            <StatCard icon="💰" label="Total Rent Collection" value="₱101,000" color="green" />
            <StatCard icon="✅" label="Payment Collected" value="2" color="teal" />
            <StatCard icon="🔧" label="Maintenance" value="0" color="yellow" />
            <StatCard icon="💬" label="Total Complain" value="3" color="red" />
          </div>

          <div className="dues-section">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming Due Date
              </button>
              <button
                className={`tab ${activeTab === 'exceeded' ? 'active' : ''}`}
                onClick={() => setActiveTab('exceeded')}
              >
                Exceeded due dates
              </button>
            </div>

            <div className="table-header">
              <input
                type="text"
                className="search-input"
                placeholder="Search by tenant or unit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="print-btn" onClick={handlePrintGraph}>
                🖨️ Print
              </button>
            </div>

            <div className="dues-table">
              <table>
                <thead>
                  <tr>
                    <th>Unit ID</th>
                    <th>Tenant Name</th>
                    <th>Due Date</th>
                    <th>Amount Due</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.unitId}</td>
                      <td>{item.tenantName}</td>
                      <td>{item.dueDate}</td>
                      <td>₱{item.amount.toLocaleString()}</td>
                      <td>
                        <Badge variant={item.status === 'upcoming' ? 'warning' : 'danger'}>
                          {item.status === 'upcoming' ? 'Due Soon' : 'Overdue'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>←</button>
              <span>Page {currentPage} of 2</span>
              <button onClick={() => setCurrentPage(Math.min(2, currentPage + 1))}>→</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
