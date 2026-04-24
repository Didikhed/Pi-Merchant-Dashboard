import './globals.css'

export const metadata = {
  title: 'PiRC2 Merchant — Command Center',
  description: 'Premium Pi Network subscription management powered by PiRC2 Smart Contracts',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* Pi Network SDK — chargement natif obligatoire avant React */}
        <script src="https://sdk.minepi.com/pi-sdk.js" async="false" />
      </head>
      <body>
        {/* Background FX */}
        <div className="grid-overlay"></div>
        <div className="scan-lines"></div>
        <div className="vignette"></div>
        {children}
      </body>
    </html>
  )
}
