'use client'
import Header from '@/components/Header'
import './services.css'

export default function ServicesPage() {
  const dummyServices = [
    { id: 1, name: 'Plan Basique', price: '10 π', period: '30 jours', active: true, subs: 124 },
    { id: 2, name: 'Plan Premium', price: '50 π', period: '30 jours', active: true, subs: 89 },
    { id: 3, name: 'Offre Saisonnière', price: '5 π', period: '7 jours', active: false, subs: 0 },
  ]

  return (
    <div className="services-container">
      <Header title="Gestion des Services" />
      
      <div className="services-content">
        <div className="services-header-actions">
          <p className="services-desc">Gérez vos offres d'abonnement et créez de nouveaux forfaits.</p>
          <button className="btn-primary">
            <span className="plus-icon">+</span> Nouveau Service
          </button>
        </div>

        <div className="services-grid">
          {dummyServices.map((svc) => (
            <div key={svc.id} className={`service-card ${!svc.active ? 'inactive' : ''}`}>
              <div className="service-header">
                <h3 className="service-name">{svc.name}</h3>
                <div className={`status-pill ${svc.active ? 'pill-active' : 'pill-inactive'}`}>
                  {svc.active ? 'Actif' : 'Désactivé'}
                </div>
              </div>
              
              <div className="service-details">
                <div className="detail-item">
                  <span className="detail-label">Prix</span>
                  <span className="detail-value">{svc.price}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Période</span>
                  <span className="detail-value">{svc.period}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Abonnés</span>
                  <span className="detail-value">{svc.subs}</span>
                </div>
              </div>

              <div className="service-actions">
                <button className="btn-secondary">Modifier</button>
                <button className="btn-outline">
                  {svc.active ? 'Désactiver' : 'Activer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
