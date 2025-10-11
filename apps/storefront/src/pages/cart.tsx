import { useEffect, useState } from 'react'
import { subscribe, getCart, updateQty, removeFromCart } from '../lib/store'
import { listProducts } from '../lib/api'
import CartList from '../components/molecules/CartList'
import CheckoutSummary from '../components/molecules/CheckoutSummary'
import PageTemplate from '../components/templates/PageTemplate'

import { Box, Button } from '@mui/material'

export default function CartPage() {
  const [lines, setLines] = useState(getCart())
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => subscribe(setLines), [])
  useEffect(() => {
    listProducts().then(setProducts)
  }, [])

  return (
    <PageTemplate title="Cart">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <CartList
          lines={lines}
          products={products}
          onQty={updateQty}
          onRemove={removeFromCart}
        />

        <CheckoutSummary lines={lines} products={products} />

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            href="#/checkout"
            disabled={lines.length === 0}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Box>
    </PageTemplate>
  )
}
