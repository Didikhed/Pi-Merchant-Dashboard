import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata = {
  title: 'PiRC2 Merchant Dashboard',
  description: 'Premium subscription management for Pi Network merchants',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <div className="layout-root">
          <Sidebar />
          <main className="app-main">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
