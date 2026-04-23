import { 
  rpc, 
  Contract, 
  scValToNative, 
  nativeToScVal,
  xdr
} from '@stellar/stellar-sdk'


// Configuration pour le Testnet Pi
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.testnet.minepi.com' 
const NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || 'Pi Testnet'
const CONTRACT_ID = process.env.NEXT_PUBLIC_STELLAR_CONTRACT_ID || 'CCDQOQKQA5OGBWD6UIAUPZRIGXJ3MC4GQ5BX3R4DNXKP3M6EYBVYKUE5'


const server = new rpc.Server(RPC_URL)

/**
 * Lit les services d'un marchand depuis la blockchain
 */
export async function getMerchantServices(merchantAddress) {
  try {
    const contract = new Contract(CONTRACT_ID)
    const tx = contract.call('get_merchant_services', nativeToScVal(merchantAddress, { type: 'address' }))
    
    // On simule pour lire les données sans payer de frais
    const result = await server.simulateTransaction(tx)
    
    if (result.error) {
      console.error('Simulation error:', result.error)
      return []
    }

    if (result.results && result.results[0]) {
      const services = scValToNative(result.results[0].xdr)
      return services // Tableau d'IDs (u64)
    }

    return [] 
  } catch (err) {
    console.error('Erreur getMerchantServices:', err)
    return []
  }
}


/**
 * Lit les abonnés d'un service spécifique (nécessite l'adresse du marchand)
 */
export async function getMerchantSubs(merchantAddress, serviceId) {
  try {
    const contract = new Contract(CONTRACT_ID)
    const tx = contract.call('get_merchant_subs', 
      nativeToScVal(merchantAddress, { type: 'address' }),
      nativeToScVal(serviceId, { type: 'u64' })
    )
    
    const result = await server.simulateTransaction(tx)
    
    if (result.error) {
      console.error(`Erreur simulation pour service ${serviceId}:`, result.error)
      return []
    }

    if (result.results && result.results[0]) {
      return scValToNative(result.results[0].xdr)
    }

    return []
  } catch (err) {
    console.error(`Erreur getMerchantSubs pour service ${serviceId}:`, err)
    return []
  }
}

/**
 * Lance le prélèvement des abonnements
 */
export async function processPayments(merchantAddress) {
  // Cette fonction nécessite une signature du portefeuille (Freighter ou Pi Wallet)
  // Mais nous utilisons GitHub Actions pour l'automatisation.
  // Cette fonction peut servir de "manuel trigger" via le dashboard.
  alert('Signature requise pour lancer le prélèvement manuel...')
}


/**
 * Récupère les derniers événements du contrat
 */
export async function getContractEvents() {
  try {
    const latestLedger = await server.getLatestLedger()
    const startLedger = latestLedger.sequence - 100

    const response = await server.getEvents({
      startLedger: startLedger,
      filters: [
        {
          type: 'contract',
          contractIds: [CONTRACT_ID],
        },
      ],
    })

    return response.events.map(e => ({
      id: e.id,
      ledger: e.ledger,
      timestamp: e.ledgerClosedAt,
      topic: scValToNative(e.topic[0]),
      data: scValToNative(e.value),
    }))
  } catch (err) {
    console.error('Erreur getContractEvents:', err)
    return []
  }
}

/**
 * Permet à un utilisateur de s'abonner à un service
 * Note: Cette fonction prépare la transaction. Elle devra être signée par le Pi Wallet.
 */
export async function subscribeToService(subscriberAddress, serviceId, amount) {
  try {
    const contract = new Contract(CONTRACT_ID)
    // On appelle la fonction 'subscribe' du contrat
    const tx = contract.call('subscribe', 
      nativeToScVal(subscriberAddress, { type: 'address' }),
      nativeToScVal(serviceId, { type: 'u64' })
    )

    // En production avec Pi Wallet, nous utiliserions Pi.createPayment()
    // ou une intégration avec le SDK Soroban pour signer la transaction.
    console.log('Préparation de l\'abonnement pour:', serviceId)
    return { success: true, tx }
  } catch (err) {
    console.error('Erreur subscribeToService:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Crée un nouveau service sur la blockchain
 */
export async function createService(merchantAddress, name, price, periodSecs) {
  try {
    const contract = new Contract(CONTRACT_ID)
    // Conversion du prix en stroops (unité de base)
    const priceStroops = BigInt(parseFloat(price) * 10000000)
    
    const tx = contract.call('create_service', 
      nativeToScVal(merchantAddress, { type: 'address' }),
      nativeToScVal(priceStroops, { type: 'i128' }),
      nativeToScVal(name, { type: 'string' }),
      nativeToScVal(periodSecs, { type: 'u64' })
    )

    console.log('Création du service sur la blockchain:', name)
    // Note: En production, cette TX doit être signée par le marchand
    return { success: true, tx }
  } catch (err) {
    console.error('Erreur createService:', err)
    return { success: false, error: err.message }
  }
}
