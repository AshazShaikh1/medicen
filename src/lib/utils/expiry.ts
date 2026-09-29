export type ExpiryStatusType = 'active' | 'expiring_soon' | 'expired'

export interface ExpiryCalculation {
  status: ExpiryStatusType
  daysRemaining: number
  label: string
  colorScheme: {
    bg: string
    text: string
    border: string
    dot: string
  }
}

/**
 * Calculates date-accurate expiry status based on current date.
 * Expiry date is formatted as YYYY-MM-DD.
 */
export function calculateExpiryStatus(expiryDateStr: string): ExpiryCalculation {
  // Parse expiry date as midnight in local time
  const [year, month, day] = expiryDateStr.split('-').map(Number)
  const expiryDate = new Date(year, month - 1, day, 23, 59, 59)

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)

  // Difference in milliseconds converted to whole calendar days
  const diffTime = expiryDate.getTime() - today.getTime()
  const daysRemaining = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (daysRemaining < 0) {
    const daysAgo = Math.abs(daysRemaining)
    return {
      status: 'expired',
      daysRemaining,
      label: daysAgo === 1 ? 'Expired yesterday' : `Expired ${daysAgo} days ago`,
      colorScheme: {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
      },
    }
  }

  if (daysRemaining <= 30) {
    return {
      status: 'expiring_soon',
      daysRemaining,
      label:
        daysRemaining === 0
          ? 'Expires today'
          : daysRemaining === 1
          ? 'Expires tomorrow'
          : `Expires in ${daysRemaining} days`,
      colorScheme: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      },
    }
  }

  return {
    status: 'active',
    daysRemaining,
    label: `Expires in ${daysRemaining} days`,
    colorScheme: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    },
  }
}
