import { 
  RpcClient, 
  Contract, 
  scValToNative, 
  nativeToScVal 
} from '@stellar/stellar-sdk'

// Configuration pour le Testnet Pi
const RPC_URL = 'https://rpc.testnet.minepi.com' 
const NETWORK_PASSPHRASE = 'Pi Testnet'
const CONTRACT_ID = 'CCDQOQKQA5OGBWD6UIAUPZRIGXJ3MC4GQ5BX3R4DNXKP3M6EYBVYKUE5'

const server = new RpcClient(RPC_URL)

/**
 * Lit les services d'un marchand depuis la blockchain
 */
export async function getMerchantServices(merchantAddress) {
  try {
    const contract = new Contract(CONTRACT_ID)
    const tx = contract.call('get_merchant_services', nativeToScVal(merchantAddress, { type: 'address' }))
    
    // Simulation du résultat Soroban (pour le moment)
    // En production : const result = await server.simulateTransaction(tx)
    console.log('Appel contrat:', tx)
    return [] 
  } catch (err) {
    console.error('Erreur getMerchantServices:', err)
    return []
  }
}

/**
 * Lance le prélèvement des abonnements
 */
export async function processPayments(merchantAddress) {
  // Cette fonction nécessite une signature du portefeuille (Freighter ou Pi Wallet)
  alert('Signature requise pour lancer le prélèvement...')
}
