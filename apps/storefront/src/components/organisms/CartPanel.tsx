import CartList from '../molecules/CartList'

export default function CartPanel({ lines, products, onQty, onRemove }: any) {
  return (
    <aside aria-label="Cart panel">
      <h3>Your cart</h3>
      <CartList lines={lines} products={products} onQty={onQty} onRemove={onRemove} />
    </aside>
  )
}
