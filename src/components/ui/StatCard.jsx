import './StatCard.css';

export default function StatCard({ icon, label, value, color = 'teal' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-icon-${color}`}>
        {icon}
      </div>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}
