"use client"
import Script from 'next/script'

export default function PiProvider() {
  return (
    <Script 
      src="https://sdk.minepi.com/pi-sdk.js" 
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window !== 'undefined' && window.Pi) {
          console.log("[PiProvider] SDK chargé. Tentative d'initialisation...");
          try {
            // On tente d'abord l'initialisation standard (Mainnet)
            window.Pi.init({ version: "2.0" });
            console.log("[PiProvider] Initialisé en mode Mainnet.");
          } catch (e) {
            console.warn("[PiProvider] Échec Mainnet, tentative Sandbox...", e);
            try {
              // Fallback pour le Sandbox
              window.Pi.init({ version: "2.0", sandbox: true });
              console.log("[PiProvider] Initialisé en mode Sandbox.");
            } catch (e2) {
              console.error("[PiProvider] Échec total de l'initialisation", e2);
            }
          }
        }
      }}
    />
  )
}
