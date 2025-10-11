import { useEffect, useState } from 'react'
import { getOrderStatus } from '../lib/api'
import { last4 } from '../lib/format'
import PageTemplate from '../components/templates/PageTemplate'

export default function OrderStatusPage({ id }: { id: string }) {
	const [s, setS] = useState<any>(null)

	useEffect(() => {
		let mounted = true
		getOrderStatus(id).then((st) => mounted && setS(st))
		const t = setInterval(() => getOrderStatus(id).then((st) => mounted && setS(st)), 2000)
		return () => {
			mounted = false
			clearInterval(t)
		}
	}, [id])

	if (!s) return <div>Order {last4(id)} not found (still creating?)</div>

	return (
		<PageTemplate title={`Order ${last4(id)}`}>
			<div>Status: {s.status}</div>
			{s.status === 'Shipped' || s.status === 'Delivered' ? (
				<div>
					Carrier: {s.carrier}
					<br />
					ETA: {s.eta}
				</div>
			) : null}
		</PageTemplate>
	)
}
