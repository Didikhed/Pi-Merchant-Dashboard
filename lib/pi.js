/**
 * Authentification pure : L'initialisation est gérée par PiProvider.js
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
    return { 
      status: 'error', 
      message: `❌ Erreur d'authentification: ${error.message || JSON.stringify(error)}`
    };
  }
}
