import { useEffect, useState } from 'react'
import { getProduct, listProducts } from '../lib/api'
import { addToCart } from '../lib/store'
import { formatCurrency } from '../lib/format'
import RelatedItems from '../components/organisms/RelatedItems'
import PageTemplate from '../components/templates/PageTemplate'

import { Box, Typography, Button, Chip, CircularProgress } from '@mui/material'

export default function ProductPage({ id }: { id: string }) {
  const [p, setP] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])

  // Load main product
  useEffect(() => {
    getProduct(id).then(setP)
  }, [id])

  // Load related products once main product is loaded
  useEffect(() => {
    if (!p) return

    listProducts().then((all) => {
      const found = all
        .filter((x) => x.id !== p.id)
        .filter((x) => x.tags?.some((t) => (p.tags || []).includes(t)))
        .slice(0, 3)
      setRelated(found)
    })
  }, [p])

  if (!p)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    )

  return (
    <PageTemplate title={p.title}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
        <Box
          component="img"
          src={p.image}
          alt={p.title}
          loading="lazy"
          sx={{ width: '100%', borderRadius: 2 }}
        />

        <Typography variant="h5" fontWeight="bold">
          {p.title}
        </Typography>

        <Typography variant="h6" color="primary">
          {formatCurrency(p.price)}
        </Typography>

        <Typography variant="body1">{p.description}</Typography>

        <Box>
          {p.stockQty > 0 ? (
            <Chip label={`Stock: ${p.stockQty} available`} color="success" />
          ) : (
            <Chip label="Out of stock" color="error" />
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => addToCart(p.id)}
          disabled={p.stockQty === 0}
        >
          Add to Cart
        </Button>

        {related.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Related
            </Typography>
            <RelatedItems items={related} />
          </Box>
        )}
      </Box>
    </PageTemplate>
  )
}
