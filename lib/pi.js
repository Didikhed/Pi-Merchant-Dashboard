/**
 * Authentification pure : L'initialisation est gérée par PiProvider.js
 */
export const authenticatePi = async () => {
  if (typeof window === 'undefined') return { status: 'error', message: 'Environnement serveur' };
  
  // Si on est en mode simulation (détecté par PiProvider)
  if (window.__PI_SIM) {
    return { status: 'simulation', message: 'Mode simulation activé' };
  }

  if (!window.Pi || !window.__PI_READY) {
    return { status: 'error', message: 'SDK Pi non initialisé. Veuillez patienter...' };
  }

  try {
    const scopes = ['payments', 'username', 'wallet_address'];
    const auth = await window.Pi.authenticate(scopes, (payment) => {
      console.log('Paiement incomplet trouvé:', payment);
    });
    
    return { 
      status: 'success', 
      message: `✅ Connecté avec succès: ${auth.user.username}`,
      user: auth.user
    };
  } catch (error) {
    return { 
      status: 'error', 
      message: `❌ Erreur d'authentification: ${error.message || JSON.stringify(error)}`
    };
  }
}
