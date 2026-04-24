/**
 * Étape 2 : Initialisation et Authentification
 */

export const initAndAuthenticatePi = async () => {
  if (typeof window === 'undefined') return { status: 'error', message: 'Environnement serveur' };
  if (!window.Pi) return { status: 'error', message: 'SDK Pi introuvable' };

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
