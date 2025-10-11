import Price from '../atoms/Price'

type Line = { id: string; qty: number }
type Product = { id: string; title: string; price: number }

export default function CheckoutSummary({
  lines,
  products,
}: {
  lines: Line[]
  products: Product[]
}) {
  const total = lines.reduce(
    (s, l) => s + (products.find((p) => p.id === l.id)?.price || 0) * l.qty,
    0
  )

  return (
    <div>
      <h3>Summary</h3>
      <ul>
        {lines.map((l) => {
          const p = products.find((p) => p.id === l.id)
          if (!p) return null
          return (
            <li key={l.id}>
              {p.title} x {l.qty} = <Price value={p.price * l.qty} />
            </li>
          )
        })}
      </ul>
      <div>Total: <Price value={total} /></div>
    </div>
  )
}
