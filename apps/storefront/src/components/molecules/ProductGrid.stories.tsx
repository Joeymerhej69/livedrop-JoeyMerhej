import ProductGrid from './ProductGrid'

export default { title: 'Molecules/ProductGrid', component: ProductGrid }

const items = Array.from({ length: 6 }).map((_, i) => ({ id: `SKU0${i+1}`, title: `Item ${i+1}`, price: 9.99 + i, image: '/vite.svg' }))

export const Default = () => <ProductGrid items={items} onAdd={() => {}} />
