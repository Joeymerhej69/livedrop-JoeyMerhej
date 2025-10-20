import { useEffect, useState } from 'react'
import { last4 } from '../lib/format'
import PageTemplate from '../components/templates/PageTemplate'

export default function OrderStatusPage({ id }: { id: string }) {
  const [status, setStatus] = useState<string | null>(null)
  const [carrier, setCarrier] = useState<string | null>(null)
  const [eta, setEta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
    const eventSource = new EventSource(`${API_BASE}/orders/${id}/stream`)

    console.log(`🔌 Connected to SSE stream for order ${id}`)

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log('📦 Order update:', data)

      setStatus(data.status || 'Unknown')
      if (data.carrier) setCarrier(data.carrier)
      if (data.eta) setEta(data.eta)
    }

    eventSource.onerror = (err) => {
      console.error('❌ SSE connection error:', err)
      setError('Connection lost or order not found.')
      eventSource.close()
    }

    return () => {
      console.log(`🛑 Closing SSE for order ${id}`)
      eventSource.close()
    }
  }, [id])

  if (error) {
    return (
      <PageTemplate title={`Order ${last4(id)}`}>
        <div style={{ color: 'red' }}>{error}</div>
      </PageTemplate>
    )
  }

  if (!status) {
    return (
      <PageTemplate title={`Order ${last4(id)}`}>
        <div>Loading order status...</div>
      </PageTemplate>
    )
  }

  return (
    <PageTemplate title={`Order ${last4(id)}`}>
      <div style={{ fontSize: '1.2rem', marginTop: 20 }}>
        <strong>Status:</strong> {status}
      </div>

      {(status === 'SHIPPED' || status === 'DELIVERED') && (
        <div style={{ marginTop: 10 }}>
          <strong>Carrier:</strong> {carrier || 'AcmeShip'}
          <br />
          <strong>ETA:</strong> {eta || '—'}
        </div>
      )}

      {status === 'DELIVERED' && (
        <div style={{ marginTop: 20, color: 'green', fontWeight: 600 }}>
          ✅ Your order has been delivered!
        </div>
      )}
    </PageTemplate>
  )
}
