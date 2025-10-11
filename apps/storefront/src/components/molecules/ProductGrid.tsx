import ProductCard from '../atoms/ProductCard'

export default function ProductGrid({ items, onAdd }: { items: any[]; onAdd?: (id: string) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
      {items.map((p) => (
        <ProductCard key={p.id} p={p} onAdd={onAdd} />
      ))}
    </div>
  )
}
