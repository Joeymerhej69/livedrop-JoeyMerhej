import { useEffect, useState } from 'react'
import CatalogPage from './pages/catalog'
import ProductPage from './pages/product'
import CartPage from './pages/cart'
import CheckoutPage from './pages/checkout'
import OrderStatusPage from './pages/order-status'
import SupportPanel from './pages/SupportPanel'
import Header from './components/organisms/Header' 
function App() {
  const [route, setRoute] = useState<{ name: string; params?: Record<string, string> }>({ name: 'catalog' })
  const [showSupport, setShowSupport] = useState(false)

  useEffect(() => {
    function onHash() {
      const hash = location.hash.replace('#', '') || '/'
      const parts = hash.split('/')
      if (parts[1] === 'p' && parts[2]) setRoute({ name: 'product', params: { id: parts[2] } })
      else if (parts[1] === 'cart') setRoute({ name: 'cart' })
      else if (parts[1] === 'checkout') setRoute({ name: 'checkout' })
      else if (parts[1] === 'order' && parts[2]) setRoute({ name: 'order', params: { id: parts[2] } })
      else setRoute({ name: 'catalog' })
    }
    window.addEventListener('hashchange', onHash)
    onHash()
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <div className="app">
      {/* Use MUI Header here */}
      <Header title="Storefront" />

      <main>
        {route.name === 'catalog' && <CatalogPage />}
        {route.name === 'product' && route.params && <ProductPage id={route.params.id} />}
        {route.name === 'cart' && <CartPage />}
        {route.name === 'checkout' && <CheckoutPage />}
        {route.name === 'order' && route.params && <OrderStatusPage id={route.params.id} />}
      </main>

      {/* Floating Ask Support button */}
      <div>
        <button
          aria-haspopup="dialog"
          aria-controls="support-panel"
          onClick={() => setShowSupport(true)}
          style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 60 }}
        >
          Ask Support
        </button>
      </div>

      {showSupport && <SupportPanel onClose={() => setShowSupport(false)} />}
    </div>
  )
}

export default App
