// @ts-nocheck
import { ElementType } from 'react'
import { motion } from 'framer-motion'

interface Props {
  icon: ElementType;
  title?: string;
  label?: string; // Adding label to support both title and label usages
  value: string | number;
  subtitle?: string;
  suffix?: string; // Adding suffix support
  color?: string;
  delay?: number;
}

export default function StatCard({ icon: Icon, title, label, value, subtitle, suffix, color = 'text-brand-green', delay = 0 }: Props) {
  const displayTitle = title || label;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-brand-card border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all flex flex-col h-full justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/5 rounded-xl">
          <Icon className={`w-6 h-6 ${color === 'green' ? 'text-brand-green' : color === 'accent' ? 'text-brand-accent' : color === 'gold' ? 'text-brand-gold' : color === 'red' ? 'text-red-400' : 'text-brand-green'}`} />
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-white">{value}</span>
          {suffix && <span className="text-sm font-bold text-gray-400">{suffix}</span>}
        </div>
        <div className="text-sm font-medium text-gray-400 mt-1">{displayTitle}</div>
        {subtitle && <div className="text-xs text-gray-500 mt-2">{subtitle}</div>}
      </div>
    </motion.div>
  )
}
