// @ts-nocheck
import { format } from 'date-fns'

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'd MMMM yyyy')
}

export const getMonthName = (month: number): string => {
  return new Date(2026, month - 1, 1).toLocaleString('default', { month: 'long' })
}

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    paid: 'bg-green-500/20 text-green-400 border-green-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    inactive: 'bg-red-500/20 text-red-400 border-red-500/30',
    past_due: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    simulated: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    published: 'bg-green-500/20 text-green-400 border-green-500/30',
  }
  return map[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}

export const getGreeting = (firstName: string): string => {
  const h = new Date().getHours()
  const time = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
  return `Good ${time}, ${firstName} 👋`
}

export const getDaysUntilEnd = (endDate: string): number => {
  const diff = new Date(endDate).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
