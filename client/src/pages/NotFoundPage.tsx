// @ts-nocheck
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center bg-brand-dark px-6">
      <motion.div 
        initial={{ y: 50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md"
      >
        <p className="text-9xl font-black text-brand-green/10 select-none">404</p>
        <h1 className="text-3xl font-black mt-4 text-white">Hole Not Found</h1>
        <p className="text-gray-400 mt-3 text-lg">Looks like this shot went out of bounds. The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/">
          <button className="mt-8 px-8 py-4 bg-brand-green text-black font-bold rounded-xl shadow-lg shadow-brand-green/20 hover:scale-105 active:scale-95 transition-all text-lg">
            Back to Fairway →
          </button>
        </Link>
      </motion.div>
    </div>
  )
}
