/**
 * Étape 1 : Fichier de test pur pour vérifier la présence du SDK Pi.
 * AUCUNE initialisation automatique ici.
 */

export const checkPiSDK = () => {
  if (typeof window === 'undefined') {
    return { status: 'error', message: 'Environnement serveur (SSR)' };
  }
  
  if (window.Pi) {
    console.log('[Étape 1] SDK trouvé:', window.Pi);
    return { status: 'success', message: '✅ SDK Pi détecté dans la fenêtre globale !' };
  } else {
    console.error('[Étape 1] SDK non trouvé');
    return { status: 'error', message: '❌ SDK Pi introuvable. Est-ce qu\'il a bien chargé ?' };
  }
}
