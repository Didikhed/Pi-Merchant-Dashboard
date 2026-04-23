import Header from '@/components/Header'
import RevenueCard from '@/components/RevenueCard'
import './page.css'

export default function Home() {
  return (
    <div className="home-container">
      <Header title="Tableau de bord financier" />
      
      <div className="dashboard-content">
        <section className="stats-grid">
          <RevenueCard 
            label="Revenu Total (Pi)" 
            value="12,540 π" 
            trend={12.5} 
            icon="💰" 
            color="purple" 
          />
          <RevenueCard 
            label="Abonnés Actifs" 
            value="432" 
            trend={8.2} 
            icon="👥" 
            color="blue" 
          />
          <RevenueCard 
            label="Volume 24h" 
            value="185 π" 
            trend={-2.4} 
            icon="📈" 
            color="gold" 
          />
        </section>

        <section className="dashboard-main-grid">
          <div className="chart-container main-card">
            <h2 className="section-title">Croissance des revenus</h2>
            <div className="mock-chart">
              {/* Placeholder for SVG Chart */}
              <div className="chart-bar-list">
                {[40, 60, 45, 70, 85, 65, 90].map((v, i) => (
                  <div key={i} className="chart-bar" style={{ height: `${v}%` }}>
                    <div className="bar-glow"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="recent-activity main-card">
            <h2 className="section-title">Activité récente</h2>
            <div className="activity-list">
              {[
                { user: 'GB...4F', action: 'Nouvel abonnement', time: 'il y a 2m' },
                { user: 'GA...2X', action: 'Paiement Processed', time: 'il y a 15m' },
                { user: 'GC...8M', action: 'Échec de paiement', time: 'il y a 1h', alert: true },
              ].map((act, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-info">
                    <span className="user-addr">{act.user}</span>
                    <span className="action-text">{act.action}</span>
                  </div>
                  <span className={`activity-time ${act.alert ? 'text-red' : ''}`}>{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="dashboard-footer">
          <div className="network-status">
             <span className="network-dot"></span>
             Pi Testnet Node: <span className="status-ok">Connected</span>
          </div>
          <p className="footer-version">PiRC2 Standard v2.0 - Audit Remediated</p>
        </footer>
      </div>
    </div>
  )
}
