import './globals.css'

export const metadata = {
  title: 'PiRC2 Merchant — Command Center',
  description: 'Premium Pi Network subscription management powered by PiRC2 Smart Contracts',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* Étape 1: Charger le SDK Pi de manière synchrone */}
        <script src="https://sdk.minepi.com/pi-sdk.js" />
        {/* Étape 2: Initialiser immédiatement après le chargement */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.__piReady = false;
          document.addEventListener('DOMContentLoaded', function() {
            if (window.Pi) {
              try {
                window.Pi.init({ version: "2.0", sandbox: true });
                window.__piReady = true;
                console.log('[Pi] SDK initialized successfully');
              } catch(e) {
                console.error('[Pi] Init failed:', e);
              }
            } else {
              console.warn('[Pi] window.Pi not available');
            }
          });
        `}} />
      </head>
      <body>
        <div className="grid-overlay"></div>
        <div className="scan-lines"></div>
        <div className="vignette"></div>
        {children}
      </body>
    </html>
  )
}
