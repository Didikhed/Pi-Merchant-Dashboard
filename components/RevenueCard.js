import './RevenueCard.css'

export default function RevenueCard({ label, value, trend, icon, color = 'purple' }) {
  const colorClass = `card-${color}`
  
  return (
    <div className={`revenue-card ${colorClass}`}>
      <div className="card-bg-glow"></div>
      <div className="card-content">
        <div className="card-header">
          <span className="card-icon">{icon}</span>
          <span className={`card-trend ${trend > 0 ? 'trend-up' : 'trend-down'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        </div>
        <div className="card-body">
          <h3 className="card-value">{value}</h3>
          <p className="card-label">{label}</p>
        </div>
      </div>
    </div>
  )
}
