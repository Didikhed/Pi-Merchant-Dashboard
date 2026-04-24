/**
 * Authentification pure : L'initialisation est désormais garantie par layout.js
 */
export const authenticatePi = async () => {
  if (typeof window === 'undefined') return { status: 'error', message: 'Environnement serveur' };
  
  if (!window.Pi) return { status: 'error', message: 'SDK Pi introuvable. Veuillez recharger la page.' };

  try {
    const scopes = ['payments', 'username'];
    const auth = await window.Pi.authenticate(scopes, (payment) => {
      console.log('Paiement incomplet trouvé:', payment);
    });
    
    return { 
      status: 'success', 
      message: `✅ Connecté avec succès: ${auth.user.username}`,
      user: auth.user
    };
  } catch (error) {
    // Si l'erreur mentionne encore l'initialisation, c'est que l'utilisateur 
    // teste sans doute depuis le Mainnet Pi Browser où sandbox=true est refusé.
    // On peut faire un dernier "fallback" ici, au cas où.
    if (error.message && error.message.includes('not initialized')) {
      try {
        console.warn("[Pi Architecture] Mode Sandbox refusé, tentative en Mainnet...");
        window.Pi.init({ version: '2.0' });
        const authFallback = await window.Pi.authenticate(['payments', 'username'], () => {});
        return { 
          status: 'success', 
          message: `✅ Connecté (Mainnet): ${authFallback.user.username}`,
          user: authFallback.user
        };
      } catch (fallbackError) {
        return { status: 'error', message: `❌ Erreur SDK (Mainnet): ${fallbackError.message}` };
      }
    }
    
    return { 
      status: 'error', 
      message: `❌ Erreur d'authentification: ${error.message || JSON.stringify(error)}`
    };
  }
}
