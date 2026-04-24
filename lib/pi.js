/**
 * Utilitaire pour l'intégration du SDK Pi Network
 * L'initialisation est gérée via un script inline dans layout.js.
 */

// Fallback init si le script inline n'a pas encore tourné
export const initPi = () => {
  if (typeof window === 'undefined' || !window.Pi) return false;
  if (window.__piReady) return true;
  try {
    window.Pi.init({ version: '2.0', sandbox: true });
    window.__piReady = true;
    console.log('[Pi] SDK initialisé via fallback');
    return true;
  } catch (e) {
    console.error('[Pi] Erreur init:', e);
    return false;
  }
}

// Attend que le SDK soit prêt (max 5 secondes, vérifie toutes les 100ms)
const waitForPi = () => new Promise((resolve, reject) => {
  if (typeof window !== 'undefined' && window.__piReady) return resolve();
  let tries = 0;
  const check = setInterval(() => {
    tries++;
    if (typeof window !== 'undefined' && window.__piReady) {
      clearInterval(check);
      resolve();
    } else if (tries > 50) {
      clearInterval(check);
      reject(new Error('SDK Pi non prêt après 5 secondes'));
    }
  }, 100);
});

export const authenticatePi = async () => {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Environnement non-browser' };
  }
  if (!window.Pi) {
    return { success: false, error: 'SDK Pi absent. Ouvrez dans le Pi Browser.' };
  }

  // S'assurer que le SDK est initialisé
  if (!window.__piReady) {
    initPi();
    try {
      await waitForPi();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  try {
    const scopes = ['payments', 'username'];
    console.log('[Pi] Lancement authentification...');
    const auth = await window.Pi.authenticate(scopes, (payment) => {
      console.log('[Pi] Paiement en attente:', payment);
    });
    console.log('[Pi] Auth réussie:', auth);
    return { success: true, user: auth.user };
  } catch (err) {
    console.error('[Pi] Erreur authentification:', err);
    return { success: false, error: `Erreur SDK: ${err.message || JSON.stringify(err)}` };
  }
}

export const createPiPayment = async (amount, memo, metadata) => {
  if (typeof window === 'undefined' || !window.Pi) return null;

  try {
    const payment = await window.Pi.createPayment({
      amount: parseFloat(amount),
      memo: memo,
      metadata: metadata,
    }, {
      onReadyForServerApproval: (paymentId) => {
        console.log('[Pi] Paiement prêt pour approbation:', paymentId);
      },
      onReadyForServerCompletion: (paymentId, txid) => {
        console.log('[Pi] Paiement complété:', paymentId, txid);
      },
      onCancel: (paymentId) => {
        console.log('[Pi] Paiement annulé:', paymentId);
      },
      onError: (error, payment) => {
        console.error('[Pi] Erreur paiement:', error, payment);
      },
    });
    return payment;
  } catch (err) {
    console.error('[Pi] Erreur création paiement:', err);
    return null;
  }
}
