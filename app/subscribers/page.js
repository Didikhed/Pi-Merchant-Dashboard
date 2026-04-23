'use client'
import Header from '@/components/Header'
import './subscribers.css'

export default function SubscribersPage() {
  const dummySubs = [
    { id: '101', addr: 'GB...4F', plan: 'Plan Premium', start: '12 Mars 2024', status: 'Active', fails: 0 },
    { id: '102', addr: 'GA...2X', plan: 'Plan Basique', start: '15 Mars 2024', status: 'Active', fails: 0 },
    { id: '103', addr: 'GC...8M', plan: 'Plan Premium', start: '10 Fév 2024', status: 'Grace Period', fails: 1 },
    { id: '104', addr: 'GD...9Z', plan: 'Plan Basique', start: '1 Jan 2024', status: 'Active', fails: 0 },
  ]

  return (
    <div className="subscribers-container">
      <Header title="Gestion des Abonnés" />
      
      <div className="subscribers-content">
        <div className="subscribers-summary-bar">
          <div className="summary-info">
            <span className="summary-count">{dummySubs.length} Abonnés totaux</span>
            <span className="summary-status-tag">En attente de prélèvement : 12</span>
          </div>
          <button className="btn-process">
            <span className="flash-icon">⚡</span> Lancer la facturation (process)
          </button>
        </div>

        <div className="subs-table-container">
          <table className="subs-table">
            <thead>
              <tr>
                <th>Subscriber ID</th>
                <th>Adresse Portefeuille</th>
                <th>Service</th>
                <th>Date Début</th>
                <th>Échecs</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummySubs.map((sub) => (
                <tr key={sub.id}>
                  <td className="cell-id">#{sub.id}</td>
                  <td className="cell-addr">{sub.addr}</td>
                  <td className="cell-plan">{sub.plan}</td>
                  <td className="cell-date">{sub.start}</td>
                  <td className="cell-fails">
                    <span className={sub.fails > 0 ? 'fails-badge alert' : 'fails-badge'}>
                      {sub.fails}
                    </span>
                  </td>
                  <td>
                    <span className={`status-tag ${sub.status.toLowerCase().replace(' ', '-')}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-small-icon">👁️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
