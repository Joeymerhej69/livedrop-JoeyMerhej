// Simple cart store: in-memory with localStorage rehydrate
type Line = { id: string; qty: number }

const STORAGE_KEY = 'storefront_cart_v1'

let state: Line[] = []
let listeners: ((s: Line[]) => void)[] = []

function save() {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
	} catch (e) {
		// ignore
	}
}

function load() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (raw) state = JSON.parse(raw)
	} catch (e) {
		state = []
	}
}

load()

function notify() {
	listeners.forEach((l) => l(state))
}

export function subscribe(fn: (s: Line[]) => void) {
	listeners.push(fn)
	fn(state)
	return () => {
		listeners = listeners.filter((l) => l !== fn)
	}
}

export function addToCart(id: string, qty = 1) {
	const existing = state.find((l) => l.id === id)
	if (existing) existing.qty += qty
	else state.push({ id, qty })
	save()
	notify()
}

export function updateQty(id: string, qty: number) {
	state = state.map((l) => (l.id === id ? { ...l, qty } : l)).filter((l) => l.qty > 0)
	save()
	notify()
}

export function removeFromCart(id: string) {
	state = state.filter((l) => l.id !== id)
	save()
	notify()
}

export function clearCart() {
	state = []
	save()
	notify()
}

export function getCart() {
	return state.slice()
}

export type { Line }
