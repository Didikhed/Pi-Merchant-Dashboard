"use client"
import Script from 'next/script'

export default function PiProvider() {
  return (
    <Script 
      src="https://sdk.minepi.com/pi-sdk.js" 
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window !== 'undefined' && window.Pi) {
          try {
            // Détection automatique du mode sandbox basé sur l'URL
            const isSandbox = window.location.hostname.includes('sandbox') || window.location.hostname.includes('localhost');
            window.Pi.init({ version: "2.0", sandbox: isSandbox });
            window.__piInitialized = true;
            console.log("[Pi SDK] Initialisé avec succès. Mode Sandbox:", isSandbox);
          } catch (e) {
            console.error("[Pi SDK] Erreur init:", e);
          }
        }
      }}
    />
  )
}
