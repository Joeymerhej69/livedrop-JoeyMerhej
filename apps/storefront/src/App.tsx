import { useEffect, useState } from 'react'
import CatalogPage from './pages/catalog'
import ProductPage from './pages/product'
import CartPage from './pages/cart'
import CheckoutPage from './pages/checkout'
import OrderStatusPage from './pages/order-status'
import SupportPanel from './pages/SupportPanel'
import Header from './components/organisms/Header'
import LoginPage from './pages/login'
import AdminDashboardPage from './pages/admin-dashboard' // ✅ NEW import

function App() {
  const [route, setRoute] = useState<{ name: string; params?: Record<string, string> }>({
    name: 'login',
  })
  const [showSupport, setShowSupport] = useState(false)

  // ✅ Handle navigation via URL hash
  useEffect(() => {
    function onHash() {
      const hash = location.hash.replace('#', '') || '/'
      const parts = hash.split('/')

      if (parts[1] === 'p' && parts[2]) setRoute({ name: 'product', params: { id: parts[2] } })
      else if (parts[1] === 'cart') setRoute({ name: 'cart' })
      else if (parts[1] === 'checkout') setRoute({ name: 'checkout' })
      else if (parts[1] === 'order' && parts[2]) setRoute({ name: 'order', params: { id: parts[2] } })
      else if (parts[1] === 'login') setRoute({ name: 'login' })
      else if (parts[1] === 'admin') setRoute({ name: 'admin' }) // ✅ admin route
      else setRoute({ name: 'catalog' })
    }

    window.addEventListener('hashchange', onHash)
    onHash()
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // ✅ Redirect to login if not logged in (except for admin)
  useEffect(() => {
    const email = localStorage.getItem('customerEmail')
    const isAdminPage = route.name === 'admin'
    const isLoginPage = route.name === 'login'

    // if not logged in, block store pages but allow admin
    if (!email && !isLoginPage && !isAdminPage) {
      window.location.hash = '#/login'
    }
  }, [route.name])

  return (
    <div className="app">
      {/* Show header everywhere except login */}
      {route.name !== 'login' && <Header title="Storefront" />}

      <main style={{ paddingBottom: 60 }}>
        {route.name === 'login' && <LoginPage />}
        {route.name === 'catalog' && <CatalogPage />}
        {route.name === 'product' && route.params && <ProductPage id={route.params.id} />}
        {route.name === 'cart' && <CartPage />}
        {route.name === 'checkout' && <CheckoutPage />}
        {route.name === 'order' && route.params && <OrderStatusPage id={route.params.id} />}
        {route.name === 'admin' && <AdminDashboardPage />} {/* ✅ admin route */}
      </main>

      {/* Floating Ask Support button */}
      {route.name !== 'login' && (
        <>
          <button
            aria-haspopup="dialog"
            aria-controls="support-panel"
            onClick={() => setShowSupport(true)}
            style={{
              position: 'fixed',
              right: 18,
              bottom: 18,
              zIndex: 60,
              background: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              padding: '10px 16px',
              cursor: 'pointer',
            }}
          >
            Ask Support
          </button>

          {showSupport && <SupportPanel onClose={() => setShowSupport(false)} />}
        </>
      )}
    </div>
  )
}

export default App
