// @ts-nocheck
import { motion } from 'framer-motion'
interface Props { number: number; index: number; size?: 'sm' | 'md' | 'lg' }
export default function LotteryBall({ number, index, size = 'md' }: Props) {
  const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-12 h-12 text-base', lg: 'w-16 h-16 text-xl' }
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
      className={`${sizes[size]} rounded-full flex items-center justify-center font-black text-white shadow-lg`}
      style={{ background: 'linear-gradient(135deg, #00C896, #6C63FF)' }}
    >
      {number}
    </motion.div>
  )
}
