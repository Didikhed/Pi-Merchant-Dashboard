"use client"
import Script from 'next/script'
import { useEffect } from 'react'

export default function PiProvider() {
  useEffect(() => {
    // Initialisation des flags globaux (comme dans ton code)
    window.PiSDKReady = false;
    window.PiSDKError = null;
    
    let retryCount = 0;
    const MAX_RETRY = 5;

    const initSDK = () => {
      if (typeof window !== 'undefined' && window.Pi) {
        try {
          console.log(`[Pi SDK] Tentative d'initialisation ${retryCount + 1}...`);
          // On force sandbox: true car on est en phase de test (Testnet)
          window.Pi.init({ version: "2.0", sandbox: true });
          
          window.PiSDKReady = true;
          window.__piInitialized = true; // Pour notre log interne
          console.log("[Pi SDK] ✅ Initialisé avec succès (Mode Sandbox)");
        } catch (e) {
          console.error("[Pi SDK] Erreur init:", e.message);
          window.PiSDKError = e.message;
          
          if (retryCount < MAX_RETRY) {
            retryCount++;
            setTimeout(initSDK, 1000);
          }
        }
      } else if (retryCount < MAX_RETRY) {
        retryCount++;
        setTimeout(initSDK, 1000);
      } else {
        // Échec définitif (Normal sur PC) -> On active la simulation
        window.__piSimulationMode = true;
        console.warn("[Pi SDK] SDK introuvable sur cet environnement. Mode simulation disponible.");
      }
    };

    // Lancer dès que possible
    initSDK();
  }, []);

  return (
    <Script 
      src="https://sdk.minepi.com/pi-sdk.js" 
      strategy="afterInteractive"
    />
  )
}
