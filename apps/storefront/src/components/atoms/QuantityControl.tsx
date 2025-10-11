export default function QuantityControl({ qty, onChange }: { qty: number; onChange: (n: number) => void }) {
  return (
    <div>
      <button onClick={() => onChange(qty - 1)} aria-label="decrease">-</button>
      <span>{qty}</span>
      <button onClick={() => onChange(qty + 1)} aria-label="increase">+</button>
    </div>
  )
}
