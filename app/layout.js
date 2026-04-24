import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'PiRC2 Merchant — Command Center',
  description: 'Premium Pi Network subscription management powered by PiRC2 Smart Contracts',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <div className="grid-overlay"></div>
        <div className="scan-lines"></div>
        <div className="vignette"></div>
        {children}
        
        {/* Étape 1 : Chargement purement passif du SDK */}
        <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
