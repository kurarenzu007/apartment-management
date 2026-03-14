import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import { getDashboardStats, getRentPayments } from '../../services/database';
import { Building2, Home, BedDouble, Users, DollarSign, CheckCircle, Wrench, MessageSquare, Search, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState(null);
  const [upcomingDues, setUpcomingDues] = useState([]);
  const [exceededDues, setExceededDues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsData = await getDashboardStats();
      setStats(statsData);

      // Fetch rent payments
      const payments = await getRentPayments();
      
      // Filter upcoming dues (due within next 7 days)
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      const upcoming = payments.filter(p => {
        const dueDate = new Date(p.dueDate);
        return p.status === 'pending' && dueDate >= today && dueDate <= nextWeek;
      });

      // Filter exceeded dues (overdue)
      const exceeded = payments.filter(p => {
        const dueDate = new Date(p.dueDate);
        return (p.status === 'overdue' || (p.status === 'pending' && dueDate < today));
      });

      setUpcomingDues(upcoming);
      setExceededDues(exceeded);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentData = activeTab === 'upcoming' ? upcomingDues : exceededDues;

  const filteredData = currentData.filter(item =>
    item.tenantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.unitName?.toLowerCase().includes(searchQuery.toLowerCase())
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
          {loading ? (
            <div className="loading-state">Loading dashboard...</div>
          ) : (
            <>
              <div className="stats-grid">
                <StatCard icon={<Building2 size={22} />} label="Total Units" value={stats?.totalUnits || 0} color="teal" />
                <StatCard icon={<Home size={22} />} label="Occupied Units" value={stats?.occupiedUnits || 0} color="blue" />
                <StatCard icon={<BedDouble size={22} />} label="Total Vacancies" value={stats?.vacantUnits || 0} color="orange" />
                <StatCard icon={<Users size={22} />} label="Total Tenant" value={stats?.totalTenants || 0} color="purple" />
                <StatCard icon={<DollarSign size={22} />} label="Monthly Revenue" value={`₱${(stats?.totalRevenue || 0).toLocaleString()}`} color="green" />
                <StatCard icon={<CheckCircle size={22} />} label="Upcoming Dues" value={upcomingDues.length} color="teal" />
                <StatCard icon={<Wrench size={22} />} label="Maintenance" value={stats?.pendingMaintenance || 0} color="yellow" />
                <StatCard icon={<MessageSquare size={22} />} label="Overdue Payments" value={exceededDues.length} color="red" />
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
              <div className="search-wrap">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by tenant or unit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="print-btn" onClick={handlePrintGraph}>
                <Printer size={16} />
                Print
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
                    <tr key={item.id || index}>
                      <td>{item.unitName}</td>
                      <td>{item.tenantName}</td>
                      <td>{new Date(item.dueDate).toLocaleDateString()}</td>
                      <td>₱{parseFloat(item.amount || item.monthlyRent).toLocaleString()}</td>
                      <td>
                        <Badge variant={item.status === 'overdue' ? 'danger' : 'warning'}>
                          {item.status === 'overdue' ? 'Overdue' : 'Due Soon'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
                <ChevronLeft size={16} />
              </button>
              <span>Page {currentPage} of 2</span>
              <button onClick={() => setCurrentPage(Math.min(2, currentPage + 1))}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
