import ProductCard from './ProductCard'

export default { title: 'Atoms/ProductCard', component: ProductCard }

const sample = {
  id: 'SKU001',
  title: 'Blue T-Shirt',
  price: 19.99,
  image: '/vite.svg',
  stockQty: 5, 
}

export const Default = () => <ProductCard p={sample} onAdd={() => {}} />

export const OutOfStock = () => (
  <ProductCard p={{ ...sample, stockQty: 0 }} onAdd={() => {}} />
)
