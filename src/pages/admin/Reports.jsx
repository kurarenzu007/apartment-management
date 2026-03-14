import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import Toast from '../../components/ui/Toast';
import { DollarSign, Wrench, TrendingUp, Download, ChevronDown } from 'lucide-react';
import './Reports.css';

const mockMonthlyData = [
  { month: 'Jan', paid: 24, missed: 2, late: 1, rentTotal: 85000, maintenanceTotal: 3500 },
  { month: 'Feb', paid: 22, missed: 3, late: 2, rentTotal: 78000, maintenanceTotal: 2000 },
  { month: 'Mar', paid: 26, missed: 1, late: 0, rentTotal: 101000, maintenanceTotal: 7000 },
  { month: 'Apr', paid: 24, missed: 2, late: 1, rentTotal: 92000, maintenanceTotal: 4500 },
  { month: 'May', paid: 24, missed: 0, late: 3, rentTotal: 95000, maintenanceTotal: 1500 },
];

function fmt(amount) {
  return '₱' + amount.toLocaleString('en-PH');
}

export default function Reports() {
  const [data] = useState(mockMonthlyData);
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [hoveredBar, setHoveredBar] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  function showToast(message, type = 'success') {
    setToast({ show: true, message, type });
  }

  function computeSummary() {
    const filtered = filterData();
    const totalRent = filtered.reduce((s, d) => s + d.rentTotal, 0);
    const totalMaintenance = filtered.reduce((s, d) => s + d.maintenanceTotal, 0);
    return { totalRent, totalMaintenance, overall: totalRent + totalMaintenance };
  }

  function filterData() {
    if (selectedMonth === 'all') return data;
    return data.filter(d => d.month === selectedMonth);
  }

  function computePercentChange(current, previous) {
    if (!previous) return '—';
    const change = ((current - previous) / previous) * 100;
    if (change > 0) return `▲ ${change.toFixed(1)}%`;
    if (change < 0) return `▼ ${Math.abs(change).toFixed(1)}%`;
    return '—';
  }

  function handleExport() {
    showToast('Export PDF coming soon!', 'info');
  }

  function getBarHeight(value, max) {
    return (value / max) * 100 + '%';
  }

  const summary = computeSummary();
  const filtered = filterData();
  const maxPayment = Math.max(...data.map(d => Math.max(d.paid, d.missed, d.late)));

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Reports" />
        <div className="page-content animate-fade-in">
          
          {/* Header */}
          <div className="rp-page-header">
            <div>
              <h1 className="rp-title">Reports</h1>
              <p className="rp-breadcrumb">Home / Reports</p>
            </div>
            <div className="rp-header-actions">
              <select className="rp-select" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
              <select className="rp-select" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                <option value="all">All Months</option>
                {data.map(d => <option key={d.month} value={d.month}>{d.month}</option>)}
              </select>
              <button className="rp-export-btn" onClick={handleExport}>
                <Download size={16} />
                Export PDF
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="rp-summary-cards">
            <div className="rp-stat-card rp-stat-green">
              <div className="rp-stat-icon rp-icon-green">
                <DollarSign size={22} />
              </div>
              <div className="rp-stat-body">
                <div className="rp-stat-label">Total Rent Collected</div>
                <div className="rp-stat-value">{fmt(summary.totalRent)}</div>
              </div>
            </div>
            <div className="rp-stat-card rp-stat-orange">
              <div className="rp-stat-icon rp-icon-orange">
                <Wrench size={22} />
              </div>
              <div className="rp-stat-body">
                <div className="rp-stat-label">Maintenance Fees</div>
                <div className="rp-stat-value">{fmt(summary.totalMaintenance)}</div>
              </div>
            </div>
            <div className="rp-stat-card rp-stat-teal">
              <div className="rp-stat-icon rp-icon-teal">
                <TrendingUp size={22} />
              </div>
              <div className="rp-stat-body">
                <div className="rp-stat-label">Overall Total</div>
                <div className="rp-stat-value">{fmt(summary.overall)}</div>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="rp-chart-section">
            <div className="rp-chart-header">
              <h2 className="rp-section-title">Monthly Payment Overview</h2>
              <div className="rp-legend">
                <div className="rp-legend-item"><span className="rp-legend-dot rp-dot-paid"></span>Paid</div>
                <div className="rp-legend-item"><span className="rp-legend-dot rp-dot-missed"></span>Missed</div>
                <div className="rp-legend-item"><span className="rp-legend-dot rp-dot-late"></span>Late</div>
              </div>
            </div>
            <div className="rp-chart">
              <div className="rp-chart-y-axis">
                {[30, 25, 20, 15, 10, 5, 0].map(v => (
                  <div key={v} className="rp-y-label">{v}</div>
                ))}
              </div>
              <div className="rp-chart-area">
                {filtered.map((d, i) => (
                  <div key={d.month} className="rp-chart-group">
                    <div className="rp-bars">
                      <div 
                        className="rp-bar rp-bar-paid" 
                        style={{ height: getBarHeight(d.paid, maxPayment), animationDelay: `${i * 0.1}s` }}
                        onMouseEnter={() => setHoveredBar({ month: d.month, type: 'Paid', value: d.paid })}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        <span className="rp-bar-label">{d.paid}</span>
                        {hoveredBar?.month === d.month && hoveredBar?.type === 'Paid' && (
                          <div className="rp-tooltip">{d.month} Paid: {d.paid} tenants</div>
                        )}
                      </div>
                      <div 
                        className="rp-bar rp-bar-missed" 
                        style={{ height: getBarHeight(d.missed, maxPayment), animationDelay: `${i * 0.1 + 0.05}s` }}
                        onMouseEnter={() => setHoveredBar({ month: d.month, type: 'Missed', value: d.missed })}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        <span className="rp-bar-label">{d.missed}</span>
                        {hoveredBar?.month === d.month && hoveredBar?.type === 'Missed' && (
                          <div className="rp-tooltip">{d.month} Missed: {d.missed} tenants</div>
                        )}
                      </div>
                      <div 
                        className="rp-bar rp-bar-late" 
                        style={{ height: getBarHeight(d.late, maxPayment), animationDelay: `${i * 0.1 + 0.1}s` }}
                        onMouseEnter={() => setHoveredBar({ month: d.month, type: 'Late', value: d.late })}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        <span className="rp-bar-label">{d.late}</span>
                        {hoveredBar?.month === d.month && hoveredBar?.type === 'Late' && (
                          <div className="rp-tooltip">{d.month} Late: {d.late} tenants</div>
                        )}
                      </div>
                    </div>
                    <div className="rp-x-label">{d.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue Table */}
          <div className="rp-table-section">
            <h2 className="rp-section-title">Revenue Breakdown</h2>
            <div className="rp-table-wrap">
              <table className="rp-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Rent Collected</th>
                    <th>Maintenance</th>
                    <th>Total</th>
                    <th>vs Last Month</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d, i) => {
                    const total = d.rentTotal + d.maintenanceTotal;
                    const prevTotal = i > 0 ? filtered[i - 1].rentTotal + filtered[i - 1].maintenanceTotal : null;
                    const change = computePercentChange(total, prevTotal);
                    const isUp = change.startsWith('▲');
                    const isDown = change.startsWith('▼');
                    return (
                      <tr key={d.month}>
                        <td className="rp-month-cell">{d.month}</td>
                        <td>{fmt(d.rentTotal)}</td>
                        <td>{fmt(d.maintenanceTotal)}</td>
                        <td className="rp-total-cell">{fmt(total)}</td>
                        <td className={`rp-change-cell ${isUp ? 'rp-change-up' : isDown ? 'rp-change-down' : ''}`}>
                          {change}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="rp-total-row">
                    <td>TOTAL</td>
                    <td>{fmt(summary.totalRent)}</td>
                    <td>{fmt(summary.totalMaintenance)}</td>
                    <td>{fmt(summary.overall)}</td>
                    <td>—</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payment Status Breakdown */}
          <div className="rp-status-section">
            <h2 className="rp-section-title">Payment Status Summary</h2>
            <div className="rp-status-list">
              {filtered.map(d => {
                const total = d.paid + d.missed + d.late;
                const paidPct = (d.paid / total) * 100;
                const latePct = (d.late / total) * 100;
                const missedPct = (d.missed / total) * 100;
                return (
                  <div key={d.month} className="rp-status-item">
                    <div className="rp-status-label">{d.month}: {d.paid} paid, {d.missed} missed, {d.late} late</div>
                    <div className="rp-status-bar">
                      <div className="rp-status-segment rp-segment-paid" style={{ width: `${paidPct}%` }}>
                        {paidPct > 15 && <span>{d.paid}</span>}
                      </div>
                      <div className="rp-status-segment rp-segment-late" style={{ width: `${latePct}%` }}>
                        {latePct > 10 && <span>{d.late}</span>}
                      </div>
                      <div className="rp-status-segment rp-segment-missed" style={{ width: `${missedPct}%` }}>
                        {missedPct > 10 && <span>{d.missed}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: '' })} />
    </div>
  );
}
