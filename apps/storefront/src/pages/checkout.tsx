import { useEffect, useState } from 'react'
import { getCart, subscribe, clearCart } from '../lib/store'
import { listProducts, placeOrder, getOrderStatus } from '../lib/api'
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

  useEffect(() => subscribe(setLines), [])

  useEffect(() => {
    listProducts().then(setProducts)
  }, [])

  useEffect(() => {
    if (!placedOrderId) return
    const interval = setInterval(async () => {
      const status = await getOrderStatus(placedOrderId)
      setOrderStatus(status)
    }, 1000)
    return () => clearInterval(interval)
  }, [placedOrderId])

  async function onPlace() {
    if (lines.length === 0) return
    setPlacing(true)
    setPurchasedLines(lines)
    const res = await placeOrder(lines)
    setPlacedOrderId(res.orderId)
    clearCart()
    await listProducts().then(setProducts)
    setPlacing(false)
  }

  const steps = ['Placed', 'Packed', 'Shipped', 'Delivered']
  const currentStep = orderStatus ? steps.indexOf(orderStatus.status) + 1 : 0

  return (
    <PageTemplate title="Checkout">
      {!placedOrderId && <CheckoutSummary lines={lines} products={products} />}

      {placedOrderId && purchasedLines.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <CheckoutSummary lines={purchasedLines} products={products} />

          {/* 🌟 MUI Stepper */}
          <Box sx={{ mt: 5, width: '100%', maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" align="center" gutterBottom>
              Order {placedOrderId} Progress
            </Typography>

            <Stepper activeStep={currentStep - 1} alternativeLabel>
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
                  {['Shipped', 'Delivered'].includes(orderStatus.status) && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Carrier: {orderStatus.carrier} <br />
                      ETA: {orderStatus.eta}
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

      {!placedOrderId && (
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onPlace}
            disabled={placing || lines.length === 0}
            size="large"
          >
            {placing ? 'Placing...' : 'Place Order'}
          </Button>
        </Box>
      )}
    </PageTemplate>
  )
}
