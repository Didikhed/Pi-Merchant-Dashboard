/**
 * Utilitaire pour l'intégration du SDK Pi Network
 */

export const initPi = () => {
  if (typeof window !== 'undefined' && window.Pi) {
    window.Pi.init({ version: '2.0', sandbox: true }); // sandbox: true pour le Testnet
  }
}

export const authenticatePi = async () => {
  if (typeof window === 'undefined' || !window.Pi) {
    return { success: false, error: 'SDK Pi non trouvé (Ouvrez dans Pi Browser)' };
  }

  try {
    const scopes = ['payments', 'username'];
    const auth = await window.Pi.authenticate(scopes, (payment) => {
      console.log('Payment updated:', payment);
    });
    return { success: true, user: auth.user };
  } catch (err) {
    console.error('Erreur authentification Pi:', err);
    return { success: false, error: err.message };
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
        console.log('Payment ready for server approval:', paymentId);
        // Ici on appellerait normalement notre backend pour approuver
      },
      onReadyForServerCompletion: (paymentId, txid) => {
        console.log('Payment ready for server completion:', paymentId, txid);
      },
      onCancel: (paymentId) => {
        console.log('Payment cancelled:', paymentId);
      },
      onError: (error, payment) => {
        console.error('Payment error:', error, payment);
      },
    });
    return payment;
  } catch (err) {
    console.error('Erreur paiement Pi:', err);
    return null;
  }
}
