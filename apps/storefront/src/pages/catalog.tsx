import { useEffect, useState } from 'react'
import { listProducts } from '../lib/api'
import { addToCart } from '../lib/store'
import ProductGrid from '../components/molecules/ProductGrid'
import PageTemplate from '../components/templates/PageTemplate'
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material'

export default function CatalogPage() {
  const [items, setItems] = useState<any[]>([])
  const [q, setQ] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null)
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ✅ Fetch all products from backend
  useEffect(() => {
    listProducts()
      .then(setItems)
      .catch((err) => {
        console.error('Error fetching products:', err)
        setError('Failed to load products. Please try again later.')
      })
      .finally(() => setLoading(false))
  }, [])

  // ✅ Logout function
  function handleLogout() {
    localStorage.removeItem('customerId')
    localStorage.removeItem('customerEmail')
    window.location.hash = '#/login'
  }

  // ✅ Show loader or error message
  if (loading) {
    return (
      <PageTemplate title="🛍️ Product Catalog">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      </PageTemplate>
    )
  }

  if (error) {
    return (
      <PageTemplate title="🛍️ Product Catalog">
        <Typography color="error" textAlign="center" mt={4}>
          {error}
        </Typography>
      </PageTemplate>
    )
  }

  // ✅ Filtering
  let filtered = items.filter((it) => {
    if (q) {
      const tokens = q.toLowerCase().split(/\s+/).filter(Boolean)
      const hay = (it.title + ' ' + (it.tags || []).join(' ')).toLowerCase()
      if (!tokens.every((t: string) => hay.includes(t))) return false
    }
    if (tagFilter && !(it.tags || []).includes(tagFilter)) return false
    return true
  })

  // ✅ Sorting
  if (sortOrder === 'asc') filtered.sort((a, b) => a.price - b.price)
  else if (sortOrder === 'desc') filtered.sort((a, b) => b.price - a.price)

  const allTags = [...new Set(items.flatMap((it) => it.tags || []))]

  return (
    <PageTemplate title="🛍️ Product Catalog">
      {/* 🧭 Top Bar with Logout Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Welcome back 👋
        </Typography>

        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      <Box
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 1,
          borderRadius: 3,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {/* 🔍 Search Bar */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Search for products..."
            variant="outlined"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && (
            <Button variant="outlined" color="error" onClick={() => setQ('')}>
              Clear
            </Button>
          )}
        </Box>

        {/* ⚙️ Sorting & Filtering */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Sort buttons */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Sort by price:
            </Typography>
            <Button
              variant={sortOrder === 'asc' ? 'contained' : 'outlined'}
              onClick={() => setSortOrder('asc')}
            >
              Low → High
            </Button>
            <Button
              variant={sortOrder === 'desc' ? 'contained' : 'outlined'}
              onClick={() => setSortOrder('desc')}
            >
              High → Low
            </Button>
            <Button variant="outlined" onClick={() => setSortOrder(null)}>
              Clear
            </Button>
          </Box>

          {/* Tag filter */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Filter by tag:
            </Typography>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Tag</InputLabel>
              <Select
                value={tagFilter || ''}
                onChange={(e) => setTagFilter(e.target.value || null)}
                label="Tag"
              >
                <MenuItem value="">All</MenuItem>
                {allTags.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* 🧱 Product Grid */}
        <ProductGrid items={filtered} onAdd={(id) => addToCart(id)} />
      </Box>
    </PageTemplate>
  )
}
