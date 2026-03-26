// @ts-nocheck
import { ReactNode } from 'react'
import { motion } from 'framer-motion'
interface Props {
  icon: ReactNode; title: string; value: string | number
  subtitle?: string; color?: string; delay?: number
}
export default function StatCard({ icon, title, value, subtitle, color = 'text-brand-green', delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-brand-card border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/5 rounded-xl">{icon}</div>
      </div>
      <div className={`text-3xl font-black ${color} mb-1`}>{value}</div>
      <div className="text-white font-medium text-sm">{title}</div>
      {subtitle && <div className="text-gray-500 text-xs mt-1">{subtitle}</div>}
    </motion.div>
  )
}
