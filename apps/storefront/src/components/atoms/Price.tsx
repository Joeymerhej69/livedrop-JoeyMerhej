import { formatCurrency } from '../../lib/format'

export default function Price({ value }: { value: number }) {
  return <span>{formatCurrency(value)}</span>
}
