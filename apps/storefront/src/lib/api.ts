// Minimal in-memory API + mock behavior used by the Storefront app
import mockCatalog from '../../public/mock-catalog.json'

type Product = {
	id: string
	title: string
	price: number
	image: string
	tags: string[]
	stockQty: number
	description?: string
}

type Order = {
	orderId: string
	status: 'Placed' | 'Packed' | 'Shipped' | 'Delivered'
	carrier?: string
	eta?: string
}

let orders: Record<string, Order> = {}

export function listProducts(): Promise<Product[]> {
	// return a small delay to emulate network
	return new Promise((resolve) => setTimeout(() => resolve(mockCatalog as Product[]), 80))
}

export function getProduct(id: string): Promise<Product | null> {
	return listProducts().then((items) => items.find((p) => p.id === id) ?? null)
}

function makeOrderId() {
	// 10 chars alphanumeric uppercase
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	let id = ''
	for (let i = 0; i < 10; i++) id += chars[Math.floor(Math.random() * chars.length)]
	return id
}

export function placeOrder(_cart: { id: string; qty: number }[]): Promise<{ orderId: string }> {
	const orderId = makeOrderId()
	const placed: Order = { orderId, status: 'Placed' }
	orders[orderId] = placed

	_cart.forEach(({ id, qty }) => {
		const product = (mockCatalog as any[]).find((p) => p.id === id)
		if (product) {
			product.stockQty = Math.max(0, product.stockQty - qty)
		}
	})
	setTimeout(() => (orders[orderId].status = 'Packed'), 5000)

	setTimeout(() => {
		orders[orderId].status = 'Shipped'
		orders[orderId].carrier = 'AcmeShip'
		const eta = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
		orders[orderId].eta = eta.toISOString().slice(0, 10)
	}, 10000)

	setTimeout(() => (orders[orderId].status = 'Delivered'), 15000)

	return Promise.resolve({ orderId })
}

export function getOrderStatus(orderId: string): Promise<Order | null> {
  return new Promise((resolve) =>
    setTimeout(() => {
      const order = orders[orderId]
      resolve(order ? { ...order } : null)
    }, 120)
  )
}


export type { Product }
