import './globals.css'

export const metadata = {
  title: 'PiRC2 Merchant — Command Center',
  description: 'Premium Pi Network subscription management powered by PiRC2 Smart Contracts',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* APPROCHE ARCHITECTURALE PURE : Chargement natif et synchrone (bloquant) */}
        {/* 1. On force le navigateur à télécharger le SDK Pi avant d'afficher quoi que ce soit */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://sdk.minepi.com/pi-sdk.js"></script>
        
        {/* 2. On initialise le SDK Pi immédiatement dans le thread principal */}
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              if (typeof window !== 'undefined' && window.Pi) {
                window.Pi.init({ version: "2.0", sandbox: true });
                console.log("[Pi Architecture] SDK Initialisé avec succès au chargement de la page.");
              }
            } catch (e) {
              console.error("[Pi Architecture] Erreur critique d'initialisation :", e);
            }
          `
        }}></script>
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
