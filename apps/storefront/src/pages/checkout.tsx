import { useEffect, useState } from 'react'
import { getCart, subscribe, clearCart } from '../lib/store'
import {
  listProducts,
  placeOrderForCustomer,
} from '../lib/api'
import CheckoutSummary from '../components/molecules/CheckoutSummary'
import PageTemplate from '../components/templates/PageTemplate'
import {
  Box,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material'

type Line = { id: string; qty: number }

export default function CheckoutPage() {
  const [lines, setLines] = useState<Line[]>(getCart())
  const [products, setProducts] = useState<any[]>([])
  const [placing, setPlacing] = useState(false)
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null)
  const [purchasedLines, setPurchasedLines] = useState<Line[]>([])
  const [orderStatus, setOrderStatus] = useState<any>(null)

  // Get logged-in user
  const customerId = localStorage.getItem('customerId')

  useEffect(() => subscribe(setLines), [])
  useEffect(() => { listProducts().then(setProducts) }, [])

  // ✅ Real-time order status via SSE
  useEffect(() => {
    if (!placedOrderId) return
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    const eventSource = new EventSource(`${API_BASE}/orders/${placedOrderId}/stream`)

    console.log(`📡 Connected to live order stream for ${placedOrderId}`)

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('🟢 Order update:', data)
        setOrderStatus(data)
      } catch (err) {
        console.error('Error parsing SSE data:', err)
      }
    }

    eventSource.onerror = () => {
      console.log('ℹ️ SSE connection closed (normal after delivery)')
      eventSource.close()
    }

    return () => {
      console.log('🔌 Closing SSE connection')
      eventSource.close()
    }
  }, [placedOrderId])

  // ✅ Place order logic
  async function onPlace() {
    if (lines.length === 0) return
    if (!customerId) {
      alert('You must log in before placing an order.')
      window.location.hash = '#/login'
      return
    }

    setPlacing(true)
    try {
      console.log('✅ Creating order for customer:', customerId)

      const order = await placeOrderForCustomer(customerId, lines, products)
      console.log('🛒 Order saved:', order)

      setPurchasedLines(lines)
      setPlacedOrderId(order._id || order.orderId)
      clearCart()
      await listProducts().then(setProducts)
    } catch (err) {
      console.error('Error placing order:', err)
      alert('Something went wrong while placing your order.')
    } finally {
      setPlacing(false)
    }
  }

  // ✅ Stepper logic
  const steps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']
  const currentStep = orderStatus ? steps.indexOf(orderStatus.status) : -1

  return (
    <PageTemplate title="Checkout">
      {!placedOrderId && <CheckoutSummary lines={lines} products={products} />}

      {placedOrderId && purchasedLines.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <CheckoutSummary lines={purchasedLines} products={products} />

          {/* 🌟 Stepper with green active circles */}
          <Box sx={{ mt: 5, width: '100%', maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" align="center" gutterBottom>
              Order {placedOrderId} Progress
            </Typography>

            <Stepper
              activeStep={currentStep}
              alternativeLabel
              sx={{
                '& .MuiStepIcon-root': { color: '#ccc' },
                '& .MuiStepIcon-root.Mui-active': { color: '#2196f3' },
                '& .MuiStepIcon-root.Mui-completed': { color: 'green' },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              {orderStatus ? (
                <>
                  <Typography>
                    Status: <strong>{orderStatus.status}</strong>
                  </Typography>
                  {['SHIPPED', 'DELIVERED'].includes(orderStatus.status) && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Carrier: {orderStatus.carrier || 'AcmeShip'} <br />
                      ETA:{' '}
                      {orderStatus.eta
                        ? new Date(orderStatus.eta).toLocaleDateString()
                        : '—'}
                    </Typography>
                  )}
                </>
              ) : (
                <CircularProgress />
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* 🛒 Place Order Button */}
      {!placedOrderId && (
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onPlace}
            disabled={placing || lines.length === 0}
            size="large"
          >
            {placing ? 'Placing Order...' : 'Place Order'}
          </Button>
        </Box>
      )}
    </PageTemplate>
  )
}
