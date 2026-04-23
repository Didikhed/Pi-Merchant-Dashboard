'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import './Sidebar.css'

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Services', path: '/services', icon: '💼' },
    { name: 'Abonnés', path: '/subscribers', icon: '👥' },
    { name: 'Paramètres', path: '/settings', icon: '⚙️' },
  ]

  return (
    <>
      {/* Hamburger button - mobile only */}
      <button
        className="hamburger-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Menu"
      >
        <span className={`ham-line ${mobileOpen ? 'open' : ''}`}></span>
        <span className={`ham-line ${mobileOpen ? 'open' : ''}`}></span>
        <span className={`ham-line ${mobileOpen ? 'open' : ''}`}></span>
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">π</div>
          <span className="logo-text">PiRC2 Admin</span>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`nav-item ${pathname === item.path ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-name">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="merchant-badge">
            <div className="badge-dot"></div>
            Pro Merchant
          </div>
        </div>
      </aside>
    </>
  )
}
