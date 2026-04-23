'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './Sidebar.css'

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Services', path: '/services', icon: '💼' },
    { name: 'Abonnés', path: '/subscribers', icon: '👥' },
    { name: 'Paramètres', path: '/settings', icon: '⚙️' },
  ]

  return (
    <aside className="sidebar">
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
  )
}
