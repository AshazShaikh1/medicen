import { calculateExpiryStatus } from '@/lib/utils/expiry'

interface StatusBadgeProps {
  expiryDate: string
}

export default function StatusBadge({ expiryDate }: StatusBadgeProps) {
  const { status, label, colorScheme } = calculateExpiryStatus(expiryDate)

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorScheme.bg} ${colorScheme.text} ${colorScheme.border}`}
      title={label}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${colorScheme.dot}`} />
      <span className="capitalize">
        {status === 'expiring_soon'
          ? 'Expiring Soon'
          : status === 'active'
          ? 'Active'
          : 'Expired'}
      </span>
    </span>
  )
}
