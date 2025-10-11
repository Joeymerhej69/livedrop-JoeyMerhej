import { formatCurrency } from '../../lib/format'
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material'

interface ProductCardProps {
  p: {
    id: string
    title: string
    image: string
    price: number
    stockQty: number
  }
  onAdd?: (id: string) => void
}

export default function ProductCard({ p, onAdd }: ProductCardProps) {
  const outOfStock = p.stockQty <= 0

  return (
    <Card sx={{ maxWidth: 200, m: 1 }}>
      <a href={`#/p/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardMedia
          component="img"
          height="140"
          image={p.image}
          alt={p.title}
          loading="lazy"
        />
      </a>
      <CardContent>
        <Typography variant="subtitle1" component="div">
          {p.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatCurrency(p.price)}
        </Typography>
        <Box mt={1}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={outOfStock}
            onClick={() => onAdd?.(p.id)}
          >
            {outOfStock ? 'Out of Stock' : 'Add to cart'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
