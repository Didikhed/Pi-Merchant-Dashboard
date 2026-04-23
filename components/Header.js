'use client'
import { useState } from 'react'
import './Header.css'

export default function Header({ title = 'Dashboard' }) {
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)

  const handleConnect = () => {
    setConnecting(true)
    // Simulation de connexion au Pi Wallet / Freighter
    setTimeout(() => {
      setConnecting(false)
      setConnected(true)
    }, 1500)
  }

  return (
    <header className="header">
      <div className="header-info">
        <h1 className="header-title">{title}</h1>
      </div>
      
      <div className="header-actions">
        <button 
          className={`btn-wallet ${connected ? 'connected' : ''}`}
          onClick={handleConnect}
          disabled={connecting}
        >
          <span className={`wallet-dot ${connected ? 'active' : ''} ${connecting ? 'pulse' : ''}`}></span>
          {connecting ? 'Connexion en cours...' : connected ? '0xGC...4Fh3' : 'Connect Pi Wallet'}
        </button>
        <div className="profile-mini">
          <div className="profile-avatar">M</div>
        </div>
      </div>
    </header>
  )
}
