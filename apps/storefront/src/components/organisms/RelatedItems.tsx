// no explicit React import required with JSX runtime

export default function RelatedItems({ items }: { items: any[] }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {items.map((r) => (
        <a key={r.id} href={`#/p/${r.id}`}>
          <img src={r.image} alt={r.title} style={{ width: 80 }} />
          <div>{r.title}</div>
        </a>
      ))}
    </div>
  )
}
