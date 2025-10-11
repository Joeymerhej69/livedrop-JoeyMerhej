import { useEffect, useState } from 'react'
import { getCart, subscribe } from '../../lib/store'
import { AppBar, Toolbar, Typography, Box } from '@mui/material'
import LinkButton from '../atoms/LinkButton'

interface HeaderProps {
  title?: string
}

export default function Header({ title }: HeaderProps) {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const unsubscribe = subscribe((cart) => {
      const total = cart.reduce((sum, line) => sum + line.qty, 0)
      setCartCount(total)
    })

    const initialTotal = getCart().reduce((sum, line) => sum + line.qty, 0)
    setCartCount(initialTotal)

    return unsubscribe
  }, [])

  const showButtons = !title || title === 'Storefront'

  return (
    <AppBar position="static" color="default" sx={{ borderBottom: '1px solid #ccc' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">{title || 'Storefront'}</Typography>

        {showButtons && (
          <Box>
            <LinkButton href="#/" color="primary" variant="contained">
              Catalog
            </LinkButton>

            <LinkButton href="#/cart" color="success" variant="contained" badgeContent={cartCount}>
              Cart
            </LinkButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}
