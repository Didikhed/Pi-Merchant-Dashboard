'use client'
import { useState, useEffect, useRef } from 'react'
import './page.css'

const TABS = [
  { id: 'overview',     label: 'Overview',    icon: '⬡' },
  { id: 'services',     label: 'Services',    icon: '💼', badge: '3' },
  { id: 'subscribers',  label: 'Abonnés',     icon: '👥', badge: '432' },
  { id: 'transactions', label: 'Transactions', icon: '🔄' },
  { id: 'analytics',    label: 'Analytics',   icon: '📊' },
  { id: 'logs',         label: 'Logs',        icon: '📡' },
]

const ACTIVITY = [
  { time: 'MAINTENANT', agent: 'GB...4F', type: 't-ok',   msg: 'Nouvel abonnement — Service Premium π 10/mois' },
  { time: 'il y a 15m', agent: 'GA...2X', type: 't-info', msg: 'Paiement traité — 83.04 π reçus avec succès' },
  { time: 'il y a 1h',  agent: 'GC...8M', type: 't-warn', msg: 'Paiement en attente — Portefeuille insuffisant' },
  { time: 'il y a 2h',  agent: 'GD...9K', type: 't-ok',   msg: 'Renouvellement automatique effectué' },
  { time: 'il y a 3h',  agent: 'GE...1P', type: 't-gen',  msg: 'Nouveau portefeuille connecté au système' },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview')
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [clock, setClock] = useState('')
  const [cmdInput, setCmdInput] = useState('')
  const [services, setServices] = useState([
    { id: 1, name: 'Premium Access', price: '10', type: 'MENSUEL', members: 42, active: true },
    { id: 2, name: 'Formation Business', price: '25', type: 'UNIQUE', members: 12, active: true },
    { id: 3, name: 'Coaching VIP', price: '50', type: 'ANNUEL', members: 5, active: true },
  ])
  const [subscribers, setSubscribers] = useState([
    { id: '001', addr: 'GB...4F', plan: 'Premium Access', price: '10 π', status: 'b-ok', statusLabel: 'ACTIF', date: '01/05' },
    { id: '002', addr: 'GA...2X', plan: 'Formation Business', price: '25 π', status: 'b-ok', statusLabel: 'ACTIF', date: '03/05' },
    { id: '003', addr: 'GC...8M', plan: 'Coaching VIP', price: '50 π', status: 'b-proc', statusLabel: 'GRACE', date: '30/04' },
    { id: '004', addr: 'GD...9K', plan: 'Premium Access', price: '10 π', status: 'b-ok', statusLabel: 'ACTIF', date: '05/05' },
    { id: '005', addr: 'GE...1P', plan: 'Formation Business', price: '25 π', status: 'b-ok', statusLabel: 'ACTIF', date: '07/05' },
  ])
  const [isAddingSub, setIsAddingSub] = useState(false)
  const [newSub, setNewSub] = useState({ addr: '', planId: 1 })
  const [searchTerm, setSearchTerm] = useState('')

  const [isAddingService, setIsAddingService] = useState(false)
  const [newService, setNewService] = useState({ name: '', price: '', type: 'MENSUEL' })
  const [logs, setLogs] = useState([
    { type: 'silver', msg: '── PiRC2 Merchant Command Center v2.0 ──' },
    { type: 'silver', msg: 'Contrat: CCDQOQKQA5OGBWD6UIAUPZRIGXJ3MC4GQ5BX3R4DNXKP3M6EYBVYKUE5' },
    { type: 'silver', msg: 'Réseau: Pi Testnet · RPC: rpc.testnet.minepi.com' },
    { type: 'silver', msg: '─────────────────────────────────────────' },
  ])
  const canvasRef = useRef(null)

  const addLog = (msg, type = 'neon') => {
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setLogs(prev => [...prev, { type, msg: `[${time}] ${msg}` }])
  }

  const [transactions, setTransactions] = useState([
    { hash: 'CCDQ...UE5', from: 'GB...4F', amount: '10 π', service: 'Premium Access', status: 'b-ok', label: 'CONFIRMÉ', date: '23/04 14:29' },
    { hash: 'CCDQ...3K2', from: 'GA...2X', amount: '25 π', service: 'Formation Business', status: 'b-ok', label: 'CONFIRMÉ', date: '23/04 09:15' },
    { hash: 'CCDQ...8XP', from: 'GC...8M', amount: '50 π', service: 'Coaching VIP', status: 'b-proc', label: 'EN COURS', date: '23/04 08:00' },
  ])

  const genHash = () => 'CCDQ' + Math.random().toString(36).substring(2, 8).toUpperCase() + '...' + Math.random().toString(36).substring(2, 5).toUpperCase()

  const handleAddSub = () => {
    if (!newSub.addr) return
    const service = services.find(s => s.id === Number(newSub.planId))
    const id = (subscribers.length + 1).toString().padStart(3, '0')
    const date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    
    setSubscribers([...subscribers, {
      id,
      addr: newSub.addr,
      plan: service.name,
      price: `${service.price} π`,
      status: 'b-ok',
      statusLabel: 'ACTIF',
      date
    }])
    
    // Add to transactions
    setTransactions([{
      hash: genHash(),
      from: newSub.addr,
      amount: `${service.price} π`,
      service: service.name,
      status: 'b-ok',
      label: 'CONFIRMÉ',
      date: new Date().toLocaleTimeString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    }, ...transactions])

    // Update service member count
    setServices(services.map(s => s.id === service.id ? { ...s, members: s.members + 1 } : s))
    
    addLog(`SUCCESS › Nouvel abonné enregistré : ${newSub.addr}`, 'neon')
    setNewSub({ addr: '', planId: 1 })
    setIsAddingSub(false)
  }

  const handleAddService = () => {
    if (!newService.name || !newService.price) return
    const id = Date.now()
    setServices([...services, { ...newService, id, members: 0, active: true }])
    
    // Add service creation transaction
    setTransactions([{
      hash: genHash(),
      from: 'SYSTEM',
      amount: '0 π',
      service: `DEPLOY: ${newService.name}`,
      status: 'b-ok',
      label: 'DÉPLOYÉ',
      date: new Date().toLocaleTimeString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    }, ...transactions])

    addLog(`SUCCESS › Nouveau service créé : ${newService.name} (π ${newService.price})`, 'neon')
    setNewService({ name: '', price: '', type: 'MENSUEL' })
    setIsAddingService(false)
  }

  const deleteService = (id) => {
    const s = services.find(x => x.id === id)
    setServices(services.filter(x => x.id !== id))
    addLog(`WARN › Service supprimé : ${s.name}`, 'amber')
  }

  const deleteSub = (id) => {
    const s = subscribers.find(x => x.id === id)
    setSubscribers(subscribers.filter(x => x.id !== id))
    addLog(`WARN › Abonné supprimé : ${s.addr}`, 'amber')
  }

  const filteredSubs = subscribers.filter(s => 
    s.addr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.plan.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCommand = (e) => {
    if (e.key !== 'Enter') return
    const cmd = cmdInput.trim().toLowerCase()
    if (!cmd) return

    addLog(`USER › ${cmdInput}`, 'silver')
    
    if (cmd === '/statut') {
      addLog('SYSTEM › Analyse du contrat PiRC2... Statut : OPÉRATIONNEL ✅', 'neon')
      setActiveTab('overview')
    } else if (cmd === '/ping') {
      addLog('SYSTEM › PONG! Connexion Blockchain : 18ms 📡', 'cyan')
    } else if (cmd === '/aide') {
      addLog('AIDE › Commandes : /statut, /ping, /abonnés, /services, /aide', 'amber')
    } else if (cmd === '/abonnés') {
      setActiveTab('subscribers')
      addLog('SYSTEM › Navigation vers la liste des abonnés...', 'neon')
    } else if (cmd === '/services') {
      setActiveTab('services')
      addLog('SYSTEM › Navigation vers la gestion des services...', 'neon')
    } else {
      addLog(`ERREUR › Commande inconnue : ${cmd}. Tapez /aide pour la liste.`, 'red')
    }

    setCmdInput('')
  }

  // Clock
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
    let pts = [], orbT = 0, animId

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    class Particle {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - .5) * .35
        this.vy = (Math.random() - .5) * .35
        this.s = Math.random() * 1.4 + .3
        this.a = Math.random() * .4 + .1
        this.c = Math.random() > .7 ? '170,255,0' : '255,255,255'
      }
      update() {
        this.x += this.vx; this.y += this.vy
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset()
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.c},${this.a})`
        ctx.fill()
      }
    }

    for (let i = 0; i < 80; i++) pts.push(new Particle())

    const drawConnections = () => {
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 90) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(170,255,0,${(1 - d / 90) * .06})`
            ctx.lineWidth = .4
            ctx.stroke()
          }
        }
      }
    }

    const drawOrbs = () => {
      orbT += .002
      const orbs = [
        [canvas.width * .2 + Math.sin(orbT) * 90, canvas.height * .3 + Math.cos(orbT * .7) * 70, 180, '170,255,0'],
        [canvas.width * .8 + Math.cos(orbT * .8) * 100, canvas.height * .65 + Math.sin(orbT) * 55, 140, '0,255,213'],
      ]
      orbs.forEach(([x, y, r, c]) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, `rgba(${c},.035)`)
        g.addColorStop(1, `rgba(${c},0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawOrbs()
      pts.forEach(p => { p.update(); p.draw() })
      drawConnections()
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  const handleConnect = () => {
    if (connected) return
    setConnecting(true)
    setTimeout(() => { setConnecting(false); setConnected(true) }, 1500)
  }

  return (
    <div className="app-shell">
      <canvas ref={canvasRef} id="bg-canvas" />

      {/* TOPBAR */}
      <header className="topbar">
        <div className="tb-logo">π</div>
        <div className="tb-brand">
          <div className="name">PiRC2 MERCHANT</div>
          <div className="sub">COMMAND CENTER v2.0</div>
        </div>
        <div className="tb-sep" />
        <div className="tb-stat"><div className="pdot" /> BLOCKCHAIN ACTIVE</div>
        <div className="tb-clock">{clock}</div>
        <button
          className={`btn-wallet-top ${connected ? 'connected' : ''}`}
          onClick={handleConnect}
          disabled={connecting}
        >
          <div className={`pdot ${connected ? '' : 'inactive'}`} style={connected ? {} : { background: 'var(--silver)', boxShadow: 'none', animation: 'none' }} />
          {connecting ? 'CONNEXION...' : connected ? 'GD2P...EN7' : 'CONNECT PI WALLET'}
        </button>
      </header>

      {/* TABS NAV */}
      <nav className="tabs-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {tab.badge && <span className="tab-badge">{tab.badge}</span>}
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <div className="tab-content">

        {/* ══ OVERVIEW ══ */}
        <div className={`tab-pane ${activeTab === 'overview' ? 'active' : ''}`}>
          <div className="slabel">vision d'ensemble</div>
          <div className="g6" style={{ marginBottom: 14 }}>
            <div className="kpi" style={{ '--kc': 'var(--neon)' }}>
              <div className="kpi-label">Revenus Total (π)</div>
              <div className="kpi-val">{subscribers.reduce((acc, s) => acc + (parseFloat(s.price) || 0), 0)}</div>
              <div className="kpi-delta up">▲ Estimation mensuelle</div>
            </div>
            <div className="kpi" style={{ '--kc': 'var(--cyan)' }}>
              <div className="kpi-label">Abonnés Actifs</div>
              <div className="kpi-val">{subscribers.length}</div>
              <div className="kpi-delta up">▲ Utilisateurs réels</div>
            </div>
            <div className="kpi" style={{ '--kc': 'var(--amber)' }}>
              <div className="kpi-label">Services Actifs</div>
              <div className="kpi-val">{services.length}</div>
              <div className="kpi-delta flat">— Contrats activés</div>
            </div>
            {/* ... kpis restants ... */}
            <div className="kpi" style={{ '--kc': 'var(--neon)' }}>
              <div className="kpi-label">Taux Succès</div>
              <div className="kpi-val">97%</div>
              <div className="kpi-delta up">▲ Blockchain Stable</div>
            </div>
            <div className="kpi" style={{ '--kc': 'var(--cyan)' }}>
              <div className="kpi-label">Connectivité</div>
              <div className="kpi-val">ON</div>
              <div className="kpi-delta flat">— Pi RPC v2</div>
            </div>
            <div className="kpi" style={{ '--kc': 'var(--neon3)' }}>
              <div className="kpi-label">Contrat ID</div>
              <div className="kpi-val" style={{ fontSize: 14, paddingTop: 8 }}>CCDQ...UE5</div>
              <div className="kpi-delta flat">— Pi Testnet</div>
            </div>
          </div>

          <div className="g3" style={{ marginBottom: 14 }}>
            <div className="panel" style={{ gridColumn: 'span 2' }}>
              <div className="ptitle"><span className="icon">📊</span> ACTIVITÉ RÉCENTE BLOCKCHAIN</div>
              {transactions.slice(0, 5).map((t, i) => (
                <div key={i} className="af-item">
                  <span className="af-time">{t.date}</span>
                  <span className="af-agent" style={{ color: 'var(--cyan)' }}>{t.from === 'SYSTEM' ? 'CONTRACT' : t.from}</span>
                  <span className={`af-type ${t.status === 'b-ok' ? 't-ok' : 't-proc'}`}>{t.label}</span>
                  <span className="af-msg">{t.service} — {t.amount}</span>
                </div>
              ))}
              {transactions.length === 0 && <div className="mono-text" style={{ padding: 20, textAlign: 'center', opacity: 0.5 }}>AUCUNE ACTIVITÉ RÉCENTE</div>}
            </div>
            <div className="panel">
              <div className="ptitle"><span className="icon">⚡</span> ÉTAT SYSTÈME</div>
              <div className="stat-row"><span className="stat-key">Pi Testnet Node</span><span className="stat-val" style={{ color: 'var(--neon)' }}>CONNECTÉ</span></div>
              <div className="stat-row"><span className="stat-key">Contrat PiRC2</span><span className="stat-val">v2.0</span></div>
              <div className="stat-row"><span className="stat-key">Paiements auto</span><span className="stat-val">08:00 UTC</span></div>
              <div className="stat-row"><span className="stat-key">Erreurs critiques</span><span className="stat-val" style={{ color: 'var(--neon)' }}>0</span></div>
              <div className="stat-row"><span className="stat-key">Uptime</span><span className="stat-val">99.2%</span></div>
              <div className="stat-row"><span className="stat-key">Réseau</span><span className="stat-val">Pi Testnet</span></div>
            </div>
          </div>

          {/* Pipeline */}
          <div className="panel">
            <div className="ptitle"><span className="icon">🔄</span> PIPELINE — TRAITEMENT PAIEMENTS</div>
            <div className="pipeline">
              {['Détection', 'Validation', 'Signature', 'Broadcast', 'Confirmation', 'Notification', 'Log'].map((s, i) => (
                <div key={i} className="pipe-step">
                  <div className={`pipe-dot ${i < 3 ? 'done' : i === 3 ? 'active' : ''}`}>{i < 3 ? '✓' : i === 3 ? '⚙' : '○'}</div>
                  <div className={`pipe-lbl ${i < 3 ? 'done' : i === 3 ? 'active' : ''}`}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ SERVICES ══ */}
        <div className={`tab-pane ${activeTab === 'services' ? 'active' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div className="slabel" style={{ margin: 0 }}>gestion des services</div>
            <button className="btn-neon" style={{ padding: '8px 16px', fontSize: 11 }} onClick={() => setIsAddingService(!isAddingService)}>
              {isAddingService ? '✕ ANNULER' : '+ CRÉER UN SERVICE'}
            </button>
          </div>

          {isAddingService && (
            <div className="panel" style={{ marginBottom: 24, border: '1px solid var(--neon2)' }}>
              <div className="ptitle"><span className="icon">✨</span> NOUVEAU SERVICE MARCHAND</div>
              <div className="g3" style={{ gap: 16 }}>
                <div>
                  <div className="mono-text" style={{ fontSize: 10, marginBottom: 8 }}>NOM DU SERVICE</div>
                  <input
                    className="cmd-input"
                    style={{ border: '1px solid var(--border)', width: '100%', background: 'rgba(255,255,255,0.02)' }}
                    placeholder="ex: Formation Coaching"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  />
                </div>
                <div>
                  <div className="mono-text" style={{ fontSize: 10, marginBottom: 8 }}>PRIX (π)</div>
                  <input
                    className="cmd-input"
                    type="number"
                    style={{ border: '1px solid var(--border)', width: '100%', background: 'rgba(255,255,255,0.02)' }}
                    placeholder="ex: 15"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  />
                </div>
                <div>
                  <div className="mono-text" style={{ fontSize: 10, marginBottom: 8 }}>TYPE</div>
                  <select
                    className="cmd-input"
                    style={{ border: '1px solid var(--border)', width: '100%', background: 'var(--void)', height: 38 }}
                    value={newService.type}
                    onChange={(e) => setNewService({ ...newService, type: e.target.value })}
                  >
                    <option value="MENSUEL">MENSUEL</option>
                    <option value="ANNUEL">ANNUEL</option>
                    <option value="UNIQUE">UNIQUE</option>
                  </select>
                </div>
              </div>
              <button className="btn-neon" style={{ marginTop: 20, width: '100%' }} onClick={handleAddService}>
                DÉPLOYER LE SERVICE SUR LA BLOCKCHAIN PI
              </button>
            </div>
          )}

          <div className="g3">
            {services.map((s, i) => (
              <div key={s.id} className="panel service-card" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div className="mono-text" style={{ fontSize: 10, color: i === 0 ? 'var(--neon)' : i === 1 ? 'var(--cyan)' : 'var(--amber)', letterSpacing: 2 }}>{s.type}</div>
                  <div className="pdot" style={{ background: s.active ? 'var(--neon)' : 'var(--red)' }} />
                </div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 22, color: 'var(--white)', marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 32, color: i === 0 ? 'var(--neon)' : i === 1 ? 'var(--cyan)' : 'var(--amber)', marginBottom: 16 }}>π {s.price}</div>
                <div className="stat-row"><span className="stat-key">Abonnés actifs</span><span className="stat-val">{s.members}</span></div>
                <div className="stat-row"><span className="stat-key">Statut</span><span className="badge b-ok">ACTIF</span></div>
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button className="btn-small" style={{ flex: 1 }}>MODIFIER</button>
                  <button className="btn-small" style={{ flex: 1, color: 'var(--red)', borderColor: 'rgba(255,0,0,0.2)' }} onClick={() => deleteService(s.id)}>SUPPRIMER</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ ABONNÉS ══ */}
        <div className={`tab-pane ${activeTab === 'subscribers' ? 'active' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div className="slabel" style={{ margin: 0 }}>liste des abonnés</div>
            <button className="btn-neon" style={{ padding: '8px 16px', fontSize: 11 }} onClick={() => setIsAddingSub(!isAddingSub)}>
              {isAddingSub ? '✕ ANNULER' : '+ NOUVEL ABONNÉ'}
            </button>
          </div>

          {isAddingSub && (
            <div className="panel" style={{ marginBottom: 24, border: '1px solid var(--cyan)' }}>
              <div className="ptitle" style={{ color: 'var(--cyan)' }}><span className="icon">👤</span> INSCRIPTION MANUELLE</div>
              <div className="g3" style={{ gap: 16 }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <div className="mono-text" style={{ fontSize: 10, marginBottom: 8 }}>ADRESSE PI DU MEMBRE</div>
                  <input
                    className="cmd-input"
                    style={{ border: '1px solid var(--border)', width: '100%', background: 'rgba(255,255,255,0.02)' }}
                    placeholder="ex: GDX...4F"
                    value={newSub.addr}
                    onChange={(e) => setNewSub({ ...newSub, addr: e.target.value })}
                  />
                </div>
                <div>
                  <div className="mono-text" style={{ fontSize: 10, marginBottom: 8 }}>CHOIX DU SERVICE</div>
                  <select
                    className="cmd-input"
                    style={{ border: '1px solid var(--border)', width: '100%', background: 'var(--void)', height: 38 }}
                    value={newSub.planId}
                    onChange={(e) => setNewSub({ ...newSub, planId: e.target.value })}
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (π {s.price})</option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="btn-neon" style={{ marginTop: 20, width: '100%', borderColor: 'var(--cyan)', color: 'var(--cyan)' }} onClick={handleAddSub}>
                ENREGISTRER LE MEMBRE DANS LE SYSTÈME
              </button>
            </div>
          )}

          <div className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="ptitle"><span className="icon">👥</span> ABONNÉS ACTIFS — {subscribers.length}</div>
              <input
                className="cmd-input"
                style={{ border: '1px solid var(--border)', width: '250px', fontSize: 11, padding: '6px 12px' }}
                placeholder="🔍 Rechercher une adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="dtable">
                <thead>
                  <tr><th>#</th><th>Adresse Pi</th><th>Service</th><th>Prix</th><th>Statut</th><th>Expiration</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {filteredSubs.map((s, i) => (
                    <tr key={s.id}>
                      <td className="mono-text">{s.id}</td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{s.addr}</td>
                      <td>{s.plan}</td>
                      <td className="mono-text" style={{ color: 'var(--neon)' }}>{s.price}</td>
                      <td><span className={`badge ${s.status}`}>{s.statusLabel}</span></td>
                      <td className="mono-text">{s.date}</td>
                      <td>
                        <button className="btn-small" style={{ color: 'var(--red)', borderColor: 'rgba(255,0,0,0.1)', padding: '2px 8px' }} onClick={() => deleteSub(s.id)}>SUPPR.</button>
                      </td>
                    </tr>
                  ))}
                  {filteredSubs.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--ghost)', fontFamily: 'var(--mono)', fontSize: 12 }}>
                        AUCUN ABONNÉ TROUVÉ DANS LA BASE DE DONNÉES
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>


        {/* ══ TRANSACTIONS ══ */}
        <div className={`tab-pane ${activeTab === 'transactions' ? 'active' : ''}`}>
          <div className="slabel" style={{ marginBottom: 20 }}>historique transactions blockchain</div>
          <div className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="ptitle"><span className="icon">🔄</span> TRANSACTIONS RÉCENTES — {transactions.length}</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="dtable">
                <thead>
                  <tr><th>Hash</th><th>De</th><th>Montant</th><th>Service</th><th>Statut</th><th>Date/Heure</th></tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--cyan)' }}>{t.hash}</td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: 10 }}>{t.from}</td>
                      <td className="mono-text" style={{ color: 'var(--neon)' }}>{t.amount}</td>
                      <td>{t.service}</td>
                      <td><span className={`badge ${t.status}`}>{t.label}</span></td>
                      <td className="mono-text">{t.date}</td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--ghost)', fontFamily: 'var(--mono)', fontSize: 12 }}>
                        AUCUNE TRANSACTION DÉTECTÉE SUR LE RÉSEAU PI
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ══ ANALYTICS ══ */}
        <div className={`tab-pane ${activeTab === 'analytics' ? 'active' : ''}`}>
          <div className="slabel" style={{ marginBottom: 20 }}>analytics & performance du réseau</div>
          <div className="g3">
            <div className="panel">
              <div className="ptitle"><span className="icon">💰</span> REVENUS PAR SERVICE</div>
              {services.map(s => {
                const revenue = subscribers.filter(sub => sub.plan === s.name).reduce((acc, sub) => acc + (parseFloat(sub.price) || 0), 0)
                return (
                  <div key={s.id} className="stat-row">
                    <span className="stat-key">{s.name}</span>
                    <span className="stat-val">{revenue} π</span>
                  </div>
                )
              })}
              <div className="stat-row" style={{ borderTop: '1px solid var(--neon2)', marginTop: 8, paddingTop: 8 }}>
                <span className="stat-key" style={{ color: 'var(--neon)' }}>TOTAL ESTIMÉ</span>
                <span className="stat-val" style={{ fontSize: 16, color: 'var(--neon)' }}>
                  {subscribers.reduce((acc, s) => acc + (parseFloat(s.price) || 0), 0)} π
                </span>
              </div>
            </div>
            <div className="panel">
              <div className="ptitle"><span className="icon">⏱</span> PERFORMANCE SYSTÈME</div>
              <div className="stat-row"><span className="stat-key">Taux renouvellement</span><span className="stat-val">94%</span></div>
              <div className="stat-row"><span className="stat-key">Taux succès blockchain</span><span className="stat-val">99.8%</span></div>
              <div className="stat-row"><span className="stat-key">Latence Pi RPC</span><span className="stat-val">~24ms</span></div>
              <div className="stat-row"><span className="stat-key">Transactions / jour</span><span className="stat-val">{transactions.length}</span></div>
              <div className="stat-row"><span className="stat-key">Uptime Contrat</span><span className="stat-val" style={{ color: 'var(--neon)' }}>100%</span></div>
            </div>
            <div className="panel">
              <div className="ptitle"><span className="icon">🏆</span> TOP ABONNÉS (RÉCENTS)</div>
              {subscribers.slice(0, 5).map((s, i) => (
                <div key={i} className="stat-row">
                  <span className="stat-key" style={{ fontSize: 10 }}>{s.addr}</span>
                  <span className="stat-val" style={{ color: 'var(--cyan)' }}>{s.price}</span>
                </div>
              ))}
              {subscribers.length === 0 && <div className="mono-text" style={{ opacity: 0.5, textAlign: 'center', padding: 20 }}>AUCUNE DONNÉE</div>}
            </div>
          </div>
        </div>

        {/* ══ LOGS ══ */}
        <div className={`tab-pane ${activeTab === 'logs' ? 'active' : ''}`}>
          <div className="slabel">logs système</div>
          <div className="panel">
            <div className="ptitle"><span className="icon">📡</span> TERMINAL — LOGS EN TEMPS RÉEL</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, lineHeight: 1.8, maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {logs.map((log, i) => (
                <div key={i} style={{ color: `var(--${log.type === 'silver' ? 'silver' : log.type === 'neon' ? 'neon' : log.type === 'amber' ? 'amber' : log.type === 'red' ? 'red' : 'cyan'})` }}>
                  {log.msg}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* CMD BAR */}
      <div className="cmd-bar">
        <span className="cmd-prompt">pirc2@merchant ~$</span>
        <input
          className="cmd-input"
          placeholder="Entrez une commande : /statut, /abonnés, /rapport, /service [nom] ..."
          autoComplete="off"
          value={cmdInput}
          onChange={(e) => setCmdInput(e.target.value)}
          onKeyDown={handleCommand}
        />
        <span className="cmd-hint">↵ ENVOYER</span>
      </div>
    </div>
  )
}
