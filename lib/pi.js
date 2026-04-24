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
    // S'assure que le script est chargé
    await loadPiScript();
  } catch (err) {
    return { status: 'error', message: 'SDK Pi introuvable (Erreur réseau)' };
  }

  if (!window.Pi) return { status: 'error', message: 'SDK Pi introuvable après chargement' };

  try {
    // 1. Initialisation (uniquement si pas déjà fait)
    if (!window.__piInitialized) {
      console.log('[Étape 2] Tentative d\'initialisation...');
      window.Pi.init({ version: '2.0', sandbox: true });
      window.__piInitialized = true;
      console.log('[Étape 2] Initialisation réussie !');
    }

    // 2. Authentification
    console.log('[Étape 2] Lancement de l\'authentification...');
    const scopes = ['payments', 'username'];
    
    const onIncompletePaymentFound = (payment) => {
      console.log('[Étape 2] Paiement incomplet trouvé:', payment);
    };

    const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
    console.log('[Étape 2] Authentification réussie:', auth);
    
    return { 
      status: 'success', 
      message: `✅ Connecté avec succès: ${auth.user.username}`,
      user: auth.user
    };

  } catch (error) {
    console.error('[Étape 2] Erreur Pi:', error);
    return { 
      status: 'error', 
      message: `❌ Erreur Pi: ${error.message || JSON.stringify(error)}`
    };
  }
}
