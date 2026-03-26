// @ts-nocheck
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth.api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof schema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(schema)
  })

  // Floating background numbers
  const floatingNumbers = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    num: Math.floor(Math.random() * 45) + 1,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: Math.random() * 5 + 5,
    delay: Math.random() * 2,
  }))

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true)
      const res = await authApi.login(data)
      login(res.user, res.token, res.subscription)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to login. Checking mock data.')
      
      // Fallback for mock mode preview
      const { useMockData, enableMockMode } = useAuthStore.getState()
      if (useMockData) {
        enableMockMode()
        navigate('/dashboard')
        toast.success('Mock login successful')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-brand-accent/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-brand-green/15 rounded-full blur-[100px] pointer-events-none" />
      
      {floatingNumbers.map((fn) => (
        <motion.div
          key={fn.id}
          initial={{ y: -20 }}
          animate={{ y: 20 }}
          transition={{ duration: fn.duration, delay: fn.delay, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="absolute text-white/[0.02] text-5xl font-black pointer-events-none select-none z-0"
          style={{ top: fn.top, left: fn.left }}
        >
          {fn.num}
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-brand-card border border-white/5 rounded-2xl p-8 relative z-10 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <Link to="/">
            <div className="w-12 h-12 rounded-xl bg-brand-green flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-black" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-center text-white">Welcome back</h1>
          <p className="text-gray-400 text-center text-sm mt-1">Sign in to your GolfCares account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-gray-300">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
              <Input 
                {...register('email')}
                type="email" 
                placeholder="you@example.com" 
                className="pl-10 bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green placeholder:text-gray-500" 
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-gray-300">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
              <Input 
                {...register('password')}
                type={showPassword ? 'text' : 'password'} 
                className="pl-10 pr-10 bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green placeholder:text-gray-500" 
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-green text-black hover:bg-brand-green/90 font-bold h-12 rounded-xl mt-6 shadow-lg shadow-brand-green/20"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account? <Link to="/register" className="text-brand-green hover:underline font-medium">Subscribe now</Link>
        </p>
      </motion.div>
    </div>
  )
}
