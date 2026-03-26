// @ts-nocheck
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Loader2, Trophy } from 'lucide-react'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/authStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      const res = await authApi.login(data)
      login(res.user, res.token, res.subscription)
      toast.success(`Welcome back, ${res.user.firstName}!`)
      navigate(res.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-brand-dark relative overflow-hidden">
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[400px] h-[400px] bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-brand-card border border-white/5 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center">
                <Trophy className="w-5 h-5 text-black" />
              </div>
              <span className="font-black text-xl text-white">Golf<span className="text-brand-green">Cares</span></span>
            </Link>
          </div>

          <h1 className="text-2xl font-black text-white text-center mb-1">Welcome back</h1>
          <p className="text-gray-400 text-center text-sm mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label className="text-gray-300 mb-2 block text-sm">Email address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className="bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green placeholder:text-gray-600"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label className="text-gray-300 mb-2 block text-sm">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green placeholder:text-gray-600"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-green text-black font-bold rounded-xl hover:bg-brand-green/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-green font-semibold hover:underline">
              Subscribe now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
