export function formatCurrency(v: number, currency = 'USD') {
	return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(v)
}

export function last4(id: string) {
	if (!id) return ''
	return id.slice(-4)
}
