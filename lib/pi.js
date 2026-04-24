/**
 * Étape 2 : Initialisation et Authentification
 */

// Fonction pour charger dynamiquement le script si Next.js l'a ignoré
const loadPiScript = () => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.Pi) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://sdk.minepi.com/pi-sdk.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Impossible de charger le script Pi'));
    document.head.appendChild(script);
  });
};

export const initAndAuthenticatePi = async () => {
  if (typeof window === 'undefined') return { status: 'error', message: 'Environnement serveur' };
  
  try {
    await loadPiScript();
  } catch (err) {
    return { status: 'error', message: 'SDK Pi introuvable (Erreur réseau)' };
  }

  if (!window.Pi) return { status: 'error', message: 'SDK Pi introuvable après chargement' };

  // On force brutalement l'initialisation
  try {
    window.Pi.init({ version: '2.0', sandbox: true });
  } catch (e) {
    // On ignore l'erreur "already initialized"
  }

  try {
    const scopes = ['payments', 'username'];
    const auth = await window.Pi.authenticate(scopes, (payment) => {
      console.log('Paiement incomplet:', payment);
    });
    return { 
      status: 'success', 
      message: `✅ Connecté avec succès: ${auth.user.username}`,
      user: auth.user
    };
  } catch (error) {
    // Si le mode sandbox échoue avec "not initialized", c'est qu'on est sur le Mainnet Pi Browser
    if (error.message && error.message.includes('not initialized')) {
      try {
        window.Pi.init({ version: '2.0' }); // Fallback sans sandbox
        const authFallback = await window.Pi.authenticate(['payments', 'username'], () => {});
        return { 
          status: 'success', 
          message: `✅ Connecté (Mainnet): ${authFallback.user.username}`,
          user: authFallback.user
        };
      } catch (fallbackError) {
        return { status: 'error', message: `❌ Erreur SDK (Fallback): ${fallbackError.message}` };
      }
    }
    
    return { 
      status: 'error', 
      message: `❌ Erreur Pi: ${error.message || JSON.stringify(error)}`
    };
  }
}
