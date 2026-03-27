// @ts-nocheck
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Trophy, Check } from 'lucide-react'
import { authApi } from '@/api/auth.api'
import { charityApi } from '@/api/charity.api'
import { useAuthStore } from '@/store/authStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const PLANS = [
  { id: 'monthly', label: 'Monthly', price: '₹799/mo', desc: 'Billed every month. Cancel anytime.' },
  { id: 'yearly', label: 'Yearly', price: '₹7990/yr', desc: 'Save 17%! Billed annually.' },
]

const detailsSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  handicap: z.number({ coerce: true }).min(0).max(54).optional(),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] })

export default function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()

  const [step, setStep] = useState(0) // 0=Details, 1=Charity, 2=Plan
  const [loading, setLoading] = useState(false)
  const [selectedCharity, setSelectedCharity] = useState(location.state?.charityId || '')
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [formData, setFormData] = useState<any>(null)

  const { data: charitiesData, isLoading: charitiesLoading } = useQuery({
    queryKey: ['charities'],
    queryFn: charityApi.getCharities,
    enabled: step >= 1,
  })
  const charities = charitiesData?.charities || []

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(detailsSchema),
  })

  const handleDetailsSubmit = async (data: any) => {
    setFormData(data)
    setStep(1)
  }

  const handleFinalSubmit = async () => {
    try {
      setLoading(true)
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        handicap: formData.handicap || 18,
        charityId: selectedCharity,
        plan: selectedPlan,
      }
      const res = await authApi.register(payload)
      login(res.user, res.token, res.subscription)
      toast.success('Welcome to GolfCares! 🎉')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
      setStep(0)
    } finally {
      setLoading(false)
    }
  }

  const steps = ['Your Details', 'Choose a Charity', 'Pick a Plan']

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-brand-dark relative overflow-hidden">
      <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] left-[-100px] w-[400px] h-[400px] bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-brand-card border border-white/5 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-brand-green flex items-center justify-center">
              <Trophy className="w-4 h-4 text-black" />
            </div>
            <span className="font-black text-xl text-white">Golf<span className="text-brand-green">Cares</span></span>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                  i < step ? 'bg-brand-green border-brand-green text-black' :
                  i === step ? 'border-brand-green text-brand-green' :
                  'border-white/10 text-gray-600'
                }`}>
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-white' : 'text-gray-500'}`}>{s}</span>
                {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-brand-green' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 0 - Details */}
            {step === 0 && (
              <motion.form key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                onSubmit={handleSubmit(handleDetailsSubmit)} className="space-y-4">
                <h2 className="text-xl font-black text-white mb-6">Your Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300 mb-1.5 block text-sm">First Name</Label>
                    <Input {...register('firstName')} className="bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green" placeholder="John" />
                    {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-1.5 block text-sm">Last Name</Label>
                    <Input {...register('lastName')} className="bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green" placeholder="Doe" />
                    {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300 mb-1.5 block text-sm">Email Address</Label>
                  <Input type="email" {...register('email')} className="bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green" placeholder="you@example.com" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label className="text-gray-300 mb-1.5 block text-sm">Handicap (optional)</Label>
                  <Input type="number" {...register('handicap')} className="bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green" placeholder="e.g. 18" min={0} max={54} />
                </div>
                <div>
                  <Label className="text-gray-300 mb-1.5 block text-sm">Password</Label>
                  <Input type="password" {...register('password')} className="bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green" placeholder="••••••••" />
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <div>
                  <Label className="text-gray-300 mb-1.5 block text-sm">Confirm Password</Label>
                  <Input type="password" {...register('confirmPassword')} className="bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green" placeholder="••••••••" />
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>
                <button type="submit" className="w-full py-3 bg-brand-green text-black font-bold rounded-xl hover:bg-brand-green/90 transition-all mt-2">
                  Next: Choose Charity →
                </button>
              </motion.form>
            )}

            {/* STEP 1 - Charity */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h2 className="text-xl font-black text-white mb-2">Choose a Charity</h2>
                <p className="text-gray-400 text-sm mb-6">10% of your subscription goes directly to your chosen cause.</p>
                {charitiesLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-brand-green animate-spin" /></div>
                ) : (
                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                    {charities.map((c: any) => (
                      <button key={c._id} type="button" onClick={() => setSelectedCharity(c._id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                          selectedCharity === c._id ? 'border-brand-green bg-brand-green/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}>
                        {c.imageUrl && <img src={c.imageUrl} alt={c.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-sm">{c.name}</p>
                          <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{c.description}</p>
                        </div>
                        {selectedCharity === c._id && <Check className="w-5 h-5 text-brand-green shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(0)} className="flex-1 py-3 border border-white/10 text-white font-medium rounded-xl hover:bg-white/5 transition-all">← Back</button>
                  <button onClick={() => setStep(2)} disabled={!selectedCharity}
                    className="flex-1 py-3 bg-brand-green text-black font-bold rounded-xl hover:bg-brand-green/90 transition-all disabled:opacity-50">
                    Next: Pick Plan →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 - Plan */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h2 className="text-xl font-black text-white mb-2">Pick a Plan</h2>
                <p className="text-gray-400 text-sm mb-6">Play, win prizes, and give back every month.</p>
                <div className="space-y-4 mb-6">
                  {PLANS.map((plan) => (
                    <button key={plan.id} type="button" onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full flex items-center justify-between p-5 rounded-xl border text-left transition-all ${
                        selectedPlan === plan.id ? 'border-brand-green bg-brand-green/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}>
                      <div>
                        <p className="font-bold text-white">{plan.label}</p>
                        <p className="text-gray-400 text-sm mt-0.5">{plan.desc}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-xl font-black text-brand-green">{plan.price}</p>
                        {selectedPlan === plan.id && <Check className="w-5 h-5 text-brand-green ml-auto mt-1" />}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 border border-white/10 text-white font-medium rounded-xl hover:bg-white/5 transition-all">← Back</button>
                  <button onClick={handleFinalSubmit} disabled={loading}
                    className="flex-1 py-3 bg-brand-green text-black font-bold rounded-xl hover:bg-brand-green/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Creating account...' : 'Subscribe Now →'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {step === 0 && (
            <p className="text-center text-gray-400 text-sm mt-6">
              Already have an account?{' '}
              <a href="/login" className="text-brand-green font-semibold hover:underline">Sign in</a>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
