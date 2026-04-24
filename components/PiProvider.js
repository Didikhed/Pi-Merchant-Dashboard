"use client"
import Script from 'next/script'
import { useEffect } from 'react'

export default function PiProvider() {
  useEffect(() => {
    // Flags globaux inspirés de ta correction
    window.__PI_READY = false;
    window.__PI_SIM = false;
    window.__PI_ERROR = null;
    window.__PI_ATTEMPTS = 0;

    const tryInit = () => {
      window.__PI_ATTEMPTS++;

      if (typeof window.Pi === 'undefined') {
        if (window.__PI_ATTEMPTS < 10) {
          setTimeout(tryInit, 300);
        } else {
          window.__PI_SIM = true;
          window.__PI_ERROR = 'SDK introuvable';
          console.warn("[Pi SDK] SDK introuvable après 10 tentatives.");
        }
        return;
      }

      try {
        // ✅ sandbox: true (Testnet) - Correction majeure
        window.Pi.init({ version: "2.0", sandbox: true });
        
        window.__PI_READY = true;
        window.__piInitialized = true; // Pour compatibilité avec nos hooks existants
        console.log(`[Pi SDK] ✅ Initialisé avec succès (Tentative ${window.__PI_ATTEMPTS})`);

      } catch (e) {
        // "not initialized" = timing, on retente avec backoff exponentiel
        if (e.message && e.message.indexOf('not initialized') > -1 && window.__PI_ATTEMPTS < 8) {
          const delay = Math.min(500 * Math.pow(2, window.__PI_ATTEMPTS - 1), 5000);
          console.warn(`[Pi SDK] Pas encore prêt, retry dans ${delay}ms...`);
          setTimeout(tryInit, delay);
        } else {
          window.__PI_SIM = true;
          window.__PI_ERROR = e.message;
          console.error("[Pi SDK] Échec définitif de l'init:", e.message);
        }
      }
    };

    // Lancement immédiat
    tryInit();
  }, []);

  return (
    <Script 
      src="https://sdk.minepi.com/pi-sdk.js" 
      strategy="afterInteractive"
    />
  )
}
