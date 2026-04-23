'use client'
import { useState, useEffect, useRef } from 'react'
import './subscribe.css'

const PLANS = [
  {
    id: 'premium',
    name: 'Accès Premium',
    price: '10',
    icon: '⭐',
    color: 'var(--neon)',
    glow: 'rgba(170,255,0,.15)',
    features: [
      'Accès à tous les contenus exclusifs',
      'Mises à jour hebdomadaires',
      'Support par WhatsApp',
      'Réseau communauté Pi',
    ],
    badge: 'POPULAIRE',
  },
  {
    id: 'formation',
    name: 'Formation Business',
    price: '25',
    icon: '🎓',
    color: 'var(--cyan)',
    glow: 'rgba(0,255,213,.15)',
    features: [
      'Tout le plan Premium',
      'Formations business complètes',
      'Sessions de coaching de groupe',
      'Accès aux outils marketing',
      'Certificat de formation',
    ],
    badge: 'RECOMMANDÉ',
  },
  {
    id: 'vip',
    name: 'Coaching VIP',
    price: '50',
    icon: '👑',
    color: 'var(--amber)',
    glow: 'rgba(255,184,0,.15)',
    features: [
      'Tout le plan Formation',
      'Coaching individuel mensuel',
      'Accès prioritaire au leader',
      'Stratégie business personnalisée',
      'Accès à vie aux archives',
      'Badge VIP dans la communauté',
    ],
    badge: 'ELITE',
  },
]

const FAQS = [
  {
    q: 'Est-ce que je dois donner mes 24 mots ?',
    a: 'JAMAIS. Personne ne vous demandera vos 24 mots ni votre mot de passe. La connexion se fait via votre Pi Browser, exactement comme pour toute autre app Pi Network.',
  },
  {
    q: 'Comment fonctionne le paiement ?',
    a: 'Vous connectez votre Pi Wallet, choisissez un plan, et approuvez la transaction directement dans votre Pi Browser. Le Contrat Intelligent sur la blockchain enregistre votre abonnement automatiquement.',
  },
  {
    q: 'Le code est-il vraiment open-source ?',
    a: 'Oui, 100%. Vous pouvez vérifier tout le code sur GitHub : github.com/Didikhed/Pi-Merchant-Dashboard. Rien n\'est caché.',
  },
  {
    q: 'Puis-je me désabonner ?',
    a: 'Oui, vous pouvez arrêter votre abonnement à tout moment. Il suffit de ne pas renouveler le prochain mois.',
  },
]

export default function Subscribe() {
  const [selectedPlan, setSelectedPlan] = useState('formation')
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [subscribing, setSubscribing] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [clock, setClock] = useState('')
  const canvasRef = useRef(null)

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Particle background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let pts = [], animId

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 60; i++) {
      pts.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
        s: Math.random() * 1.2 + .3, a: Math.random() * .3 + .1,
        c: Math.random() > .6 ? '170,255,0' : '255,255,255',
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.c},${p.a})`; ctx.fill()
      })
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  const handleConnect = () => {
    setConnecting(true)
    setTimeout(() => { setConnecting(false); setConnected(true) }, 1800)
  }

  const handleSubscribe = () => {
    if (!connected) { handleConnect(); return }
    setSubscribing(true)
    setTimeout(() => { setSubscribing(false); setSubscribed(true) }, 2500)
  }

  const plan = PLANS.find(p => p.id === selectedPlan)

  if (subscribed) {
    return (
      <div className="sub-shell">
        <canvas ref={canvasRef} id="bg-canvas" />
        <div className="grid-overlay" /><div className="scan-lines" /><div className="vignette" />
        <div className="success-screen">
          <div className="success-icon">✅</div>
          <div className="success-title">ABONNEMENT CONFIRMÉ !</div>
          <div className="success-msg">
            Bienvenue dans l'Empire Pi ! 🌔<br />
            Votre abonnement <strong style={{ color: plan.color }}>{plan.name}</strong> est actif.<br />
            Vous recevrez bientôt les accès par WhatsApp.
          </div>
          <div className="success-detail mono-text">Enregistré sur la blockchain Pi · Contrat PiRC2 v2.0</div>
          <a href="/" className="btn-back">← Retour au Dashboard</a>
        </div>
      </div>
    )
  }

  return (
    <div className="sub-shell">
      <canvas ref={canvasRef} id="bg-canvas" />
      <div className="grid-overlay" /><div className="scan-lines" /><div className="vignette" />

      {/* Header */}
      <header className="sub-header">
        <a href="/" className="sub-logo">
          <div className="tb-logo">π</div>
          <div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 16, color: 'var(--neon)', letterSpacing: 2 }}>PiRC2 MERCHANT</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--silver)', letterSpacing: 3 }}>COMMAND CENTER v2.0</div>
          </div>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="tb-stat"><div className="pdot" /> BLOCKCHAIN ACTIVE</div>
          <div className="tb-clock">{clock}</div>
        </div>
      </header>

      <div className="sub-content">

        {/* Hero */}
        <div className="sub-hero">
          <div className="sub-hero-badge">REJOINDRE L'EMPIRE PI</div>
          <h1 className="sub-hero-title">Abonnez-vous &amp; Accédez<br />à l'Écosystème Pi</h1>
          <p className="sub-hero-sub">
            Payez en <strong style={{ color: 'var(--neon)' }}>Pi Network</strong> · Contrat Intelligent transparent · Code open-source
          </p>
          <div className="trust-badges">
            <span className="trust-badge">🔐 Aucun mot de passe partagé</span>
            <span className="trust-badge">📖 Code open-source</span>
            <span className="trust-badge">⛓️ Blockchain Pi</span>
          </div>
        </div>

        {/* Plans */}
        <div className="slabel" style={{ justifyContent: 'center', marginBottom: 20 }}>choisissez votre plan</div>
        <div className="plans-grid">
          {PLANS.map(p => (
            <div
              key={p.id}
              className={`plan-card ${selectedPlan === p.id ? 'selected' : ''}`}
              style={{ '--pc': p.color, '--pg': p.glow }}
              onClick={() => setSelectedPlan(p.id)}
            >
              {p.badge && <div className="plan-badge" style={{ color: p.color }}>{p.badge}</div>}
              <div className="plan-icon">{p.icon}</div>
              <div className="plan-name">{p.name}</div>
              <div className="plan-price">
                <span className="plan-pi">π</span>
                <span className="plan-amount">{p.price}</span>
                <span className="plan-period">/mois</span>
              </div>
              <ul className="plan-features">
                {p.features.map((f, i) => (
                  <li key={i}><span style={{ color: p.color }}>✓</span> {f}</li>
                ))}
              </ul>
              {selectedPlan === p.id && (
                <div className="plan-selected-indicator">PLAN SÉLECTIONNÉ ✓</div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="panel cta-panel">
            <div className="ptitle"><span className="icon">⚡</span> FINALISER VOTRE ABONNEMENT</div>
            <div className="cta-summary">
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--silver)', marginBottom: 4 }}>PLAN SÉLECTIONNÉ</div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 24, color: plan.color }}>{plan.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--silver)', marginBottom: 4 }}>MONTANT</div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 32, color: plan.color }}>π {plan.price}/mois</div>
              </div>
            </div>

            <div className="wallet-status">
              {connected ? (
                <div className="wallet-connected">
                  <div className="pdot" /> Pi Wallet connecté · 0xGD2P...EN7
                </div>
              ) : (
                <div className="wallet-disconnected">
                  ⚠ Connectez votre Pi Wallet pour s'abonner
                </div>
              )}
            </div>

            <button
              className={`btn-subscribe ${connected ? 'ready' : ''} ${subscribing ? 'loading' : ''}`}
              style={{ '--bc': plan.color, '--bg': plan.glow }}
              onClick={handleSubscribe}
              disabled={subscribing}
            >
              {subscribing
                ? '⏳ Transaction en cours sur la blockchain...'
                : connected
                  ? `S'ABONNER — π ${plan.price}/mois`
                  : '🔗 CONNECTER PI WALLET'}
            </button>

            <div className="cta-note">
              🔒 Aucune donnée sensible partagée · Paiement 100% on-chain · Résiliable à tout moment
            </div>
          </div>
        </div>

        {/* Transparency Section */}
        <div className="transparency-section">
          <div className="slabel">transparence totale</div>
          <div className="g3">
            <div className="panel">
              <div className="ptitle"><span className="icon">⛓️</span> CONTRAT INTELLIGENT</div>
              <p style={{ fontSize: 13, color: 'var(--silver)', lineHeight: 1.7, marginBottom: 10 }}>
                Votre abonnement est enregistré directement sur la blockchain Pi via un Smart Contract PiRC2. Aucun intermédiaire.
              </p>
              <div className="mono-text" style={{ color: 'var(--neon)', wordBreak: 'break-all', fontSize: 10 }}>
                CCDQOQKQA5OGBWD6UIAUPZRIGXJ3MC4GQ5BX3R4DNXKP3M6EYBVYKUE5
              </div>
            </div>
            <div className="panel">
              <div className="ptitle"><span className="icon">📖</span> CODE OPEN-SOURCE</div>
              <p style={{ fontSize: 13, color: 'var(--silver)', lineHeight: 1.7, marginBottom: 10 }}>
                Tout le code de ce dashboard est public et vérifiable. Rien n'est caché. Vous pouvez contrôler vous-même.
              </p>
              <a
                href="https://github.com/Didikhed/Pi-Merchant-Dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-github"
              >
                🔗 Voir sur GitHub
              </a>
            </div>
            <div className="panel">
              <div className="ptitle"><span className="icon">🛡️</span> VOS CLÉS = VOTRE ARGENT</div>
              <p style={{ fontSize: 13, color: 'var(--silver)', lineHeight: 1.7 }}>
                Nous ne demandons JAMAIS vos 24 mots secrets. La connexion se fait via votre Pi Browser. Vous gardez le contrôle total.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <div className="slabel">questions fréquentes</div>
          {FAQS.map((f, i) => (
            <div key={i} className="faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div className="faq-q">
                <span>{f.q}</span>
                <span className="faq-arrow" style={{ transform: openFaq === i ? 'rotate(90deg)' : 'none' }}>›</span>
              </div>
              {openFaq === i && <div className="faq-a">{f.a}</div>}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sub-footer">
          <span className="mono-text">PiRC2 Standard v2.0 · Audit Remediated · Pi Testnet</span>
          <a href="/" className="mono-text" style={{ color: 'var(--neon)' }}>← Tableau de bord</a>
        </div>

      </div>
    </div>
  )
}
