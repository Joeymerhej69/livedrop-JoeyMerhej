import QuantityControl from '../atoms/QuantityControl'
import Price from '../atoms/Price'

export default function CartItem({ item, product, onQty, onRemove }: any) {
  return (
    <li>
      <div>{product.title}</div>
      <div><Price value={product.price} /></div>
      <QuantityControl qty={item.qty} onChange={(n) => onQty(item.id, n)} />
      <button onClick={() => onRemove(item.id)}>Remove</button>
    </li>
  )
}
