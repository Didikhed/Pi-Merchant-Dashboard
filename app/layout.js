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
        
        {/* Chargement propre du SDK Pi via Next.js */}
        <Script 
          src="https://sdk.minepi.com/pi-sdk.js" 
          strategy="afterInteractive"
          onLoad={() => {
            if (window.Pi) {
              try {
                window.Pi.init({ version: "2.0", sandbox: true });
                window.__piReady = true;
                console.log('[Pi] SDK initialisé via Script onLoad');
              } catch(e) {
                console.error('[Pi] Init Error:', e);
              }
            }
          }}
        />
      </body>
    </html>
  )
}
