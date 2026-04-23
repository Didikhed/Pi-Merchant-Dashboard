'use client'
import { useState, useEffect } from 'react'
import { getMerchantServices } from '@/lib/stellar'

export function useStellar(merchantAddress) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refreshData = async () => {
    if (!merchantAddress) return
    setLoading(true)
    try {
      const data = await getMerchantServices(merchantAddress)
      setServices(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [merchantAddress])

  return { services, loading, error, refreshData }
}
