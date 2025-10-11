import CartItem from './CartItem'

export default function CartList({ lines, products, onQty, onRemove }: any) {
  return (
    <ul>
      {lines.map((ln: any) => (
        <CartItem key={ln.id} item={ln} product={products.find((p: any) => p.id === ln.id) || { title: ln.id, price: 0 }} onQty={onQty} onRemove={onRemove} />
      ))}
    </ul>
  )
}
